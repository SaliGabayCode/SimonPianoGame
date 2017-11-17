'use strict';
//global vars:
var gState = {turn:'computer',sequence:[],currentComputerNote:0,currentUserNote:0,numberOfNotes:0 };
var gSounds = ['cat','cow','dog','horse','sheep'];
var gMyInterval = null;
//checking if the user has a simon's piano high score on his local storage
if (!localStorage.simonHighScore) {
    localStorage.simonHighScore = 0;
}
//using the function printToSpan to print the High score into the DOM
$(document).ready(printToSpan('highScore','High score: '+localStorage.simonHighScore));

//start function use also as a restart so in case the user wants to restart it reset the gState var.
function start (){
    var startButton = document.querySelector('.start');
    startButton.innerText = 'restart game';
    clearInterval(gMyInterval);
    gState.numberOfNotes = 0;
    gState.sequence = [];
    gState.turn = 'computer';
    printToSpan('yourScore','Your Score: '+gState.numberOfNotes);
    initGame();
}
//this function gets an 'input' from the user or the gState.sequence and play it's sound and chang the color
function playAnimalSound (animal){
    var animalSound = new Audio('sounds/'+animal+'.mp3');
    var elDiv = document.querySelector('.'+animal);
    console.log(elDiv);
    elDiv.classList.add(animal+'-light');
    setTimeout(function(){ elDiv.classList.remove(animal+'-light'); }, 700);
    animalSound.play();
}
//this function sets the interval for adding more notes into the gState.sequence and play them.
function initGame() {
    gState.numberOfNotes++;
    printToSpan('instructions','Listen carefully!');
    gMyInterval = setInterval(function () {soundInterval();
    },1500);
}
// this function sends notes from the gState.sequence to the playAnimalSound.
function soundInterval (){
    if (gState.currentComputerNote >= gState.numberOfNotes){
        clearInterval(gMyInterval);
        gState.currentComputerNote = 0;
        gState.turn = 'user';
        printToSpan('instructions','Now try to repeat the sequence ');
        return;
    }
    var randomNumber = Math.floor(Math.random() * 5);
    gState.sequence.push(gSounds[randomNumber]);
    playAnimalSound(gState.sequence[gState.currentComputerNote]);
    gState.currentComputerNote ++;
}
//this function will only work if it's the user's turn to play, it checks if the user pressed
// the correct button.and if so sends it's value to the playAnimalSound function
function userTurn (animal) {
    if (gState.turn === 'computer')return;
    if (animal === gState.sequence[gState.currentUserNote]) {
        playAnimalSound(animal);
        gState.currentUserNote ++;
    }
    else{
        printToSpan('instructions','Sorry you lost..');
        gState.turn = 'computer';
        if (gState.numberOfNotes > localStorage.simonHighScore){
            localStorage.simonHighScore = gState.numberOfNotes-1;
            printToSpan('highScore','High score: '+(gState.numberOfNotes-1));
        }
        setTimeout(function(){ printToSpan('instructions','Press the restart button to play again'); }, 1700);
        }
    if (gState.currentUserNote >= gState.numberOfNotes){
        gState.currentUserNote = 0;
        gState.turn = 'computer';
        printToSpan('yourScore','Your Score: '+gState.numberOfNotes);
        setTimeout(function(){ printToSpan('instructions','Great job!!'); }, 700);
        setTimeout(function(){ initGame(); }, 1700);
    }
}
//this function is the one i'm most proud of. it takes an id & input and print the input into the DOM.
function printToSpan (span,input){
    var turnSpan = document.querySelector('#'+span);
    turnSpan.innerHTML = input;
}