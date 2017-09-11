var Mustache = require('mustache');
var debounce = require('debounce');

(function($) {
  $.fn.extend({
    datoSearch: function(options) {
      this.defaultOptions = {
        highlight: '<em />',
        debounce: 200
      };
      var settings = $.extend({}, this.defaultOptions, options);

      function highlightMatches(string) {
        return string.replace(/\[h\](.+?)\[\/h\]/g, function(a, b) {
          return $(settings.highlight).text(b)[0].outerHTML;
        });
      }

      return this.each(function() {
        var lastAjaxRequest;
        var $this = $(this);
        var template = $this.siblings('script[type=x-tmpl-mustache]').html();
        Mustache.parse(template);

        var $container = $('<div />')
          .addClass('datocms-results')
          .insertAfter($this);

        $this.on('keyup', debounce(function() {
          var query = $this.val();

          if (lastAjaxRequest) {
            lastAjaxRequest.abort();
          }

          lastAjaxRequest = $.ajax({
            url: "https://site-api.datocms.com/search-results",
            headers: { 'X-Site-Domain': settings.adminDomain },
            data: { q: query },
            dataType: "json"
          })
          .done(function(response) {
            var results = $.map(response.data, function(page) {
              var highlight = page.attributes.highlight;
              return {
                title: page.attributes.title,
                url: page.attributes.url,
                body: highlight.body ?
                  ("..." + highlight.body.map(highlightMatches).join("...") + "...") :
                  ''
              };
            });

            var result = Mustache.render(
              template,
              { results: results, query: query }
            );

            $container.html(result);
          })
          .fail(function(e) {
            console.log("error", e);
          })
          .always(function() {
            console.log("complete");
          });
        }, settings.debounce));
      });
    }
  });
}(jQuery));
