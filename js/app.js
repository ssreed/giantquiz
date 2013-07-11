$(function(){

    /**
     * Main application
     */
    function GBapp() {
        var app = this;
        app.api_key = '7f4c7d2fa9de93b62e9d2cb05f83828d04119472';
        console.log('App initialized!' + app);

        //app.userSearch = $('#search-field');
        //app.gameForm = $('#game-search form');
        app.questions = $('#questions');
        app.errorMsg = $('#error');
        app.loadingMsg = $('#loading');
        app.submitButton = $('#submitBtn');
        app.resetButton = $('#resetBtn');
        app.startButton = $('#startBtn');
        app.results = $('#results');

        app.randomNum = 0;
        app.points = 0;
        app.val = "";
        app.correctAnswer = "";
        app.questionsArray = [];
        app.listOfGames = [];
        app.listOfCharacters = [];
        //app.submit.hide();
        //app.userAnswer = $('input:radio:checked');
        
        /* Don't need this temporarily 
        app.gameForm.on('submit', function(e){
            e.preventDefault();
            app.getListOfGames();
            app.getListOfCharacters();
            app.reset();
            
            if(app.userSearch.val() !== "")
            {
                app.find(app.userSearch.val());
            } else {
                app.find('Kratos');
            }
        }); */

        app.startButton.on('click', function(e){
            e.preventDefault();
            app.start();
        });

        app.submitButton.on('click' , function(e) {
            e.preventDefault();
            console.log("VAL: " + $('input:radio:checked').val() + " correctVAL: " + app.correctAnswer.toLowerCase());
            if($('input:radio:checked').val().toLowerCase() === app.correctAnswer.toLowerCase())
            {
                app.reset();
                app.points += 1;
                if(app.points === 5) {alert('you win!')};
                if(app.listOfCharacters)
                {
                    console.log(app.points);
                    app.correctAnswer = ""; //reset
                    var character = app.shuffle(app.listOfCharacters);
                    app.find(character[0] + '');
                } else {
                    app.find('dante');
                }  
            }
            else
            {
                alert('please try again!');
            } 

        });

        app.resetButton.on('click',function(e){
            e.preventDefault();
            app.reset();
            //app.userSearch.val('');
        });
    }

    GBapp.prototype.start = function() {
        console.log('start was called');
        app.find('kratos');
        app.getListOfGames();
        app.getListOfCharacters();
        //app.userSearch.show();
        app.results.show();
        app.resetButton.show();
        app.submitButton.show();
        app.startButton.hide();
    };

    GBapp.prototype.hideAll = function() {
        console.log('hide was called');
        //app.gameForm.hide();
        //app.userSearch.hide();
        app.results.hide();
        app.resetButton.hide();
        app.submitButton.hide();
        //alert(app.resetButton);
        //alert(app.submitButton);
        app.startButton.show();
    };

    GBapp.prototype.reset = function() {
        app.questions.html('');
        app.results.html('');
        app.questions.show();
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
            app.questions.append('<p> In which game did he/she make their first appearance?</p> <br>'); 
            app.questionsArray = ["Metal Gear Solid", "Indigo Prophecy", "Super Smash Brothers", "Madden", "Ninja Gaiden"];

            var i,
                game,
                prev,
                shuffledArray,
                shuffledGames = [],
                firstFiveGames = [];
            
            //goes through json object, checks whether input is equal to name and appends the image
            for(i in data.results) {
                //if(app.userSearch.val().toLowerCase() === data.results[i].name.toLowerCase() ||
                   if(app.val.toLowerCase() === data.results[i].name.toLowerCase()) {
                    console.log('inside if statement');
                    app.correctAnswer =  data.results[i].first_appeared_in_game.name;
                    $('#results').append('<img src=' + data.results[i].image.medium_url + '>');
                     //app.questions.append("<input type='radio' name='choice' value='" + app.correctAnswer + "'/>" + app.correctAnswer + "<br />");                    
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

                //app.listOfGames.push(app.correctAnswer);
                shuffledGames = app.shuffle(app.listOfGames);
                firstFiveGames = shuffledGames.slice(0, 5);
                firstFiveGames.push(app.correctAnswer);
                firstFiveGames = app.shuffle(firstFiveGames);
                console.log("Correct Answer is : " + app.correctAnswer);
                
                /* ORIGINAL
                for(j in shuffledArray) {
                    prev = j-1;
                    console.log($(".choice").eq(prev).val() + " vs " + shuffledArray[j]);
                    if($(".choice").eq(prev).val() !== shuffledArray[j]) {
                        app.questions.append("<input type='radio' name='games' class='choice' value='" + shuffledArray[j] + "'/>" + shuffledArray[j] + "<br />");

                    }
                } */

                if(firstFiveGames.length !== 0 && app.points !== 0) {
                        //for(j = 0; j < 6; j++) {
                    for(game in firstFiveGames) {
                        prev = game - 1;
                        if($(".choice").eq(prev).val() !== firstFiveGames[game]) {
                            app.questions.append("<input type='radio' name='games' class='choice' value='" + firstFiveGames[game] + "'/>" + firstFiveGames[game] + "<br />");
                        }
                    }
                }
                else {
                    for(game in shuffledArray) {
                    prev = game - 1;
                    console.log($(".choice").eq(prev).val() + " vs " + shuffledArray[game]);
                    if($(".choice").eq(prev).val() !== shuffledArray[game]) {
                        app.questions.append("<input type='radio' name='games' class='choice' value='" + shuffledArray[game] + "'/>" + shuffledArray[game] + "<br />");

                    }
                     }
                } 
            }
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