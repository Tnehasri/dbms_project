#!/usr/bin/env python3
"""
Image Gallery Test Script
Tests the basic functionality of the Image Gallery application
"""

import requests
import json
import time
import sys

def test_backend_health():
    """Test if the backend is running"""
    try:
        response = requests.get('http://localhost:5000/api/images', timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running and responding")
            return True
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend connection failed: {e}")
        return False

def test_elasticsearch_health():
    """Test if Elasticsearch is accessible"""
    try:
        response = requests.get('http://localhost:9200/_cluster/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Elasticsearch is running (status: {data.get('status', 'unknown')})")
            return True
        else:
            print(f"❌ Elasticsearch returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Elasticsearch connection failed: {e}")
        return False

def test_frontend_health():
    """Test if the frontend is accessible"""
    try:
        response = requests.get('http://localhost:3000', timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running and accessible")
            return True
        else:
            print(f"❌ Frontend returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend connection failed: {e}")
        return False

def test_search_functionality():
    """Test search functionality"""
    try:
        # First, try to get images
        response = requests.get('http://localhost:5000/api/images')
        if response.status_code == 200:
            data = response.json()
            if data.get('images'):
                print(f"✅ Found {len(data['images'])} images in database")
                
                # Test search
                search_response = requests.get('http://localhost:5000/api/search?query=test')
                if search_response.status_code == 200:
                    print("✅ Search functionality is working")
                    return True
                else:
                    print(f"❌ Search returned status code: {search_response.status_code}")
                    return False
            else:
                print("ℹ️  No images found in database (this is normal for a fresh install)")
                return True
        else:
            print(f"❌ Images API returned status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Search test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Image Gallery Health Check")
    print("=" * 40)
    
    tests = [
        ("Backend Health", test_backend_health),
        ("Elasticsearch Health", test_elasticsearch_health),
        ("Frontend Health", test_frontend_health),
        ("Search Functionality", test_search_functionality),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        if test_func():
            passed += 1
        time.sleep(1)  # Small delay between tests
    
    print("\n" + "=" * 40)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your Image Gallery is ready to use.")
        print("\n🌐 Access your application:")
        print("   Frontend: http://localhost:3000")
        print("   Backend API: http://localhost:5000")
        print("   Elasticsearch: http://localhost:9200")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")
        print("\n🆘 Troubleshooting:")
        print("   - Make sure all services are running: docker-compose ps")
        print("   - Check logs: docker-compose logs")
        print("   - Verify ports are not blocked")
        sys.exit(1)

if __name__ == "__main__":
    main()

