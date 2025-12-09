import boto3
from botocore.exceptions import ClientError
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class S3StorageService:
    """Service for interacting with AWS S3 storage"""

    def __init__(self):
        self.s3_client = boto3.client(
            "s3", region_name=os.getenv("AWS_REGION", "us-east-1")
        )
        self.bucket_name = os.getenv("S3_BUCKET", "inrisk-weather-explorer-data")
        logger.info(f"Initialized S3 service with bucket: {self.bucket_name}")

    def generate_filename(
        self, latitude: float, longitude: float, start_date: str, end_date: str
    ) -> str:
        """
        Generate filename for weather data
        Format: weather_<lat>_<lon>_<start>_<end>_<timestamp>.json
        """
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        # Sanitize coordinates for filename
        lat_str = f"{latitude:.4f}".replace(".", "_").replace("-", "n")
        lon_str = f"{longitude:.4f}".replace(".", "_").replace("-", "n")
        start_str = start_date.replace("-", "")
        end_str = end_date.replace("-", "")

        filename = f"weather_{lat_str}_{lon_str}_{start_str}_{end_str}_{timestamp}.json"
        return filename

    async def upload_weather_data(
        self,
        data: Dict[str, Any],
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str,
    ) -> str:
        """
        Upload weather data to S3

        Returns:
            Filename of the uploaded file
        """
        filename = self.generate_filename(latitude, longitude, start_date, end_date)

        try:
            json_data = json.dumps(data, indent=2)

            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=filename,
                Body=json_data,
                ContentType="application/json",
            )

            logger.info(f"Successfully uploaded {filename} to S3")
            return filename

        except ClientError as e:
            logger.error(f"Failed to upload to S3: {e}")
            raise Exception(f"Failed to upload weather data to S3: {str(e)}")

    async def list_weather_files(self) -> List[Dict[str, Any]]:
        """
        List all weather files in the S3 bucket

        Returns:
            List of file metadata dictionaries
        """
        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)

            if "Contents" not in response:
                return []

            files = []
            for obj in response["Contents"]:
                files.append(
                    {
                        "filename": obj["Key"],
                        "size": obj["Size"],
                        "last_modified": obj["LastModified"].isoformat(),
                    }
                )

            logger.info(f"Listed {len(files)} weather files from S3")
            return files

        except ClientError as e:
            logger.error(f"Failed to list S3 objects: {e}")
            raise Exception(f"Failed to list weather files: {str(e)}")

    async def get_file_content(self, filename: str) -> Optional[Dict[str, Any]]:
        """
        Get content of a specific weather file

        Args:
            filename: Name of the file to retrieve

        Returns:
            JSON content of the file, or None if not found
        """
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=filename)

            content = response["Body"].read().decode("utf-8")
            data = json.loads(content)

            logger.info(f"Retrieved file {filename} from S3")
            return data

        except ClientError as e:
            if e.response["Error"]["Code"] == "NoSuchKey":
                logger.warning(f"File not found: {filename}")
                return None
            logger.error(f"Failed to get file from S3: {e}")
            raise Exception(f"Failed to retrieve file: {str(e)}")


# Singleton instance
storage_service = S3StorageService()
