var chai = require('chai');
var sinonChai = require("sinon-chai");
var logout = require('modules/logout');
var headerLogout = require('entry-points/chrome/header/header-logout');
var $ = require('jquery');
var expect = chai.expect;

chai.use(sinonChai);

describe('Header Logout', function() {
  var sandbox;
  var server;
  var body = '{ "theDude": "abides", "success": false }';

  beforeEach(function() {
    sandbox = sinon.sandbox.create({
      useFakeServer: true
    });
    server = sandbox.server;

    server.respondWith(logout.METHOD, logout.LOGOUT_URL, [
      200, { "Content-Type": "text/plain" },
      body
    ]);

    fixture.set('<a id="logout" href="/logout">Log Me Out</a>');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should logout or something', function() {
    var evt = $.Event('click', {
      target: $('#logout')[0]
    });
    sandbox.spy(evt, 'preventDefault');

    headerLogout('#logout')
    $('#logout').trigger(evt);
    server.respond();

    expect(evt.preventDefault).to.have.been.called;

    var request = server.requests[0];
    expect(request.method).to.equal(logout.METHOD);
    expect(request.url).to.equal(logout.LOGOUT_URL);
    expect(request.response).to.equal(body);
  });
});
