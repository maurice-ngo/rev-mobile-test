var chai = require('chai');
var cookie = require('js-cookie');
var clearSearchCookies = require('entry-points/chrome/header/clear-search-cookies');
var $ = require('jquery');
var expect = chai.expect;

describe('Clear Search Cookies', function() {
  beforeEach(function() {
    fixture.set('<a id="clear-me" href="#clear-me">Clear Me</div>');
  });

  function fillCookies() {
    clearSearchCookies.COOKIE_NAMES.forEach(function(name) {
      cookie.set(name, 'dude');
    });
  }

  function assertCookiesExist() {
    clearSearchCookies.COOKIE_NAMES.forEach(function(name) {
      expect(cookie.get(name)).to.exist;
    });
  }

  function assertCookiesEmpty() {
    clearSearchCookies.COOKIE_NAMES.forEach(function(name) {
      expect(cookie.get(name)).to.be.empty;
    });
  }

  it('should clear all the search related cookies', function() {
    fillCookies();
    assertCookiesExist();
    clearSearchCookies('#clear-me');
    $('#clear-me').trigger('click');
    assertCookiesEmpty();
  });
});
