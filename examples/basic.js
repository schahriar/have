const basicPage = require('./basicPage');

describe("Basic Test Suite", function () {
  this.timeout(10000);
  before(sync(function () {
    browser.loadPage(basicPage);
  }));
  it("should include google in the page title", sync(function () {
    browser.page.title().should.include("Google");
  }));
  it("should log all link texts from page", sync(function () {
    let elements = browser.page.find('a');
    let texts = browser.page.find('a').map((el) => el.text());
    texts.should.include('Privacy');
    texts.should.not.include('someUnknownElementToHaveSuite');
  }));
  it("should fill searchbox", sync(function () {
    browser.page.find('#lst-ib').type('behave');
    browser.page.find('#lst-ib')[0].getValue().should.equal('behave');
  }));
});