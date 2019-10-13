# Takako

## Docker 

### `docker build -t tatako-django .`
### `docker run -p 8000:8000 takako-django`

## Celery Worker

### `celery worker -A notes --loglevel=debug` under `takako` which has `manage.py`

## Server

### `npm run build`
### `python manage.py collectstatic`
