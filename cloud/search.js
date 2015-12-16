Parse.Cloud.define("ngoByDistance", function(request, response) {
  console.log("listing NGOs by distance... ")
	var lat = request.params.lat;
	var long = request.params.long;
	console.log("Coords: lat " + lat + ", long " + long)

  var query = new Parse.Query("NgoDetails");
  //query.equalTo("movie", request.params.movie);
	//query.select("name");
  query.find().then(function(results) {
      console.log("all NGOs: " + results)
			var results2 = sortByDistance(lat, long, results);	
      console.log("all NGOs by distance: " + results2)
      response.success(results2);
    }, function(error) {
      response.error("category lookup failed");
    }
  );
});

function sortByDistance(lat, long, ngos) {
	var newNgos = new Array();
	for (var i = 0; i < ngos.length; i++) {
		console.log("sortByDistance: " + i);
		newNgos[i] = JSON.parse(JSON.stringify(ngos[i]));
    newNgos[i].distance = 1;
		console.log("distance: " + newNgos[i].distance);
  };		
	return newNgos;				
}
