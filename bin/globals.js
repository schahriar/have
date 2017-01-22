const have = require('../have');
const sync = require('synchronize');

/** @todo: add browser support using argv */
global.browser = new have.Browser();
global.chai = require("chai");

/** @todo: re-add if promises are shipped by default */
// global.chaiAsPromised = require("chai-as-promised");
// enables chai assertion chaining
//chaiAsPromised.transferPromiseness = browser.getWebDriver().transferPromiseness;
// chai.use(chaiAsPromised);

chai.should();

global.sync = (func) => {
  return (done) => {
    sync.fiber(() => {
      let syncFunc = sync.asyncIt(func);
      sync.await(syncFunc(done, sync.defer()));
      done();
    });
  };
};

/** @todo: Add TDD & QUnit options for Initial and final test */
// Initial test
it("should start test suite", function (done) {
  this.timeout(10000);
  global.browser.on('ready', done);
});