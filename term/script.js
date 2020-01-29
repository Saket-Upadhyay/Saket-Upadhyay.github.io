$(function() {
  var data = [

  { 
    action: 'type',
    strings: ["whoami^400"],
    output: '<br><span class="white"><strong class="red">x64</strong><strong>Mayhem</strong></span><br>&nbsp;',
    postDelay: 1000
  },
  { 
    action: 'type',
    strings: ["cd ./info_files^400"],
    output: ' ',
    postDelay: 1000
  },
  { 
    action: 'type',
    //clear: true,
    strings: ['cat ./short_info.txt^400'],
    output: $('.mimik-run-output').html()
  },
  { 
    action: 'type',
    strings: ["./contact_link.sh","chmod +x 764 ./contact_link.sh"],
    output:' ',
    postDelay: 1000
  },
  { 
    action: 'type',
    strings: ["./contact_link.sh"],
    output: $('.script-run-data').html(),
    postDelay: 1000
  }

  
];
  runScripts(data, 0);
});

function runScripts(data, pos) {
    var prompt = $('.prompt'),
        script = data[pos];
    if(script.clear === true) {
      $('.history').html(''); 
    }
    switch(script.action) {
        case 'type':
          // cleanup for next execution
          prompt.removeData();
          $('.typed-cursor').text('');
          prompt.typed({
            strings: script.strings,
            typeSpeed: 40,
            callback: function() {
              var history = $('.history').html();
              history = history ? [history] : [];
              history.push('$ ' + prompt.text());
              if(script.output) {
                history.push(script.output);
                prompt.html('');
                $('.history').html(history.join('<br>'));
              }
              // scroll to bottom of screen
              $('section.terminal').scrollTop($('section.terminal').height());
              // Run next script
              pos++;
              if(pos < data.length) {
                setTimeout(function() {
                  runScripts(data, pos);
                }, script.postDelay || 1000);
              }
            }
          });
          break;
        case 'view':

          break;
    }
}
