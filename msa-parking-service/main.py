import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import parking
from service.database import create_tables

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:3000", # 허용할 프론트엔드 도메인
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(parking.router)


if __name__ == '__main__':
    create_tables()
    uvicorn.run('main:app', port=8002, reload=True)
