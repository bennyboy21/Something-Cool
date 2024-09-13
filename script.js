const firebaseConfig = {
    apiKey: "AIzaSyCQD712D3aH1Ku6yMdpJ8rdIZpI5YkF4g8",
    authDomain: "mapbox-8554a.firebaseapp.com",
    databaseURL: "https://mapbox-8554a-default-rtdb.firebaseio.com",
    projectId: "mapbox-8554a",
    storageBucket: "mapbox-8554a.appspot.com",
    messagingSenderId: "1006740104953",
    appId: "1:1006740104953:web:695a8148416f6f3b3a2428",
    measurementId: "G-DTCXQE2S90"
};

firebase.initializeApp(firebaseConfig);

function countOccurrences(string, substring) {
    // Initialize a counter
    let count = 0;
    let position = 0;

    // Loop through the string and search for the substring
    while ((position = string.indexOf(substring, position)) !== -1) {
        // Increment the counter
        count++;
        // Move the position forward to continue searching
        position += substring.length;
    }

    return count;
}

function searchMovie(event) {
    event.preventDefault();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    document.getElementById("all-Movies-Container").innerHTML = ""

    search = document.getElementById("search-Box").value
    
    movieData = []
    movieTitles = []
    movieLinks = []
    movieBadPosters = []
    ran = false

    firebase.database().ref("current_Search").set({
        "search":search
    });
}

firebase.database().ref("current_Search").once("value", function(snapshot) {
    // if()
})

firebase.database().ref("search_Movie_Data/").on("child_added", function(snapshot) {
    var current_Search = ""
    firebase.database().ref("current_Search").once("value", function(snapshot) {
        // alert(snapshot.val().search)
        current_Search = snapshot.val().search
    })
    console.log(snapshot.val().poster_IMG_Link)
    movieData.push([snapshot.val().movie_Link, snapshot.val().movie_Name])
    movieTitles.push(snapshot.val().movie_Name)
    movieLinks.push(snapshot.val().movie_Link)
    movieBadPosters.push(snapshot.val().poster_IMG_Link)

    // addMovie(snapshot.val().movie_Link, snapshot.val().poster_IMG_Link, snapshot.val().movie_Name, "1h 2m")

    setTimeout(function() {
        num = countOccurrences(document.getElementById("all-Movies-Container").innerHTML, "movie-Container")
        if(num < 4 && num != 0) {
            for(var i=0;i<(4-num);i++) {
                addBlank()
            }
        }

        if(!ran) {
            /*
            */
            getMoviesData(movieTitles).then(moviesData => {
                for(var i=0;i<moviesData.length;i++) {
                    if(moviesData[i].data != "Not found") {
                        console.log(moviesData[i].data);
                        var posterIMG = moviesData[i].data.Poster
                        var movieRating = moviesData[i].data.Rated
                        var movieTitle = moviesData[i].data.Title
                        var releaseYear = moviesData[i].data.Year
                        var moviePlot = moviesData[i].data.Plot
                        var movieLink = movieLinks[i]
                        var movieDuration = formatRuntime(moviesData[i].data.Runtime)
                        var actors = moviesData[i].data.Actors
                        addMovie(posterIMG, movieRating, movieTitle, releaseYear, moviePlot, movieLink, movieDuration, actors)
                    } else {
                        console.log(movieLinks[i]);
                        var posterIMG = movieBadPosters[i]
                        var movieRating = "Unknown Rating"
                        var movieTitle = movieTitles[i]
                        var releaseYear = "-"
                        var moviePlot = "Couldn't Get Plot"
                        var movieLink = movieLinks[i]
                        var movieDuration = "-"
                        var actors = "Can't Get Actors"
                        addMovie(posterIMG, movieRating, movieTitle, releaseYear, moviePlot, movieLink, movieDuration, actors)
                    }
                }

            });
            addVariableToURL("q", current_Search)
            document.getElementById("search-Box").value = current_Search
            ran = true
        }
    }, 2500)
})

function addVariableToURL(variableName, variableValue) {
    // Get the current URL
    let currentURL = new URL(window.location.href);

    // Add or update the query parameter
    currentURL.searchParams.set(variableName, variableValue);

    // Update the URL without reloading the page
    window.history.pushState({}, '', currentURL);
}

async function getMoviesData(titles) {
    const apiKey = 'ed83e91'; // Replace with your OMDB API key
    const results = [];

    for (let title of titles) {
        const url = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True") {
                results.push({ title: title, data: data });
            } else {
                results.push({ title: title, data: 'Not found' });
            }
        } catch (error) {
            console.error(`Error fetching movie data for ${title}:`, error);
            results.push({ title: title, data: 'Error' });
        }
    }

    return results;
}

function formatRuntime(runtime) {
    // Extract the number of minutes from the runtime string
    const minutes = parseInt(runtime, 10);

    // Check if the runtime is valid
    if (isNaN(minutes)) {
        return null;
    }

    // Calculate hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // Format the output
    if (hours > 0) {
        return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + 'm' : ''}`.trim();
    } else {
        return `${remainingMinutes}m`;
    }
}

function parseNames(namesString) {
    return namesString.split(',').map(name => name.trim());
}

function getActorsHTML(list) {
    arrayOfNames = parseNames(list)
    var html = ""

    for(var i=0;i<arrayOfNames.length;i++) {
        html += '<div class="actor-Name">' + arrayOfNames[i] + '</div>'
    }
    
    return html
}

function addMovie(posterIMG, movieRating, movieTitle, releaseYear, moviePlot, movieLink, movieDuration, actors) {
    var actorsHTML = getActorsHTML(actors)
    var html = '<div class="movie-Container"><div class="poster-Container" onclick="watchMovie(`' + movieLink + '`)"><img class="poster-Img" src="' + posterIMG + '"></div><div class="info-Container"><div class="movie-Name">' + movieTitle + '</div><div class="movie-Rating-Movie-Actors"><div class="movie-Rating">' + movieRating + '</div><div class="movie-Actors"><div class="movie-Actors-Container">' + actorsHTML + '</div><div class="right-Side-Overflow"></div></div></div><div class="movie-Plot">' + moviePlot + '</div><div class="relased-In-Length"><div class="relased-In">' + releaseYear + '</div><div class="seperator">•</div><div class="movie-Duration">' + movieDuration + '</div></div><button class="watch-Now" onclick="watchMovie(`' + movieLink + '`)">Watch Now</button></div></div>'

    document.getElementById("all-Movies-Container").innerHTML += html
}

function addBlank() {
    var html = '<div class="movie-Container fake" style="cursor:default;"><div class="circle-One"></div><div class="poster-Container"></div>'
    document.getElementById("all-Movies-Container").innerHTML += html
}

function watchMovie(movieURL) {
    console.log(movieURL)
    firebase.database().ref("link_For_Movie").set({
        "link":movieURL
    })

    

    firebase.database().ref("data_For_Current_Movie").set({
        "link":movieURL
    })

    // moviesData

    setTimeout(function() {
        window.location = "/movie/"
    }, 1000)
}


var movieData = []
var movieTitles = []
var movieLinks = []
var movieBadPosters = []
var ran = false