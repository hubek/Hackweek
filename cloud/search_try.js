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

	var categoryQueries = getCategoryQueries( params["category"] );
	
	var genderPointers = getGenderPointers( params["gender"] );

	console.error( "Category Queries" + categoryQueries );
	console.error( "Gender Queries" + genderPointers );

	//========= Main Query 
	var mainQuery = new Parse.Query("Stock");

	mainQuery._orQuery( categoryQueries );

	mainQuery.containedIn( "gender", genderPointers );

	mainQuery.find( {
		success: function( result ) 
		{
			response.success( result );

		},
		error: function( error )
		{
			response.success( error );
		}
	});
}

//============== Get Categories Or Query ==============
function getCategoryQueries( categories )
{
	var queries = new Array();

	for (var i = 0; i < categories.length; i++) 
	{
		var query = new Parse.Query("Stock");
		
		query.equalTo( "category", pointerTo( categories[i], "Category" ));
		
		queries.push( query );
	}

	return queries;
}
//============== Get Categories Or Query ==============

//============== Get Gender Pointer ==============
function getGenderPointers( ids )
{
	var pointers = new Array();

	for (var i = 0; i < ids.length; i++) 
	{
		pointers.push( pointerTo( ids[i], "Gender" ) );
	}

	return pointers;
}
//============== Get Gender Pointer ==============


//============== Get GeoPoint From Address ============
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
//============== Get GeoPoint From Address ============

function pointerTo( objectId, klass ) 
{
    return { __type: "Pointer", className: klass, objectId: objectId };
}

