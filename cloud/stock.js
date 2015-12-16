//================== Create or update Stock ===================
Parse.Cloud.define("update_stock", function( request, response ) {
	
	var query = new Parse.Query("Stock");

	query.get( request.params.id ).then(
		function( stock )
		{
			return stock;
		},

		function( error )
		{	
			return Parse.Promise.as( new Parse.Object( "Stock" ) );
		}).then(

		function( stock )
		{
			//========= Build stock
			stock.set( "category", pointerTo( request.params.category, "Category" ) );
			stock.set( "gender", pointerTo( request.params.gender, "Gender" ) );
			stock.set( "ngo", pointerTo( request.params.ngo, "NgoDetails" ) );
			stock.set( "size", pointerTo( request.params.size, "Size" ) );
			stock.set( "current", request.params.current );
			stock.set( "requested", request.params.requested );

			stock.save( null ).then(
				function( stock ){
					response.success( stock );
				},

				function( error ){
					response.error( error );
				});
		},

		function(error)
		{
			response.error( error );
		});
});
//================== Create or update Stock ===================

//================== List All Socks By NGO ===================

Parse.Cloud.define("list_stocks", function( request, response ) {
	
	var query = new Parse.Query("Stock");

	if( request.params.ngo )
	{
		query.equalTo( "ngo", pointerTo( request.params.ngo, "NgoDetails" ) );
	}

	query.include("category");
	query.include("gender");
	query.include("ngo");
	query.include("size");
	
	query.find({
		success: function( result )
		{
			response.success( result );
		},
		error: function( error )
		{
			response.error( error );
		}

	});
});

//================== List All Socks By NGO ===================

//================== Get Stock by Uniq values ===================

Parse.Cloud.define("get_stock", function( request, response ) {
	
	var query = new Parse.Query("Stock");

	query.equalTo( "category", pointerTo( request.params.category, "Category" ) );
	query.equalTo( "gender", pointerTo( request.params.gender, "Gender" ) );
	query.equalTo( "ngo", pointerTo( request.params.ngo, "NgoDetails" ) );
	query.equalTo( "size", pointerTo( request.params.size, "Size" ) );

	query.include("category");
	query.include("gender");
	query.include("ngo");
	query.include("size");
		
	query.find({
		success: function( stock )
		{
			response.success( stock );
		},
		error: function( error )
		{
			response.error( error );
		}

	});
});

//================== Get Stock by Uniq values ===================

//================== Update Amount ( requested, current ) ===================

Parse.Cloud.define("update_amount", function( request, response ) {

	var query = new Parse.Query("Stock");
	
	query.get( request.params.id ).then(
		function( stock )
		{
			return stock;
		},

		function( error )
		{	
			response.error( error );
		}).then(

		function( stock )
		{
			var columnType = request.params.type;

			var amount = stock.get( columnType );

			amount = amount + request.params.amount;

			if( amount < 0  ){
				amount = 0;
			}

			stock.set( columnType, amount );

			stock.save( null ).then(
				function( stock ){
					response.success( stock );
				},

				function( error ){
					response.error( error );
				});
		});
});

//================== Update Amount ( requested, current ) ===================

function pointerTo( objectId, klass ) {
    return { __type: "Pointer", className: klass, objectId: objectId };
}

