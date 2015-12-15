//================== Register User ===================
Parse.Cloud.define("register", function(request, response) {
  
  Parse.Cloud.useMasterKey();
  
  var user = new Parse.User();

  user.set( "username", request.param( 'userName' ) ) ;
  user.set( "password", request.param( 'password' ) );
  user.set( "email", request.param( 'email' ) );
  user.set( "ngo", request.param( 'ngo' ) );

  user.signUp(null, {
    
    success: function(user) {
      response.success( user );
    },

    error: function(user, error) {
      response.error( "Can't Register" );
    }
  });

});
//================== Register User ===================
