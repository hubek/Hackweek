require('cloud/category.js');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("test", function(request, response) {
  
  Parse.Cloud.useMasterKey();
  var query = new Parse.Query( Parse.User);

  //query.equalTo("name", request.params.name);

  query.find({
    success: function(results) {

      response.success( results );
    },
    error: function() {
      response.error("user lookup failed");
    }
  });

});
