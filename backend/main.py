from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# CORSを設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドのサーバーアドレス
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベースを定義
DATABASE = {
    "西千葉": {"x": 1640, "y": 2077},
    "千葉大": {"x": 3430, "y": 4650},
    "klab": {"x": 3330, "y": 1240},
    "北京亭": {"x": 35.62377319704928, "y": 140.10337833307406 },
}

# class Coordinate(BaseModel):
#     x: int
#     y: int

class Coordinate(BaseModel):
    x: float  # int から float に変更
    y: float  # int から float に変更
    
# 座標と混雑度をまとめて取得するエンドポイント
@app.get("/location/{name}")
async def get_location_and_congestion(name: str):
    if name in DATABASE:
        coordinates = DATABASE[name]
        congestion = generate_congestion()  # 混雑度を取得する処理
        return {"coordinates": coordinates, "congestion": congestion}
    else:
        return {"error": "Name not found"}

# 混雑度をランダムで生成（ココをMLの処理に！！）
def generate_congestion():
    return random.randint(0, 100)