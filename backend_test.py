import requests
import sys
import base64
import io
from datetime import datetime
from PIL import Image

class InstagramProfileStylerTester:
    def __init__(self, base_url="https://profile-stylist.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.user_data = None
        self.test_photos = []
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def create_test_image(self, width=400, height=400, color=(255, 100, 100)):
        """Create a test image with visual features"""
        img = Image.new('RGB', (width, height), color)
        # Add some visual features - diagonal lines
        pixels = img.load()
        for i in range(width):
            for j in range(height):
                if (i + j) % 50 < 10:  # Create diagonal stripes
                    pixels[i, j] = (100, 150, 200)
                elif (i - j) % 30 < 5:  # Create another pattern
                    pixels[i, j] = (200, 200, 100)
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=85)
        return buffer.getvalue()

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files else {}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files)
                else:
                    response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        test_user = {
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!",
            "name": "Test User"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user
        )
        
        if success and 'id' in response:
            self.user_data = response
            print(f"   User ID: {response['id']}")
            return True
        return False

    def test_user_login(self):
        """Test user login"""
        if not self.user_data:
            print("❌ Cannot test login - no user registered")
            return False
            
        login_data = {
            "email": self.user_data['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and response.get('id') == self.user_data['id']:
            print(f"   Login successful for user: {response['name']}")
            return True
        return False

    def test_photo_upload(self):
        """Test photo upload"""
        if not self.user_data:
            print("❌ Cannot test photo upload - no user logged in")
            return False

        # Create test image
        image_data = self.create_test_image()
        
        # Prepare form data
        form_data = {'user_id': self.user_data['id']}
        files = {'image': ('test_photo.jpg', image_data, 'image/jpeg')}
        
        success, response = self.run_test(
            "Photo Upload",
            "POST",
            "photos",
            200,
            data=form_data,
            files=files
        )
        
        if success and 'id' in response:
            self.test_photos.append(response)
            print(f"   Photo uploaded with ID: {response['id']}")
            return True
        return False

    def test_get_photos(self):
        """Test getting user photos"""
        if not self.user_data:
            print("❌ Cannot test get photos - no user logged in")
            return False

        success, response = self.run_test(
            "Get User Photos",
            "GET",
            f"photos/{self.user_data['id']}",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Retrieved {len(response)} photos")
            return True
        return False

    def test_get_filters(self):
        """Test getting filter presets"""
        success, response = self.run_test(
            "Get Filter Presets",
            "GET",
            "filters",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Retrieved {len(response)} filter presets")
            filter_names = [f['name'] for f in response]
            print(f"   Filters: {', '.join(filter_names)}")
            return True
        return False

    def test_layout_analysis(self):
        """Test AI layout analysis"""
        if not self.user_data or len(self.test_photos) < 3:
            print("❌ Cannot test layout analysis - need at least 3 photos")
            return False

        # Upload more photos if needed
        while len(self.test_photos) < 3:
            image_data = self.create_test_image(color=(100 + len(self.test_photos) * 50, 150, 200))
            form_data = {'user_id': self.user_data['id']}
            files = {'image': ('test_photo.jpg', image_data, 'image/jpeg')}
            
            success, response = self.run_test(
                f"Photo Upload #{len(self.test_photos) + 1}",
                "POST",
                "photos",
                200,
                data=form_data,
                files=files
            )
            
            if success:
                self.test_photos.append(response)

        # Test layout analysis
        form_data = {
            'user_id': self.user_data['id'],
            'photo_ids': [photo['id'] for photo in self.test_photos[:3]]
        }
        
        success, response = self.run_test(
            "AI Layout Analysis",
            "POST",
            "layouts/analyze",
            200,
            data=form_data
        )
        
        if success and 'suggestion' in response:
            print(f"   AI suggestion received (length: {len(response['suggestion'])} chars)")
            return True
        return False

    def test_create_layout(self):
        """Test creating a layout"""
        if not self.user_data or len(self.test_photos) < 3:
            print("❌ Cannot test layout creation - need user and photos")
            return False

        layout_data = {
            "user_id": self.user_data['id'],
            "photo_ids": [photo['id'] for photo in self.test_photos[:3]],
            "layout_type": "test-layout",
            "ai_suggestion": "Test layout suggestion",
            "approved": True
        }
        
        success, response = self.run_test(
            "Create Layout",
            "POST",
            "layouts",
            200,
            data=layout_data
        )
        
        if success and 'id' in response:
            print(f"   Layout created with ID: {response['id']}")
            return True
        return False

    def test_get_layouts(self):
        """Test getting user layouts"""
        if not self.user_data:
            print("❌ Cannot test get layouts - no user logged in")
            return False

        success, response = self.run_test(
            "Get User Layouts",
            "GET",
            f"layouts/{self.user_data['id']}",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Retrieved {len(response)} layouts")
            return True
        return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Instagram Profile Styler API Tests")
        print(f"📍 Testing against: {self.base_url}")
        
        # Test sequence
        tests = [
            self.test_user_registration,
            self.test_user_login,
            self.test_get_filters,
            self.test_photo_upload,
            self.test_get_photos,
            self.test_layout_analysis,
            self.test_create_layout,
            self.test_get_layouts
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ Test {test.__name__} failed with exception: {str(e)}")
                self.failed_tests.append({
                    'name': test.__name__,
                    'error': str(e)
                })
        
        # Print summary
        print(f"\n📊 Test Results:")
        print(f"   Tests run: {self.tests_run}")
        print(f"   Tests passed: {self.tests_passed}")
        print(f"   Tests failed: {self.tests_run - self.tests_passed}")
        print(f"   Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for failure in self.failed_tests:
                print(f"   - {failure['name']}: {failure.get('error', f\"Expected {failure.get('expected')}, got {failure.get('actual')}\"")}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = InstagramProfileStylerTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())