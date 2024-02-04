import scrapy


class BlogSpider(scrapy.Spider):
    name = "blogspider"
    start_urls = ["https://www.zyte.com/blog/"]

    def parse(self, response):
        for title in response.xpath("//title/text()"):
            yield {"title": str(title)}
