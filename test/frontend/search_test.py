import unittest
from selenium.webdriver.support.ui import WebDriverWait
from core import driver, url, login, reset, children, child_count_equals


class SearchTest(unittest.TestCase):
    def setUp(self):
        reset()
        login()
        driver.get(url + "/search.html")
        self.search_result = driver.find_element_by_css_selector(
            ".fbook-search-result")
        self.query = driver.find_element_by_name("query")
        self.submit = driver.find_element_by_css_selector(
            "button.fbook-search")

    def test_search_returns_everyone_when_empty(self):
        self.submit.click()
        WebDriverWait(driver, 1000).until(
            child_count_equals(".fbook-search-result", 4))
        self.assertEqual(4, len(children(self.search_result)))

    def test_search_filters_by_query(self):
        self.query.send_keys("Test2")
        self.submit.click()
        self.assertEqual(1, len(children(self.search_result)))
