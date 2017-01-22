const wd = require('wd');
const EventEmitter = require('events').EventEmitter;
const sync = require('synchronize');
const async = require('async');
const List = require('./lib/List');
const Element = require('./lib/Element');
const Page = require('./lib/Page');

class Browser extends EventEmitter {
  constructor(name) {
    super();
    sync(this, 'loadPage', 'pause');
    
    this._browser = wd.promiseChainRemote();
    const browserPromise = this._browser.init({ browserName: this.name || 'chrome' });

    browserPromise.then(() => {
      this.emit('ready');
      this.ready = true;
    }, (error) => this.emit('error', error));

    this.name = name || 'chrome';
    this.ready = false;
  }

  get page() {
    return this.currentLocalPage;
  }

  set page(value) {
    return null; // Disable page overrides
  }

  loadPage(pageObject, callback) {
    const page = new Page(this._browser, pageObject);
    /** @todo: verify page object integrity */
    const url = (typeof page.url === 'function')?page.url():page.url;
    this.currentLocalPage = page;
    const urlPromise = this._browser.get(url);
    urlPromise.then(() => callback(), (error) => callback(error));
  }

  pause(...args) {
    this.page.pause(...args);
  }

  getWebDriver() {
    return wd;
  }
}

module.exports = {
  Browser: Browser
}