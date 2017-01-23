const multiElement = require('./multiElementPage');

describe("MultiElement Test Suite", function () {
  this.timeout(10000);
  before(sync(function () {
    client.loadPage(multiElement);
    client.page.waitForElementVisible('#list');
  }));
  it("should pause on both client and page", sync(function () {
    client.pause(250);
    client.page.pause(250);
  }));
  it("should check default order of items in the list", sync(function () {
    let results = [];
    results = client.page.find('#list > .item').map((el) => parseInt(el.text().substring(5))); // Remove "Test " from text and return integer array
    results.should.deep.equal(results.slice(0).sort((a,b) => a - b));
  }));
  it("should modify the order of items in the list", sync(function () {
    let results = [];
    // Click on reorder
    client.page.find('#reorder').click();
    results = client.page.find('#list > .item').map((el) => parseInt(el.text().substring(5))); // Remove "Test " from text and return integer array
    results.should.deep.equal(results.slice(0).sort((a,b) => b - a));
  }));
  it("should concat text of List elements together", sync(function () {
    client.page.find('#list > .item').text().should.equal("Test 15Test 14Test 13Test 12Test 11Test 10Test 9Test 8Test 7Test 6Test 5Test 4Test 3Test 2Test 1");
  }));
  it("should call find within a list", sync(function () {
    let list = client.page.find('#list');
    client.page.find('body > section > .item').length.should.gte(15);
    list.find('> section > .item').length.should.equal(0);
    list.find('> .item').length.should.equal(15);
  }));
  it("should find one element", sync(function () {
    let listElement = client.page.findOne('#list');
    let listItems = listElement.find('> .item');
    listItems.length.should.be.gte(15);
  }));
});