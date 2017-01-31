var homepage = require('../config/urls.json').homepage;

casper.test.begin('Should open the search box', 2, function(test) {
  casper.start(homepage, function() {
    test.assertNotVisible('#header_search_mhp', 'Search box should not be visible');
    this.click('.top_search_btn a');

    this.waitUntilVisible('#header_search_mhp', function() {
      test.assertVisible('#frmSearch', 'Search box should be visible');
    });
  }).run(function() {
    test.done();
  });
});

casper.test.begin('Should open the search box and then close it', 2, function(test) {
  casper.start(homepage, function() {
    this.click('.top_search_btn a');

    this.waitUntilVisible('#header_search_mhp', function() {
      test.assertVisible('#frmSearch', 'Search box should be visible');
    });
  })
  .then(function() {
    this.click('.top_search_btn a');

    this.waitWhileVisible('#header_search_mhp', function() {
      test.assertNotVisible('#frmSearch', 'Search box should not be visible');
    });
  })
  .run(function() {
    test.done();
  });
});

// TODO: Need url to ajax request or needs to be mocked out
//casper.test.begin('Should trigger search autocomplete', 0, function() {
//  casper.start(homepage, function() {
//  })
//  .run(function() {
//    test.done();
//  });
//});

casper.test.begin('Should open the search box, type in some keywords, and then clear the search box', 2, function(test) {
  var term = 'the dude abides';
  casper.start(homepage, function() {
    this.click('.top_search_btn a');
    this.waitUntilVisible('#header_search_mhp');
  })
  .then(function() {
    this.sendKeys('#search_term', term);
    test.assertField('search', term, 'Search box contains ' + term);
    this.click('.mobile_search_btn_mhp:not([value])');
    test.assertField('search', '', "Search box is empty");
  })
  .run(function() {
    test.done();
  });
});

casper.test.begin('Should perform a search', 1, function(test) {
  var term = 'clothing';
  casper.start(homepage, function() {
    this.click('.top_search_btn a');
    this.waitUntilVisible('#header_search_mhp');
  })
  .then(function() {
    this.fill('#frmSearch', {
      search: term
    }, true);
  })
  .then(function() {
    test.assertUrlMatch(/\/r\/mobile\/SearchResult\.jsp\?search\=clothing$/, 'Performed search on ' + term);
  })
  .run(function() {
    test.done();
  });
});
