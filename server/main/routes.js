const express = require('express');
const router = express.Router();
const pool = require('./db')

const restaurantsData = require('../static/example_restaurants.json');
const articlesData = require('../static/example_articles.json');

// used to calculate distance between user and restaurants
const calculateDistance = (lat1, lon1, lat2, lon2) => {
	let R = 6371; // Radius of the earth in km
	let dLat = deg2rad(lat2-lat1);  // deg2rad below
	let dLon = deg2rad(lon2-lon1); 
	let a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	let d = R * c * 0.62137119; // Distance in miles
	return d.toFixed(1);
}
const deg2rad = (deg) => {
	return deg * (Math.PI/180)
}

// returns restaurants; if lat/lng provided, calculates distance from location for each restaurant
router.get('/api/restaurants', (request, response) => {
	let userLat = request.query.lat;
	let userLng = request.query.lng;

	if (userLat === "null" || userLng === "null") {
		response.json(restaurantsData);
	} else {
		// deep copy
		let restaurantsDataLocations = JSON.parse(JSON.stringify(restaurantsData));
		// let restaurantsDataLocations = [...restaurantsData];
		restaurantsDataLocations.map(rest =>
			rest['distance'] = calculateDistance(rest.lat, rest.lng, userLat, userLng)
		); 
		response.json(restaurantsDataLocations);
	}
})

router.get('/api/articles', (request, response) => {
	response.json(articlesData);
})

module.exports = router