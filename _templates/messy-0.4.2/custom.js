window.addEvent('domready', function() {
    var body = $$('body');
    var navigation = $$('.navigation');
    var bertaCopyright = $('bertaCopyright');
    var additionalText = $('additionalText');
    var covers = $$('.covers');
    var first_cover = covers ? covers.getFirst() : null;
    var homeCover = $$('.xContent-home .xCoverId-1');
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

    if (first_cover) {
    /*
     var scroll_down = Elements.from('<a href="#" class="scroll_down">See features<span class="icon-scroll"></span></a>');
     scroll_down.inject(first_cover[0]);

     var videoEmbed = Elements.from('<div class="videoWrap"><iframe src="//player.vimeo.com/video/109796698?title=0&amp;byline=0&amp;portrait=0" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
     var videoEmbedContainer = first_cover.getElement('.slide');

     videoEmbed.inject(videoEmbedContainer[0]);

     scroll_down.addEvent('click', function(e){
      e.preventDefault();

      var container = $('contentContainer');
      var pos = container.getCoordinates();
      var gap_navigation = navigation.getSize();
      var gap_container = parseInt(container.getStyle('margin-top'));
      var gap = gap_navigation[0].y + gap_container;

      new Fx.Scroll(window).start(0, pos.top - gap);
     });
    */
    }

    var fixHomeCoverContents = function(){

      var windowWidth = window.getSize().x;
      var coverGalleryWidthPercent = null;
      var coverGalleryLeftPercent = null;

      var homeCoverHeight = homeCover[0].getSize().y;
      var contentContainerHeight = contentContainer[0].getSize().y;
      var spaceAvailable = homeCoverHeight - contentContainerHeight;

      var coverGalleryHeight = spaceAvailable;
      var coverGalleryWidth = parseInt(coverGalleryHeight / .5625);

      if (coverGalleryWidth > windowWidth) {
        coverGalleryWidth = windowWidth - 10;
        coverGalleryHeight = parseInt(coverGalleryWidth * .5625);
      }

      coverGalleryWidthPercent = parseInt(coverGalleryWidth * 100 / windowWidth) + '%';

      coverGalleryLeftPercent = parseInt((100 - parseInt(coverGalleryWidthPercent)) / 2) + '%';

      coverGallery.setStyle('width', coverGalleryWidthPercent)  ;
      coverGallery.setStyle('left', coverGalleryLeftPercent);
      coverGallery.setStyle('height', coverGalleryHeight+'px');
    }

    if (homeCover){
      var coverGallery = homeCover.getElement('.coverGallery');
      var contentContainer = homeCover.getElement('.contentContainer');

      // fixHomeCoverContents();
      // window.addEvents({
      //   'resize': fixHomeCoverContents
      // });
    }

});
