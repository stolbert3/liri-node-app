require('dotenv').config();

var keys = require("./keys.js")
var request = require("request");
var fs = require("fs");
var Spotify = require('node-spotify-api');

var userCommand = process.argv[2];

if (userCommand === "concert-this") {
    //https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp
    //name of the venue
    //venue location
    //date of the event (use moment to format as mm/dd/yyyy)
}
else if (userCommand === "spotify-this-song") {
    //return artist(s), song's name, preview link of the song from spotify, album that the song is from
    //if no song is provided, program will default to "The Sign" by Ace of Base
    //utilize node spotify api
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data); 
    });
}
else if (userCommand === "movie-this") {
    var movieTitle = '';
    if (process.argv.length < 4) {
        movieTitle = "mr+nobody";
    }
    else {
        for (i = 3; i < (process.argv.length - 1); i++) {
            movieTitle = process.argv[i] + "+"
        }
        var lastWord = process.argv.length - 1;
        movieTitle += process.argv[lastWord];
    }

    request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log("-------------------------")
            console.log("TITLE: " + JSON.parse(body).Title);
            console.log("YEAR RELEASED: " + JSON.parse(body).Year);
            console.log("IMDB RATING: " + JSON.parse(body).imdbRating);
            console.log("ROTTEN TOMATOES RATING: " + JSON.parse(body).Ratings[1].Value);
            console.log("PRODUCED IN: " + JSON.parse(body).Country);
            console.log("LANGUAGE: " + JSON.parse(body).Language);
            console.log("PLOT: " + JSON.parse(body).Plot);
            console.log("ACTORS: " + JSON.parse(body).Actors);
            console.log("-------------------------")
        }
    
    });
      
    //search omdb (key = trilogy)
    //title of the movie
    //year the movie came out
    //imdb rating
    //rotten tomatoes rating
    //country where the movie was produced
    //language of the movie
    //plot of the movie
    //actors in the movie
    //no movie entered = output data for "Mr. Nobody"
}
else if (userCommand === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        console.log(data);
      });
    //using the fs node package, liri will take the text inside of random.txt and use it to call commands
}