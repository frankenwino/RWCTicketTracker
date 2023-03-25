from selenium import webdriver
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.firefox.options import Options
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import Select
import utils
import pathlib

class SeleniumDriver:
    def __init__(self, headless_browser: bool = True) -> None:
        self.headless_browser = headless_browser
        
    def selenium_driver(self) -> webdriver.Firefox:
        """selenium_driver creates a Selenium webdriver object.

        Args:
            headless (bool, optional): Determines whether the browser id visible or not. Defaults to False.

        Returns:
            webdriver.Firefox: a Selenium webdriver object.
        """
        
        geckodriver_binary = pathlib.Path(__file__).parent.joinpath("geckodriver").joinpath("geckodriver")
        if geckodriver_binary.is_file():
            service = FirefoxService(executable_path=geckodriver_binary)
        else:
            service = FirefoxService(executable_path=GeckoDriverManager().install())
        
        # Set headless option
        options = Options()
        options.headless = self.headless_browser
        utils.print_message(f"Hide browser: {self.headless_browser}")

        # Initialise selenium driver
        driver = webdriver.Firefox(service=service, options=options)

        return driver