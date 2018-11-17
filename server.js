var http = require('http');
var express = require('express');
var app     = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var rp = require('request-promise');




var lat;
var lon;
var pollutionKey = "dec24c80c40a497bae6c99ee810522cb";
/*function getOptions(l1, l2) {
	console.log('https://api.breezometer.com/baqi/?lat=' + l1 + '&lon=' + l2 + '&key=' + pollutionKey);
	return {
		//'https://api.breezometer.com/baqi/?lat=' + lat + '&lon=' + lon + '&key=' + pollutionKey,
		//'https://api.breezometer.com/baqi/?lat=40.7324296&lon=-73.9977264&key=' + pollutionKey,
		url: 'https://api.breezometer.com/baqi/?lat=' + l1 + '&lon=' + l2 + '&key=' + pollutionKey,
		headers: {
			'User-Agent': 'Request-Promise'
		},
		json: true // Automatically parses the JSON string in the response
	};
}*/

var options1 = {
    url: '	http://flutrack.org/results.json',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};




var geocodingKey = "AIzaSyBsPU2eyFc2O1gfHY7CpNXM-b9Dwb-lfyg"
var locations;
//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=

function getOptions1(locations)
{
	return {
		//'https://maps.googleapis.com/maps/api/geocode/json?address=4842+Tarrington+Drive,+Hoffman+Estates,+IL&key=' + geocodingKey,
		//'https://maps.googleapis.com/maps/api/geocode/json?address=' + locations + '&key=' + geocodingKey,
		url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + locations + '&key=' + geocodingKey,
		headers: {
			'User-Agent': 'Request-Promise'
		},
		json: true // Automatically parses the JSON string in the response
	};
}






io.on('connection', function (socket) {
//NFJWJS522SMB1UTT
//https://www.alphavantage.co/
   /* socket.on("start program", function(){
       getStockData()
    });*/
	socket.on("location", function(input) {
		locations = input;
		console.log(input);
		getStockData()
	});
    socket.on("coordinates", function(lad) {
		lat = lad;
		console.log(lat + "HEY");
	});
	socket.on("coordinates1", function(lod) {
		lon = lod;
		console.log(lon + "HEY");
	});
	
    function getStockData() {
        rp(getOptions1(locations))
            .then(function (data) {
                console.log(data)
				lon = data.results[0].geometry.location.lng
				lat = data.results[0].geometry.location.lat
				console.log(lat);
				console.log(lon);
                socket.emit("latitude", lat)
                socket.emit("longitude", lon)
				
				rp(getOptions(lat, lon)).then(function (data) {
					data = data.breezometer_aqi
					console.log(data)
					
					socket.emit("pollution", data)
				})
				.catch(function (err) {
					console.log("error" + err)
				});
            })
            .catch(function (err) {
                // API call failed...
				console.log("error");
            });
			
		rp(options1)
            .then(function (data) {
                console.log(data)
				var rawsData = data;
				var latitudeArray = []
				var longitudeArray = []
				/*for(var i=0;i<= rawsData.length; i++)
				{
					latitudeArray[i] = rawsData[i].latitude
					longitudeArray[i] = rawsData[i].longitude	
				}
				console.log(latitudeArray)
				console.log(longitudeArray)
                socket.emit("FluLADLON", latitudeArray, longitudeArray)*/
				socket.emit("FluLADLON", data)
            })
            .catch(function (err) {
                console.log("YOU DUMBASS " + err)
            });
    }
});




/*var options2 = {
    url: '	http://flutrack.org/results.json,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};*/


app.use(express.static(__dirname + '/public'));

server.listen(process.env.PORT || 3000, function () {
  console.log('Server listening at port %d 3000');
});