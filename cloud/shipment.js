//================== Create or update Shipment ===================
Parse.Cloud.define("update_shipment", function( request, response ) {
	
	var query = new Parse.Query("Shipment");

	query.get( request.params.id ).then(
		
		function( shipment )
		{
			return shipment;
		},

		function( error )
		{	
			return Parse.Promise.as( new Parse.Object( "Shipment" ) );
		}).then(

		function( shipment )
		{
			//========= Build stock
			shipment.set( "stock", pointerTo( request.params.stock, "Stock" ) );
			shipment.set( "from",  request.params.from );
			shipment.set( "amount", request.params.amount );
			

			shipment.save( null ).then(
				function( shipment ){
					response.success( shipment );
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
//================== Create or update Shipment ===================

//================== List All Shipments By Stock ===================

Parse.Cloud.define("list_shipments", function( request, response ) {
	
	var query = new Parse.Query("Shipment");

	if( request.params.stock )
	{
		query.equalTo( "stock", pointerTo( request.params.stock, "Stock" ) );
	}

	query.include("stock");
	
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

//================== List All Shipments By Stock ===================

function pointerTo( objectId, klass ) {
    return { __type: "Pointer", className: klass, objectId: objectId };
}

