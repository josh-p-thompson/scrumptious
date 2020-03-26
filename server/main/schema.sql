-- commands for PSQL

-- create database
CREATE DATABASE scrumptious

-- connect to database
\c scrumptious

-- create tables
CREATE TABLE articles(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  cityPrefix VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  publishDate timestamp NOT NULL
);

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  gmaps VARCHAR(255) NOT NULL,
  lat float NOT NULL,
  lng float NOT NULL
);

CREATE TABLE articles_restaurants (
  article_id INT REFERENCES articles(id),
  restaurant_id INT REFERENCES restaurants(id)
);

-- list tables
\dt

-- populate test data
INSERT INTO articles (title, city, cityPrefix, url, publishDate)
VALUES 
('The 38 Essential East Bay Restaurants, Winter 2020', 'San Francisco', 'sf', 'https://sf.eater.com/maps/best-east-bay-oakland-berkeley-restaurants-38', '2019-12-10 22:32:00'), 
('The Best Restaurants to Take Your Parents in San Francisco', 'San Francisco', 'sf', 'https://sf.eater.com/maps/best-restaurants-take-parents-dinner-san-francisco', '2019-05-08 16:38:00');

INSERT INTO restaurants (name, address, slug, gmaps, lat, lng)
VALUES 
('Chez Panisse', '1517 Shattuck Ave, Berkeley, CA 94709', 'chez-panisse', 'https://www.google.com/maps/place/Chez+Panisse/@37.879594,-122.2711237,17z/data=!3m1!4b1!4m5!3m4!1s0x80857ea1255c8b71:0x4163509ac1eb5cf9!8m2!3d37.879594!4d-122.268935', 37.879594, -122.268935);

INSERT INTO articles_restaurants (article_id, restaurant_id)
VALUES 
((SELECT id FROM articles WHERE title = 'The 38 Essential East Bay Restaurants, Winter 2020'), (SELECT id FROM restaurants)),
((SELECT id FROM articles WHERE title = 'The Best Restaurants to Take Your Parents in San Francisco'), (SELECT id FROM restaurants));