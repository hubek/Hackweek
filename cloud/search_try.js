//================== Create or update Shipment ===================
Parse.Cloud.define("search_try", function( request, response ) {
	
	var params = new Object();

	params["gender"] = request.params.gender;
	params["category"] = request.params.category;
	params["address"] = request.params.address;
	params["coords"] = request.params.coords;

	getGeoPoint( params, response );
});
//================== Create or update Shipment ===================

function error( response, error )
{
	response.error( error )
}

function queryStocks( params, response )
{	
	response.success( params );
}

function getGeoPoint( params, response )
{
	if( params["coords"] )
	{
		queryStock( params, response );
	}
	else
	{
		Parse.Cloud.httpRequest({
			
			method: "POST",
			url: 'https://maps.googleapis.com/maps/api/geocode/json',

			params: {
				address : params["address"],
				key: "AIzaSyADYKV1S-640B-KTxkkD-HXb8slGMCvb2I"
			}}).then(
			  function( googleResponse ) 
			  {

				var data = googleResponse.data;
				console.error( "Working !!" );

				if( data.status == "OK")
				{
					var langLat = data.results[0].geometry.location;
					var point = new Parse.GeoPoint( { latitude: langLat.lat, longitude: langLat.lng } );

					params["coords"] = point;
				}

				queryStocks( params, response );
			 },
			 function( error )
			 {
			 	 error( response, error )
			 }
			);
	}
}
//============= Get GeoPoint From Address ==============

