from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
import json
from elasticsearch import Elasticsearch
import base64
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('FLASK_SQLALCHEMY_DATABASE_URI', 'postgresql://gallery_user:your_password@postgres:5432/imagegallery')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize extensions
db = SQLAlchemy(app)

# Elasticsearch configuration
es = Elasticsearch(['http://elasticsearch:9200'], timeout=30, max_retries=10, retry_on_timeout=True)

# Database Models
class Image(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text)
    tags = db.Column(db.Text)  # JSON string
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer)
    mime_type = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'caption': self.caption,
            'tags': json.loads(self.tags) if self.tags else [],
            'file_path': self.file_path,
            'file_size': self.file_size,
            'mime_type': self.mime_type,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Helper functions
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_thumbnail(image_path, thumbnail_path, size=(300, 300)):
    """Create a thumbnail for the uploaded image"""
    try:
        with Image.open(image_path) as img:
            img.thumbnail(size, Image.Resampling.LANCZOS)
            img.save(thumbnail_path, optimize=True, quality=85)
        return True
    except Exception as e:
        print(f"Error creating thumbnail: {e}")
        return False

def index_image_to_elasticsearch(image_data):
    """Index image metadata to Elasticsearch"""
    try:
        doc = {
            'id': image_data['id'],
            'caption': image_data['caption'] or '',
            'tags': image_data['tags'],
            'filename': image_data['original_filename'],
            'created_at': image_data['created_at']
        }
        es.index(index='images', id=image_data['id'], body=doc)
        return True
    except Exception as e:
        print(f"Error indexing to Elasticsearch: {e}")
        return False

# API Routes
@app.route('/api/images', methods=['GET'])
def get_images():
    """Get all images with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    
    images = Image.query.order_by(Image.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'images': [image.to_dict() for image in images.items],
        'total': images.total,
        'pages': images.pages,
        'current_page': page,
        'per_page': per_page
    })

@app.route('/api/upload', methods=['POST'])
def upload_image():
    """Upload a new image with metadata"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        caption = request.form.get('caption', '')
        tags = request.form.get('tags', '')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Save file
        file.save(file_path)
        
        # Create thumbnail
        thumbnail_filename = f"thumb_{unique_filename}"
        thumbnail_path = os.path.join(app.config['UPLOAD_FOLDER'], thumbnail_filename)
        create_thumbnail(file_path, thumbnail_path)
        
        # Parse tags
        tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()] if tags else []
        
        # Save to database
        image = Image(
            filename=unique_filename,
            original_filename=filename,
            caption=caption,
            tags=json.dumps(tag_list),
            file_path=file_path,
            file_size=os.path.getsize(file_path),
            mime_type=file.content_type
        )
        
        db.session.add(image)
        db.session.commit()
        
        # Index to Elasticsearch
        image_data = image.to_dict()
        index_image_to_elasticsearch(image_data)
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'image': image_data
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_images():
    """Search images using Elasticsearch"""
    query = request.args.get('query', '')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    
    if not query:
        return jsonify({'error': 'Search query is required'}), 400
    
    try:
        # Elasticsearch query
        search_body = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["caption^2", "tags^1.5", "filename"],
                    "type": "best_fields",
                    "fuzziness": "AUTO"
                }
            },
            "from": (page - 1) * per_page,
            "size": per_page,
            "sort": [{"created_at": {"order": "desc"}}]
        }
        
        response = es.search(index='images', body=search_body)
        
        # Get image IDs from search results
        image_ids = [hit['_source']['id'] for hit in response['hits']['hits']]
        
        # Fetch full image data from database
        images = Image.query.filter(Image.id.in_(image_ids)).all()
        
        # Maintain search result order
        image_dict = {img.id: img for img in images}
        ordered_images = [image_dict[img_id] for img_id in image_ids if img_id in image_dict]
        
        return jsonify({
            'images': [image.to_dict() for image in ordered_images],
            'total': response['hits']['total']['value'],
            'pages': (response['hits']['total']['value'] + per_page - 1) // per_page,
            'current_page': page,
            'per_page': per_page,
            'query': query
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/images/<image_id>', methods=['GET'])
def get_image(image_id):
    """Get a specific image by ID"""
    image = Image.query.get_or_404(image_id)
    return jsonify(image.to_dict())

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Initialize database and Elasticsearch index
def create_tables():
    with app.app_context():
        db.create_all()
        
        # Create Elasticsearch index if it doesn't exist
        try:
            if not es.indices.exists(index='images'):
                es.indices.create(index='images', body={
                    'mappings': {
                        'properties': {
                            'id': {'type': 'keyword'},
                            'caption': {'type': 'text', 'analyzer': 'standard'},
                            'tags': {'type': 'text', 'analyzer': 'standard'},
                            'filename': {'type': 'text', 'analyzer': 'standard'},
                            'created_at': {'type': 'date'}
                        }
                    }
                })
        except Exception as e:
            print(f"Warning: Could not connect to Elasticsearch: {e}")

# Initialize on startup
create_tables()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
