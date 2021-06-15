<?php

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width">
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
        <script async await src="scripts/main.js"></script>
        <link rel="stylesheet" href="styles/main.css">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Bubbler+One&display=swap" rel="stylesheet">
        <title>Doppler</title>
    </head>
    <header>
        <div class="page-wrapper header-wrapper">
            <div class="logo-container">
                <img class="logo" src="images/logo.png" alt="Doppler Games Logo">     
            </div>
            <button class="btn" type="button" onclick="buyBeer(event)">Buy me a beer!</button>
        </div>
    </header>
    <body>
        <div class="app page-wrapper" id="app">
            <div class="text-div">
                <h2>DOPPLER</h2>
                <p>Doppler is the ultimate test of memory and reflexes. Watch the pattern, repeat the pattern, don't crack under the pressure. Do you have what it takes?</p>
            </div>
            <div class="scoreboard-flex-container">
                <div class="scoreboard-sub-container">
                    <div class="btn-div start-btn" v-if="showStartGameBtn">
                        <button class="btn" type="button" @click="startGame($event)">Start Game</button>
                    </div>
                    <div class="btn-div reset-btn" v-if="!showStartGameBtn">
                        <button class="btn" type="button" @click="restartGame($event)">Restart Game</button>
                    </div>
                    <div class="scoreboard">
                        <p>Level: {{ currentLevel }}</p>
                        <p>Score: {{ currentScore }}</p>
                    </div>
                </div>
            </div>
            <div class="segments-flex-container">
                <div class="segments-container">
                    <div class="top-red-segment segments" ref="top-red-segment" @mousedown="segmentClicked($event)" @mouseup="segmentUnclicked($event)"></div>
                    <div class="right-green-segment segments" ref="right-green-segment" @mousedown="segmentClicked($event)" @mouseup="segmentUnclicked($event)"></div>
                    <div class="left-yellow-segment segments" ref="left-yellow-segment" @mousedown="segmentClicked($event)" @mouseup="segmentUnclicked($event)"></div>
                    <div class="bottom-blue-segment segments" ref="bottom-blue-segment" @mousedown="segmentClicked($event)" @mouseup="segmentUnclicked($event)"></div>
                </div>
            </div>
            <div class="help-msg-div">
                <p>{{ helpMessages }}</p>
            </div>

            <audio src="media/C3_pp.wav" class="red-sound" type="audio/wav" ref="red-sound"></audio>
            <audio src="media/C4_pp.wav" class="green-sound" type="audio/wav" ref="green-sound"></audio>
            <audio src="media/C5_pp.wav" class="yellow-sound" type="audio/wav" ref="yellow-sound"></audio>
            <audio src="media/G3_pp.wav" class="blue-sound" type="audio/wav" ref="blue-sound"></audio>
            <audio src="media/victory.ogg" class="victory-sound" type="audio/ogg" ref="victory-sound"></audio>

        </div>

    </body>
    <footer>
        <div class="page-wrapper footer-wrapper">
            <p>&#169; Fractalsoft 2021</p>
        </div>
    </footer>
</html>