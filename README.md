# Scrapy UI

## 安装运行

```bash
npx scrapy-ui@latest run
```

服务默认监听 8600 端口。可以使用 `--port` 自定义端口号：

```bash
npx scrapy-ui@latest run --port 8000
```

## 开发环境说明

### Database

首次启动该项目前，需要执行以下命令来初始化开发环境数据库：

```bash
npx db-migrate up
```

### Scrapyd 服务

使用下列命令将运行一个 Scrapyd 服务，并且会向该服务上传一个 Scrapy 爬虫项目：

```bash
cd example/

docker compose up
```

如需重新上传爬虫项目，可使用以下命令：

```bash
cd example/

docker compose up scrapy-deploy
```

### UI 组件开发

```bash
npm run storybook
```
