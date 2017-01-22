const multiElement = require('./multiElementPage');

describe("MultiElement Test Suite", function () {
  this.timeout(10000);
  before(sync(function () {
    browser.loadPage(multiElement);
    browser.page.waitForElementVisible('#list');
  }));
  it("should check default order of items in the list", sync(function () {
    let results = [];
    results = browser.page.find('#list > .item').map((el) => parseInt(el.text().substring(5))); // Remove "Test " from text and return integer array
    results.should.deep.equal(results.slice(0).sort((a,b) => a - b));
  }));
  it("should modify the order of items in the list", sync(function () {
    let results = [];
    // Click on reorder
    browser.pause(1000);
    browser.page.find('#reorder').click();
    results = browser.page.find('#list > .item').map((el) => parseInt(el.text().substring(5))); // Remove "Test " from text and return integer array
    browser.pause(1000);
    results.should.deep.equal(results.slice(0).sort((a,b) => b - a));
  }));
});