var chai = require('chai');
var chaiJquery = require('chai-jquery');
var $ = require('jquery');
var manageRefineMenu = require('entry-points/plp/manage-refine-menu');
var createFixture = require('../../helpers/create-fixture');
var expect = chai.expect;
chai.use(chaiJquery);


describe('Manage Refine Menu', function() {
  var $fixture;
  var $filterOptions;
  var $sortOptions;
  var $refineSort;
  var $refineFilter;

  beforeEach(function() {
    $.fx.off = true;
    $fixture = createFixture('manage-refine-menu');
    $filterOptions = $fixture.find(manageRefineMenu.SELECTORS.filterOptions);
    $sortOptions = $fixture.find(manageRefineMenu.SELECTORS.sortOptions);
    $refineSort = $fixture.find(manageRefineMenu.SELECTORS.refineSort);
    $refineFilter = $fixture.find(manageRefineMenu.SELECTORS.refineFilter);
    manageRefineMenu();
  });

  it('should open up sort options', function() {
    $refineSort.trigger('click');
    expect($sortOptions).to.be.visible;
  });

  it('should open up filter options', function() {
    $refineFilter.trigger('click');
    expect($filterOptions).to.be.visible;
  });

  it('should open up sort options and close filter options', function() {
    $filterOptions.css('display', 'block');
    $refineSort.trigger('click');
    expect($filterOptions).to.be.hidden;
  });

  it('should open up filter options and close sort options', function() {
    $sortOptions.css('display', 'block');
    $refineFilter.trigger('click');
    expect($sortOptions).to.be.hidden;
  });
});
