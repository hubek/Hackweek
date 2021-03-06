//================== Create or update Shipment ===================
Parse.Cloud.define("search_stocks", function( request, response ) {
	
	var params = new Object();

	params["category"] = request.params.category;
	params["address"] = request.params.address;
	params["coords"] = request.params.coords;
	params["gender"] = request.params.gender;
	params["radius"] = request.params.radius;

	fixParams( params, {
		success: function( params )
		{
			queryStocks( params, response );
		},
		error: function( error )
		{
			response.error( error );
		}

	});
});
//================== Create or update Shipment ===================

function queryStocks( params, response )
{	
	var categoryPointers = getIdsPointers( params["category"], "Category" );
	
	var genderPointers = getIdsPointers( params["gender"], "Gender" );

	//========= Main Query 
	var mainQuery = new Parse.Query("Stock");

	mainQuery.containedIn( "category", categoryPointers );

	mainQuery.containedIn( "gender", genderPointers );

	mainQuery.greaterThan( "current", 0 );

	mainQuery.include( [ "gender", "ngo", "category", "size"] );

	mainQuery.find().then( 
		function( results ) 
		{
			//=============== Build result query with distance
			var filteredSearchResults = new Array();

			for( var i =0 ; i < results.length ; i++ )
			{
				//==== set stock
				var searchResult = new Object();

				searchResult["stock"] = results[i];
				
				//===== set distance
				var ngoLocation = results[i].get("ngo").get("coordinates");

				var distance = ngoLocation.kilometersTo( params["coords"] );

				searchResult["distance"] = distance;

				//=== set unique key
				var ngoId = results[i].get("ngo").id ;
				var categoryId = results[i].get("category").id;
				var genderId = results[i].get("gender").id;
				
				var key = ngoId + categoryId + genderId;

				searchResult["refKey"] = key;

                //=== add result
				filteredSearchResults[i] = searchResult;
			}

			return  filteredSearchResults ;
		}
	).then(
	  function ( results )
	  {
	  	return filterResults( results, params["radius"] );
	  }
	).then(
	  function( results )
	  {
	  	response.success( sortStocks( results ) );
	  },
	  function( error )
	  {
	  	response.error( error );
	  }
	);
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
function getIdsPointers( ids, type )
{
	var pointers = new Array();

	for (var i = 0; i < ids.length; i++) 
	{
		pointers.push( pointerTo( ids[i], type ) );
	}

	return pointers;
}
//============== Get Gender Pointer ==============


//============== Get GeoPoint From Address ============
function getGeoPoint( params, callback )
{
	if( exists( params["coords"] ) ) 
	{
		var point = new Parse.GeoPoint( { latitude: params["coords"]["lat"], 
			longitude: params["coords"]["lng"] } );

		params["coords"] = point;

		callback.success( params ) ;
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

				if( data.status == "OK")
				{
					var langLat = data.results[0].geometry.location;
					var point = new Parse.GeoPoint( { latitude: langLat.lat, longitude: langLat.lng } );

					params["coords"] = point;
				}

				callback.success( params ) ;
			 },
			 function( error )
			 {
			 	 callback.error( error );
			 }
			);
	}
}
//============== Get GeoPoint From Address ============

//============== Fix Params =========================
function fixParams( params, callback )
{
    // set default radius
	if( !exists( params["radius"] )  )
	{
		params["radius"] = 20;
	}

	var query = new Parse.Query("Gender");

	query.find().then(
		function( results )
		{
			if( exists( params["gender"] ) && params["gender"].length > 0 )
			{
				return params;
			}
			else
			{
				var genderIds = new Array();

				for( var i = 0 ; i < results.length; i++ )
				{
					genderIds[i] = results[i].id;
				}

				params["gender"] = genderIds;
				return params;
			}
		}).then(
		  function( params )
		  {

		  	if( exists( params["category"] ) && params["category"].length > 0 )
		  	{
		  		return params;
		  	}
		  	else
		  	{
		  		var query = new Parse.Query("Category");

		  		return query.find().then(
		  			function ( results )
		  			{
		  				var categoryIds = new Array();
		  				for( var i = 0 ; i < results.length; i++ )
		  				{
		  					categoryIds[i] = results[i].id;
		  				}

		  				params["category"] = categoryIds;

		  				return params;
		  			}
		  		);
		  	}
		  }).then(
		    function ( params )
		    {
		    	getGeoPoint( params, callback );
		    },

		    function ( error )
		    {
		    	callback.error( error );
		    }
		);
}
//============== Fix Params =========================


//============== Filter Results ========================
function filterResults( stocks, radius )
{

	var filteredStocks = new Array();
	var repeated = new Array();

	for( var i = 0; i < stocks.length; i++ )
	{
		var key = stocks[i]["refKey"];

		console.error( "Ref Key " + key);

		if( stocks[i]["distance"] > radius || exists( repeated[ key ] ) )
		{
			continue;
		}

		filteredStocks[ filteredStocks.length ] = stocks[i];
		repeated[ key ] = true;
	}

	return filteredStocks;
}
//============== Filter Results ========================

//============== Sort Stocks ========================
function sortStocks( stocks )
{	
	return stocks.sort( compareByDistance );
}
//============== Sort Stocks ========================

//============= Compare function ===============
function compareByDistance( first, second ) 
{
  if ( first.distance < second.distance)
    return -1;
  if (first.distance > second.distance)
    return 1;
  return 0;
}
//============= Compare function ===============

function pointerTo( objectId, klass ) 
{
    return { __type: "Pointer", className: klass, objectId: objectId };
}

function exists( variable )
{
	return ( typeof variable  !== 'undefined' ) && ( variable !== null );
}

