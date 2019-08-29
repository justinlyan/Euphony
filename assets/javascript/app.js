// Initialize Firebase
var config = {
    apiKey: "AIzaSyDNYs14_CK81WrZUVI_xtcP70DIpGPUk7I",
    authDomain: "mwclass-48b5d.firebaseapp.com",
    databaseURL: "https://mwclass-48b5d.firebaseio.com",
    projectId: "mwclass-48b5d",
    storageBucket: "mwclass-48b5d.appspot.com",
    messagingSenderId: "1000969090197"
};
firebase.initializeApp(config);

var roomID;
var user;
var userIndex;

// Create a variable to reference the database.
var database = firebase.database();

database.ref('rooms').on("child_added", function (snapshot) {
    var sv = snapshot.val();
});



var octave = 4;

var pianoIsOn = false;

var octaveNumbers = ["2", "3", "4", "5"];
var octaveValues = [2, 3, 4, 5]

var keyboard = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s"]
var keyboardHigher = ["d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b"];



function playNote(k) {

    $(".user" + userIndex).css({
        "color":"red"
    })

    for (i = 0; i < keyboard.length; i++) {

        if (k === keyboard[i]) {

            var audioElement = document.createElement("audio");
            audioElement.setAttribute("src", "assets/audio/" + k + octave + ".wav");

            if ($("." + k).hasClass("pushed") === false) {


                audioElement.play();
 

                $("." + k).addClass("pushed");
                console.log("playing");
            }
            let obj = {
                key: k+octave+"",
                user: userIndex
            };
            database.ref('rooms/' + roomID + "/notes").push(obj);



            break;
        };

    }

    for (i = 0; i < keyboardHigher.length; i++) {

        if (k === keyboardHigher[i]) {

            var audioElement = document.createElement("audio");
            audioElement.setAttribute("src", "assets/audio/" + keyboard[i] + (octave + 1) + ".wav");

            if ($("." + k).hasClass("pushed") === false) {


                audioElement.play();
                $("." + k).addClass("pushed");
                console.log("playing");
            }

            break;
        };

    }



};

function stopNote(k) {

    setTimeout(function(){ $(".user" + userIndex).css({"color":"black"}); },100)

    for (i = 0; i < keyboard.length; i++) {

        if (k === keyboard[i]) {

            var audioElement = document.createElement("audio");
            audioElement.setAttribute("src", "assets/audio/" + k + octave + ".wav");

            audioElement.pause();
            $("." + k).removeClass("pushed");
            console.log("paused");
        };

    };

    for (i = 0; i < keyboardHigher.length; i++) {

        if (k === keyboardHigher[i]) {

            var audioElement = document.createElement("audio");
            audioElement.setAttribute("src", "assets/audio/" + keyboard[i] + octave + ".wav");

            audioElement.pause();
            $("." + k).removeClass("pushed");
            console.log("paused");
        };

    };

};


function changeOctave(n) {


    for (i = 0; i < octaveNumbers.length; i++) {

        if (n === octaveNumbers[i]) {

            octave = octaveValues[i];
            console.log(octave);

            for (i = 0; i < octaveNumbers.length; i++) {

                $("." + octaveNumbers[i]).removeClass("pushed");
            }


            $("." + n).addClass("pushed");

        }

    }

};


$(".piano").on("click", ".key", function () {

    if( pianoIsOn === true){
        console.log($(this).text());

        k = $(this).text();
        playNote(k);
        stopNote(k);


    }
})

$(".octave-control").on("click", ".key", function () {

    console.log($(this).text());
    k = $(this).text();
    changeOctave(k);

    if( k === "on"){
        pianoIsOn = true;
        $(".on").addClass("pushed");
        $(".off").removeClass("pushed");
    }else if( k === "off"){
        pianoIsOn = false;
        $(".on").removeClass("pushed");
        $(".off").addClass("pushed");

    }

})



$(document).keydown(function (keypressed) {

    var k = keypressed.key;

    if( pianoIsOn === true){
        playNote(k);

    }

    changeOctave(k);

});

$(document).keyup(function (keypressed) {

    var k = keypressed.key;
    stopNote(k);

});

$(".show_search").on("click", function(event){
    event.preventDefault();

    $(".search_area").empty();

    $(".search_area").html(
        '<form class="form-inline youtube-search">' + 
            '<p class="search-label">Search for tutorials: </p>' +
            '<div class="form-group mx-sm-3 mb-2">' +
                '<label for="inputPassword2" class="sr-only"></label>' +
                '<input class="form-control artist" id="inputPassword2" placeholder="Artist">' +
            '</div>' + 
            '<div class="form-group mx-sm-3 mb-2">' + 
                '<label for="inputPassword2" class="sr-only"></label>' +
                '<input class="form-control songName" id="inputPassword2" placeholder="Track Name">' +
            '</div>' +
            '<a href="#results"><button type="submit" class="btn btn-primary mb-2 search_btn">Search</button></a>' +
        '<form>'
    );

    $(".search_btn").on("click", function(event){
        event.preventDefault();
        
        $(".album_art").empty();
        search();
        
    
    })

});

function search() {
    $("#results").html("");

    var songName = $(".songName").val().trim();
    var artist = $(".artist").val().trim();

    if (songName === "" && artist === "") {
        return;
    }

    var count = 0;

    console.log(artist === "");

    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: "snippet, id",
            q: artist + " " + songName + " piano tutorial",
            type: "video",
            maxResults: 5,
            videoSyndicated: true,
            videoEmbeddable: true,
            key: "AIzaSyDN-PLrk0-E5MqpChSnkZ6x2HebZssXKJg"
        }, function(data){
            console.log(data);

            $.each(data.items, function(i, item){

                var vidInfo = {
                    videoID: item.id.videoId,
                    videoTitle: item.snippet.title,
                    thumb: item.snippet.thumbnails.high.url,
                    description: item.snippet.description
                }
                


                $("#results").append(
                    "<div class='tutorial hello" + count + "' val='" + vidInfo.videoID + "'>" + 
                    "<a href='#video'><img src= " + vidInfo.thumb + " class='image video-click hello" + count + "'></a>" + 
                    "<a href='#video'<p class='title video-click hello" + count + "'>" + vidInfo.videoTitle + "</p></a>" + 
                    "<p class='description'>" + vidInfo.description + "</p></div>"
                );
                $(".hello"+count).data(vidInfo);
                count++;

                $(".video-click").on("click", function(event){
                    console.log($(this).data());
                    var tutVid = $(this).data();
                    $("#video").html("<iframe class='tutorial_video' val='" + tutVid.videoID + "' width='800' height='500' src='https://www.youtube.com/embed/" + tutVid.videoID + "' frameborder = '0' allow='autoplay; encrypted media' allowfullscreen></iframe>");
                    
                })
            });
            
        }
    )

}


function createRoom(database, user) {
    return database.ref('rooms').push({
        users: [user]
    });
}

function joinRoom(database, roomId, username) {
    roomID = roomId;
    database.ref('rooms/' + roomId + '/users').once('value').then((snap) => {
        let users = snap.val();
        if (!users || !users.includes(username)) {
            users.push(username);
            database.ref('rooms/' + roomId + '/users').set(users);
            userIndex = users.length - 1;
        } else {
            userIndex = users.indexOf(username);
        }
        user = username;

        database.ref('rooms/' + roomId + '/users/' + userIndex).onDisconnect().remove();

        $("#roomPanel").addClass("hidden");
        $("#mainPanel").removeClass("hidden");

        pianoIsOn = true;
        $(".on").addClass("pushed");
        $(".off").removeClass("pushed");

        registerOnNoteReceived();
        for (var i = 0; i < users.length; i++) {
            $(".users").append(`<p class="user${i}"">User ${i}</p>`)
        }
    });
}


function registerOnNoteReceived(){
    console.log('once');
    database.ref('rooms/' + roomID + "/notes").limitToLast(1).on('child_added', function(snap) {
        let note = snap.val();
        
        let koct = note.key;


        var audioElement = document.createElement("audio");
        audioElement.setAttribute("src", "assets/audio/" + koct + ".wav");

        audioElement.play();


        console.log("haha" + note);
    });
}

$("#createRoomBtn").on("click", function(event){
    event.preventDefault();
    var name = $("#createNameInput").val();
    createRoom(database, name).then((snap) => {
        let key = snap.key;
        console.log("Your room key is: " + key);
        joinRoom(database, key, name);
        $(".room-key").text("Room Key: " + key);
    });
    $("#exit-room").removeClass("hidden");
});


$("#joinRoomBtn").on("click", function (event) {
    event.preventDefault();
    var name = $("#createNameInput").val();
    var roomId = $("#roomKey").val();
    joinRoom(database, roomId, name);
    $("#exit-room").removeClass("hidden");
});

$("#exit-room").on("click", function() {
    $("#exit-room").addClass("hidden");
})





