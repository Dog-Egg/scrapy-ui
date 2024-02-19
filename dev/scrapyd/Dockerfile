FROM python:3.11

WORKDIR /code

ADD . .

RUN pip config set global.index-url https://mirrors.cloud.tencent.com/pypi/simple
RUN pip install git+https://github.com/Dog-Egg/scrapyd.git

EXPOSE 6800

CMD ["scrapyd"]