//var _ = require("underscore");

Parse.Cloud.define("category", function(request, response) {
  console.log("listing all categories... ")
  var query = new Parse.Query("Category");
  //query.equalTo("movie", request.params.movie);
	//query.select("name");
  query.find({
    success: function(results) {
      console.log("all categories: ", results)
			var categories = new Array();
			for (var i = 0; i < results.length; ++i) {
        categories[i] = { "name":results[i].get("name")};
      }
      console.log("all categories: ", categories)
      response.success(categories);
    },
    error: function() {
      response.error("category lookup failed");
    }
  });
});

Parse.Cloud.define("categoryWithGroup", function(request, response) {
  console.log("listing all categories with groups... ")
  var query = new Parse.Query("Category");
	query.include("group")
  //query.equalTo("movie", request.params.movie);
	//query.select("name");
  query.find({
    success: function(results) {
      console.log("all categories: ", results)
      response.success(results);
    },
    error: function() {
      response.error("category lookup failed");
    }
  });
});
