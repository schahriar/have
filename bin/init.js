const suite = require('../havesuite');
const sync = require('synchronize');

global.client = new suite.Client(global.havesuite.options);
global.chai = require("chai");

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
// options.interface
const HAVESUITE_INIT_FUNCTION = function (done) {
  this.timeout(30000);
  global.client.on('ready', done);
};

switch (global.havesuite.options.interface) {
  case 'tdd':
    test("should start test suite", HAVESUITE_INIT_FUNCTION);
  break;
  default:
    it("should start test suite", HAVESUITE_INIT_FUNCTION);
}