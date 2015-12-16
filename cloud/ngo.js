//================== Create or update NGO ===================
Parse.Cloud.define("update_ngo", function( request, response ) {

var query = new Parse.Query("NgoDetails");

query.get( request.params.id ).then(
	function( ngo )
	{
		return ngo;
	},
	function( error )
	{	
		return Parse.Promise.as( new Parse.Object( "NgoDetails" ) );

	}).then(

	function( ngo )
	{
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
				console.error( "Working !!" );

				if( data.status == "OK")
				{
					var langLat = data.results[0].geometry.location;
					var point = new Parse.GeoPoint( { latitude: langLat.lat, longitude: langLat.lng } );
					ngo.set( "coordinates", point );
				}

				ngo.save( null ).then(

					function( ngo ){
						response.success( ngo );
					},

					function( error ){
						response.error( error );
					}
				);
			},

			error: function( googleResponse ) {
				response.error( 'Invalid Address ' + googleResponse );
			}
		});
	},
	function(error)
	{
		response.error( error );
	});
});
//================== Create or update NGO ===================

//================== Get NGO ===================
Parse.Cloud.define("get_ngo", function( request, response ) {

var query = new Parse.Query("NgoDetails");

query.get( request.params.id ).then(
	function( ngo )
	{
		response.success( ngo );
	},
	function( error )
	{	
		response.success( error);

	});
});
//================== Get NGO ===================

//================== List NGOs ===================
Parse.Cloud.define("list_ngos", function( request, response ) {

var query = new Parse.Query("NgoDetails");

query.find({
	success: function( ngos)
	{
		response.success( ngos );
	},
	error: function( error )
	{	
		response.success( error);

	}
 });
});
//================== List NGOs ===================