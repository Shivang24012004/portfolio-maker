from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.layouts import router as layouts_router
from app.api.layout_data import router as layout_data_router
from app.config.database import close_mongo_connection, connect_to_mongo

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(layouts_router)
app.include_router(layout_data_router)

@app.get("/")
def root():
    return {"message": "Backend Running"}