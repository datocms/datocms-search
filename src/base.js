var nanoajax = require('nanoajax');
var objectAssign = require('object-assign');
var Promise = typeof window !== 'undefined' ?
  (window.Promise || require('promise-polyfill')) :
  require('promise-polyfill');

import LocalizedStrings from 'localized-strings';
import strings from './localization';

function highlightMatches(highlight, string) {
  return string.replace(/\[h\](.+?)\[\/h\]/g, function(a, b) {
    var div = document.createElement('div');
    div.innerHTML = highlight;
    div.children[0].innerText = b;
    return div.children[0].outerHTML;
  });
}

function DatoCmsSearch(apiToken, environment = "production") {
  this.apiToken = apiToken;
  this.environment = environment;
}

DatoCmsSearch.prototype = {
  search: function(query, options) {
    options = Object.assign(
      {
        highlightWith: '<strong class="highlight"></strong>',
        locale: null,
      },
      options
    );

    var url = 'https://site-api.datocms.com/search-results?';
    url += 'q=' + encodeURIComponent(query);
    url += '&environment=' + encodeURIComponent(this.environment);

    if (options.locale) {
      url += '&locale=' + encodeURIComponent(options.locale);
    }

    if (options.offset) {
      url += '&offset=' + encodeURIComponent(options.offset);
    }

    if (options.limit) {
      url += '&limit=' + encodeURIComponent(options.limit);
    }

    var ajaxOptions = {
      url: url,
      headers: {
        'Authorization': 'API-Token ' + this.apiToken,
        'Accept': 'application/json',
      },
    };

    var highlighter = highlightMatches.bind(null, options.highlightWith);

    return new Promise(function(resolve, reject) {
      nanoajax.ajax(ajaxOptions, function(code, responseText) {
        if (code === 401) {
          reject(new Error(strings.invalid_token));
          return;
        }

        var response = JSON.parse(responseText);

        var results = response.data.map(function(result) {
          var highlight = result.attributes.highlight;

          return {
            url: result.attributes.url,

            title: (
              highlight.title ?
                highlighter(highlight.title[0]) :
                result.attributes.title
            ),

            body: (
              highlight.body ?
                (
                  "..." +
                  highlight.body.map(function(text) {
                    return highlighter(text.trim());
                  }).join("...") +
                  "..."
                ) :
                result.attributes.body_excerpt
            ),

            raw: {
              title: result.attributes.title,
              body: result.attributes.body_excerpt
            }
          };
        });

        resolve({ results: results, total: response.meta.total_count });
      });
    });
  }
};

module.exports = DatoCmsSearch;
