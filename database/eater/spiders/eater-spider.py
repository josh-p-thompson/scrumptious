import scrapy
from scrapy.loader import ItemLoader
from eater.items import RestaurantItem
from datetime import datetime

def limit_by_date(text): 
    publish_datetime = datetime.strptime(text, "%Y-%m-%dT%H:%M:%S")
    if publish_datetime.year >= 2017: 
        return True

class ArticlesSpider(scrapy.Spider): 
    name = "articles"

    start_urls = ['https://sf.eater.com/maps/archives']

    def parse(self, response): 
        articles = response.css('.c-compact-river__entry')
        for article in articles: 
            article_url = article.xpath(".//div//div//h2//a/@href").get()
            article_title = article.xpath(".//div//div//h2//a/text()").get()
            article_datetime = article.xpath(".//div//div//div//span//span//time/@datetime").get()

            if limit_by_date(article_datetime): 
                yield response.follow(article_url, self.parse_restaurants, meta={
                    'article_url': article_url, 
                    'article_title': article_title, 
                    'article_datetime': article_datetime
                })

        next_page = response.css(".c-pagination__next")
        for a in next_page: 
            yield response.follow(a, callback=self.parse)

    def parse_restaurants(self, response): 
        cards = response.css(".c-mapstack__card")
        for card in cards: 
            slug_path = "./@data-slug"
            slug = card.xpath(slug_path).get()

            name_path = ".//div[@class='c-mapstack__card-hed']//div//h1/text()"
            name = card.xpath(name_path).getall()

            address_path = ".//div[@class='c-mapstack__address']/text()"
            address = card.xpath(address_path).getall()

            maps_path = ".//ul[@class='c-mapstack__services']//li//a/@href"
            maps = card.xpath(maps_path).get()

            if slug and name and address and maps: 

                loader = ItemLoader(item=RestaurantItem(), selector=card)
                loader.add_value('article_url', response.meta['article_url'])
                loader.add_value('article_title', response.meta['article_title'])
                loader.add_value('article_datetime', response.meta['article_datetime'])
                loader.add_xpath('restaurant_slug', slug_path)
                loader.add_xpath('restaurant_name', name_path)
                loader.add_xpath('restaurant_address', address_path)
                loader.add_xpath('restaurant_googlemaps', maps_path)
                yield loader.load_item()
