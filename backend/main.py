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
    
@app.get("/coordinates/{name}")
async def get_coordinates(name: str):
    if name in DATABASE:
        return DATABASE[name]
    else:
        return {"error": "Name not found"}


# 混雑度をランダムで生成（ココをMLの処理に！！）
def generate_congestion():
    return random.randint(0, 100)


# 店舗の混雑度を送信
@app.get("/congestion/{name}")
async def get_congestion(name: str):
    if name in DATABASE:
        # 座標情報を取得
        coordinates = DATABASE[name]
        # ここで座標情報を使用して混雑度を計算する処理を実装する
        congestion = generate_congestion()
        return {"congestion": congestion}
    else:
        return {"error": "Name not found"}