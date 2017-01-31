var chai = require('chai');
var chaiJquery = require('chai-jquery');
var $ = require('jquery');
var toggleCategoryDropdown = require('entry-points/plp/toggle-category-dropdown');
var createFixture = require('../../helpers/create-fixture');
var expect = chai.expect;
chai.use(chaiJquery);

describe('Toggle Category Dropdown', function() {
  var $fixture;
  var selectors;
  var classNames;

  beforeEach(function() {
    $.fx.off = true;
    $fixture = createFixture('toggle-category-dropdown');
    toggleCategoryDropdown();
    selectors = toggleCategoryDropdown.SELECTORS;
    classNames = toggleCategoryDropdown.CLASS_NAMES;
  });

  it('should hide the filters by default', function() {
    expect($fixture.find(selectors.filterDDItem)).to.be.hidden;
  });

  it('should hide the filters when they are visible', function() {
    $fixture.find(selectors.adHeader).addClass(classNames.arrowDown);
    $fixture.find(selectors.pageHeader).trigger('click');
    expect($fixture.find(selectors.pageHeader)).to.have.class(classNames.active);
    expect($fixture.find(selectors.filterDD)).to.be.hidden;
  });

  it('should show the filters when they are hidden', function() {
    $fixture.find(selectors.filterDD).hide();
    $fixture.find(selectors.adHeader).addClass(classNames.arrowDown);
    $fixture.find(selectors.pageHeader).addClass(classNames.active).trigger('click');

    expect($fixture.find(selectors.pageHeader)).to.not.have.class(classNames.active);
    expect($fixture.find(selectors.filterDD)).to.be.visible;
  });
});
