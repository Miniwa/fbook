import unittest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.common.by import By
from core import driver, url, login, reset, children


class ProfileTest(unittest.TestCase):
    def setUp(self):
        users = reset()
        login()

        user = users[0]
        driver.get(url + "/profile.html?id=" + user["_id"])
        self.messages = driver.find_element_by_css_selector(".fbook-messages")
        self.comment = driver.find_element_by_id("comment")
        self.submit = driver.find_element_by_css_selector(
            "button.fbook-post-comment")

    def test_publish_comment(self):
        self.comment.send_keys("hello")
        self.submit.click()
        WebDriverWait(driver, 1).until(ec.presence_of_element_located(
            (By.CSS_SELECTOR, ".fbook-message")))
        self.assertEqual(1, len(children(self.messages)))

    def test_publish_comment_missing_values(self):
        self.submit.click()
        self.assertEqual(0, len(children(self.messages)))
