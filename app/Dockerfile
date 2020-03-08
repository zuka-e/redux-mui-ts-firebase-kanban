# pull official base image
FROM python:3.8.2-alpine

# [ set work directory ]
WORKDIR /usr/src/app

# [ set environment variables ]
# Prevents Python from writing pyc files to disc 
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# [ install dependencies ]
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

# [  copy project ]
COPY . /usr/src/app/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
