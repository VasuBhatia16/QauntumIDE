FROM node:18 AS frontend-build

WORKDIR /frontend

COPY frontend/ .

COPY frontend/package*.json .

RUN npm install

RUN npm run build

FROM python:3.11-slim AS backend-build

WORKDIR /backend

COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app

COPY backend/.env .env

FROM python:3.11-slim

WORKDIR /app

RUN ln -s /run/desktop/docker.sock /var/run/docker.sock || true

RUN apt-get update && \
    apt-get install -y curl docker.io && \
    apt-get clean


COPY --from=backend-build /backend/app ./app

COPY --from=backend-build /backend/.env .env

COPY --from=frontend-build /frontend/dist ./static

RUN pip install uvicorn[standard] fastapi

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

