import pandas as pd
import smtplib
import json
from pathlib import Path
from datetime import datetime

# Email configuration
MY_EMAIL = "agnifirealert@gmail.com"
MY_PASSWORD = "qggyedfqthksyyoq"

def load_subscriptions():
    """Load email subscriptions from JSON file"""
    subs_file = Path(__file__).parent / "alert_subscriptions.json"
    if not subs_file.exists():
        return []
    
    with open(subs_file, 'r') as f:
        return json.load(f)

def load_fire_data():
    """Load current fire danger data"""
    csv_path = Path(__file__).parent / "california_fire_danger_factors.csv"
    df = pd.read_csv(csv_path)
    return df

def send_alert_email(to_email, county, risk_level, risk_score, data):
    """Send fire danger alert email"""
    subject = f"🔥 {risk_level} Fire Danger Alert - {county} County"
    
    # Build detailed message
    message = f"""Subject: {subject}

This is an automated alert from AGNI Fire Risk System.

⚠️  HIGH FIRE DANGER ALERT ⚠️

County: {county}
Risk Level: {risk_level}
Risk Score: {risk_score}/10

Current Conditions:
• Temperature: {data.get('temperature_f', 'N/A')}°F
• Humidity: {data.get('relative_humidity', 'N/A')}%
• Wind Speed: {data.get('wind_speed', 'N/A')}
• Wind Direction: {data.get('wind_direction', 'N/A')}
• Conditions: {data.get('conditions', 'N/A')}

{f"🔥 Active Fires Nearby: {data.get('active_fires_nearby', 0)}" if data.get('active_fires_nearby', 0) > 0 else "No active fires detected nearby"}

RECOMMENDATIONS:
- Stay alert and monitor local conditions
- Avoid outdoor burning or spark-producing activities
- Have evacuation plan ready
- Follow local fire authority guidance

This alert was triggered because fire danger reached {risk_level} level in your subscribed area.

Stay safe,
AGNI Fire Risk System
{MY_EMAIL}

---
To unsubscribe, reply to this email with "UNSUBSCRIBE"
"""
    
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as connection:
            connection.starttls()
            connection.login(MY_EMAIL, MY_PASSWORD)
            connection.sendmail(
                from_addr=MY_EMAIL,
                to_addrs=to_email,
                msg=message.encode('utf-8')
            )
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
        return False
        
def send_welcome_email(to_email, county):
    """Send welcome/confirmation email when someone subscribes"""
    subject = f"✅ Subscribed to AGNI Fire Alerts - {county} County"
    
    message = f"""Subject: {subject}

Welcome to AGNI Fire Alert System! 🔥

Thank you for subscribing to fire danger alerts for {county} County, California.

You will receive email notifications when:
• Fire danger reaches HIGH level (risk score 6-7/10)
• Fire danger reaches VERY HIGH level (risk score 8-10/10)

What you'll get in alerts:
✓ Current risk level and score
✓ Temperature, humidity, and wind conditions
✓ Active fires nearby (if any)
✓ Safety recommendations

IMPORTANT INFORMATION:
- Alerts are sent when conditions change
- Check your spam folder if you don't see alerts
- Data is updated regularly via NWS and NASA satellites

Stay informed, stay safe! 🌲🔥

Questions? Reply to this email.

Best regards,
AGNI Fire Risk System
{MY_EMAIL}

---
Monitoring: {county} County
Subscribed: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
"""
    
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as connection:
            connection.starttls()
            connection.login(MY_EMAIL, MY_PASSWORD)
            connection.sendmail(
                from_addr=MY_EMAIL,
                to_addrs=to_email,
                msg=message.encode('utf-8')
            )
        print(f"✅ Welcome email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send welcome email to {to_email}: {e}")
        return False

def check_and_send_alerts(threshold=6):
    """
    Check fire danger levels and send alerts to subscribers
    
    Args:
        threshold: Minimum risk score to trigger alerts (default: 6 = High risk)
    
    Returns:
        dict with results
    """
    print("📧 Checking fire danger levels for alerts...")
    
    # Load data
    subscriptions = load_subscriptions()
    fire_data = load_fire_data()
    
    if not subscriptions:
        print("ℹ️  No subscriptions found")
        return {"status": "no_subscriptions", "alerts_sent": 0}
    
    alerts_sent = 0
    alerts_failed = 0
    results = []
    
    # Check each subscription
    for sub in subscriptions:
        email = sub.get('email')
        county = sub.get('county')
        
        # Find county data
        county_data = fire_data[fire_data['county'].str.lower() == county.lower()]
        
        if county_data.empty:
            print(f"⚠️  County '{county}' not found in data")
            continue
        
        row = county_data.iloc[0]
        risk_score = row.get('risk_score', 0)
        risk_level = row.get('fire_danger_level', 'Unknown')
        
        # Send alert if threshold is met
        if risk_score >= threshold:
            print(f"🔥 Sending alert to {email} for {county} ({risk_level}, Score: {risk_score})")
            
            success = send_alert_email(
                to_email=email,
                county=county,
                risk_level=risk_level,
                risk_score=risk_score,
                data=row.to_dict()
            )
            
            if success:
                alerts_sent += 1
                results.append({
                    "email": email,
                    "county": county,
                    "risk_level": risk_level,
                    "sent": True
                })
                print(f"✅ Alert sent to {email}")
            else:
                alerts_failed += 1
                results.append({
                    "email": email,
                    "county": county,
                    "risk_level": risk_level,
                    "sent": False
                })
        else:
            print(f"ℹ️  {county} ({risk_score}/10) - Below threshold, no alert sent")
    
    summary = {
        "status": "complete",
        "alerts_sent": alerts_sent,
        "alerts_failed": alerts_failed,
        "total_subscriptions": len(subscriptions),
        "timestamp": datetime.now().isoformat(),
        "results": results
    }
    
    print(f"\n📊 Summary: {alerts_sent} alerts sent, {alerts_failed} failed")
    return summary

# For manual testing
if __name__ == "__main__":
    result = check_and_send_alerts(threshold=6)
    print(f"\n✅ Done! Sent {result['alerts_sent']} alerts")