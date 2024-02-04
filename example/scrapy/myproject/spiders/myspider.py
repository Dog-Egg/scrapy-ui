import scrapy
from scrapy.http import TextResponse
from scrapy.linkextractors import LinkExtractor


linkextra = LinkExtractor()


class BlogSpider(scrapy.Spider):
    name = "blogspider"
    start_urls = ["https://www.zyte.com/blog/"]

    def parse(self, response: TextResponse):
        for title in response.xpath("//title//text()"):
            yield {"title": title.get()}

        for next_page in linkextra.extract_links(response):
            yield response.follow(next_page, self.parse)
