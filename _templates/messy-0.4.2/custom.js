window.addEvent('domready', function() {
    var body = $$('body');
    var navigation = $$('.navigation');
    var bertaCopyright = $('bertaCopyright');
    var additionalText = $('additionalText');
    var start_trial_button = $$('.xSection-free-trial a, .start_trial');
    var start_trial_basic = $$('.start_trial_basic');
    var start_trial_pro = $$('.start_trial_pro');
    var start_trial_shop = $$('.start_trial_shop');
    var log_in_button = $$('.xSection-log-in a');

    start_trial_button.addEvent('click', function(){
      ga('send', 'event', 'berta', 'Start trial button clicked');
    });

    start_trial_basic.addEvent('click', function(){
      ga('send', 'event', 'berta', 'Start Basic button clicked');
    });

    start_trial_pro.addEvent('click', function(){
      ga('send', 'event', 'berta', 'Start Pro button clicked');
    });

    start_trial_shop.addEvent('click', function(){
      ga('send', 'event', 'berta', 'Start Shop button clicked');
    });

    log_in_button.addEvent('click', function(){
      ga('send', 'event', 'berta', 'Login button clicked');
    });

    bertaCopyright.set('html', '');
    additionalText.inject(bertaCopyright);

    if (navigation) {
        if (body[0].hasClass('xContent-home')) {
            var trial_button = navigation.getElement('.xSection-free-trial');
            if (trial_button) {
                trial_button.dispose();
            }
        }
    }

});
