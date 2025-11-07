from urllib.request import urlopen
import json
import pandas as pd
import plotly.express as px
import agni_backend.src.scrapers.data_manager

# Load GeoJSON
with urlopen('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/california-counties.geojson') as response:
    counties = json.load(response)

# Load data
df = pd.read_csv(
    'california_fire_danger_factors.csv',
    dtype={'fire_danger_level': str},
    header=0
)

# Clean levels
df['fire_danger_level'] = df['fire_danger_level'].str.lower().str.strip()

# Map categories to numeric for coloring (optional but common)
level_map = {
    'low': 1,
    'moderate': 2,
    'high': 3,
    'very high': 4,
    'extreme': 5
}
df['danger_value'] = df['fire_danger_level'].map(level_map)

fig = px.choropleth(
    df,
    geojson=counties,
    locations='county',                 # must match county names
    featureidkey='properties.name',     # how to look up each feature
    color='danger_value',               # numeric values to color by
    color_continuous_scale=[
        (0.0, "green"),
        (0.5, "yellow"),
        (1.0, "red")
    ],
    range_color = (1, 3)
)

fig.update_geos(fitbounds="locations", visible=False)
fig.update_layout(margin={"r":0,"t":0,"l":0,"b":0})
fig.show()
