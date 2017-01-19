const have = require('../have');
const sync = require('synchronize');

/** @todo: add browser support using argv */
global.browser = new have.Browser();
global.chai = require("chai");
global.chaiAsPromised = require("chai-as-promised");
// enables chai assertion chaining
chaiAsPromised.transferPromiseness = browser.getWebDriver().transferPromiseness;

chai.use(chaiAsPromised);
chai.should();

global.sync = sync.asyncIt;