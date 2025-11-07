import pandas as pd
import json
from langchain_core.messages import ToolMessage

class FireDangerTool:

    name = "fire_danger"

    def __init__(self, csv_path:str):
        self.csv_path = csv_path
    
    def invoke(self, args=None):
        df = pd.read_csv(self.csv_path)

        data_json = df.to_dict(orient="records")

        return ToolMessage(
            name=self.name,
            content=json.dumps(data_json),
            tool_call_id="1"
        )

def load_fire_danger_factors(path: str):
    df = pd.read_csv(path)
    return df