var chai = require('chai');
var chaiJquery = require('chai-jquery');
var sinonChai = require('sinon-chai');
var emailSignUp = require('modules/email-sign-up');
var createFixture = require('../helpers/create-fixture');
var expect = chai.expect;
chai.use(chaiJquery);
chai.use(sinonChai);

describe('Email Sign Up', function() {
  var sandbox;
  var server;
  var $fixture;
  var $input;
  var errorClassName = emailSignUp.CLASS_NAMES.error;
  var emailAddress = 'dude@lebowski.com';

  function createFakeRequest(body) {
    body = body ? JSON.stringify(body) : '{}';
    var url = emailSignUp.PATH + '?email=' + encodeURIComponent(emailAddress) + '&gender=female';
    server.respondWith(emailSignUp.METHOD, url, [
      200, { "Content-Type": "text/plain" },
      body
    ]);
  }

  function createEmailSignUp(body) {
    createFakeRequest(body);
    var signUp = emailSignUp();
    server.respond();
    return signUp;
  }

  beforeEach(function() {
    sandbox = sinon.sandbox.create({
      useFakeServer: true
    });
    server = sandbox.server;
    sandbox.stub(window, 'open');
    $fixture = createFixture('email-sign-up');

    $input = $fixture.find('input');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should remove the error class upon a successful sign up',function() {
    $input.addClass(errorClassName).val(emailAddress);

    return createEmailSignUp({ success: true }).then(function() {
      expect($input).to.not.have.class(errorClassName);
    });
  });

  it('should do a crap ton of DOM manipulation upon a successful submit', function() {
    $input.val(emailAddress);
    return createEmailSignUp({ success: true }).then(function() {
      expect($input).to.be.hidden;
      expect($fixture.find('span').eq(0)).to.be.visible;
      expect($fixture.find('span').eq(1)).to.be.hidden;
      expect(window.open).to.be.called;
    });
  });

  it('should receive an error upon submitting', function() {
    $input.val(emailAddress);
    var msg = 'the dude abides';
    return createEmailSignUp({ success: false, msg0: msg }).then(function() {
      expect($input).to.have.value('');
      expect($input).to.have.attr('placeholder', msg);
      expect($input).to.have.class(errorClassName);
    });
  });

  it('should display an error with an invalid email', function(done) {
    $input.val('nice marmot man');
    createEmailSignUp({ success: true }).fail(function() {
      expect($input).to.have.value('');
      expect($input).to.have.attr('placeholder').match(/invalid email/i);
      expect($input).to.have.class(errorClassName);
      done();
    });
  });
});
