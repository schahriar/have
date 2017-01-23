const have = require('../have');
const sync = require('synchronize');

global.client = new have.Client(global.havesuite.options);
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
it("should start test suite", function (done) {
  this.timeout(10000);
  global.client.on('ready', done);
});