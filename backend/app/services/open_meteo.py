import httpx
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

OPEN_METEO_BASE_URL = "https://archive-api.open-meteo.com/v1/archive"


async def fetch_weather_data(
    latitude: float, longitude: float, start_date: str, end_date: str
) -> Dict[str, Any]:
    """
    Fetch historical weather data from Open-Meteo API

    Args:
        latitude: Latitude coordinate
        longitude: Longitude coordinate
        start_date: Start date in ISO format (YYYY-MM-DD)
        end_date: End date in ISO format (YYYY-MM-DD)

    Returns:
        Dict containing weather data from Open-Meteo API

    Raises:
        httpx.HTTPError: If API request fails
    """
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start_date,
        "end_date": end_date,
        "daily": ",".join(
            [
                "temperature_2m_max",
                "temperature_2m_min",
                "apparent_temperature_max",
                "apparent_temperature_min",
            ]
        ),
        "timezone": "auto",
    }

    logger.info(
        f"Fetching weather data for lat={latitude}, lon={longitude}, {start_date} to {end_date}"
    )

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(OPEN_METEO_BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

        logger.info(f"Successfully fetched weather data")
        return data
