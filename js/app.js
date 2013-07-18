$(function(){

    /**
     * Main application
     */
    function GBapp() {
        var app = this;
        app.api_key = '7f4c7d2fa9de93b62e9d2cb05f83828d04119472';
        console.log('App initialized!' + app);

        app.questions = $('#questions');
        app.errorMsg = $('#error');
        app.loadingMsg = $('#loading');
        app.submitButton = $('#submitBtn');
        app.resetButton = $('#resetBtn');
        app.startButton = $('#startBtn');
        app.results = $('#results');
        app.finalResult = $('#finalResult');
        app.information = $('#info');

        app.randomNum = 0;
        app.points = 0;
        app.val = "";
        app.correctAnswer = "";
        app.questionsArray = [];
        app.listOfGames = [];
        app.listOfCharacters = [];
        app.counter = 1;

        app.startButton.on('click', function(e){
            e.preventDefault();
            app.start();
            app.startButton.fadeOut('fast');
        });

        app.submitButton.on('click' , function(e) {
            e.preventDefault();
            
            if(app.counter === 5) {
                app.checkAnswer();
                app.counter = 0;
                $('#score').hide();
                app.hideAll();
                app.startButton.hide();
                app.finalResult.show().append(" Final Score: " + app.points);
                app.reset();
                app.resetButton.show();
            }

            app.checkAnswer();

            if(app.listOfCharacters) {
                console.log(app.points);
                app.correctAnswer = ""; //reset
                var character = app.shuffle(app.listOfCharacters);
                app.find(character[0]);
            }

            if($('input:radio:checked').val() !== undefined) {
                app.counter++;
            }

            app.reset();

        });

        app.resetButton.on('click',function(e){
            e.preventDefault();
            app.points = 0;
            app.counter = 0;
            $('#score').html(app.points + "/5");
            app.reset();
            app.start();
            app.finalResult.html("");
        });
    }

    GBapp.prototype.checkAnswer = function() {
        if($('input:radio:checked').val().toLowerCase() === app.correctAnswer.toLowerCase()) {
                app.points += 1;
                $('#score').html(app.points + "/5");
        }
    };

    /**
     * Initiates the app, calls find and displays results
     */
    GBapp.prototype.start = function() {
        console.log('start was called');
        app.find('kratos');
        app.getListOfGames();
        app.getListOfCharacters();
        app.results.slideDown(1000);
        app.information.show();
        //app.questions.hide(function(){$(this).slideDown(1000);});
    };

    /**
     * Hides all elements
     */
    GBapp.prototype.hideAll = function() {
        console.log('hide was called');
        app.information.hide();
        app.results.hide();
        app.startButton.show();
    };

    /**
     * Resets the page
     */
    GBapp.prototype.reset = function() {
        app.questions.html('');
        app.results.html('');
        //app.questions.show();
    };

    /**
     * Shuffles array
     */
    GBapp.prototype.shuffle = function(array) {
        var curr = array.length;
        var temp;
        var rand;

        while(curr !== 0) {
            rand = Math.floor(Math.random() * curr);
            curr--;

            temp = array[curr];
            array[curr] = array[rand];
            array[rand] = temp;
        }

        return array;
    };

    /**
     * Parses and appends data received from ajax request
     */
    GBapp.prototype.parseData = function(data) {
            app.questions.append('<p>In which game did this character make their debut?</p> <br>'); 
            app.questionsArray = ["Metal Gear Solid", "Indigo Prophecy", "Super Smash Brothers", "Madden", "Ninja Gaiden"];

            var i,
                game,
                prev,
                shuffledArray,
                shuffledGames = [],
                firstFiveGames = [];
            
            //goes through json object, checks whether input is equal to name and appends the image
            for(i in data.results) {
                   if(app.val.toLowerCase() === data.results[i].name.toLowerCase()) {
                    console.log('inside if statement');
                    app.correctAnswer =  data.results[i].first_appeared_in_game.name;
                    $('#results').append('<img src=' + data.results[i].image.medium_url + '>');
                    break;
                }
            }

            
            /* If there is a 'correctAnswer' then:
             * create and shuffle array, get first 6 elements
             * then push 'correctAnswer', then append to html
             * 
             */
            if(app.correctAnswer !== "") {
                
                app.questionsArray.push(app.correctAnswer);
                
                shuffledArray = app.shuffle(app.questionsArray);
                shuffledGames = app.shuffle(app.listOfGames);
                
                firstFiveGames = shuffledGames.slice(0, 5);
                firstFiveGames.push(app.correctAnswer);
                firstFiveGames = app.shuffle(firstFiveGames);
                
                //console.log("Correct Answer is : " + app.correctAnswer);


                if(firstFiveGames.length !== 0 && app.points !== 0) {
                        //for(j = 0; j < 6; j++) {
                    for(game in firstFiveGames) {
                        prev = game - 1;
                        if($(".choice").eq(prev).val() !== firstFiveGames[game]) {
                            app.questions.append("<input type='radio' name='games' class='choice'  id='" + firstFiveGames[game] + "' value='" + firstFiveGames[game] + "'/>");
                            app.questions.append("<label for='" + firstFiveGames[game] + "'>" + firstFiveGames[game] + "</label>  <br />");
                        }
                    }
                }
                else {
                    for(game in shuffledArray) {
                        prev = game - 1;
                        console.log($(".choice").eq(prev).val() + " vs " + shuffledArray[game]);
                        if($(".choice").eq(prev).val() !== shuffledArray[game]) {
                            app.questions.append("<input type='radio' name='games' class='choice'  id='" + shuffledArray[game] + "' value='" + shuffledArray[game] + "'/>");
                            app.questions.append("<label for='" + shuffledArray[game] + "'>" + shuffledArray[game] + "</label>  <br />");

                        }
                    }
                }
            }

            app.resetButton.show();
            app.submitButton.show();
    };

    /**
     * Retreive a image and game based on character name.
     */
    GBapp.prototype.find = function(arg) {       
        app.val = arg;

        $.ajax({
            url: 'http://www.giantbomb.com/api/search',
            dataType: 'jsonp',
            cache: false,
            data: {
                    api_key: app.api_key,
                    //query: app.userSearch.val(),
                    query: arg,
                    resources : "character",
                    format : "jsonp"
            },
            jsonp: 'json_callback',
            beforeSend: function() {
                app.errorMsg.hide();
                app.loadingMsg.show();
            },
            complete: function() {
                app.loadingMsg.hide();
            },
            success: function(data) {  
                console.log(data);
                app.parseData(data);
            },
            error: function() {
                app.errorMsg.show();
            }
        });
    };

    /**
     * Retrieves list of games
     */
    GBapp.prototype.getListOfGames = function() {
        $.ajax({
            url: 'http://www.giantbomb.com/api/games',
            dataType: 'jsonp',
            cache: false,
            data: {
                    api_key: app.api_key,
                    field_list: 'name',
                    format : "jsonp"
            },
            jsonp: 'json_callback',
            beforeSend: function() {
                app.errorMsg.hide();
            },
            success: function(data) {  
                console.log(data);
                for(var i in data.results)
                {
                   app.listOfGames.push(data.results[i].name);
                }
            },
            error: function() {
                app.errorMsg.show();
            }
        });
    };

    /**
     * Retrieves list of characters
     */
    GBapp.prototype.getListOfCharacters = function() {       
        $.ajax({
            url: 'http://www.giantbomb.com/api/characters',
            dataType: 'jsonp',
            cache: false,
            data: {
                    api_key: app.api_key,
                    field_list: 'name',
                    format : "jsonp"
            },
            jsonp: 'json_callback',
            beforeSend: function() {
                app.errorMsg.hide();
            },
            success: function(data) {  
                console.log(data);
                for(var i in data.results)
                {
                   app.listOfCharacters.push(data.results[i].name);
                }
            },
            error: function() {
                app.errorMsg.show();
            }
        });
    };

    //start the app
    var app = new GBapp();
    app.hideAll();
    app.startButton.show();
});