//============= Create Pointer Object ==============
function pointerTo( objectId, klass ) 
{
    return { __type: "Pointer", className: klass, objectId: objectId };
}
//============= Create Pointer Object ==============

//============= Get GeoPoint From Address ==============
function getGeoPoint( address )
{
	console.error( "Hiiii" );
	console.error( address );
	Parse.Cloud.httpRequest({

			method: "POST",
			url: 'https://maps.googleapis.com/maps/api/geocode/json',

			params: {
				address : address,
				key: "AIzaSyADYKV1S-640B-KTxkkD-HXb8slGMCvb2I"
			}
		}).then(
			  function( googleResponse ) 
			  {

				var data = googleResponse.data;
				console.error( "Working !!" );

				if( data.status == "OK")
				{
					var langLat = data.results[0].geometry.location;
					var point = new Parse.GeoPoint( { latitude: langLat.lat, longitude: langLat.lng } );
					return point;
				}
				return 
			 },
			 function( error )
			 {
			 	return error;
			 }
			);
}
//============= Get GeoPoint From Address ==============

