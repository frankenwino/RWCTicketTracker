from datetime import datetime, timedelta
from time import sleep

def now() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def print_message(message: str) -> None :
    print(f"{now()} - {message}")
    
def do_wait(wait_time: int, reason: str=None) -> None:
    if reason is None:
        print(f"{now()} - Waiting {wait_time} seconds")
    else:
        print(f"{now()} - Waiting {wait_time} seconds. {reason.capitalize()}")
    
    sleep(wait_time)

def today() -> str():
     return datetime.now().strftime("%Y-%m-%d")

def tomorrow() -> str():
    tomorrow = datetime.today() + timedelta(days=1)
    return tomorrow.strftime("%Y-%m-%d")

def tomorrow_year():
    tomorrow = datetime.today() + timedelta(days=1)
    return tomorrow.strftime("%Y")

def tomorrow_month():
    tomorrow = datetime.today() + timedelta(days=1)
    return tomorrow.strftime("%m")
