Parse.Cloud.define("category", function(request, response) {
  console.log("listing all categories... ")
  var query = new Parse.Query("Category");
  //query.equalTo("movie", request.params.movie);
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
