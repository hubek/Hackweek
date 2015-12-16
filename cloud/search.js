Parse.Cloud.define("ngoByDistance", function(request, response) {
  console.log("listing NGOs by distance... ")
	var lat = request.lat;
	var long = request.long;
  var query = new Parse.Query("NgoDetails");
  //query.equalTo("movie", request.params.movie);
	//query.select("name");
  query.find({
    success: function(results) {
      console.log("all NGOs: ", results)
			var categories = new Array();
			results = sortByDistance(lat, long, results);
      console.log("all NGOs by distance: ", results)
      response.success(results);
    },
    error: function() {
      response.error("category lookup failed");
    }
  });
});

function sortByDistance(lat, long, ngos) {
	for (var i = 0; i < ngos.length; ++i) {
    ngos[i].distance = 0;
  }		
	return ngos;				
}
