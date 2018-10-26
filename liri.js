require('dotenv').config();

var keys = require("./keys.js")
var request = require("request");
var fs = require("fs");
var moment = require("moment");
var Spotify = require('node-spotify-api');

var userCommand = process.argv[2];
var artistName = '';
var queryTerm = '';
var movieTitle = '';

//------------FUNCTIONS------------//

function concertQueue(artistName) {
    
    request("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp", function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var concertInfo = JSON.parse(body)
            for (i = 0; i < concertInfo.length; i++) {
                var thisConcert = concertInfo[i];
                var venue = thisConcert.venue.name;
                var location = (thisConcert.venue.city) + " " + (thisConcert.venue.region);
                var date = moment(thisConcert.datetime, "YYYY-MM-DD").format("MM/DD/YYYY");
                
                console.log("-------------------------")
                console.log("VENUE: " + venue);
                console.log("LOCATION: " + location);
                console.log("DATE: " + date);
                console.log("-------------------------")
            }
        }
    })
}

function spotifyQueue(queryTerm) {
    
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("-------------------------")
        console.log("ARTIST(S): " + JSON.parse(body).artists);
        console.log("SONG TITLE: " + JSON.parse(body).name);
        console.log("SONG PREVIEW: " + JSON.parse(body).preview_url);
        console.log("ALBUM: " + JSON.parse(body).album);
        console.log("-------------------------")
    });
}

function movieQueue(movieTitle) {

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
}

//------------CALLS A SPECIFIC FUNCTION BASED ON USER INPUT------------//

if (userCommand === "concert-this") {
    for (i = 3; i < (process.argv.length - 1); i++) {
        artistName = process.argv[i] + "+"
    }
    var lastWord = process.argv.length - 1;
    artistName += process.argv[lastWord];

    concertQueue(artistName);
}
else if (userCommand === "spotify-this-song") {
    if (process.argv.length < 4) {
        queryTerm = 'The Sign';
    }
    else {
        queryTerm = process.argv[3];
    };

    spotifyQueue(queryTerm);
}
else if (userCommand === "movie-this") {
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
    movieQueue(movieTitle);
}
else if (userCommand === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        var commandArr = data.split(",");
        var userInput = commandArr[1].split('"').join('');

        if (commandArr[0] === "concert-this") {
            var concertPull = userInput.split(' ').join("+");
            concertQueue(concertPull);
        }
        else if (commandArr[0] === "spotify-this-song") {
            spotifyQueue(commandArr[1]);
        }
        else if (commandArr[0] === "movie-this") {
            var moviePull = userInput.split(" ").join("+");
            movieQueue(moviePull);
        }
    });
}