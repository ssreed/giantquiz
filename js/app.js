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
        app.submit = $('#submit-button');
        app.game_form = $('#game-search form');


        app.game_form.on('submit', function(e){
            e.preventDefault();
            app.find();
            $('#questions').html('');
            $('#questions').append('<h1> Who is the main character of this game? </h1> <br>');
            app.findData();
        });

        $(document).ajaxComplete(function(){
            if($('.choices').length !== 0)
                $('.choices').css('text-decoration', 'none');
        });

        // app.submit.on('click', function(e){
        //     e.preventDefault();
        //     app.find();
        // });

        console.log($('#results'));

        // app.user_search.keypress(function(e){
        //     if(e.which === 13) {
        //         e.preventDefault();
        //         app.find();
        //     }
        // });

        // app.submit.on('click', function(e){
        //     e.preventDefault();
        //     console.log(app.submit);
        //     app.find();
        // });

        // app.game_form.submit(function(){
        //     app.find();
        // });
        //app.find();

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
                    resources : "game",
                    format : "jsonp"
            },
            jsonp: 'json_callback',
            beforeSend: function() {
                $('#error').hide();
            },
            success: function(data) {
                $('#error').hide();
                console.log(data);
                // var i;
                // var datas = $('#results');
                // datas.html('');
                // for (i in data['results']) {
                //     datas.append('<div>' + '<img src="' + data['results'][i]['image']['icon_url'] + '">' + ' is: <p>' + data['results'][i]['resource_type'] + '</p></div><br />');
                // }
                $('#results').append('<img src=' + data['results'][0].image.medium_url + '>');             
                //$('#questions ul').append('<p>hello</p>');
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
    GBapp.prototype.findData = function() {
        $.ajax({
            url: 'http://www.giantbomb.com/api/search',
            dataType: 'jsonp',
            cache: false,
            data: {
                api_key:  '7f4c7d2fa9de93b62e9d2cb05f83828d04119472',
                query: "kratos",
                resources: "character",
                format: "jsonp",
                field_list:"first_appeared_in,name,image"
            },
            jsonp: 'json_callback',
            beforeSend: function() {
                $('#error').hide();
            },
            success: function(data) {
                //$('#questions').append(data.results[0].name);
                //$('#questions').append('<li  class="choices" style="clear:both;margin-bottom:0;text-decoration:none;" >Master</li>' +
                //                        '<li class="choices" style="clear:both;margin-bottom:0;text-decoration:none;" >' + data.results[0].name + '</li>' +
                //                        '<li class="choices" style="clear:both;margin-bottom:0;text-decoration:none;" >Balrog</li>');
            },
            error: function() {
            
            }
        });
    };

    //start the app
    var app = new GBapp();

});