# ScrapyUI

This is a web service that manages and schedules [Scrapyd](https://scrapyd.readthedocs.io/).

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

# install the latest scrapy-ui package.
npm install git+https://github.com/Dog-Egg/scrapy-ui.git#latest

# run service
./node_modules/.bin/scrapy-ui run
```
