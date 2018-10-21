import unittest
from core import driver

url = "http://localhost:8000"


class SignupTest(unittest.TestCase):
    def setUp(self):
        self.driver = driver
        self.driver.get(url + "/signup.html")
        self.username = self.driver.find_element_by_id("username")
        self.password = self.driver.find_element_by_id("password")
        self.firstname = self.driver.find_element_by_id("firstname")
        self.lastname = self.driver.find_element_by_id("lastname")
        self.submit = self.driver.find_element_by_css_selector("button.btn")

    def test_signup(self):
        self.username.send_keys("mini")
        self.password.send_keys("test")
        self.firstname.send_keys("Test")
        self.lastname.send_keys("Testsson")
        self.submit.click()
        self.assertEqual(self.driver.current_url, url + "/user")

    def test_signup_missing_values(self):
        self.username.send_keys("mini")
        self.password.send_keys("test")
        self.firstname.send_keys("Test")
        self.submit.click()
        self.assertEqual(self.driver.current_url, url + "/signup.html")
