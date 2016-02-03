$(document).ready(function(){




	function construireUrlMeteo(coords){

		var service = 'https://api.forecast.io/forecast';
		var cle = '15bc998c8e0640675e51c488fd4e71a6';
		var geoloc = coords.latitude + ',' + coords.longitude;
		var url = service + '/' + cle + '/' + geoloc;

		return url;

		// du code qui produit
		// https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
	}

	function construireUrlRevGeoCoder(coords) {
		var service = 'http://nominatim.openstreetmap.org/reverse';
		var format = '?format=json';
		var geoloc = '&lat=' + coords.latitude + '&lon=' + coords.longitude;
		var details = '&zoom=18&addressdetails=1';

		var url = service + format + geoloc + details;

		return url;
	}

	function reverseGeocoding( coords ){
		var urlServiceRevcoding = construireUrlRevGeoCoder( coords );

		$.ajax({
			url: urlServiceRevcoding,
			type: 'GET',
			dataType: 'json',
		})
		.done(function( donneesRevGeocoding ) {
			console.log("success");
			console.log (donneesRevGeocoding);


			var adresse = donneesRevGeocoding.display_name ;
			$('#adresseId').html( adresse );
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
		
	}




	// 1. géolocaliser

	if (Modernizr.geolocation) {
		var icons = {

			'clear-day': 'B',
			'clear-night': 'C',
			'rain': 'R',
			'snow': 'G',
			'sleet': 'X',
			'wind': 'S',
			'fog': 'M',
			'cloudy': 'Y',
			'partly-cloudy-day': 'H',
			'partly-cloudy-night': 'I'
		}



		navigator.geolocation.getCurrentPosition(
			function(position){
				var coords = position.coords;

				console.log('Votre position actuelle est:');
				console.log('Latitude: ' + coords.latitude);
				console.log('Longitude:' + coords.longitude);

				var urlServiceMeteo = construireUrlMeteo(coords);

				$.ajax({
					url:urlServiceMeteo,
					type: 'GET',
					dataType: 'jsonp',
					data: {units: 'si'},
				})
				.done(function( donneesMeteoForecast ){

					console.log( donneesMeteoForecast );
					console.log( donneesMeteoForecast.currently.temperature );
					console.log( donneesMeteoForecast.daily.summary );

					var temperature = donneesMeteoForecast.currently.temperature + '&deg;C';

					$('#temperatureId').html( temperature );

					var iconMeteo = icons[donneesMeteoForecast.currently.icon];
					$('#temperatureId').attr( 'data-icon' , iconMeteo );

					var summary = donneesMeteoForecast.daily.summary;
					$('#summaryId').html( summary );


					console.log( iconMeteo);
					console.log( summary );

					reverseGeocoding( coords );

				})
				.fail(function(){
					console.log("Fail");
				})
				.always(function(){
					console.log("Complete");
				});		
			}
		);
	}
	else {
		console.log('erreur : pas de géolocalisation');
	}

});
