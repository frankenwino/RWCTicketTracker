from selenium_driver import SeleniumDriver
from selenium.webdriver.common.by import By
from time import sleep
import pathlib
from bs4 import BeautifulSoup
import random
import utils
from datetime import datetime

class RWCTracker:
    def __init__(self, testing=True):
        self.d = SeleniumDriver(headless_browser=False)
        self.driver = self.d.selenium_driver()
        
        # self.driver.add_cookie({"name": "key", "value": "value"})

        self.base_url = "https://tickets.rugbyworldcup.com/en"
        self.temp_html_file_path = pathlib.Path(__file__).parent.joinpath("base.html")
        
        self.downloaded_web_page_dir = pathlib.Path(__file__).parent.parent.joinpath("downloaded_web_pages")
        self.tickets_web_page_file = self.downloaded_web_page_dir.joinpath("Tickets Rugby World Cup France 2023.html")
        
        self.testing = testing
                        
    def random_sleep(self, queue=False):
        if self.testing is True:
            sleep_time = random.randrange(3, 5)
        else:
            if queue is True:
                sleep_time = random.randrange(75, 80)
            else:
                sleep_time = random.randrange(10, 25)
        utils.print_message(f"Sleeping for {sleep_time} seconds")
        sleep(sleep_time)
    
    def get_page_html(self):
        self.driver.get(self.base_url)
        html = self.driver.page_source
        soup = BeautifulSoup(html, "html.parser")
        with open(self.temp_html_file_path, "w") as f:
            f.write(soup.prettify()) 
        sleep(5)
        self.driver.close()
    
    def get_base_html_file_html(self):
        with open(self.temp_html_file_path, "r") as f:
            html_doc = f.read()
        
        return html_doc
    
    def tidy_match_date_string(self, match_date_str: str):
        # match_date_str = match_date_str.split(",")[-1]
        datetime_object = datetime.strptime(match_date_str, '%A,%d %B %Y')
        dt_to_string = datetime_object.strftime("%A %d %B %Y")
        
        return dt_to_string
    
    def generate_match_id(self, match_date_str: str, day: int, match: int):
        match_date_str = match_date_str.split(",")[-1]
        datetime_object = datetime.strptime(match_date_str, '%d %B %Y')
        dt_to_string = datetime_object.strftime("%Y%m%d")
        id_string = f"{dt_to_string}{day}{match}"
        
        return int(id_string)
        
    def traverse_ticket_pages(self):
        self.driver.set_window_position(0,0)
        
        if self.testing is True:
            self.driver.set_window_size(width=900, height=750)
            self.driver.get(f"file://{self.tickets_web_page_file}")
        else:
            self.driver.set_window_size(width=900, height=1500)
            self.driver.get(self.base_url) 

        # Check if about to be placed into the queuing system
        if self.driver.title == "RWC 2023 Queue Client":
            utils.print_message(f"Page title: {self.driver.title}")
            utils.print_message("Queue page presented. Clicking on enter queue button.")
            self.driver.find_element(By.CLASS_NAME, "btn.btn-primary").click()
            self.random_sleep(queue=True)
        
        # # Scroll to bottom of page
        # footer = self.driver.find_element(By.CLASS_NAME, "site-footer__bottom")
        # scroll = "arguments[0].scrollIntoView();"
        # self.driver.execute_script(scroll, footer)

        # Locate all events container
        events_container = self.driver.find_element(By.CLASS_NAME, "next-events-content")
        
        # Locate match day containers in events_container
        match_day_containers = events_container.find_elements(By.CLASS_NAME, "match-day.js-form-item.form-item.js-form-wrapper.form-group")
        print(f"Total match day containers: {len(match_day_containers)}")
        
        for match_day_index, match_day_container in enumerate(match_day_containers[0:4], start=1):
            
            scroll = "arguments[0].scrollIntoView();"
            self.driver.execute_script(scroll, match_day_container)
            self.random_sleep()
            
            match_date = match_day_container.find_element(By.CLASS_NAME, "fieldset-legend").text.lower().capitalize()
            match_date_conv = self.tidy_match_date_string(match_date)
            
            # Locate individual match containers in match_day_containers
            match_containers = match_day_container.find_elements(By.CLASS_NAME, "list-ticket-content")
            # print(f"Total matches for {match_date}: {len(match_containers)}\n")

            for match_container_index, match_container in enumerate(match_containers, start=1):
                try:
                    scroller_button = self.driver.find_element(By.CLASS_NAME, "scroller").click()
                except Exception as e:
                    # print(f"{type(e)} - {str(e)}")
                    pass
                
                # scroll = "arguments[0].scrollIntoView();"
                # self.driver.execute_script(scroll, match_container)
                
                self.random_sleep()
                
                match_info_wrapper = match_container.find_element(By.CLASS_NAME, "match-info")

                # Parse team info
                teams = match_info_wrapper.find_elements(By.CLASS_NAME, "team")
                separator = match_info_wrapper.find_element(By.CLASS_NAME, "separator").text
                team1 = teams[0].text
                team2 = teams[-1].text
                
                # Parse additional match nfo
                pool = match_info_wrapper.find_element(By.CLASS_NAME, "competition-additional").text
                venue = match_info_wrapper.find_element(By.CLASS_NAME, "venue").text.lower().capitalize()
                kick_off = match_info_wrapper.find_element(By.CLASS_NAME, "time").text
                
                # Generate match ID
                match_id = self.generate_match_id(match_date, match_day_index, match_container_index)
                
                # Display match info
                print(f"--- {match_date_conv} | Day {match_day_index} of {len(match_day_containers)} | Match {match_container_index} of {len(match_containers)} ---")
                print(f"Date: {match_date_conv}")
                print(f"Match: {team1} {separator} {team2}")
                print(f"Pool: {pool}")
                print(f"Venue: {venue}")
                print(f"Kick off: {kick_off}")
                print(f"Match ID: {match_id}")
                
                # input("Enter")
                
                """
                # try:
                # Locate "Show Offers" button
                actions_wrapper = match_container.find_element(By.CLASS_NAME, "actions-wrapper")
                # print(actions_wrapper.text)
                
                # Click "Show Offers" button
                show_offers_button = actions_wrapper.find_element(By.CLASS_NAME, "btn.btn-primary.js-show-offers.noloader")
                show_offers_button.click()
                pop_up_window = self.driver.find_element(By.CLASS_NAME, "ui-dialog.modal-resale-option.ui-widget.ui-widget-content.ui-front")
                
                # Get resale link
                resale_link = pop_up_window.find_element(By.CLASS_NAME, "btn-resale.btn.btn-secondary").get_attribute("href")
                print(f"Resale_link: {resale_link}\n\n")
                
                # Close "Show Offers" window
                utils.print_message("Closing offers window")
                self.random_sleep()
                self.driver.find_element(By.CLASS_NAME, "ui-dialog-titlebar-close").click()
                """
                
                
                """
                # Click on resale link
                utils.print_message("Clicking on resale link")
                resale_button = pop_up_window.find_element(By.CLASS_NAME, "btn-resale.btn.btn-secondary")
                resale_button.click()
                self.random_sleep()
                
                # Get ticket container
                ticket_container = self.driver.find_element(By.CLASS_NAME, "ticket-content-container")
                
                # Check for 'No ticket currently available' text
                utils.print_message("Should be checking to no tikcet available stuff here")
                
                ticket_content_container = self.driver.find_element(By.CLASS_NAME, "ticket-content-container")
                
                
                
                
                self.random_sleep()
                input("Enter")
                """
                
                
                # Sleep for a moment
                # self.random_sleep()
                
                # except Exception as e:
                #     print(f"{type(e)} - {str(e)}")
            # input("Enter")
                
        
        self.driver.close()
        
        
        

r = RWCTracker(testing=True)
r.traverse_ticket_pages()
