//================== Create NGO ===================
Parse.Cloud.define("create_ngo", function(request, response) {

  var ngo = new Parse.NgoDetails();

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