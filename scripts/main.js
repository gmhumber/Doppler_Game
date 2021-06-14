const app = new Vue({

    el: '#app',

    data: {
        gameStatus : 'inactive', //flag to mark the game's status and control the user's available options at various stages of the game
        currentLevel : 1,
        currentScore : 0,
        audioObject: {
                        redAudioElement: null,
                        greenAudioElement: null,
                        yellowAudioElement: null,
                        blueAudioElement: null,
                        victoryAudioElement: null
                    },
        segmentElementsArray : [],
        gameSequenceArray : [],
    },

    mounted() {
        // DOM elements of the segments in the game circle
        this.segmentElementsArray.push(this.$refs['top-red-segment']);
        this.segmentElementsArray.push(this.$refs['right-green-segment']);
        this.segmentElementsArray.push(this.$refs['left-yellow-segment']);
        this.segmentElementsArray.push(this.$refs['bottom-blue-segment']);

        // DOM elements for the audio elements in the HTML code
        this.audioObject.redAudioElement = this.$refs['red-sound'];
        this.audioObject.greenAudioElement = this.$refs['green-sound'];
        this.audioObject.yellowAudioElement = this.$refs['yellow-sound'];
        this.audioObject.blueAudioElement = this.$refs['blue-sound'];
        this.audioObject.victoryAudioElement = this.$refs['victory-sound'];
    },

    methods: {

        // Function to play a sound file when executed. This function will stop playback if the file is already playing before it plays the sound in the current cycle.
        // @param requestedSound = a string corresponding to a sound file to be played
        playAudioFile: function(requestedSound) {

            switch (requestedSound) {
                
                case 'red':
                    this.audioObject.redAudioElement.pause();
                    this.audioObject.redAudioElement.currentTime = 0;
                    this.audioObject.redAudioElement.play();
                    break;

                case 'green':
                    this.audioObject.greenAudioElement.pause();
                    this.audioObject.greenAudioElement.currentTime = 0;
                    this.audioObject.greenAudioElement.play();
                    break;

                case 'yellow':
                    this.audioObject.yellowAudioElement.pause();
                    this.audioObject.yellowAudioElement.currentTime = 0;
                    this.audioObject.yellowAudioElement.play();
                    break;

                case 'blue':
                    this.audioObject.blueAudioElement.pause();
                    this.audioObject.blueAudioElement.currentTime = 0;
                    this.audioObject.blueAudioElement.play();
                    break;

                case 'victory':
                    this.audioObject.victoryAudioElement.pause();
                    this.audioObject.victoryAudioElement.currentTime = 0;
                    this.audioObject.victoryAudioElement.play();
                    break;
            };

        },

        // function to generate the game sequence randomly, the higher the player's level the longer the sequence is.
        generateSequenceArray: function() {
            const generatedSequence = [];

            for (let i=0; i < this.currentLevel; i++) {
                const randomNum = Math.floor(Math.random() * this.segmentElementsArray.length);
                generatedSequence.push(this.segmentElementsArray[randomNum]);
            }

            return generatedSequence;
        },

        // function to toggle the light up feature of each game circle segment and optionally play the sound that is associated with a game circle segment
        //@param segmentElement = the segment element in the DOM that is to be toggled
        //@param playSound = boolean value to determine whether the sound should be played, default value is false (no sound)
        toggleLightOnSegmentElement: function(segmentElement, playSound = false) {

            if (segmentElement.classList.contains('top-red-segment')) {
                segmentElement.classList.toggle('top-red-segment-on');
                if (playSound) {
                    this.playAudioFile('red');
                }

            } else if (segmentElement.classList.contains('right-green-segment')) {
                segmentElement.classList.toggle('right-green-segment-on');
                if (playSound) {
                    this.playAudioFile('green');
                }

            } else if (segmentElement.classList.contains('left-yellow-segment')) {
                segmentElement.classList.toggle('left-yellow-segment-on');
                if (playSound) {
                    this.playAudioFile('yellow');
                }

            } else if (segmentElement.classList.contains('bottom-blue-segment')) {
                segmentElement.classList.toggle('bottom-blue-segment-on');
                if (playSound) {
                    this.playAudioFile('blue');
                }
            };
        },

        // function to turn off the lighting on all game cirle segments, regardless of whehter they are on or off. Use this function to clear the game board.
        resetAllLightsOnSegmentElements: function(){
            for (let i=0; i < this.segmentElementsArray.length; i++) {
                this.segmentElementsArray[i].classList.remove('top-red-segment-on', 'right-green-segment-on', 'left-yellow-segment-on', 'bottom-blue-segment-on');
            };
        },

        // function that returns a promise that will light up a game circle element, used to display the game sequence to the user in preparation for a new round. The duration of the lighting and the gap between lighting up two elements in the sequence are delayed and determined by two computed properties in this Vue app.
        //@param segmentElement = the DOM element to be lit up
        showSequence: function(segmentElement) {
            return new Promise ((resolve, reject) => {

                this.toggleLightOnSegmentElement(segmentElement, true);
                //console.log("in show sequence func")

                setTimeout(() => {
                    this.toggleLightOnSegmentElement(segmentElement, false);
                    setTimeout(() => {
                        //console.log("about to call resolve()")
                        resolve();
                    }, this.sequenceDisplaySpeedInterval);
                }, this.sequenceDisplaySpeed);
            });
        },

        // function that returns a promise used for creating timeouts to delay the events of the game when needed.
        //@param delayDuration = the time, in miliseconds, to delay by. Default value is 1500ms.
        createTimeout: function(delayDuration = 1500) {
            return new Promise ((resolve, reject) => {
                setTimeout(()=>{
                    resolve();
                }, delayDuration);
            });
        },

        // Async function that begins the game by generating a new game sequence and then presenting it to the user. It is designed to be triggered by an event listener on the "Start Game" button.
        //@param event = event object that triggered the event listener that exeucted this function
        startGame: async function(event) {
            if (this.gameStatus !== 'inactive' 
                && this.gameStatus !== 'lost' 
                && this.gameStatus !== 'start-new-round') {
                
                    return;
            }

            if (this.gameStatus === 'lost') {
                this.currentLevel = 1;
                this.currentScore = 0;
            }

            this.gameStatus = 'showing-sequence';
            this.gameSequenceArray = this.generateSequenceArray();

            await this.createTimeout();   
            
            // loop over the game sequence array and display it to the user
            for (let i=0; i < this.gameSequenceArray.length; i++) {
                await this.showSequence(this.gameSequenceArray[i]);
            }

            this.gameStatus = 'awaiting-user-selection';

        },

        // function to detect a mouse down event on the game circle segments and light up the segment that was clicked
        //@param event = event object that triggered the event listener that exeucted this function
        segmentClicked: function(event) {
            if (this.gameStatus !== 'awaiting-user-selection') {
                return;
            }

            const clickedSegment = event.currentTarget;
            this.toggleLightOnSegmentElement(clickedSegment, true);
        },

        // this function is designed to be triggered by a mouse up event after the user clicks on a game circle segment. Upon mouse up, the segment selected by the user is confirmed and segment is lit up. The reason for doing this in the mouse up phase instead of the mousedown phase is to allow a user to change their mind about their selection even after the mouse down event, by dragging the cursor to the desired segment and then releasing the mouse button. This was designed to provide a better user experience.
        //@param event = event object that triggered the event listener that exeucted this function
        segmentUnclicked: function(event) {
            if (this.gameStatus !== 'awaiting-user-selection') {
                return;
            }

            this.gameStatus = 'analyze-user-selection';
            const clickedSegment = event.currentTarget;
            this.resetAllLightsOnSegmentElements();
            this.toggleLightOnSegmentElement(clickedSegment, false);
            setTimeout(()=>{
                this.toggleLightOnSegmentElement(clickedSegment, false);
            }, 150);

            // This is the heart of the game logic. The first element in the game sequence array is peeled off and compared with the element selected by the user. If it matches, the user is correct and moves on, is not then the user loses.
            if (clickedSegment === this.gameSequenceArray.shift()) {
                this.currentScore += 1;

                // Check if all elements have been peeled away from the game sequence array, if so, then the array should be empty and we know we are at the end of the round. If the user made it into this part of the condition tree, he or she has completed the sequence in the round successfully and will level up before moving on to the next round.
                if (this.gameSequenceArray.length === 0) {
                    this.currentLevel += 1;
                    this.playAudioFile('victory');
                    this.gameStatus = 'start-new-round';

                    setTimeout(()=>{
                        this.startGame();
                    }, 3750)
                } else {
                    this.gameStatus = 'awaiting-user-selection';
                }
            } else {
                this.gameStatus = 'lost';
                return;
            }
        },

        // function allowing the user to restart during mid-game by forcing an error to be thrown to stop execution of all pending code, then restart the game. (Maybe there's a better to achieve this, perhaps a solution like exit() in PHP?)
        restartGame: function() {
            try {
                throw "Restarting game....";
            }
            catch(err) {
                console.log(err);
            }
            finally {
                this.gameStatus = 'lost';
                this.startGame();
            }
        },

    },

    computed: {

        // computed property that controls the speed that the game sequence is displayed to the player. The speed increases as the user's level increases.
        sequenceDisplaySpeed : function() {
            if (this.currentLevel <= 3) {
                return 1000;
            } else {
                const displaySpeed = 1000 * (1 - (this.currentLevel * 0.025));
                return displaySpeed > 300 ? displaySpeed : 300;
            }
        },

        // computed property that controls the time gap between each part of the game sequence that is displayed to the player. This property is a function of the sequenceDisplaySpeed property.
        sequenceDisplaySpeedInterval : function() {
            return (this.sequenceDisplaySpeed / 4);
        },

        // property to determine whether the "Start Game" button should be displayed
        showStartGameBtn: function() {
            if (this.gameStatus === 'inactive' || this.gameStatus === 'lost' ) {
                return true;
            }
        },

        // property to determine whether the "Restart Game" button should be displayed
        showRestartGameBtn: function() {
            if (this.gameStatus !== 'inactive' && this.gameStatus !== 'lost' ) {
                return true;
            }
        },

        // property to determine the appropriate message to the shown to the user at each stage of a round in the game
        helpMessages: function() {

            switch (this.gameStatus) {

                case 'inactive':
                    return "Press 'Start Game' to begin";
                    break;
                
                case 'start-new-round':
                    return "You have leveled up!";
                    break;

                case 'lost':
                    return "Game Over :`(";
                    break;

                case 'awaiting-user-selection':
                    return "Repeat the sequence by clicking on the segments";
                    break;

                case 'showing-sequence':
                    return "Watch the sequence carefully"
                    break;

                default:
                    return "Isn't this fun?";
                    break;

            };
        },

    }
});


function buyBeer(event) {
    event.preventDefault();
    alert("Thanks! Glad you like the game enough to click here!");
}