# ScrapyUI

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

Replace the `<hostpath>` below to save the database on the host.

```bash
docker run -p 8600:8600 --volume=<hostpath>:/data -d dogegg/scrapy-ui
```
