# ScrapyUI

This is a web service that manages and schedules [Scrapyd](https://scrapyd.readthedocs.io/).

[![Published on npm](https://img.shields.io/npm/v/scrapy-ui?logo=npm)](https://www.npmjs.com/package/scrapy-ui)

## Running

### via `npx`

This project uses [Node](https://nodejs.org/) as its runtime, so you can start service with `npx`.

```bash
npx scrapy-ui@latest run
```

By default, the service listens to port 8600. You can use `--port` to customize the port.

```bash
npx scrapy-ui@latest run --port 8000
```

### via Docker

```bash
docker run -p 8600:8600 -d dogegg/scrapy-ui
```

Replace the `HOST_PATH` below to save the database on the host.

```bash
docker run -p 8600:8600 --volume=HOST_PATH:/data -d dogegg/scrapy-ui
```

## Installation the latest deveoplment package

```bash
# create a directory to install package.
mkdir scrapy-ui-service
cd scrapy-ui-service

# download package.
curl -LO https://cdn.jsdelivr.net/gh/Dog-Egg/scrapy-ui@packages/scrapy-ui-dev.tgz

# install package.
npm install scrapy-ui-dev.tgz

# run service
npx scrapy-ui run
```
