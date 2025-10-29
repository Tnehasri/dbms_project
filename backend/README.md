# 🖼️ Modern Image Gallery

A beautiful, modern image gallery web application built with React, Flask, PostgreSQL, and Elasticsearch. Features include image upload, search functionality, and a responsive design.

## ✨ Features

- **Modern React Frontend**: Built with functional components and hooks
- **Flask REST API**: Clean and efficient backend API
- **PostgreSQL Database**: Reliable data storage for image metadata
- **Elasticsearch Integration**: Powerful full-text search capabilities
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **Image Upload**: Support for multiple image formats with thumbnails
- **Advanced Search**: Search by caption, tags, and filename
- **Grid Layout**: Responsive image grid with hover effects

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   Flask Backend │    │   PostgreSQL    │
│   (Port 3000)   │◄──►│   (Port 5000)   │◄──►│   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Elasticsearch  │
                       │   (Port 9200)   │
                       └─────────────────┘
```

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd image-gallery
```

### 2. Start All Services
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Elasticsearch on port 9200
- Flask backend on port 5000
- React frontend on port 3000

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Elasticsearch**: http://localhost:9200

## 🛠️ Manual Setup

### Backend Setup

1. **Install Python Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Setup PostgreSQL**
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql -f database_setup.sql
```

3. **Setup Elasticsearch**
```bash
# Install Elasticsearch (Ubuntu/Debian)
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list
sudo apt-get update && sudo apt-get install elasticsearch

# Start Elasticsearch
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch
```

4. **Configure Environment**
```bash
# Copy and edit configuration
cp config.env .env
# Edit .env with your database credentials
```

5. **Run the Backend**
```bash
python app.py
```

### Frontend Setup

1. **Install Node.js Dependencies**
```bash
cd frontend
npm install
```

2. **Start Development Server**
```bash
npm start
```

## 📁 Project Structure

```
image-gallery/
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend container
│   ├── database_setup.sql    # Database initialization
│   └── uploads/              # Image storage directory
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── Navbar.js
│   │   │   ├── ImageCard.js
│   │   │   └── SearchBar.js
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── UploadPage.js
│   │   │   └── SearchPage.js
│   │   ├── App.js            # Main App component
│   │   └── App.css           # Global styles
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml        # Multi-container setup
└── README.md
```

## 🔌 API Endpoints

### Images
- `GET /api/images` - Get all images (with pagination)
- `GET /api/images/<id>` - Get specific image
- `POST /api/upload` - Upload new image

### Search
- `GET /api/search?query=<term>` - Search images

### File Serving
- `GET /uploads/<filename>` - Serve uploaded images
- `GET /uploads/thumb_<filename>` - Serve thumbnails

## 🎨 UI Components

### Pages
- **Home Page**: Displays all images in a responsive grid
- **Upload Page**: Form for uploading images with metadata
- **Search Page**: Search interface with results display

### Components
- **ImageCard**: Displays image with caption, tags, and metadata
- **Navbar**: Navigation with active state indicators
- **SearchBar**: Search input with loading states

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://username:password@localhost/imagegallery
ELASTICSEARCH_URL=http://localhost:9200
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
SECRET_KEY=your-secret-key
FLASK_ENV=development
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Production Deployment

1. **Build Production Images**
```bash
docker-compose -f docker-compose.prod.yml build
```

2. **Deploy to Production**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment Options

#### Heroku
```bash
# Install Heroku CLI
# Create Procfile in backend/
echo "web: gunicorn app:app" > backend/Procfile

# Deploy backend
cd backend
heroku create your-app-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create bonsai:starter
git push heroku main
```

#### DigitalOcean App Platform
- Connect your GitHub repository
- Configure build settings for both frontend and backend
- Set environment variables
- Deploy automatically

#### AWS/GCP/Azure
- Use container services (ECS, Cloud Run, Container Instances)
- Set up managed databases (RDS, Cloud SQL, Azure Database)
- Configure managed Elasticsearch services

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Performance Optimization

- **Image Optimization**: Automatic thumbnail generation
- **Lazy Loading**: Images load as needed
- **Caching**: Static file serving with proper headers
- **Database Indexing**: Optimized queries with proper indexes
- **Elasticsearch**: Fast full-text search with relevance scoring

## 🔒 Security Features

- **File Validation**: Only image files allowed
- **File Size Limits**: Configurable upload limits
- **SQL Injection Protection**: SQLAlchemy ORM
- **CORS Configuration**: Proper cross-origin settings
- **Input Sanitization**: Clean user inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify database credentials in .env
   - Ensure database exists

2. **Elasticsearch Connection Error**
   - Check Elasticsearch is running
   - Verify port 9200 is accessible
   - Check Elasticsearch logs

3. **Image Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Ensure supported file formats

4. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Getting Help

- Check the logs: `docker-compose logs <service-name>`
- Verify all services are running: `docker-compose ps`
- Test API endpoints: `curl http://localhost:5000/api/images`

## 🌟 Features Roadmap

- [ ] User authentication and authorization
- [ ] Image editing capabilities
- [ ] Advanced filtering options
- [ ] Image collections/albums
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Image analytics and insights

---

**Built with ❤️ using React, Flask, PostgreSQL, and Elasticsearch**

