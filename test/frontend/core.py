import atexit
import requests
from selenium import webdriver

driver = webdriver.Chrome()
url = "http://localhost:8000"
username = "miniwa"
password = "test"


def reset():
    res = requests.get(url + "/reset")
    return res.json()


def login():
    driver.get(url + "/login.html")
    driver.find_element_by_name("username").send_keys(username)
    driver.find_element_by_name("password").send_keys(password)
    driver.find_element_by_css_selector("button.btn").click()
    assert driver.current_url == url + "/"


def children(element):
    return element.find_elements_by_xpath("*")


# Returns a function that returns true when number of children of element
# with css selector is equal to count. Can be used as condition in
# webdriver waits.
def child_count_equals(css, count):
    def _inner(driver):
        elem = driver.find_element_by_css_selector(css)
        return len(children(elem)) == count
    return _inner


def cleanup():
    if driver is not None:
        reset()
        driver.close()


atexit.register(cleanup)
