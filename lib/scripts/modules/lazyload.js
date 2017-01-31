var $ = require('jquery');
var defaults = require('lodash/defaults');
var assign = require('lodash/assign');
var slideshows = $('.js-lazyload-slick');
var defaultSettings = {slideshowSettings: {}};
var offsetLoadY = 100;
require('slick-carousel');

module.exports = init;
defaults(module.exports, {});

function init(userSettings) {
    var settings = assign({}, defaultSettings, userSettings);
    
    slideshows.attr('lazyTriggered', false);
    $(window).on('scroll resize', function() {
        checkScroll(settings);
    }).scroll();
}

function checkScroll(settings) {
    var $window = $(this);

    slideshows.each(function(){
        var $slideshow = $(this);
        
        if($slideshow.attr('lazyTriggered') === 'false') {
            var y = $slideshow.offset().top;
            var visibleY = $window.scrollTop() + $window.innerHeight();
            if(y < visibleY + offsetLoadY) {
                $slideshow.removeClass('js-lazyload-slick');
                $slideshow.slick(settings.slideshowSettings);
                $slideshow.attr('lazyTriggered', true);
            }
        } 
    });
}
