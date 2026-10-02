(function () {
  "use strict";

  var Theme = {};

  Theme.backToTop = {
    register: function () {
      var $backToTop = $('#back-to-top');

      $(window).scroll(function () {
        if($(window).scrollTop() > 100) {
          $backToTop.fadeIn(1000);
        } else {
          $backToTop.fadeOut(1000);
        }
      });

      $backToTop.click(function () {
        $('body,html').animate({ scrollTop: 0 });
      });
    }
  };

  Theme.fancybox = {
    register: function () {
      if ($.fancybox){
        $('.post').each(function () {
          $(this).find('img').each(function () {
            $(this).wrap('<a class="fancybox" href="' + this.src + '" title="' + this.alt + '"></a>')
          });
        });

        $('.fancybox').fancybox({
          openEffect	: 'elastic',
          closeEffect	: 'elastic'
        });
      }
    }
  };

  Theme.codeTabs = {
    register: function () {
      $('.code-tabs').each(function () {
        var $figures = $(this).children('.highlight');
        var $nav = $('<div class="code-tabs-nav" role="tablist"></div>');

        $figures.each(function (index) {
          // Reuse the language label the stylesheet draws on every code block (see $code-type-list),
          // reading it before .is-ready hides that label
          var label = window.getComputedStyle($(this).children('table')[0], '::after').content;

          $('<button type="button" role="tab"></button>')
            .text(label.replace(/^"|"$/g, ''))
            .click(function () {
              $(this).addClass('is-active').attr('aria-selected', true)
                .siblings().removeClass('is-active').attr('aria-selected', false);
              $figures.hide().eq(index).show();
            })
            .appendTo($nav);
        });

        $(this).addClass('is-ready').prepend($nav);
        $nav.children().first().click();
      });
    }
  };

  this.Theme = Theme;
}.call(this));
