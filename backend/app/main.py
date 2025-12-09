from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import weather
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

app = FastAPI(
    title="Weather Explorer API",
    description="API for fetching and storing historical weather data",
    version="1.0.0",
)

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(weather.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Weather Explorer API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "ok",
        "aws_region": os.getenv("AWS_REGION", "not_set"),
        "s3_bucket": os.getenv("S3_BUCKET", "not_set"),
    }
