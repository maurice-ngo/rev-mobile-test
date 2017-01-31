var chai = require('chai');
var sinonChai = require('sinon-chai');
var $ = require('jquery');
var smartBanner = require('modules/smart-banner');
var expect = chai.expect;
chai.use(sinonChai);

describe('Smart Banner', function() {
  var sandbox;
  var smartBannerStub;

  function createSmartBannerStub() {
    $.smartbanner = function() {};
    return sandbox.spy($, 'smartbanner');
  }

  function createGlobalPropsStub(val) {
    window.rcProps = {};
    return sandbox.stub(window, 'rcProps', {
      smartBanner: val
    });
  }

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    smartBannerStub = createSmartBannerStub();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should be called with no overrides', function() {
    smartBanner();
    expect(smartBannerStub).to.have.been.calledWith({
      appendToSelector: '#home'
    });
  });

  it('should use rcProps and override default values', function() {
    var props = {
      appendToSelector: '#things',
      foo: 'bar'
    };
    createGlobalPropsStub(props);
    smartBanner();
    expect(smartBannerStub).to.have.been.calledWith(props);
  });

  it('should accept and override with any local options', function() {
    createGlobalPropsStub({
      foo: 'baz',
      bat: 'meh'
    });
    smartBanner({
      appendToSelector: '#things',
      foo: 'bar'
    });
    expect(smartBannerStub).to.have.been.calledWith({
      appendToSelector: '#things',
      foo: 'bar',
      bat: 'meh'
    });
  });
});
