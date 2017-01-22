const wd = require('wd');
const EventEmitter = require('events').EventEmitter;
const sync = require('synchronize');
const async = require('async');
const Element = require('./lib/Element');
const List = require('./lib/List');

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
    const page = this._browser;
    sync(page, 'title');
    
    page.waitForElementVisible = sync((selector, timeout, callback) => {
      this._browser.waitForElementByCssSelector(selector, wd.asserters.isDisplayed, timeout || 10000, callback);
    });
    page.waitForElementHidden = sync((selector, timeout, callback) => {
      this._browser.waitForElementByCssSelector(selector, wd.asserters.isNotDisplayed, timeout || 10000, callback);
    });
    page.waitForElementPresent = sync((selector, timeout, callback) => {
      /** @todo: figure out DOM presence check */
      //this._browser.waitForElementByCssSelector(selector, wd.asserters.isDisplayed, timeout || 10000, callback);
    });
    page.waitForElementAbsent = sync((selector, timeout, callback) => {
      //this._browser.waitForElementByCssSelector(selector, wd.asserters.isNotDisplayed, timeout || 10000, callback);
    });
    page.find = sync((selector, callback) => {
      this._browser.elementsByCssSelector(selector, (error, elements) => {
        if (error) return callback(error);

        let list = List.createFromWD(elements, selector);

        callback(null, list);
      });
    });
    return this._browser;
  }

  loadPage(page, callback) {
    /** @todo: verify page object integrity */
    const url = (typeof page.url === 'function')?page.url():page.url;
    this.localPage = page;
    const urlPromise = this._browser.get(url);
    urlPromise.then(() => callback(), (error) => callback(error));
  }

  pause(timeout, callback) {
    setTimeout(callback, timeout);
  }

  getWebDriver() {
    return wd;
  }
}

module.exports = {
  Browser: Browser
}