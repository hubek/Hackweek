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
      response.error("all NGOs by distance failed");
    }
  );
});

function sortByDistance(lat, long, ngos) {
	console.log("sortByDistance: ");
	var newNgos = ngosWithDistance(lat, long, ngos);
	newNgos.sort(compareByDistance);
	return newNgos;				
}

function ngosWithDistance(lat, long, ngos) {
	var newNgos = new Array();
	for (var i = 0; i < ngos.length; i++) {
		newNgos[i] = JSON.parse(JSON.stringify(ngos[i]));
		var ngoLat = newNgos[i].coordinates.latitude;
		var ngoLong = newNgos[i].coordinates.longitude
    newNgos[i].distance = dist(long-ngoLong, lat-ngoLat);
  };		
	return newNgos;	
}

function dist(x1,y1,x2,y2){ 
  if(!x2) x2=0; 
  if(!y2) y2=0;
  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); 
}

function compareByDistance(a,b) {
  if (a.distance < b.distance)
    return -1;
  if (a.distance > b.distance)
    return 1;
  return 0;
}
