const express = require('express');
const router = express.Router();
const pool = require('./db.js')

/*

POSTGRES QUERIES

*/
const queryArticles = 'SELECT * FROM article ORDER BY title'; 

const queryRestaurants = `
	SELECT *, array_length(articles, 1) AS article_count
	FROM restaurant
	LEFT JOIN 
		(SELECT restaurant_id AS id, array_agg(article_id) AS articles 
		FROM restaurant_article 
		GROUP BY restaurant_id) a 
	using (id)
	WHERE lat IS NOT NULL AND lng IS NOT NULL
	ORDER BY article_count DESC`;

/*

HELPER FUNCTIONS

*/

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

/*

ROUTES

*/

router.get('/api/restaurants', (request, response) => {
	let userLat = request.query.lat;
	let userLng = request.query.lng;

	// query Articles
	pool.query(queryArticles, (articles_error, articles_results) => {
		if (articles_error) {
			throw error;
		};

		const all_articles = articles_results.rows;
		
		// query Restaurants
		pool.query(queryRestaurants, (error, results) => {
			if (error) {
				throw error
			};

			const restaurants = results.rows; 

			// map articleIds to article objects
			restaurants.map(rest => 
				rest.articles.map((articleId, index) =>
					rest.articles[index] = all_articles.find(element =>
						element.id === articleId	
					)
				)
			);
	
			if (userLat === "null" || userLng === "null") {
				response.status(200).json(restaurants)
			} else {		
				restaurants.map(rest =>
					rest['distance'] = parseFloat(calculateDistance(rest.lat, rest.lng, userLat, userLng))
				);
				response.status(200).json(restaurants);
			}
		}); 
	});
});

router.get('/api/articles', (request, response) => {
	pool.query(queryArticles, (error, results) => {
		if (error) {
		  throw error
		}
		response.status(200).json(results.rows)
	})
})


module.exports = router