from pydantic import BaseModel, Field, field_validator
from datetime import datetime, date
from typing import Optional


class WeatherRequest(BaseModel):
    """Request schema for storing weather data"""

    latitude: float = Field(
        ..., ge=-90, le=90, description="Latitude between -90 and 90"
    )
    longitude: float = Field(
        ..., ge=-180, le=180, description="Longitude between -180 and 180"
    )
    start_date: str = Field(..., description="Start date in ISO format (YYYY-MM-DD)")
    end_date: str = Field(..., description="End date in ISO format (YYYY-MM-DD)")

    @field_validator("start_date", "end_date")
    @classmethod
    def validate_date_format(cls, v: str) -> str:
        """Validate date is in ISO format"""
        try:
            datetime.fromisoformat(v)
            return v
        except ValueError:
            raise ValueError(f"Date must be in ISO format (YYYY-MM-DD), got: {v}")

    @field_validator("end_date")
    @classmethod
    def validate_date_range(cls, v: str, info) -> str:
        """Validate date range constraints"""
        start_date_str = info.data.get("start_date")
        if not start_date_str:
            return v

        start_date = datetime.fromisoformat(start_date_str).date()
        end_date = datetime.fromisoformat(v).date()

        # Check start_date <= end_date
        if start_date > end_date:
            raise ValueError(f"start_date must be less than or equal to end_date")

        # Check max range of 31 days
        delta = (end_date - start_date).days
        if delta > 31:
            raise ValueError(f"Date range cannot exceed 31 days, got {delta} days")

        return v


class WeatherFileMetadata(BaseModel):
    """Metadata for a stored weather file"""

    filename: str
    size: Optional[int] = None
    last_modified: Optional[str] = None


class WeatherResponse(BaseModel):
    """Response schema for weather operations"""

    success: bool
    message: str
    filename: Optional[str] = None
    data: Optional[dict] = None
