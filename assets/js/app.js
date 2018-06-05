//Initialize firebase
var config = {
    apiKey: "AIzaSyAAOg_qtx5SbEc8ROO5fcexJyihoJ_3unc",
    authDomain: "week7homework-8c937.firebaseapp.com",
    databaseURL: "https://week7homework-8c937.firebaseio.com",
    projectId: "week7homework-8c937",
    storageBucket: "week7homework-8c937.appspot.com",
    messagingSenderId: "365333168603"
};

firebase.initializeApp(config);

//Create a variable to reference the database
var database = firebase.database();

//Create a reference for the game
const gameReference = firebase.database().ref().child('game');
const gameState = gameReference.child('state');
const players = gameReference.child('players');
const player1 = players.child('player1');
const player2 = players.child('player2');
var ready1;
var ready2;
var eleccion1;
var eleccion2;

var playerName = "-";
var firstPlayer;
var secondPlayer;
var playerNumber;
var playerChoice = "-";
var state;


//Starts the game
$(document).ready(function(){
    reset();
    
    
    //When the joing button is clicked it saves the name and calls the game start function
    $(".joinButton").click(function(event){
        event.preventDefault();
        playerName = $(".name").val().trim();
        gameStart();
    });

    //Listens for the player's choice button to be pressed
    $('.choiceButton').click(function(event){
        event.preventDefault();
        //If the player is player 1
        if(playerNumber === 1){
            //Looks for the radios for player 1
            let radios = $('input:radio[name="option1"]');
            //goes through the radios and checks which one is checked
            for(let i = 0; i < radios.length; i++){
                if($(radios[i]).is(':checked')===true){
                    console.log("player choice");
                    console.log($(radios[i]).val().trim());
                    playerChoice = $(radios[i]).val().trim();
                    console.log(playerChoice);
                }
            }
            //Hides the options  
            $('.player1form').hide();
            //Creates an h1 to say the player is ready, the appends it
            let option = $('<h1>');
            option.text("Player 1 ready");
            $('.player1choice').append(option);
            //Updates firebase
            player1.set({
                name: playerName,
                choice: playerChoice,
                number: 1,
                status: "ready"
            });

        } else if (playerNumber === 2){
            let radios = $('input:radio[name="option2"]');
            console.log("radios");
            console.log(radios);
            //goes through the options to see which one is checked
            for(let i = 0; i < radios.length; i++){
                if($(radios[i]).is(':checked')===true){
                    console.log("player choice");
                    console.log($(radios[i]).val().trim());
                    playerChoice = $(radios[i]).val().trim();
                    console.log(playerChoice);
                }
            }     
            //Hides player 2's options       
            $('.player2form').hide();
            let option = $('<h1>');
            option.text("Player 2 ready");
            $('.player2choice').append(option);
            //updates firebase
            player2.set({
                name: playerName,
                choice: playerChoice,
                number: 2,
                status: "ready"
            });
        }
    });
})

//Function that reads the if the player is player 1 or 2
function gameStart(){
    console.log("game start");
    
    //If the player is the first one in, it is set as player 1
    if(state==="new"){
        //Updating the info on firebase
        player1.set({
            name: playerName,
            choice: playerChoice,
            number: 1,
            status: "not"
        });
        //Local control number
        playerNumber = 1;
        $(".player1name").text(playerName);
        //Changes the game state so that it is recognized there is a player already in
        gameState.set("created");
    } else if (state === "created") {
        //Updating player 2 info on firebase
        player2.set({
            name: playerName,
            choice: playerChoice,
            number: 2,
            status: "not"
        });
        playerNumber = 2;
        $(".player2name").text(playerName);
        //Change status to recognize there are two people now playing the game
        gameState.set("joined");
    }
}

//Changes the game's phase from waiting for players to selecting options
function gamePhase(){
    console.log("gamephase");
    $('.startName').hide();
    //Shows the player's options
    if(playerNumber === 1){
        $('.player1choice').show();
    } else if(playerNumber === 2) {
        $('.player2choice').show();
    }

}

//Listens for any info changes for the players
gameReference.on("child_changed", function(snapshot){
    console.log("player child changed");
    let data = snapshot.val();
    console.log(data);
    if(playerNumber === 1){
        ready1 = data.player1.status;
    } else if (playerNumber===2){
        ready2 = data.player2.status;
    }
    eleccion1 = data.player1.choice
    eleccion2 = data.player2.choice
    console.log(eleccion1 + " " + eleccion2);
    if((data.player1.status === "ready")&&(data.player2.status ==="ready")){
        gameState.set("ready");
    }
})

//Listen for changes to player 1 and saves the name on local
players.on("child_changed", function(snapshot){
    console.log("player1");
    console.log(firstPlayer);
    let playerInfo = snapshot.val();
    if(playerInfo.number === 1){
        firstPlayer = playerInfo.name;
    } else {
        secondPlayer = playerInfo.name;
    }
})

//Function to see who won
function gameCalc(){
     let result;
     console.log("gameCalc");
     
     if(eleccion1 === eleccion2){
        result = "tie";
     } else if((eleccion1 === "rock")&&(eleccion2==="scissors")){
        result = firstPlayer;
     } else if((eleccion1 === "scissors")&&(eleccion2 === "paper")){
        result = firstPlayer;
     } else if((eleccion1 === "paper")&&(eleccion2==="rock")){
        result = firstPlayer;
    } else {
        result = secondPlayer;
    }

    let player1choice = $('<h1>');
    player1choice.text(ready1);
    $('.player1').append(player1choice);
    let player2choice = $('<h1>');
    player2choice.text(ready2);
    $('.player2').append(player2choice);
    $('.winner').text(result + " is the winner!");
    $('.result').show();

}

function reset(){
    $('.result').hide();
    $('.result').empty();


    gameState.set("finished");
    player1.set({
        name: "-",
        choice: "-",
        number: 1,
        status: "not"
    });
    player2.set({
        name: "-",
        choice: "-",
        number: 2,
        status: "not"
    });
    gameState.set("new");
    $('.startName').show();
}

//Listen for changes
gameState.on("value", function(snapshot){
    console.log("gameState");
    console.log(snapshot.val());
    $(".player2name").text(secondPlayer);
    $(".player1name").text(firstPlayer);
    //sets the state variable to the state it pulled from the cloud
    state = snapshot.val();
    //Activates a game phase depending on the game state
    switch(snapshot.val()){
        //If both players have joined then it goes to game phase
        case 'new':
        case 'created':
            break;
        case 'joined':
            gamePhase();
            break;
        case 'ready':
            gameCalc();
            break;
        case 'finished':
            reset();
        default:
            break;

    }
});
//ask for the players name
//review status of the game
//if status of the game is not started then add players name to player 1
//if game already was started then add players name to player 2
//


