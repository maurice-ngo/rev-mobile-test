var chai = require('chai');
var sinonChai = require("sinon-chai");
var logout = require('modules/logout');
var expect = chai.expect;
chai.use(sinonChai);

describe('Logout Module', function() {
  var sandbox;
  var server;
  var reloadSpy;

  function fakeRequest(data) {
    server.respondWith(logout.METHOD, logout.LOGOUT_URL, [
      200, { "Content-Type": "text/plain" },
      JSON.stringify(data)
    ]);
  }

  function doLogout(data) {
    fakeRequest(data);
    var promise = logout({ reloadFunc: reloadSpy });
    server.respond();
    return promise;
  }

  beforeEach(function() {
    sandbox = sinon.sandbox.create({
      useFakeServer: true
    });
    server = sandbox.server;
    reloadSpy = sandbox.spy();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should successfully logout', function() {
    return doLogout({ success: true }).then(function() {
      expect(reloadSpy).to.have.been.called;
    });
  });

  it('should not successfully logout', function() {
    return doLogout({ success: false }).then(function() {
      expect(reloadSpy).to.not.have.been.called;
    });
  });
});
