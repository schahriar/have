const basicPage = require('./basicPage');

describe("Basic Test Suite", function () {
  this.timeout(10000);
  before(function () {
    return browser.loadPage(basicPage);
  });
  it.skip("should fill searchbox", function () {
    return browser.page.elementByCss('#lst-ib')
      .type('behave')
      .getValue().should.become('behave');
  });
  it("should include google in the page title", function () {
    return browser.page.title().should.eventually.include("Google");
  });
  it("should log all link texts from page", sync(function () {
    let elements = browser.page.find('a');
    elements.forEach((el) => {
      console.log(">", el.text());
    });
  }));
});