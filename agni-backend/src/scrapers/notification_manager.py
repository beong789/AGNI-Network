from pandas import *
import smtplib
import os

MY_EMAIL = "agnifirealert@gmail.com"
MY_PASSWORD = "qggyedfqthksyyoq"
TO_ADDRESS = "jgvelazq@ucsc.edu"

script_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(script_dir, "california_fire_danger_factors.csv")

data = read_csv(csv_path)
data_dict = data.to_dict("records")
danger_dict = {item.get("county"): item.get("risk_score") for item in data_dict}
# print(danger_dict)

for county in danger_dict:
    # print(danger_dict.get(county))
    # print(county)
    message = f"""
This is an automated message from the Fire Danger Monitoring System \"Agni\".\n
Our latest data analysis indicates that {county} County is currently experiencing high fire danger conditions based on current weather and environmental factors.\n
These conditions suggest increased potential for wildire ignition and spread. We recommend reviewing current readiness levels, public advisories, and field conditions within your jurisdiction\n
Please take any necessary preventative actions and notify response teams if needed.\nThank you for your continued work in protecting the community.\n
Stay safe,\nAgni\n(agnifirealert@gmail.com)"""
    if danger_dict.get(county) >= 7:
        with smtplib.SMTP("smtp.gmail.com") as connection:
            connection.starttls()
            connection.login(MY_EMAIL, MY_PASSWORD)
            connection.sendmail(from_addr=MY_EMAIL, to_addrs=TO_ADDRESS, msg=f"Subject:High Fire Danger in {county} County\n\n{message}")
