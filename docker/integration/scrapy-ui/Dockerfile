FROM node:18

WORKDIR /app

RUN curl -LO https://gitee.com/dog-egg1025/scrapy-ui/raw/packages/scrapy-ui-dev.tgz

RUN npm config set registry http://mirrors.cloud.tencent.com/npm/
RUN npm install scrapy-ui-dev.tgz

RUN mkdir /data
VOLUME [ "/data" ]

EXPOSE 8600

CMD [ "npx", "scrapy-ui", "run", "--dbfile", "/data/scrapy-ui.db" ]