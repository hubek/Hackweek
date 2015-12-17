Parse.Cloud.define("searchForCategories", function(request, response) {
  console.log("listing categories by availibility and distance... ")
	var categories = request.params.categories;
	var lat = request.params.lat;
	var long = request.params.long;
	console.log("Coords: lat " + lat + ", long " + long)

	var arrayOfQueries = new Array();
	for (var i = 0; i < categories.length; i++) {
		var query = new Parse.Query("Category");
		query.equalTo("name", request.params.categories[i]);
		arrayOfQueries = query;
	}

	Parse.Query.or.apply(Parse.Query, arrayOfQueries).find().then(function(results) {
      console.log("all Categories: " + results)
			//var results2 = sortByDistance(lat, long, results);	
      //console.log("all Categories by distance: " + results2)
      response.success(results);
    }, function(error) {
      response.error("all Categories failed");
    }
  );
});

