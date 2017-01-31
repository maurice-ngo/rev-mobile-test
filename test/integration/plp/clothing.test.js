var url  = require('../config/urls.json').clothingPLP;

casper.test.begin('Should open the filters list', 2, function(test) {
  casper.start(url, function() {
    test.assertNotVisible('#plp_filter_dd', 'Filters should not be visible');
    this.click('#plpheader_dropdown h1');

    this.waitUntilVisible('#plp_filter_dd', function() {
      test.assertVisible('#plp_filter_dd ul', 'Filters should be visible');
    });
  }).run(function() {
    test.done();
  });
});

casper.test.begin('Should open the filters list and select Activewear', 1, function(test) {
  casper.start(url, function() {
    this.click('#plpheader_dropdown h1');

    this.waitUntilVisible('#plp_filter_dd');
  })
  .then(function() {
    this.evaluate(function() {
      $('#plp_filter_dd li:first-child a:contains("Activewear")').click();
    });
  })
  .then(function() {
    test.assertUrlMatch(new RegExp(/clothing-activewear/), 'Next page should hit the clothing activewear page');
  })
  .run(function() {
    test.done();
  });
});

casper.test.begin('Should open sort by options', 2, function(test) {
  casper.start(url, function() {
    test.assertNotVisible('#sort_options', 'Sort options should not be visible');
    this.click('.plp_filter_refine a:first-child');

    this.waitUntilVisible('#sort_options', function() {
      test.assertVisible('#sortby', 'Sort options should be visible');
    });
  }).run(function() {
    test.done();
  });
});

casper.test.begin('Should open sort by options and then close it', 1, function(test) {
  casper.start(url, function() {
    this.click('.plp_filter_refine a:first-child');
    this.waitUntilVisible('#sort_options');
  })
  .then(function() {
    this.click('.plp_filter_refine a:first-child');
    this.waitWhileVisible('#sort_options', function() {
      test.assertNotVisible('#sort_options', 'Sort options should not be visible');
    });
  })
  .run(function() {
    test.done();
  });
});

casper.test.begin('Should open sort options and select news', 1, function(test) {
  casper.start(url, function() {
    this.click('.plp_filter_refine a:first-child');
    this.waitUntilVisible('#sort_options');
  })
  .then(function() {
    this.evaluate(function() {
      $('#sortby').val('newest').change();
    });
  })
  .then(function() {
    test.assertUrlMatch(new RegExp(/sortBy=newest/), 'Next page should contain results sorted by newest');
  })
  .run(function() {
    test.done();
  });
});

casper.test.begin('Should open refine options', 1, function(test) {
  casper.start(url, function() {
      this.click('.plp_filter_refine a:last-child');
      this.waitUntilVisible('#filter_options');
    })
    .then(function() {
      test.assertVisible('#filter_options', 'Refine options should not be visible');
    })
    .run(function() {
      test.done();
    });
});

casper.test.begin('Should select one of each refine options and go to the next page', 1, function(test) {
  casper.start(url, function() {
      this.click('.plp_filter_refine a:last-child');
      this.waitUntilVisible('#filter_options');
    })
    .then(function() {
      this.evaluate(function() {
        $('#alldesigners').val('Juicy Couture').change();
        $('#allsizes').val('M').change();
        $('#allcolors').val('green').change();
      });

      this.click('#apply_filters');
    })
    .then(function() {
      test.assertUrlMatch(new RegExp(/designer=Juicy Couture&size=M&color=green/), 'Should select Juicy Couture, size Medium, and Green color');
    })
    .run(function() {
      test.done();
    });
});

casper.test.begin('Should select one of each refine options, select clear,' +
  ' and all options have been deselected', 3, function(test) {
  casper.start(url, function() {
      this.click('.plp_filter_refine a:last-child');
      this.waitUntilVisible('#filter_options');
    })
    .then(function() {
      this.evaluate(function() {
        $('#alldesigners').val('Juicy Couture').change();
        $('#allsizes').val('M').change();
        $('#allcolors').val('green').change();
      });

      this.click('.filter_clear a');
    })
    .then(function() {
      var allDesigners = this.evaluate(function() {
        return $('#alldesigners').val();
      });
      test.assertNot(allDesigners[0], 'All designers should be empty');

      var allSizes = this.evaluate(function() {
        return $('#allsizes').val();
      });
      test.assertNot(allSizes[0], 'All designers should be empty');

      var allColors = this.evaluate(function() {
        return $('#allcolors').val();
      });
      test.assertNot(allColors[0], 'All designers should be empty');
    })
    .run(function() {
      test.done();
    });
});

casper.test.begin('Should select the heart from the first product', 1, function(test) {
  casper.start(url, function() {
      this.click('#pageItems .citem:first-child a:first-child');
      this.waitForSelector('#pageItems .citem:first-child .hearted_active');
    })
    .then(function() {
      test.assertExists('#pageItems .citem:first-child .hearted_active');
    })
    .run(function() {
      test.done();
    });
});

casper.test.begin('Should select the heart from the first product and then deselect it', 1, function(test) {
  casper.start(url, function() {
      this.click('#pageItems .citem:first-child a:first-child');
      this.waitForSelector('#pageItems .citem:first-child .hearted_active');
    })
    .then(function() {
      this.click('#pageItems .citem:first-child a:first-child');
      this.waitWhileSelector('#pageItems .citem:first-child .hearted_active');
    })
    .then(function() {
      test.assertNotExists('#pageItems .citem:first-child .hearted_active');
    })
    .run(function() {
      test.done();
    });
});

casper.test.begin('Should go to the second page from the first page', 1, function(test) {
  casper.start(url, function() {
      this.click('#next_btn');
    })
    .then(function() {
      test.assertUrlMatch(new RegExp(/pageNum=2/), 'Should be on page of the results');
    })
    .run(function() {
      test.done();
    });
});
