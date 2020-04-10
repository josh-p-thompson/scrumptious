from scrapy.item import Item, Field
from scrapy.loader.processors import MapCompose, Compose, TakeFirst, Join
from datetime import datetime

def parse_datetime(text): 
    return datetime.strptime(text, '%Y-%m-%dT%H:%M:%S')

def parse_name(name_list): 
    return name_list[1]

def parse_google(link_list): 
    for link in link_list: 
        if 'google' in link: 
            return link 

class RestaurantItem(Item):
    article_url = Field(
        input_processor=MapCompose(str.strip),
        output_processor=TakeFirst()
    )
    article_title = Field(
        input_processor=MapCompose(str.strip),
        output_processor=TakeFirst()
    )
    article_datetime = Field(
        input_processor=MapCompose(parse_datetime),
        output_processor=TakeFirst()
    )
    restaurant_slug = Field(
        input_processor=MapCompose(str.strip),
        output_processor=TakeFirst()
    )
    restaurant_name = Field(
        input_processor=MapCompose(str.strip),
        output_processor=Compose(parse_name)
    )
    restaurant_address = Field(
        input_processor=MapCompose(str.strip),
        output_processor=Join(', ')
    )
    restaurant_googlemaps = Field(
        input_processor=MapCompose(str.strip),
        output_processor=Compose(parse_google)
    )