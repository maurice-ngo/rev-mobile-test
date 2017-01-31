var chai = require('chai');
var chaiJquery = require('chai-jquery');
var createFixture = require('../helpers/create-fixture');
var SiteMenu = require('modules/site-menu');
var $ = require('jquery');
var expect = chai.expect;

chai.use(chaiJquery);

describe('Site Menu', function() {
  var sandbox;
  var $fixture;
  var siteMenu;
  var triggerEl;
  var containerEl;
  var navEl;
  var options = {
    openClassName: 'open',
    overlayClassName: 'overlay',
    overlapContainerClassName: 'overlap',
    levelClassName: 'level',
    levelDataAttribute: 'level',
    wrapperOpenClassName: 'pushed',
    activeLevelClassName: 'active',
    animationOffset: 10
  };

  var assertMenuOpen = function() {
    expect($fixture.find('#container')).to.have.class(options.wrapperOpenClassName);
  };

  var assertMenuClosed = function() {
    expect($fixture.find('#container')).to.not.have.class(options.wrapperOpenClassName);
  };

  var assertIsOpen = function(selector) {
    expect($fixture.find(selector)).to.have.class(options.openClassName);
  };

  var createEvent = function(el) {
    if (el instanceof $) {
      el = el[0];
    }

    return $.Event('click', {
      target: el
    });
  };

  var menuTransition = function(selector) {
    var $target = $fixture.find(selector);
    var $menuItemEl = $target.closest('li');
    var subLevel = $menuItemEl.find('.level:eq(0)')[0];
    var evt = createEvent($target);
    siteMenu.navigateMenuTransition($menuItemEl[0], subLevel, evt);
  };

  beforeEach(function() {
    sandbox = sinon.sandbox.create({
      useFakeTimers: true
    });
    $fixture = createFixture('site-menu');
    navEl = document.getElementById('menu');
    triggerEl = document.getElementById('trigger')
    containerEl = document.getElementById('container');

    siteMenu = new SiteMenu(navEl, triggerEl, containerEl, options);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('when initializing', function() {
    it('should mark level 1 element', function() {
      expect($fixture.find('#level-1')).to.have.data('level', 1);
    });

    it('should mark level 2 elements', function() {
      var ids = [ '1-1', '2-1'];

      ids.forEach(function(id) {
        expect($fixture.find('#level-' + id)).to.have.data(options.levelDataAttribute, 2);
      });
    });

    it('should mark level 3 elements', function() {
      var ids = ['1-1-1', '1-1-2', '1-1-3', '2-1-1', '2-1-2'];

      ids.forEach(function(id) {
        expect($fixture.find('#level-' + id)).to.have.data(options.levelDataAttribute, 3);
      });
    });

    it('should mark level 4 elements', function() {
      var ids = ['2-1-2-1', '2-1-2-2'];

      ids.forEach(function(id) {
        expect($fixture.find('#level-' + id)).to.have.data(options.levelDataAttribute, 4);
      });
    });
  });

  describe('when toggling via the trigger', function() {
    it('should open the menu when engaged', function() {
      siteMenu.toggleMenuFromTrigger(createEvent(triggerEl));
      assertMenuOpen();
      expect($fixture.find('#level-1')).to.have.class(options.openClassName);
    });

    it('should close an opened menu when engaged', function() {
      siteMenu.openMenu();
      siteMenu.toggleMenuFromTrigger(createEvent(triggerEl));

      assertMenuClosed();

      sandbox.clock.tick(options.animationOffset + 10);
      expect($fixture.find('#level-1')).to.not.have.class(options.openClassName);
    });
  });

  describe('when closing from the outside', function() {
    it('should not close an already closed menu when engaged', function() {
      siteMenu.closeMenu();
      siteMenu.closeMenuFromOutside(createEvent(document.body));
      assertMenuClosed();
    });

    it('should close an open menu on the body when engaged', function() {
      siteMenu.openMenu();
      siteMenu.closeMenuFromOutside(createEvent(document.body));
      assertMenuClosed();
    });

    it('should not close an open menu on the trigger when engaged', function() {
      siteMenu.openMenu();
      siteMenu.closeMenuFromOutside(createEvent(triggerEl));
      assertMenuOpen();
    });
  });

  describe('when navigating a menu item', function() {
    beforeEach(function() {
      siteMenu.openMenu();
    });

    it('should open a menu item at the first level', function() {
      menuTransition('[href="#dogs"]');
      assertIsOpen('#level-1-1');
    });

    it('should open a menu item at the second level', function() {
      menuTransition('[href="#dogs"]');
      menuTransition('[href="#leland"]');
      assertIsOpen(('#level-1-1-1'));
    });

    it('should open a menu item at the second level', function() {
      menuTransition('[href="#cats"]');
      menuTransition('[href="#other-dudes"]');
      menuTransition('[href="#by-name"]');
      assertIsOpen('#level-2-1-2-1');
    });
  });

  describe('when navigating to a section', function() {
    var target;

    beforeEach(function() {
      siteMenu.openMenu();
    });

    it('should drill into one level and go to the previous level', function() {
      menuTransition('[href="#dogs"]');
      target = $fixture.find('.menu-section a:contains("Furry Things")')[0];
      siteMenu.navigateSectionItem(createEvent(target));
      assertIsOpen('#level-1');
    });

    it('should drill into two levels and go to the previous level', function() {
      menuTransition('[href="#dogs"]');
      menuTransition('[href="#leland"]');
      target = $fixture.find('.menu-section a:contains("Dogs")')[0];
      siteMenu.navigateSectionItem(createEvent(target));
      assertIsOpen('#level-1-1');
    });

    it('should drill into two levels and go back two levels', function() {
      menuTransition('[href="#dogs"]');
      menuTransition('[href="#leland"]');
      target = $fixture.find('.menu-section a:contains("Furry Things")')[0];
      siteMenu.navigateSectionItem(createEvent(target));
      assertIsOpen('#level-1');
    });
  });

  describe('when applying an active menu', function() {
    var target;

    it('should have an active class on the first level', function() {
      menuTransition('[href="#dogs"]');
      target = $fixture.find('.menu-section a:contains("Furry Things")')[0];
      siteMenu.navigateSectionItem(createEvent(target));

      sandbox.clock.tick(options.animationOffset + 10);
      expect($fixture.find('#level-1')).to.have.class(options.activeLevelClassName);
    });

    it('should not have an active class on the first level when on the first level', function() {
      menuTransition('[href="#dogs"]');
      menuTransition('[href="#leland"]');
      target = $fixture.find('.menu-section a:contains("Dogs")')[0];
      siteMenu.navigateSectionItem(createEvent(target));

      sandbox.clock.tick(options.animationOffset + 10);
      expect($fixture.find('#level-1')).to.not.have.class(options.activeLevelClassName);
    });

    it('should have an active class on the second level', function() {
      menuTransition('[href="#dogs"]');
      menuTransition('[href="#leland"]');
      target = $fixture.find('.menu-section a:contains("Dogs")')[0];
      siteMenu.navigateSectionItem(createEvent(target));

      sandbox.clock.tick(options.animationOffset + 10);
      expect($fixture.find('#level-1-1')).to.have.class(options.activeLevelClassName);
    });
  });
});
