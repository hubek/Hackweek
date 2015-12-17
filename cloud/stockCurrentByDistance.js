Parse.Cloud.define("stockCurrentByDistance", function(request, response) {
  console.log("listing categories by availibility and distance... ")
	var categories = request.params.categories;
	var lat = request.params.lat;
	var long = request.params.long;
	console.log("Coords: lat " + lat + ", long " + long)

	var arrayOfQueries = new Array();
	for (var i = 0; i < categories.length; i++) {
		var query = new Parse.Query("Stock");
		//query.include("gender").include("ngo").include("category").include("size");
		query.notEqualTo("current", 0);
		query.equalTo("category", pointerTo( request.params.categories[i].id, "Category" ));
		arrayOfQueries.push(query);
	}

	var orQuery = new Parse.Query("Stock");
	orQuery._orQuery(arrayOfQueries);
	orQuery.include("gender").include("ngo").include("category").include("size");

	orQuery.find( function(results) {
      console.log("all Categories: " + results)
			//var results2 = sortByDistance(lat, long, results);	
      //console.log("all Categories by distance: " + results2)
      response.success(results);
    }, function(error) {
      response.error("all Categories failed");
    }
  );
});


Parse.Cloud.define("stockCurrentByDistance2", function(request, response) {
  console.log("listing categories by availibility and distance... ")
	var categories = request.params.categories;
	var lat = request.params.lat;
	var long = request.params.long;
	console.log("Coords: lat " + lat + ", long " + long)

	var arrayOfQueries = new Array();
	for (var i = 0; i < categories.length; i++) {
		var query = new Parse.Query("Stock");
		query.include("gender").include("ngo").include("category").include("size");
		//query.notEqualTo("current", 0);
		//query.equalTo("category", pointerTo( request.params.categories[i].id, "Category" ));
		arrayOfQueries.push(query);
	}

	var ob = eval("Parse.Query.or(arrayOfQueries[0], arrayOfQueries[1])");

	ob.find( function(results) {
      console.log("all Categories: " + results)
			//var results2 = sortByDistance(lat, long, results);	
      //console.log("all Categories by distance: " + results2)
      response.success(results);
    }, function(error) {
      response.error("all Categories failed");
    }
  );
});



function pointerTo( objectId, klass ) {
    return { __type: "Pointer", className: klass, objectId: objectId };
}
