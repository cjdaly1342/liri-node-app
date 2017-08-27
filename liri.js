// LIRI
// ==============================================================================
// Step 1 - Load the required Node Modules
// ------------------------------------------------------------------------------
var fs = require('fs'); // require node file system

var request = require('request'); // request makes it possible to make http calls
// ------------------------------------------------------------------------------
var Twitter = require('twitter');

var keys = require('keys.js');

var twitterKeys = keys.twitterKeys;
// ------------------------------------------------------------------------------
// npm install --save node-spotify-api
var spotify = require('node-spotify-api')
// var spotify = new Spotify({
//   id: '<2049101be8f64e5c8c386dd907342f20>',
//   secret: '<a3932fcfc99e4372b92c464ab4d43627>'
// });

// ------------------------------------------------------------------------------
// Step 2 - Read in user input from Command Line
// ------------------------------------------------------------------------------
var nodeArgs = process.argv; // tells node to take in command line arguments

var liriCommand = nodeArgs[2]; // # 2 command line argument

// Account for spaces from the user input
var liriArg = ' ';

for (var i = 5; i < nodeArgs.length; i++) {
	liriArg += nodeArgs[i] + ' ';
}

// -------------------------------------------------------------------------------
// Step 3 - Gather Tweets using the twitter api
// -------------------------------------------------------------------------------
function tweets() {

	// Append Command to log file (log.txt)
	fs.appendFile('./log.txt', 'Command Line: node liri.js myTweets\n\n', function(err) {

		if (err) {
			// Report error if one exists
			console.log("Error!!!");
		}
	}); // End fs.appendFile('./log.txt', 'Command Line: etc', function(err)

	var client = new Twitter(twitterKeys); // initializes twitter client

	// Twitter Parameters uses my user name for my Twitter Account
	var parameters = {screen_name: 'cjdaly134241', count: 20};

	// get the last 20 tweets from Twitter
	client.get('statuses/user_timeline', parameters, function(error, tweets, response) {

		if (error) { // Error statment, logs error if one occurs

			var errorTW = 'Error, cannont retrive Tweets!' + error;

			// appends error to log file (log.txt)
			fs.appendFile('./log.txt', errorTW function(err) {

				if (err) { // again, error statement, if one occurs

					console.log(errorTW); // logs error on command line

				} else {

					// Doing my best to make it look good
					var returnString = '-----------------------------\n' +
									  'User Tweets:\n' +
									  '-----------------------------\n';

					for (var i = 0; i < tweets.length; i++) {

						returnString += 'Created on: ' + tweets[i].created_at + '\n' +
									   'Tweet Body: ' + tweets[i].text + '\n' +
									   '----------------------------------------\n';

					} //End for(var i = 0; i < tweets.length; i++)

					fs.appendFile('./log.txt', 'LIRI Response:\n\n' + returnString + '\n', function(err) {

						if(err) {

							console.log('ERROR!!!');

						} else {

							console.log(returnString);

						}

					}); // End fs.appendFile('./log.txt', 'LIRI Response:\n\n' + returnString + '\n', function(err) {

				} // End else

			}); //End fs.appendFile('./log.txt', error function(err))
			return;

		} // End if(error)
	}); // End client.get()
} // End function tweets()

// ----------------------------------------------------------------------------------
// Step 4 - SPOTIFY!!! retireve song information from Spotify
// ----------------------------------------------------------------------------------
function spotify(song) {

	fs.appendFile('./log.txt', 'Command Line: node liri.js spotify-this-song ' + song

		+ '\n', function(err) {

			if(err) {

				console.log('ERROR!!!')

			} // End if(err)

		}); // End fs.appendFile('./log.txt', etc function(err))

	var search;

	if(song === ' ') {

		search = 'He Is Ghost';

	} else {

		search = song;

	} // End else

	spotify.search({type: 'track', query: search}, function(error, data) {

		if(error) {

			var errorSP = 'ERROR Retrieving Spotify Song!' + error;

			fs.appendFile('./log.txt', errorSP, function(err) {

				if(err) {

					console.log(errorSP);

				} // End if(err)

			}) // End fs.appendFile('./log.txt', errorSP, function(err) 

			return;

		} // End if(error) 

		else {

			var songInfo = data.tracks.items[0];

			if(!songInfo) {

				var errorSP2 = 'ERROR! No song info found, please try again'

				fs.appendFile('./log.txt', errorSP2, function(err) {

					console.log(errorSP2);

				}); // End fs.appendFile('./log.txt', errorSP2, function(err)
				return;

			} // End if(!songInfo)
			else {

				var returnString = '------------------------------------\n' +
									'Song Information:\n' +
									'------------------------------------\n' +
									'Song Title: ' + songInfo.name + '\n' +
									'Artist: ' + songInfo.artist[0].name + '\n' +
									'Album: ' + songInfo.album.name + '\n' +
									'Preview Here: ' + songInfo.preview_url + '\n';

				fs.appendFile('./log.txt', 'LIRI Response:\n' + returnString + '\n', function(err) {

					if(err) {
						console.log('ERROR!!!');

					} else {
						console.log(returnString;
					} // End if else statement
				}); // End fs.appendFile(log.txt, LIRI, function(err))
			} // End else
		} // End else
	}); // End spotify.search({type: 'track', query: search}, function(error, data)
} // End function spotify(song)

// --------------------------------------------------------------------------------------
// Step 5 - OMDB Movie Info
// --------------------------------------------------------------------------------------
function OMDBInfo(movie) {

	fs.appendFile('./log.txt', 'Command Line: node liri.js movie-this' + movie + '\n', function(err) {

		if(err) {

			console.log('ERROR!!!');
		} // End if(err)
	}); // fs.appendFile('./log.txt', ' ', function(err))
	var search;

	if(movie === ' ') {

		search = 'Alien Covenant';

	} else {

		search = movie;
	} // End if else

	search = search.split(' ').join('+');

	var OMDBInfo = 'http://www.omdbapi.com/?t=' + search + '&plot=full&tomatoes=true';

	request(OMDBInfo, function(error, response, body) {

		if(error || (response.statusCode !== 200)) {

			var errorOMDB1 = 'ERROR Retrieving OMDB Movie Info' + error;

			fs.appendFile('./log.txt', errorOMDB1, function(err) {

				if(err) {
					console.log(errorOMDB1);
				} // End if(err)
			}); // End fs.appendFile('./log.txt', errorOMDB, function(err))

			return; 
		} else {

			var data = JSON.parse(body);

			if(!data.Title && !data.Released && !data.imdbRating) {

				var errorOMDB2 = 'ERROR, No Movie Info, Please Try Again';

				fs.appendFile('./log.txt', errorOMDB2, function(err) {

					if(err) {
						console.log(errorOMDB2);
					} // End if(err)
				}); // End if(!data.Title && !data.Released && !!data.imdbRating)
				return;

			} else {

				var returnString = '---------------------------------\n' +
								 'Movie Information:\n' +
								 '---------------------------------\n' +
								 'Movie Title: ' + data.Title + '\n' +
								 'Year Released: ' + data.Released + '\n' +
								 'IMDB Rating: ' + data.imdbRating + '\n' +
								 'Rotten Tomatoes Ratings: ' + data.tomatoRating + '\n' +
								 'Country Produced: ' + data.Country + '\n' +
								 'Language: ' + data.Language + '\n' +
								 'Plot: ' + data.Plot + '\n' +
								 'Actors: ' + data.Actors + '\n';

				fs.appendFile('./log.txt', 'LIRI Response: \n' + returnString + '\n' function(err) {

					if (err) {
						console.log('ERROR!!!');

					} else {
						console.log(returnString);
					} // End if else statement
				}); // End fs.appendFile
				} // End else var returnString
		} // End else var data
	}); // End request(OMDBInfo)
}  // End function OMDBInfo

// ---------------------------------------------------------------------------------------
// Step 6 - Read In File containing command function
// ---------------------------------------------------------------------------------------
function readFile() {

	fs.appendFile('./log.txt', 'Command Line: node liri.js do-what-it-says\n', function(err) {

		if(err) {
			console.log('ERROR!!!');
		} // End if(err)
	}); // End fs.appendFile(function(err))

	fs.readFile('./random.txt', 'utf8', function(error, data) {

		if(error) {
			console.log('ERROR Reading text file random.txt' + error);
			return;

		} else {
			var cmdLine = data.split(',');

			var Command = cmdLine[0].trim();

			var Parameters = cmdLine[1].trim();

			switch(Command) {
				case 'my-tweets':
					tweets();
					break;

				case 'spotify-this-song':
					spotifySong(parameters);
					break;

				case 'movie-this':
					OMDBInfo(parameters);
					break;
			} // End switch case
		} // End if else statement
	}); // End fs.readFile(function(error, data))
} // End function readFile()

// ----------------------------------------------------------------------------------------
// Step 7 - Determine which LIRI command is requested by the user
// ----------------------------------------------------------------------------------------
if (liriCommand === 'my-tweets') {
	tweets();

} else if (liriCommand === 'spotify-this-song') {
	spotifySong(nodeArgs);

} else if (liriCommand === 'movie-this') {
	OMDBInfo(nodeArgs);

} else if (liriCommand === 'do-what-it-says') {
	readFile();

} else {
	fs.appendFile('./log.txt', 'Command Line: ' + nodeArgs + '\n', function(err) {
		if (err) {
			console.log('ERROR!!!');
		} // End if (err)

		returnString = 'my-tweets\n' + 'spotify-this-song\n' + 'movie-this\n';

		fs.appendFile('./log.txt', 'LIRI Response:\n' + returnString + '\n', function(err) {
			if (err) {
				console.log('ERROR!!!');

			} else {
				console.log(returnString);

			} // End if else statment
		}); // End fs.appendFile(function(err))
	}); // End fs.appendFile(function(err))
} // End else statment