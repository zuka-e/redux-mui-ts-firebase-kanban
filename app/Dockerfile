FROM python:3.8.2-alpine

WORKDIR /usr/src/app

    # Prevents Python from writing pyc files to disc 
ENV PYTHONDONTWRITEBYTECODE=1 \
  # Prevents Python from buffering stdout and stderr
  PYTHONUNBUFFERED=1 \
  # Create ,venv in project-dir instead of ~/.local/share/virtualenvs/
  PIPENV_VENV_IN_PROJECT=1 \
  # Sytem install, not into virtual-env (equiv.--system)
  PIPENV_SYSTEM=1

# Install psycopg2 for postgres dependencies
RUN apk update && apk add \
  postgresql-dev \
  gcc \
  python3-dev \
  musl-dev

# Install from Pipfile by pipenv
COPY Pipfile Pipfile.lock /usr/src/app/
RUN pip install --upgrade pip && pip install pipenv \
  && pipenv install --deploy

COPY . /usr/src/app/

CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]
