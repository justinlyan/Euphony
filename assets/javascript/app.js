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
        '<form class="form-inline">' + 
            '<div class="form-group mb-2">' +
                '<label for="staticEmail2" class="sr-only">Email</label>' +
                '<input type="text" readonly class="form-control-plaintext" id="staticEmail2" value="Search for tutorials: ">' +
            '</div>' + 
            '<div class="form-group mx-sm-3 mb-2">' +
                '<label for="inputPassword2" class="sr-only"></label>' +
                '<input class="form-control artist" id="inputPassword2" placeholder="Artist">' +
            '</div>' + 
            '<div class="form-group mx-sm-3 mb-2">' + 
                '<label for="inputPassword2" class="sr-only"></label>' +
                '<input class="form-control songName" id="inputPassword2" placeholder="Track Name">' +
            '</div>' +
            '<button type="submit" class="btn btn-primary mb-2 search_btn">Search</button>' +
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
            key: "AIzaSyCDHzzlaYYZ23WOUIkyFB4qVqcgoXu7T1s"
        }, function(data){
            console.log(data);

            $.each(data.items, function(i, item){

                var vidInfo = {
                    videoID: item.id.videoId,
                    videoTitle: item.snippet.title,
                    thumb: item.snippet.thumbnails.high.url,
                    description: item.snippet.description
                }
                
                $("#results").append("<div class='tutorial hello" + count + "' val='" + vidInfo.videoID + "'><img src= " + vidInfo.thumb + " class='image'><p class='title'>" + vidInfo.videoTitle + "</p><p class='description'>" + vidInfo.description + "</p></div>");
                $(".hello"+count).data(vidInfo);
                count++;

                $(".tutorial").on("click", function(event){
                    console.log($(this).data());
                    var tutVid = $(this).data();
                    $(".video").html("<iframe class='tutorial_video' val='" + tutVid.videoID + "' width='800' height='500' src='https://www.youtube.com/embed/" + tutVid.videoID + "' frameborder = '0' allow='autoplay; encrypted media' allowfullscreen></iframe>");
                    
                })
            });
            
        }
    )

    $.ajax({
        type: "GET",
        data: {
            apikey:"dc323e0e3f23c8b4bab30839be7c790f",
            q_track: songName,
            q_artist: artist,
            f_has_lyrics: 1,
            format:"jsonp",
            callback:"jsonp_callback"
        },
        url: "http://api.musixmatch.com/ws/1.1/track.search",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        contentType: 'application/json',
        success: function(data) {
            var track = data.message.body.track_list[0].track;
            console.log(track);
            $(".album_art").html(
                '<div class="card" style="width: 18rem;">' +
                    '<div class="card-body">' +
                        '<h5 class="card-title">Artist: ' + track.artist_name + '</h5>' +
                        '<h6 class="card-subtitle mb-2 text-muted">Track: ' + track.track_name + '</h6>' +
                        "<p class='card-text album_name'>Album: " + track.album_name + "</p>" +
                        '<a href="' + track.track_share_url + '" target="_blank"><button class="btn btn-primary mb-2 search_btn">Lyrics</button></a>' +
                    '</div>' +
                '</div>'
                // "<div class='song_info'>" + 
                //     "<div class='artist_name'>" + track.artist_name + "</div>" + 
                //     "<div class='album_name'>" + track.album_name + "</div>" +
                //     '<a href="' + track.track_share_url + '" target="_blank"><button class="btn btn-primary mb-2 search_btn">Lyrics</button></a>' + 
                // "</div>"
            );
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $(".album_art").empty();
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }    
      });

      

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
    });
});


$("#joinRoomBtn").on("click", function (event) {
    event.preventDefault();
    var name = $("#createNameInput").val();
    var roomId = $("#roomKey").val();
    joinRoom(database, roomId, name);
});

// $.get(
//     "http://api.musixmatch.com/ws/1.1/track.search?apikey=dc323e0e3f23c8b4bab30839be7c790f", {
//         q_track: "Let her go",
//         q_artist: "passenger"
//     }, function(data){
//         console.log(data);
//     }
// );

// $.ajax({
//     type: "GET",
//     data: {
//         apikey:"dc323e0e3f23c8b4bab30839be7c790f",
//         q_track:"let her go",
//         q_artist:"passenger",
//         f_has_lyrics: 1,
//         format:"jsonp",
//         callback:"jsonp_callback"
//     },
//     url: "http://api.musixmatch.com/ws/1.1/track.search",
//     dataType: "jsonp",
//     jsonpCallback: 'jsonp_callback',
//     contentType: 'application/json',
//     success: function(data) {
//         console.log(data); 
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//         console.log(jqXHR);
//         console.log(textStatus);
//         console.log(errorThrown);
//     }    
//   });




