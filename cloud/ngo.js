//================== Create NGO ===================
Parse.Cloud.define("create_ngo", function(request, response) {

  var ngo = new Parse.Object( "NgoDetails" );

  ngo.set( "name", request.params.name );
  ngo.set( "description", request.params.description );
  ngo.set( "address", request.params.address );

  ngo.save( null, {

  	success: function( ngo ){

  		response.success( ngo );

  	},

  	error: function( error ){

  		response.error( error );
  	}

  });

});
//================== Create NGO ===================

Parse.Cloud.define('myHttpRequest', function(request, response) {
  
  Parse.Cloud.httpRequest({
  	
  	method: "POST",
  	url: 'https://maps.googleapis.com/maps/api/geocode/json',

  	params: {
  		address : "Bayreuther Straße 8, Berlin",
  		key: "AIzaSyADYKV1S-640B-KTxkkD-HXb8slGMCvb2I"
    },
    
    success: function(httpResponse) {
    	var res = httpResponse.data;
    	if(res.status == "OK"){
    		var langLat = res.results[0].geometry.location;
            console.error(langLat);
        }

        response.success( httpResponse.data );
    },

    error: function(httpResponse) {
    	console.error('Request failed with response code ' + httpResponse.status);
    	response.error( httpResponse.status );
    }
  });

});