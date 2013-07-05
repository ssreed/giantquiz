$(function(){

    /**
     * Main application
     */
    function GBapp() {
        var app = this;
        app.api_key = '7f4c7d2fa9de93b62e9d2cb05f83828d04119472';
        console.log('App initialized!' + app);
        app.user_input = $('#search-field').val();
        app.user_search = $('#search-field');
        app.submit = $('#submitBtn');
        app.game_form = $('#game-search form');
        app.randomNum = 0;
       

        app.game_form.on('submit', function(e){
            e.preventDefault();
            $('#questions').html('');
            app.submit.removeClass('hidden');
            app.find();
            app.addQuestions();
        });

        //console.log($('#results'));

    }

    /**
     * Add question and choices
     */
    GBapp.prototype.addQuestions = function() {
            $('#questions').append('<p> In which game did he/she make their first appearance?</p> <br>'); 
            var q = ["Metal Gear Solid", "God Of War", "Super Smash Brothers", "Madden", "Ninja Gaiden"];
                      
            for(var i in q)
            {
                app.randomNum = Math.floor(q.length * Math.random());
                //console.log(app.randomNum);
                //console.log(q[app.randomNum]);
                //console.log($("input:radio").val());
                //console.log($("input:radio").val() !== q[app.randomNum]);
                if($("input:radio").val() !== q[app.randomNum])
                {
                    $('#questions').append("<input type='radio' name='choice' value='" + q[app.randomNum] + "'/>" + q[app.randomNum] + "<br />");
                }
            }
            //console.log($('#questions input:checked').val());
            
            
            $('input:button').on('click', function(e) {
                e.stopPropagation();
                alert('hello');
            });
    };

    /**
     * Retreive a list of games based on name.
     */
    GBapp.prototype.find = function() {
        $.ajax({
            url: 'http://www.giantbomb.com/api/search',
            dataType: 'jsonp',
            cache: false,
            data: {
                    api_key: app.api_key,
                    query: $('#search-field').val(),
                    resources : "character",
                    format : "jsonp"
            },
            jsonp: 'json_callback',
            beforeSend: function() {
                $('#error').hide();
            },
            success: function(data) {
                $('#error').hide();
                //app.submit.show();
                console.log(data);
                var i;
                // var datas = $('#results');
                // datas.html('');
                // for (i in data['results']) {
                //     datas.append('<div>' + '<img src="' + data['results'][i]['image']['icon_url'] + '">' + ' is: <p>' + data['results'][i]['resource_type'] + '</p></div><br />');
                // }
                for(i in data.results)
                { 
                    //console.log($('#search-field').val().toLowerCase());
                    console.log(data['results'][i].name);
                    
                    if($('#search-field').val().toLowerCase() === data['results'][i].name.toLowerCase())
                    {
                         $('#results').append('<img src=' + data['results'][i].image.medium_url + '>');
                         $('#questions').append("<input type='radio' name='choice' value='" + data['results'][i].first_appeared_in_game.name + "'/>" +data['results'][i].first_appeared_in_game.name + "<br />");
                         break;
                    }

                    
                    //$('#questions').append(data['results'][i].first_appeared_in_game.name);

                }
                //$('#questions').append('');
            },
            error: function() {
                $('#error').show();
                console.log(app.user_input);
                console.log(app.api_key);
                console.log(this);
            }
        });
    };

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
                $('#error').hide();
            },
            success: function(data) {
               // $('#questions').append(data.results[0].name);
               //j+=100;
               for(var i in data.results) {
                    //if(data.results[i].name === $('#search-field').val())
                    {
                        //console.log(data.results[i].name + " | | " + $('#search-field').val());
                        //console.log(data.results[i].name === $('#search-field').val());
                        $('#questions').append('<li class="choices" style="list-style-type:none; display:inline-block" >' + data.results[i].name + '</li>' + ' // ');
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
    };

    //start the app
    var app = new GBapp();

});