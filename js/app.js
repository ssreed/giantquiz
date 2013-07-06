$(function(){

    /**
     * Main application
     */
    function GBapp() {
        var app = this;
        app.api_key = '7f4c7d2fa9de93b62e9d2cb05f83828d04119472';
        console.log('App initialized!' + app);

        app.userSearch = $('#search-field');
        app.submit = $('#submitBtn');
        app.gameForm = $('#game-search form');
        app.questions =  $('#questions');
        app.errorMsg = $('#errorMsg');
        app.questions = $('#questions');
        app.randomNum = 0;
        //app.userAnswer = $('input:radio:checked');
        app.correctAnswer = "";
        //app.submit.hide();

        app.gameForm.on('submit', function(e){
            e.preventDefault();
            app.questions.html('');
            app.questions.show();
            if(app.userSearch.val() !== "")
            {
                app.find();
                app.submit.removeClass('hidden');
                app.addQuestions();
            }
        });

        app.submit.on('click' , function(e)
        {
            e.preventDefault();
            if($('input:radio:checked').val() === app.correctAnswer)
            {
                app.questions.hide();
                $('#search-results').hide();
                console.log('nice');
            }

        });
    }

    GBapp.prototype.reset = function() {
        alert('hi');
    };

    /**
     * Add question and choices
     */
    GBapp.prototype.addQuestions = function() {
            app.questions.append('<p> In which game did he/she make their first appearance?</p> <br>'); 
            var questionsArray = ["Metal Gear Solid", "God Of War", "Super Smash Brothers", "Madden", "Ninja Gaiden"];
                      
            for(var i in questionsArray)
            {
                app.randomNum = Math.floor(questionsArray.length * Math.random());
                if($("input:radio").val() !== questionsArray[app.randomNum])
                {
                    app.questions.append("<input type='radio' name='choice' value='" + questionsArray[app.randomNum] + "'/>" + questionsArray[app.randomNum] + "<br />");

                } 
            }
    };

    /**
     * Parses and appends data received from ajax request
     */
    GBapp.prototype.parseData = function(data) {
            var i;
            for(i in data.results)
            {  
                console.log(data['results'][i].name);
                if(app.userSearch.val().toLowerCase() === data['results'][i].name.toLowerCase())
                {
                     app.correctAnswer =  data['results'][i].first_appeared_in_game.name;
                     $('#results').append('<img src=' + data['results'][i].image.medium_url + '>');
                      app.questions.append("<input type='radio' name='choice' value='" + app.correctAnswer + "'/>" + app.correctAnswer + "<br />");
                     break;
                }
            }
    };

    /**
     * Retreive a image and game based on character name.
     */
    GBapp.prototype.find = function() {
        $.ajax({
            url: 'http://www.giantbomb.com/api/search',
            dataType: 'jsonp',
            cache: false,
            data: {
                    api_key: app.api_key,
                    query: app.userSearch.val(),
                    resources : "character",
                    format : "jsonp"
            },
            jsonp: 'json_callback',
            beforeSend: function() {
                app.errorMsg.hide();
            },
            success: function(data) {
                app.errorMsg.hide();
                console.log(data);
                app.parseData(data);
            },
            error: function() {
                app.errorMsg.show();
                console.log(app.user_input);
                console.log(app.api_key);
                console.log(this);
            }
        });
    };

    /*
    //&format=json&query=kratos&resources=character&field_list=name,first_appeared_in,image
    GBapp.prototype.findGames = function() {
        $.ajax({
            url: 'http://www.giantbomb.com/api/games',
            dataType: 'jsonp',
            cache: false,
            data: {
                api_key:  '7f4c7d2fa9de93b62e9d2cb05f83828d04119472',
                format: "jsonp",
                field_list:"name,id",
                offset: 0
            },
            jsonp: 'json_callback',
            beforeSend: function() {
                app.errorMsg.hide();
            },
            success: function(data) {
               //  app.questions.append(data.results[0].name);
               //j+=100;
               for(var i in data.results) {
                    //if(data.results[i].name === $('#search-field').val())
                    {
                        //console.log(data.results[i].name + " | | " + $('#search-field').val());
                        //console.log(data.results[i].name === $('#search-field').val());
                         app.questions.append('<li class="choices" style="list-style-type:none; display:inline-block" >' + data.results[i].name + '</li>' + ' // ');
                        console.log(data.results[i]);
                    }
                }
            },
            error: function() {
                console.log('error');
            }
        });
    };

    GBapp.prototype.findCharacters = function() {
        $.ajax({
            url: 'http://www.giantbomb.com/api/characters',
            dataType: 'jsonp',
            cache: false,
            data: {
                api_key: '7f4c7d2fa9de93b62e9d2cb05f83828d04119472',
                format: "jsonp",
                field_list:"name,first_appeared_in_game",
                offset: 0
            },
            jsonp: 'json_callback',
            beforeSend: function() {

            },
            success: function(data) {
                for(var i in data.results){
                    console.log(" - - " + data.results[i].name !== null);   
                    if(data.results[i].name !== null && data.results[i].first_appeared_in_game.name !== null) {
                       console.log(data.results[i].name + " " + data.results[i].first_appeared_in_game.name);   
                    }
                }
            },
            error: function() {

            }
        });
    };*/

    //start the app
    var app = new GBapp();

});