var chai = require('chai');
var chaiJquery = require('chai-jquery');
var sinonChai = require('sinon-chai');
var $ = require('jquery');
var qs = require('qs');
var heartProduct = require('modules/heart-product');
var createFixture = require('../helpers/create-fixture');
var expect = chai.expect;
chai.use(chaiJquery);
chai.use(sinonChai);

describe('Heart Product', function() {
  var sandbox;
  var server;
  var $heart;
  var activatedClassName = heartProduct.CLASS_NAMES.activated;
  var requests = heartProduct.REQUESTS;
  var heartActivatedClassName = heartProduct.CLASS_NAMES.activated;

  function setupRequests() {
    server.respondWith(requests.heartProduct.method, requests.heartProduct.url, [
      200, { "Content-Type": "application/x-www-form-urlencoded" },
      '\n\n\n\n\n\nsuccess'
    ]);

    server.respondWith(requests.totalCount.method, requests.totalCount.url, [
      200, { "Content-Type": "application/x-www-form-urlencoded" },
      '\n\n\n\n\n\n1'
    ]);
  }

  function createHeartProduct(pcode, size, sectionUrl) {
    setupRequests();
    return heartProduct.heartProductM($heart[0], pcode, size, sectionUrl);
  }

  beforeEach(function() {
    sandbox = sinon.sandbox.create({
      useFakeServer: true
    });
    server = sandbox.server;
    server.autoRespond = true;
    fixture.set('<a id="heart" href="#heart-product" ' + heartProduct.PRODUCT_CODE  + '="abcd1234"><span></span></a>');
    $heart = $('#heart');
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('when interacting with a heart element', function() {
    var $el;
    beforeEach(function() {
      $el = createFixture('heart-product');
    });

    it('should heart an item with no delegate', function() {
      var $heartEl = $el.find('.heart-item:eq(0)')
      var $inner = $heartEl.find('span');
      heartProduct('.heart-item');
      $heartEl.trigger('click');
      expect($inner).to.have.class(heartActivatedClassName);
    });

    it('should heart and then unheart an item with no delegate', function() {
      var $heartEl = $el.find('.heart-item:eq(0)')
      var $inner = $heartEl.find('span');
      heartProduct('.heart-item');
      $heartEl.trigger('click');
      $heartEl.trigger('click');
      expect($inner).to.not.have.class(heartActivatedClassName);
    });

    it('should heart an item when provided a delegate', function() {
      var $heartEl = $el.find('.products .heart-item')
      var $inner = $heartEl.find('span');
      heartProduct('.products', '.heart-item');
      $heartEl.trigger('click');
      expect($inner).to.have.class(heartActivatedClassName);
    });

    it('should heart and then heart an item when provided a delegate', function() {
      var $heartEl = $el.find('.products .heart-item')
      var $inner = $heartEl.find('span');
      heartProduct('.products', '.heart-item');
      $heartEl.trigger('click');
      $heartEl.trigger('click');
      expect($inner).to.not.have.class(heartActivatedClassName);
    });
  });

  describe('when hearting a product', function() {
    it('should send across proper data when sending a POST to heart a product', function() {
      var pcode = 'abcd1234';
      return createHeartProduct(pcode).then(function() {
        var heartProductBody = qs.parse(server.requests[0].requestBody);
        expect(heartProductBody).to.deep.equal({ pcode: pcode, action_T: 'add' });
      });
    });

    it('should send across proper data when sending a POST to remove a heart a product', function() {
      var pcode = 'abcd1234';
      return createHeartProduct(pcode)
        .then(function() {
          return createHeartProduct(pcode);
        })
        .then(function() {
          var heartProductBody = qs.parse(server.requests[2].requestBody);
          expect(heartProductBody).to.deep.equal({ pcode: pcode, action_T: 'remove' });
        });
    });

    it('should send back proper responses from the necessary requests', function() {
      var pcode = 'abcd1234';
      return createHeartProduct(pcode).then(function(info) {
        expect(info).to.deep.equal({
          heartStatus: 'success',
          totalCount: '1'
        });
      });
    });

    it('should successfully heart a product with a pcode', function() {
      var pcode = 'abcd1234';
      return createHeartProduct(pcode).then(function() {
        expect($heart.find('span')).to.have.class(activatedClassName);
      });
    });

    it('should successfully unheart a hearted product', function() {
      var pcode = 'abcd1234';
      return createHeartProduct(pcode)
        .then(function() {
          return createHeartProduct(pcode);
        })
        .then(function() {
          expect($heart.find('span')).to.not.have.class(activatedClassName);
        });
    });

    it('should update the total heart count', function() {
      fixture.set('<div id="' + heartProduct.SELECTORS.totalCount.substr(1) + '"></div>');
      var pcode = 'abcd1234';
      return createHeartProduct(pcode).then(function() {
        var $totalCount = $(heartProduct.SELECTORS.totalCount);
        expect($totalCount).to.have.text('1');
      });
    });

    it('should reject a promise when no code has been passed in', function(done) {
      createHeartProduct().fail(function(e) {
        expect(e).to.be.an.instanceof(Error);
        done();
      });
    });

    it('should pass along a size', function() {
      var pcode = 'abcd1234';
      var size = 12;
      return createHeartProduct(pcode, size).then(function() {
        var body = qs.parse(server.requests[0].requestBody);
        expect(body).to.have.property('psize', size+'');
      });
    });

    it('should pass along a size and sectionUrl', function() {
      var pcode = 'abcd1234';
      var sectionUrl = "/lebowski/el-duderino"
      return createHeartProduct(pcode, 12, sectionUrl).then(function() {
        var body = qs.parse(server.requests[0].requestBody);
        expect(body).to.have.property('sectionURL', sectionUrl);
      });
    });
  });

  describe('when hearting all the things', function() {
    var $fixture;

    beforeEach(function() {
      $fixture = createFixture('heart-product');
    });

    it('should heart everything', function() {
      var len = $fixture.find(heartProduct.SELECTORS.favHeart).length;
      heartProduct.heartProductM($fixture.find('.heart-container'));
      expect($fixture.find('.' + activatedClassName)).to.have.length(len);
    });

    it('shoudl heart and then unheart everything', function() {
      heartProduct.heartProductM($fixture.find('.heart-container'));
      heartProduct.heartProductM($fixture.find('.heart-container'));
      expect($fixture.find('.' + activatedClassName)).to.have.length(0);
    });
  });
});
