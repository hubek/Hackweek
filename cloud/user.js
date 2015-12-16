//================== Register User ===================
Parse.Cloud.define("register", function(request, response) {
  
  Parse.Cloud.useMasterKey();
  
  var user = new Parse.User();

  user.set( "username", request.params.username ) ;
  user.set( "password", request.params.password );
  user.set( "email", request.params.email );
  
  if( request.params.ngo )
  {
    user.set( "ngo", pointerTo( request.params.ngo, "NgoDetails" ) );
  }
  

  user.signUp(null, {
    
    success: function(user) {

      var query = new Parse.Query( Parse.Role ); 
      query.equalTo( "name", request.params.role ); 

      query.find({ 

         success: function( roles ) {

          roles[0].getUsers().add( user );
          roles[0].save();
          
          response.success( user );
         },

        error: function( error ){

          response.error( error );

        }
      });
    },

    error: function(user, error) {

      response.error( error );
      
    }
  });

});
//================== Register User ===================


//================== Login User ===================
Parse.Cloud.define("login", function(request, response) {
  
  Parse.Cloud.useMasterKey();

  if ( Parse.User.current() ) {

    Parse.User.logOut();

  } 

  Parse.User.logIn( request.params.username, request.params.password, {
    
    success: function(user) {

      response.success( user );

    },

    error: function(user, error) {

      response.error( error );
      
    }
  });

});
//================== Login User ===================

//================== Logout User ===================
Parse.Cloud.define("logout", function(request, response) {
  
  Parse.Cloud.useMasterKey();

  Parse.User.logOut();

  response.success( "logged out !" );

});
//================== Logout User ===================

function pointerTo( objectId, klass ) {
    return { __type: "Pointer", className: klass, objectId: objectId };
}
