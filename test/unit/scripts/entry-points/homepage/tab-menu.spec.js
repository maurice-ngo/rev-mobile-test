var chai = require('chai');
var chaiJquery = require('chai-jquery');
var $ = require('jquery');
var tabMenu = require('entry-points/homepage/tab-menu');
var createFixture = require('../../helpers/create-fixture');
var expect = chai.expect;
chai.use(chaiJquery);

describe('Tab Menu', function() {
  var $fixture;
  var selectedClassName;
  var $content;
  var $targetEls;

  beforeEach(function() {
    $.fx.off = true;
    $fixture = createFixture('tab-menu');
    $content = $fixture.find('.box');
    $targetEls = $fixture.find('a');
    selectedClassName = 'active';
    tabMenu($content[0], $targetEls[0], {
      selectedClassName: selectedClassName
    })
  });

  it('should show the content area a target has been interacted with', function() {
    expect($content).to.be.hidden;
    $content.show();
    $targetEls.eq(0).trigger('click');
    expect($content).to.be.hidden;
  });

  it('should mark the first anchor as selected and open section-2', function() {
    var $section2 = $fixture.find('.section-2');
    var $target = $targetEls.eq(0);
    expect($section2).to.be.hidden;
    $target.trigger('click');

    expect($target).to.have.class(selectedClassName);
    expect($section2).to.be.visible;
  });

  it('should remote the active class and the next section', function() {
    var $target = $targetEls.eq(0);
    var $section2 = $fixture.find('.section-2');
    $target.trigger('click');
    $target.trigger('click');

    expect($target).to.not.have.class(selectedClassName);
    expect($section2).to.be.hidden;
  });
});
