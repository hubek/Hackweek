//================== Create NGO ===================
Parse.Cloud.define("create_ngo", function( request, response ) {

  var ngo = new Parse.Object( "NgoDetails" );

  ngo.set( "name", request.params.name );
  ngo.set( "description", request.params.description );
  ngo.set( "address", request.params.address );

  Parse.Cloud.httpRequest({
  	
  	method: "POST",
  	url: 'https://maps.googleapis.com/maps/api/geocode/json',

  	params: {
  		address : request.params.address,
  		key: "AIzaSyADYKV1S-640B-KTxkkD-HXb8slGMCvb2I"
    },
    
    success: function( googleResponse ) {
    	var data = googleResponse.data;

    	console.error( data );

    	console.error( data.results[0].geometry.location );

    	if( data.status == "OK")
    	{
    		var langLat = data.results[0].geometry.location;
            console.error(langLat);

            console.error(langLat.latitude);
            console.error(langLat.lng);

            var point = new Parse.GeoPoint({latitude: 40.0, longitude: -30.0});

            ngo.set( "address", langLat );
        }

        ngo.save( null, {
        	success: function( ngo ){
        		response.success( ngo );
        	},

        	error: function( error ){
        		response.error( error );
        	}
        });
    },

    error: function( googleResponse ) {
    	console.error('Request failed with response code ' + googleResponse.status);
    	response.error( 'Invalid Address ' );
    }

  });

});
//================== Create NGO ===================