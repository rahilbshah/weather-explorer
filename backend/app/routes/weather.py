from fastapi import APIRouter, HTTPException, status
from app.models.schemas import WeatherRequest, WeatherResponse, WeatherFileMetadata
from app.services.open_meteo import fetch_weather_data
from app.services.storage import storage_service
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["weather"])


@router.post("/store-weather-data", response_model=WeatherResponse)
async def store_weather_data(request: WeatherRequest):
    """
    Fetch weather data from Open-Meteo API and store in S3

    Validates input coordinates and dates, fetches historical weather data,
    and stores the complete response in S3 bucket.
    """
    try:
        # Fetch weather data from Open-Meteo
        weather_data = await fetch_weather_data(
            latitude=request.latitude,
            longitude=request.longitude,
            start_date=request.start_date,
            end_date=request.end_date,
        )

        # Store in S3
        filename = await storage_service.upload_weather_data(
            data=weather_data,
            latitude=request.latitude,
            longitude=request.longitude,
            start_date=request.start_date,
            end_date=request.end_date,
        )

        return WeatherResponse(
            success=True, message="Weather data successfully stored", filename=filename
        )

    except Exception as e:
        logger.error(f"Error storing weather data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store weather data: {str(e)}",
        )


@router.get("/list-weather-files", response_model=List[WeatherFileMetadata])
async def list_weather_files():
    """
    List all stored weather files from S3

    Returns metadata including filename, size, and last modified date
    """
    try:
        files = await storage_service.list_weather_files()
        return [WeatherFileMetadata(**file) for file in files]

    except Exception as e:
        logger.error(f"Error listing weather files: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list weather files: {str(e)}",
        )


@router.get("/weather-file-content/{filename}", response_model=dict)
async def get_weather_file_content(filename: str):
    """
    Get content of a specific weather file from S3

    Returns the full JSON content of the stored weather data
    """
    try:
        content = await storage_service.get_file_content(filename)

        if content is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"File '{filename}' not found",
            )

        return content

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving file content: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve file content: {str(e)}",
        )
