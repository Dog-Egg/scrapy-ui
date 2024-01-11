# Scrapy UI

## 开发环境

### Scrapyd

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
