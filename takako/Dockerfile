FROM python:3.6

RUN mkdir -p /opt
RUN mkdir -p /opt/takako
COPY takako/ /takako


RUN set -ex; \
    pip install --upgrade pip;

ADD . /opt

WORKDIR /opt
RUN pip install -r requirements.txt

#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

ENTRYPOINT ["gunicorn", "--config", "gunicorn_config.py", "takako.wsgi:application"]
