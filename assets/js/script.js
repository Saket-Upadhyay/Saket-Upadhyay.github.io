$( document ).ready(function() {

    // FOR ANIMATION OF MAIN WEBSITE PANELS


                // For Debugging
                // $('#index').fadeOut();
                $("#about_scroll").fadeOut()
                $("#inspire_scroll").fadeOut();  ;   
                $("#reseach_scroll").fadeOut();
                $("#projects_scroll").fadeOut();
                $("#patent_scroll").fadeOut();
                $("#scicomm_scroll").fadeOut();
                $("#talksandpresentations_scroll").fadeOut();

                $("#about").click(function(){
                    $("#index").fadeOut();
                    $("#about_scroll").fadeIn();
                    $('#about_left').addClass('animated slideInLeft');
                    $('#about_right').addClass('animated slideInRight');
                    // $("#inspire_scroll").fadeIn();
                    // $('#inspire_left').addClass('animated slideInLeft');
                    // $('#inspire_right').addClass('animated slideInRight');

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

                $("#scicomm").click(function(){
                    $("#index").fadeOut();
                    $("#scicomm_scroll").fadeIn();
                    $('#scicomm_left').addClass('animated slideInLeft');
                    $('#scicomm_right').addClass('animated slideInRight');
                });
            
                $("#talksandpresentations").click(function(){
                    $("#scicomm_scroll").fadeOut();
                    $("#talksandpresentations_scroll").fadeIn();
                    $('#talksandpresentations_left').addClass('animated slideInLeft');
                    $('#talksandpresentations_right').addClass('animated slideInRight');
                });
                


                $(".back").click(function(){
                    $(".pages").fadeOut();
                    $("#index").fadeIn();
                    $('#index_left').addClass('animated slideInLeft');
                    $('#index_right').addClass('animated slideInRight');
                    });

                $(".backfromtalk").click(function(){
                        $(".pages").fadeOut();
                        $("#scicomm_scroll").fadeIn();
                        $('#scicomm_left').addClass('animated slideInLeft');
                        $('#scicomm_right').addClass('animated slideInRight');
                        });


        // OTHER LINKS I WANT TO OPEN IN NEW TABS
        $("#bloglink").click(function(){
            window.open("http://saket-upadhyay.github.io/blog", "_blank");
        });

        $("#mediumlink").click(function(){
            window.open("https://saketupadhyay.medium.com/", "_blank");
        });

        $("#simonyt").click(function(){
            window.open("https://www.youtube.com/c/SimonOxfPhys", "_blank");
        });


        $("#hstwitter").click(function(){
            window.open("https://twitter.com/sydonahi", "_blank");
        });
        
        $("#hsweb").click(function(){
            window.open("https://www.hfstevance.com/graphics", "_blank");
        });

        $("#itcsyt").click(function(){
            window.open("https://www.youtube.com/watch?v=-uasGLC0m04", "_blank");
        });

        $("#itcsgit").click(function(){
            window.open("https://github.com/Saket-Upadhyay/Talks_and_Presentation/tree/master/2021/Introduction_to_Cybersecurity_(DSC)", "_blank");
        });


        $("#malhuntgit").click(function(){
            window.open("https://github.com/Saket-Upadhyay/Talks_and_Presentation/tree/master/2020/PennStateTechClub_(PSWCTC)", "_blank");
        });


        $("#malhuntyt").click(function(){
            window.open("https://www.youtube.com/watch?v=1FqDsTxrIdg", "_blank");
        });

        $("#fireflyyt").click(function(){
            window.open("https://youtu.be/5nwDzJLSCTo?t=15628", "_blank");
        });
        $("#fireflygit").click(function(){
            window.open("https://github.com/Saket-Upadhyay/firefly-ids", "_blank");
        });

        

        $("#shellyt").click(function(){
            window.open("https://youtu.be/4PMW_huHuqo?t=291", "_blank");
        });

		});