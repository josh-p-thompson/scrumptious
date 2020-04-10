# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

from sqlalchemy.orm import sessionmaker
from scrapy.exceptions import DropItem
from eater.models import Restaurant, Article, db_connect, create_table
import logging
import os
from geopy.geocoders import GoogleV3

def parse_googlemaps_id(text): 
    if 'place_id' in text: 
        return text.split('query_place_id=')[1]

def parse_lat(text): 
    if 'place_id' not in text: 
        coordinates = text.split('/')[-1]
        return round(float(coordinates.split(',')[0]), 4)

def parse_lng(text): 
    if 'place_id' not in text: 
        coordinates = text.split('/')[-1]
        return round(float(coordinates.split(',')[1]), 4)

def convert_id(text): 
    """ Returns lat and lng from place ID using Google Geocoder """
    GOOGLE_API_KEY = os.environ['GOOGLE_API_KEY']
    geo = GoogleV3(api_key=GOOGLE_API_KEY)
    location = geo.geocode(place_id=text)
    return location.latitude, location.longitude

class DuplicatesPipeline(object): 
    def __init__(self):
        """
        Initializes database connection and sessionmaker.
        Creates tables.
        """
        engine = db_connect()
        create_table(engine)
        self.Session = sessionmaker(bind=engine)
        logging.info("****DuplicatesPipeline: database connected****")

    def process_item(self, item, spider):
        session = self.Session()
        exist_restaurant = session.query(Restaurant).filter_by(slug = item['restaurant_slug']).first()
        exist_article = session.query(Article).filter_by(url = item['article_url']).first()

        is_duplicate = False
        if exist_restaurant and exist_article: 
            if exist_article in exist_restaurant.articles: 
                is_duplicate = True

        if is_duplicate:
            raise DropItem(f"Duplicate item found: {item['restaurant_slug']} in {item['article_url']}")
            session.close()
        else:
            return item
            session.close()

class RestaurantsPipeline(object):
    def __init__(self):
        """
        Initializes database connection and sessionmaker
        Creates tables
        """
        engine = db_connect()
        create_table(engine)
        self.Session = sessionmaker(bind=engine)
        logging.info("****SaveRestaurantsPipeline: database connected****")



    def process_item(self, item, spider):
        """
        Save restaurants in the database
        This method is called for every item pipeline component
        """
        session = self.Session()
        article = Article()
        restaurant = Restaurant()

        # populate article
        article.url = item['article_url']
        article.title = item['article_title']
        article.datetime = item['article_datetime']
    
        # populate restaurant
        restaurant.name = item['restaurant_name']
        restaurant.slug = item['restaurant_slug']
        restaurant.address = item['restaurant_address']
        restaurant.googlemaps_url = item['restaurant_googlemaps']
        restaurant.googlemaps_id = parse_googlemaps_id(restaurant.googlemaps_url)
        restaurant.lat = parse_lat(restaurant.googlemaps_url)
        restaurant.lng = parse_lng(restaurant.googlemaps_url)

        # determine if new article
        exist_article = session.query(Article).filter_by(url = article.url).first()
        if exist_article: 
            article = exist_article

        # determine if new restaurant
        exist_restaurant = session.query(Restaurant).filter_by(slug = restaurant.slug).first()
        if exist_restaurant: 
            restaurant = exist_restaurant
            if article not in restaurant.articles: 
                restaurant.articles.append(article)
                restaurant.article_count = len(restaurant.articles)
        else:
            # geocode for lat lng if necessary
            if restaurant.googlemaps_id: 
                restaurant.lat, restaurant.lng = convert_id(restaurant.googlemaps_id)
            # add article to restaurant.articles
            restaurant.articles.append(article)
            restaurant.article_count = 1

        try:
            session.add(restaurant)
            session.commit()

        except:
            session.rollback()
            raise

        finally:
            session.close()

        return item