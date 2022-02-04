$( document ).ready(function() {

    // FOR ANIMATION OF MAIN WEBSITE PANELS


                // For Debugging
                // // $('#index').fadeOut();
                // $("#hiddenpanel").fadeOut();
                // $("#about_scroll").fadeOut();
                // $("#inspire_scroll").fadeOut();    
                // $("#reseach_scroll").fadeOut();
                // $("#projects_scroll").fadeOut();
                // $("#patent_scroll").fadeOut();
                // $("#scicomm_scroll").fadeOut();
                // $("#talksandpresentations_scroll").fadeOut();
                processParameters(location.search);

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

        $("#mytwitter").click(function(){
            window.open("https://twitter.com/saketofcyber", "_blank");
        });

        $("#mygithub").click(function(){
            window.open("https://github.com/Saket-Upadhyay", "_blank");
        });

        $("#mylinkedin").click(function(){
            window.open("https://www.linkedin.com/in/saketupadhyay/", "_blank");
        });

        $("#myfb").click(function(){
            window.open("https://www.facebook.com/x64mayhem", "_blank");
        });

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

        $("#sharingaaninfo").click(function(){
            window.open("https://naruto.fandom.com/wiki/Sharingan","_blank");
        });
        $("#publickkey").click(function(){
            window.open("./pubkey.html","_blank");
        });

		});

function HiddenFunction(){
window.alert("Hi! (⌐■_■)"+
"\r\n"
+
"If you are browsing the source code, you might be interested in it's github repo!"
+
"\r\n"
+
"You can go to https://github.com/Saket-Upadhyay/Saket-Upadhyay.github.io to see the source code and LICENSE stuff."
+
"\r\n"
+
"\r\n"
+
"If you have any suggestions please feel free to contact me at saketsec[at]icloud[dot]com"
+
"\r\n"
+
"\r\n"
+
"I am not a full time webdev. ofc, but I can code enough to make this haha xD"
+
"\r\n"
+
"\r\n"
+
"PSSSSS... have you checked \"/bonus.html\" ? ;)")
}

function processParameters(url) {
    // if(!url) url = location.search;
    var query = url.substr(1);
    var result = {};
    query.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });

    if (result['show'] == 'publications'){
                        $('#index').fadeOut();
                        $("#about_scroll").fadeOut();
                        $("#inspire_scroll").fadeOut();  
                        $("#reseach_scroll").fadeIn();
                        $("#projects_scroll").fadeOut();
                        $("#hiddenpanel").fadeOut();
                        $("#patent_scroll").fadeIn();
                        $("#scicomm_scroll").fadeOut();
                        $("#talksandpresentations_scroll").fadeOut();
    }
    else if(result['show'] == 'projects')
    {
        $('#index').fadeOut();
        $("#about_scroll").fadeOut();
        $("#inspire_scroll").fadeOut();   
        $("#reseach_scroll").fadeOut();
        $("#projects_scroll").fadeIn();
        $("#hiddenpanel").fadeOut();
        $("#patent_scroll").fadeOut();
        $("#scicomm_scroll").fadeOut();
        $("#talksandpresentations_scroll").fadeOut();
    }
    else if(result['show'] == 'talks')
    {
        $('#index').fadeOut();
        $("#about_scroll").fadeOut();
        $("#inspire_scroll").fadeOut(); 
        $("#reseach_scroll").fadeOut();
        $("#projects_scroll").fadeOut();
        $("#hiddenpanel").fadeOut();
        $("#patent_scroll").fadeOut();
        $("#scicomm_scroll").fadeOut();
        $("#talksandpresentations_scroll").fadeIn();
    }
    else if(result['show'] == 'about')
    {
        $('#index').fadeOut();
        $("#about_scroll").fadeIn();
        $("#inspire_scroll").fadeOut(); 
        $("#reseach_scroll").fadeOut();
        $("#projects_scroll").fadeOut();
        $("#hiddenpanel").fadeOut();
        $("#patent_scroll").fadeOut();
        $("#scicomm_scroll").fadeOut();
        $("#talksandpresentations_scroll").fadeOut();
    }
    else if(result['show'] == 'aboutinspire')
    {
        $('#index').fadeOut();
        $("#about_scroll").fadeIn();
        $("#inspire_scroll").fadeIn(); 
        $("#reseach_scroll").fadeOut();
        $("#projects_scroll").fadeOut();
        $("#hiddenpanel").fadeOut();
        $("#patent_scroll").fadeOut();
        $("#scicomm_scroll").fadeOut();
        $("#talksandpresentations_scroll").fadeOut();
    }
    else if(result['show'] == 'hiddenpanel')
    {
        HiddenFunction();
    }
    else if(result['show'] == 'scicomm')
    {
        $('#index').fadeOut();
        $("#about_scroll").fadeOut();
        $("#inspire_scroll").fadeOut(); 
        $("#reseach_scroll").fadeOut();
        $("#projects_scroll").fadeOut();
        $("#hiddenpanel").fadeOut();
        $("#patent_scroll").fadeOut();
        $("#scicomm_scroll").fadeIn();
        $("#talksandpresentations_scroll").fadeOut();
    }
    else if(result['show'] == 'publickey')
    {
        window.location.replace("https://saket-upadhyay.github.io/pubkey.html");
    }
    else{
        $('#index').fadeIn();
        $("#hiddenpanel").fadeOut();
        $("#about_scroll").fadeOut();
        $("#inspire_scroll").fadeOut();    
        $("#reseach_scroll").fadeOut();
        $("#projects_scroll").fadeOut();
        $("#patent_scroll").fadeOut();
        $("#scicomm_scroll").fadeOut();
        $("#talksandpresentations_scroll").fadeOut();
    }
  }
