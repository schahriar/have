const wd = require('wd');
const sync = require('synchronize');
const ProxyExt = require('./ProxyExt');
const List = require('./List');
const Element = require('./Element');

/** 
 * A list containing multiple elements with aggregation capabilities
 * @class List
 */
class Page extends ProxyExt {
  constructor(browser, pageObject) {
    super({}, browser, (method) => {
      if (typeof pageObject[method] === 'function') {
        this.setProxyExtMappedSync(pageObject, method);
        return (...args) => pageObject[method](...args);
      } else if (pageObject[method]) {
        return pageObject[method];
      } else if (typeof browser[method] === 'function') {
        this.setProxyExtMappedSync(browser, method);
        return (...args) => browser[method](...args);
      } else if (browser[method]) {
        return browser[method];
      }
    });

    return this.getProxyExt();
  }

  waitForElementVisible(selector, ...params) {
    const callback = params.pop(), timeout = params.pop();
    this.getProxyExt().waitForElementByCssSelector(selector, wd.asserters.isDisplayed, timeout || 10000, callback);
  }

  waitForElementHidden(selector, ...params) {
    const callback = params.pop(), timeout = params.pop();
    this.getProxyExt().waitForElementByCssSelector(selector, wd.asserters.isNotDisplayed, timeout || 10000, callback);
  }

  waitForElementPresent() {
    /** @todo: figure out DOM presence check */
  }

  waitForElementAbsent() {
    /** @todo: figure out DOM absence check */
  }

  find(selector, callback) {
    this.getProxyExt().elementsByCssSelector(selector, (error, elements) => {
      if (error) return callback(error);

      let list = List.createFromWD(elements, selector);

      callback(null, list);
    });
  }

  pause(timeout, callback) {
    setTimeout(callback, timeout);
  }

  inspect() {
    return `Page [${this.url}]`;
  }
}

module.exports = Page;