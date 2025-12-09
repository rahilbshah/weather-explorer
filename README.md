# Weather Explorer

Full-stack weather data explorer application for inRisk interview case study.

## Features

- Fetch and store historical weather data from Open-Meteo API
- List and view stored weather files
- Visualize temperature data with interactive charts
- Responsive React frontend with Tailwind CSS
- FastAPI backend with AWS S3 storage

## Tech Stack

**Backend:**

- FastAPI
- Python 3.11
- AWS S3 (boto3)
- Pydantic for validation

**Frontend:**

- React + Vite
- Tailwind CSS
- Recharts for data visualization
- Axios for API calls

**Infrastructure:**

- Docker & Docker Compose
- AWS App Runner (deployment)
- AWS S3 (storage)

## Project Structure

```
weather-explorer/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose
- AWS account with S3 bucket

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/weather-explorer.git
   cd weather-explorer
   ```

2. **Backend setup:**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your AWS credentials
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your backend URL
   npm install
   ```

### Run with Docker Compose

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/docs

### Run Locally (Development)

**Backend:**

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
npm run dev
```

## API Endpoints

| Method | Endpoint                       | Description                   |
| ------ | ------------------------------ | ----------------------------- |
| POST   | `/store-weather-data`          | Fetch and store weather data  |
| GET    | `/list-weather-files`          | List all stored weather files |
| GET    | `/weather-file-content/{file}` | Get specific file content     |

## Environment Variables

**Backend (.env):**

- `AWS_REGION`: AWS region for S3
- `S3_BUCKET`: S3 bucket name
- `ALLOWED_ORIGINS`: CORS allowed origins

**Frontend (.env):**

- `VITE_API_URL`: Backend API URL

## Deployment

### Backend (AWS App Runner)

1. Build and push Docker image to ECR
2. Create App Runner service
3. Configure environment variables
4. Attach IAM role for S3 access

### Frontend (AWS S3 + CloudFront)

1. Build: `npm run build`
2. Upload `dist/` to S3 bucket
3. Configure CloudFront distribution
4. Update CORS on backend

## Testing

**Backend:**

```bash
cd backend
pytest tests/ -v
```

**Frontend:**

```bash
cd frontend
npm run test
```

## License

MIT

## Author

Built for inRisk interview case study
