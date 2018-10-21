import unittest
from core import driver, url, login


class SignupTest(unittest.TestCase):
    def setUp(self):
        self.driver = driver
        self.driver.get(url + "/login.html")
        self.username = self.driver.find_element_by_name("username")
        self.password = self.driver.find_element_by_name("password")
        self.submit = self.driver.find_element_by_css_selector("button.btn")

    def test_login_valid_credentials(self):
        login()
        self.assertEqual(self.driver.current_url, url + "/")

    def test_login_invalid_credentials(self):
        self.username.send_keys("asd")
        self.password.send_keys("asd")
        self.submit.click()
        self.assertEqual(
            self.driver.current_url, url + "/login.html?failed=true")

    def test_login_missing_values(self):
        self.username.send_keys("asd")
        self.submit.click()
        self.assertEqual(self.driver.current_url, url + "/login.html")
