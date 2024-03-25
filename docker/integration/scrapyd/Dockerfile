FROM python:3.12

WORKDIR /app

COPY . .

RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install -U pip

# 国内镜像源
RUN pip install git+https://gitee.com/dog-egg1025/scrapyd.git

EXPOSE 6800

CMD [ "scrapyd" ]