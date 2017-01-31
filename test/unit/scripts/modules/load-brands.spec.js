var chai = require('chai');
var sinonChai = require('sinon-chai');
var assign = require('lodash/assign');
var loadBrands = require('modules/load-brands');
var createFixture = require('../helpers/create-fixture');
var expect = chai.expect;
chai.use(sinonChai);

describe('Load Brands', function() {
  var sandbox;
  var navigateSpy;
  var $fixture;
  var $alldesigners;
  var $allsizes;
  var $allcolors;
  var $pageNumParam;

  function loadBrandsPage(selector, options) {
    var obj = {}
    assign(obj, {
      navigateFunc: navigateSpy,
      path: '/the-dude-abides'
    }, options);

    loadBrands($fixture.find(selector)[0], obj);
  }

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    navigateSpy = sandbox.spy();
    $fixture = createFixture('load-brands');
    $alldesigners = $fixture.find('#alldesigners');
    $allsizes = $fixture.find('#allsizes');
    $allcolors = $fixture.find('#allcolors');
    $pageNumParam = $fixture.find('#pageNum_param');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should not call on navigate when no element has been passed in', function() {
    loadBrandsPage('.cookie-monster');
    expect(navigateSpy).to.not.be.called;
  });

  it('should filter with nothing selected', function() {
    loadBrandsPage('.filter');
    expect(navigateSpy).to.be.calledWith('/the-dude-abides?sortBy=1&pageNum=1');
  });

  it('should filter and select a bunch of filters', function() {
    $alldesigners.val(['lebowski', 'walter']);
    $allsizes.val(['small', 'medium']);
    $allcolors.val(['red']);
    loadBrandsPage('.filter');
    expect(navigateSpy).to.be.calledWith('/the-dude-abides?sortBy=1&designer=lebowski&designer=walter&size=small&size=medium&color=red&pageNum=1')
  });

  it('should paginate to next page', function() {
    $pageNumParam.val(2)
    loadBrandsPage('.next');
    expect(navigateSpy).to.be.calledWith('/the-dude-abides?sortBy=1&pageNum=3');
  });

  it('should paginate to previous page', function() {
    $pageNumParam.val(2)
    loadBrandsPage('.previous');
    expect(navigateSpy).to.be.calledWith('/the-dude-abides?sortBy=1&pageNum=1');
  });

  it('should modify the path when new arrivals', function() {
    $pageNumParam.val(2)
    fixture.set('<select id="newarrivals"><option value="hey-man" data-url="/nice-marmot" select>Nice Marmot</option></select>', true);
    loadBrandsPage('.filter');
    expect(navigateSpy).to.be.calledWith('/nice-marmot?sortBy=1&pageNum=1&arrivalDate=hey-man');
  });
});
