//================== End Points =====================

//================== Register User ===================
Parse.Cloud.define("register", function(request, response) {
  
  Parse.Cloud.useMasterKey();
  
  var user = new Parse.User();

  user.set( "username", request.params.username ) ;
  user.set( "password", request.params.password );
  user.set( "email", request.params.email );
  user.set( "ngo", request.params.ngo );

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


//================== End Points =====================
