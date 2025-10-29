# Image Gallery - Quick Start Guide

## 🚀 Getting Started

### Option 1: Docker (Recommended)
```bash
# Clone and start everything
git clone <your-repo-url>
cd image-gallery
docker-compose up -d

# Access the app
open http://localhost:3000
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Setup PostgreSQL
sudo -u postgres psql -f database_setup.sql

# Start Elasticsearch
sudo systemctl start elasticsearch

# Run Flask
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuration

1. **Database**: Update `DATABASE_URL` in backend config
2. **Elasticsearch**: Ensure it's running on port 9200
3. **File Uploads**: Images stored in `backend/uploads/`

## 📱 Features

- ✅ Upload images with captions and tags
- ✅ Search images by content
- ✅ Responsive grid layout
- ✅ Modern UI with Tailwind CSS
- ✅ Docker deployment ready
- ✅ Production configuration included

## 🌐 Deployment

### Production with Docker
```bash
# Configure environment
cp env.prod.example .env
# Edit .env with your settings

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment
- **Heroku**: Use provided Procfile
- **DigitalOcean**: App Platform ready
- **AWS/GCP/Azure**: Container services compatible

## 🆘 Troubleshooting

- **Database issues**: Check PostgreSQL is running
- **Search not working**: Verify Elasticsearch on port 9200
- **Upload fails**: Check file permissions in uploads/
- **Frontend errors**: Clear node_modules and reinstall

## 📊 Monitoring

```bash
# Check logs
docker-compose logs -f

# Check service status
docker-compose ps

# Test API
curl http://localhost:5000/api/images
```

---

**Ready to go! 🎉**

