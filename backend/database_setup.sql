-- PostgreSQL Database Setup for Image Gallery
-- Run this script to create the database and user

-- Create database
CREATE DATABASE imagegallery;

-- Create user (replace 'your_password' with a secure password)
CREATE USER gallery_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE imagegallery TO gallery_user;

-- Connect to the database
\c imagegallery;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO gallery_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gallery_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gallery_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO gallery_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO gallery_user;

