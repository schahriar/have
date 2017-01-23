const assert = require('assert');
const basicPage = require('./page/basicPage');

suite("Basic Test Suite", function () {
  this.timeout(30000);
  setup(sync(function () {
    client.loadPage(basicPage);
  }));
  test("should include google in the page title", sync(function () {
    assert.equal(client.page.title(), "Google");
  }));
  test("should fill searchbox", sync(function () {
    client.page.find('#lst-ib').type('behave');
    assert.equal(client.page.find('#lst-ib')[0].getValue(), 'behave');
  }));
});