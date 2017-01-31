var $ = require('jquery');

module.exports = createFixture;

function createFixture(name) {
  fixture.setBase('test/unit/fixtures');
  fixture.load(name + '.html');
  return $(fixture.el);
}
