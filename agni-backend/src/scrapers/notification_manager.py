from pandas import *
import smtplib

MY_EMAIL = "agnifirealert@gmail.com"
MY_PASSWORD = "qggyedfqthksyyoq"
TO_ADDRESS = "jgvelazq@ucsc.edu"

data = read_csv("california_fire_danger_factors.csv")
data_dict = data.to_dict("records")
danger_dict = {item.get("county"): item.get("fire_danger_level") for item in data_dict}
# print(danger_dict)

for county in danger_dict:
    # print(danger_dict.get(county))
    # print(county)
    if danger_dict.get(county) == "High":
        with smtplib.SMTP("smtp.gmail.com") as connection:
            connection.starttls()
            connection.login(MY_EMAIL, MY_PASSWORD)
            connection.sendmail(from_addr=MY_EMAIL, to_addrs=TO_ADDRESS, msg=f"Subject:High Fire Danger\n\n{county} currently has high fire danger, proactive measures may be required")

# SMTP_HOST = "smtp.gmail.com"
# SMTP_PORT = 587  # STARTTLS
# TIMEOUT = 30

# SENDER = MY_EMAIL
# APP_PASSWORD = MY_PASSWORD
# TO = TO_ADDRESS

# msg = EmailMessage()
# msg["From"] = SENDER
# msg["To"] = TO
# msg["Subject"] = "Test"
# msg.set_content("Hello via Gmail SMTP (587).")

# with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=TIMEOUT) as smtp:
#     smtp.ehlo()
#     smtp.starttls()  # upgrade to TLS
#     smtp.ehlo()
#     smtp.login(SENDER, APP_PASSWORD)
#     smtp.send_message(msg)