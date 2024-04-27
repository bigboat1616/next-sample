# from fastapi import FastAPI, Query
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import random

# app = FastAPI()

# # CORSを設定
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # フロントエンドのサーバーアドレス
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # データベースを定義
# DATABASE = {
#     "西千葉": {"x": 1640, "y": 2077},
#     "千葉大": {"x": 3430, "y": 4650},
#     "klab": {"x": 3330, "y": 1240},
#     "北京亭": {"x": 35.62377319704928, "y": 140.10337833307406 },
# }

# # class Coordinate(BaseModel):
# #     x: int
# #     y: int

# class Coordinate(BaseModel):
#     x: float  # int から float に変更
#     y: float  # int から float に変更
    
# # 座標と混雑度をまとめて取得するエンドポイント
# @app.get("/location/{name}")
# async def get_location_and_congestion(name: str):
#     if name in DATABASE:
#         coordinates = DATABASE[name]
#         congestion = generate_congestion()  # 混雑度を取得する処理
#         return {"coordinates": coordinates, "congestion": congestion}
#     else:
#         return {"error": "Name not found"}

# # 混雑度をランダムで生成（ココをMLの処理に！！）
# def generate_congestion():
#     return random.randint(0, 100)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
import random
from typing import List


app = FastAPI()

# CORSを設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドのサーバーアドレス
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Coordinate(BaseModel):
    lat: float
    lng: float

class Coordinates(BaseModel):
    coordinates: List[Coordinate]


@app.post("/save_coordinates")
def save_coordinates(coordinates_list: List[dict]):
    # 座標データをCSVに書き込む
    with open('coordinates.csv', 'w', newline='') as csvfile:
        fieldnames = ['latitude', 'longitude']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for coord in coordinates_list:
            writer.writerow({'latitude': coord['lat'], 'longitude': coord['lng']})

    # ランダムな混雑度を座標ごとに生成
    congestions = [generate_congestion() for _ in coordinates_list]

    # 位置情報と混雑度の組み合わせをリストとして返す
    return [{"coordinates": coord, "congestion": congestion} for coord, congestion in zip(coordinates_list, congestions)]

# 混雑度をランダムで生成（ここでMLからの出力を受け取る）
def generate_congestion():
    return random.randint(0, 100)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="localhost", port=5000)
