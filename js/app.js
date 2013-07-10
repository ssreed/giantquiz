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
        app.errorMsg = $('#error');
        app.questions = $('#questions');
        app.randomNum = 0;
        app.results = $('#results');
        //app.userAnswer = $('input:radio:checked');
        app.correctAnswer = "";
        app.questionsArray = [];
        app.resetButton = $('#resetBtn');
        //app.submit.hide();

        app.gameForm.on('submit', function(e){
            e.preventDefault();
            app.reset();
            if(app.userSearch.val() !== "")
            {
                app.find();
                //app.submit.removeClass('hidden');
            }
        });

        app.submit.on('click' , function(e)
        {
            e.preventDefault();
            console.log($('.choice:checked').val());
            if($('input:radio:checked').val() === app.correctAnswer)
            {
                // app.questions.hide();
                // $('#search-results').hide();
                app.reset();
                console.log('nice');
            }
            else
            {
                alert('please try again!');
            }

        });

        app.resetButton.on('click',function(e){
            e.preventDefault();
            app.reset();
            app.userSearch.val('');
        });
    }

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
            app.questionsArray = ["Metal Gear Solid", "God of War", "Super Smash Brothers", "Madden", "Ninja Gaiden"];
            console.log(app.questionsArray);
            
            var i,
                j,
                prev,
                shuffledArray;

            for(i in data.results) {  
                //console.log(data['results'][i].name);
                if(app.userSearch.val().toLowerCase() === data['results'][i].name.toLowerCase()) {
                     app.correctAnswer =  data['results'][i].first_appeared_in_game.name;
                     $('#results').append('<img src=' + data['results'][i].image.medium_url + '>');
                     //app.questions.append("<input type='radio' name='choice' value='" + app.correctAnswer + "'/>" + app.correctAnswer + "<br />");                    
                     break;
                }
            }

            if(app.correctAnswer !== "") {
                app.questionsArray.push(app.correctAnswer);
                shuffledArray = app.shuffle(app.questionsArray);
                console.log(shuffledArray);

                for(j in shuffledArray) {
                    prev = j-1;
                    console.log($(".choice").eq(prev).val() + " vs " + shuffledArray[j]);
                    if($(".choice").eq(prev).val() !== shuffledArray[j]) {
                        app.questions.append("<input type='radio' name='games' class='choice' value='" + shuffledArray[j] + "'/>" + shuffledArray[j] + "<br />");

                    }
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

    //start the app
    var app = new GBapp();

});