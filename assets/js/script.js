$( document ).ready(function() {
                // For Debugging
                // $('#index').fadeOut();
                $("#about_scroll").fadeOut()
                $("#inspire_scroll").fadeOut();  ;   
                $("#reseach_scroll").fadeOut();
                $("#projects_scroll").fadeOut();
                $("#patent_scroll").fadeOut();

                $("#about").click(function(){
                    $("#index").fadeOut();
                    $("#about_scroll").fadeIn();
                    $('#about_left').addClass('animated slideInLeft');
                    $('#about_right').addClass('animated slideInRight');
                    $("#inspire_scroll").fadeIn();
                    $('#inspire_left').addClass('animated slideInLeft');
                    $('#inspire_right').addClass('animated slideInRight');

                    });
                $("#reseach").click(function(){
                    $("#index").fadeOut();
                    $("#reseach_scroll").fadeIn();
                    $('#reseach_left').addClass('animated slideInLeft');
                    $('#reseach_right').addClass('animated slideInRight');
                    $("#patent_scroll").fadeIn();
                    $('#patent_left').addClass('animated slideInLeft');
                    $('#patent_right').addClass('animated slideInRight');
                    });
                $("#projects").click(function(){
                    $("#index").fadeOut();
                    $("#projects_scroll").fadeIn();
                    $('#projects_left').addClass('animated slideInLeft');
                    $('#projects_right').addClass('animated slideInRight');
                    });
                
                $(".back").click(function(){
                    $(".pages").fadeOut();
                    $("#index").fadeIn();
                    $('#index_left').addClass('animated slideInLeft');
                    $('#index_right').addClass('animated slideInRight');
                    });
           
		});