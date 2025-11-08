# AGNI-Network 
This project is a collaboration by UCSC Students as part of the Reboot Earth 2025 hackathon. The name AGNI is inspired by the Hindu God of Fire, Agni. It is a fitting title since the first Reboot Hackathon was held in India. This dashboard is designed to aggregate data from various sources and create a visual map of California color coded by fire risk areas. Additionally, there is an AI agent that has been incorporated into the dashboard that can make recommendations to fire departments based on data points to initiate control burns or other fire management techniques as well as answer questions about fire risk by area. This tool is designed with first responders in mind to help assist in fire prevention and management by giving fire departments a proactive tool. While we have chosen to start with California first, this network is scalable to other states and countries, allowing fire professionals around the world to have an edge in proactive fire prevention. 

Our program works by obtaining weather data from various public sources such as weather.gov, nasa.gov, and droughtmonitor.edu.

These data sets are them interpreted by our integrated AI agent to predict fire danger level and therefore an evaluated fire risk score.

These scores along with danger levels are then used by the AI to generate a fire danger heat map of all California counties.

These scores are being constantly updated over the web to keep up to date information available for first responders/users.

If at any point a danger score is recorded that exceeds determined level of "high risk" an alert is sent to nearby fire departments, warning to of the possible risk.

Future scalability of this project includes deployment to areas with potentially less developed fire prevention abilities such as developing countries.