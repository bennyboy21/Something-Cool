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

firebase.database().ref("iFrame_HTML/").on("child_changed", function(snapshot) {
    // alert("movie loaded")
    console.log(snapshot.val())
    document.getElementById("play-It").setAttribute("src", snapshot.val())
    document.getElementById("play-It").style.transition = ".5s"
    document.getElementById("play-It").style.opacity = "1"
})


function seekVideo(seconds) {
    var iframe = document.getElementById('play-It');
    console.log(iframe)
}

function accessIframe() {
    var iframe = document.getElementById('play-It');
    var iframeDocument;

    try {
        // Access the iframe's document
        iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        if (iframeDocument) {
            // Do something with the iframe's document
            console.log(iframeDocument.documentElement.outerHTML); // Logs the entire HTML of the iframe
        } else {
            console.log("Unable to access iframe's document.");
        }
    } catch (e) {
        console.log("Error accessing iframe's document:", e);
    }
}