from sqlalchemy import create_engine, Column, Table, ForeignKey, MetaData
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (
    Integer, String, DateTime, Float, Boolean
)
from sqlalchemy.engine.url import URL
from scrapy.utils.project import get_project_settings

Base = declarative_base()


def db_connect():
    """
    Performs database connection using database settings from settings.py.
    Returns sqlalchemy engine instance
    """
    return create_engine(get_project_settings().get("CONNECTION_STRING"), pool_size=20, max_overflow=20)


def create_table(engine):
    """"""
    Base.metadata.create_all(engine)


restaurant_article = Table('restaurant_article', Base.metadata,
    Column('restaurant_id', Integer, ForeignKey('restaurant.id')),
    Column('article_id', Integer, ForeignKey('article.id')),
)


class Article(Base):
    __tablename__ = "article"

    id = Column(Integer, primary_key=True)
    title = Column('title', String)
    url = Column('url', String)
    datetime = Column('datetime', DateTime)
    restaurants = relationship('Restaurant', secondary='restaurant_article',
        lazy='dynamic', backref="article") 


class Restaurant(Base):
    __tablename__ = "restaurant"

    id = Column(Integer, primary_key=True)
    name = Column('name', String)
    address = Column('address', String)
    slug = Column('slug', String)
    googlemaps_url = Column('googlemaps_url', String)
    googlemaps_id = Column('googlemaps_id', String, nullable=True)
    lat = Column('lat', Float)
    lng = Column('lng', Float)
    articles = relationship('Article', secondary='restaurant_article',
        lazy='dynamic', backref="restaurant") 