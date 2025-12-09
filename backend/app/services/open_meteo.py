import asyncio
from typing import Dict, Any
import logging

import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry

logger = logging.getLogger(__name__)

OPEN_METEO_BASE_URL = "https://archive-api.open-meteo.com/v1/archive"

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession(".cache", expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo_client = openmeteo_requests.Client(session=retry_session)


def _fetch_weather_data_sync(
    latitude: float, longitude: float, start_date: str, end_date: str
) -> Dict[str, Any]:
    """Synchronous helper that calls Open-Meteo using openmeteo-requests."""
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

    responses = openmeteo_client.weather_api(OPEN_METEO_BASE_URL, params=params)
    response = responses[0]

    # Extract daily data in the same shape the frontend expects
    daily = response.Daily()
    daily_temperature_2m_max = daily.Variables(0).ValuesAsNumpy()
    daily_temperature_2m_min = daily.Variables(1).ValuesAsNumpy()
    daily_apparent_temperature_max = daily.Variables(2).ValuesAsNumpy()
    daily_apparent_temperature_min = daily.Variables(3).ValuesAsNumpy()

    # Build corresponding date range for the daily data
    dates = pd.date_range(
        start=pd.to_datetime(daily.Time(), unit="s", utc=True),
        end=pd.to_datetime(daily.TimeEnd(), unit="s", utc=True),
        freq=pd.Timedelta(seconds=daily.Interval()),
        inclusive="left",
    )

    data: Dict[str, Any] = {
        "latitude": response.Latitude(),
        "longitude": response.Longitude(),
        "elevation": response.Elevation(),
        "daily": {
            "time": [d.date().isoformat() for d in dates],
            "temperature_2m_max": daily_temperature_2m_max.tolist(),
            "temperature_2m_min": daily_temperature_2m_min.tolist(),
            "apparent_temperature_max": daily_apparent_temperature_max.tolist(),
            "apparent_temperature_min": daily_apparent_temperature_min.tolist(),
        },
    }

    logger.info("Successfully fetched weather data")
    return data


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
        Exception: If API request fails
    """
    return await asyncio.to_thread(
        _fetch_weather_data_sync, latitude, longitude, start_date, end_date
    )
