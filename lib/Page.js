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
  constructor(client, pageObject) {
    super({}, client, (method) => {
      if (typeof pageObject[method] === 'function') {
        this.setProxyExtMappedSync(pageObject, method);
        return (...args) => pageObject[method](...args);
      } else if (pageObject[method]) {
        return pageObject[method];
      } else if (typeof client[method] === 'function') {
        this.setProxyExtMappedSync(client, method);
        return (...args) => client[method](...args);
      } else if (client[method]) {
        return client[method];
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
    List.createFromSelector(this.getProxyExt(), selector, callback);
  }

  findOne(selector, callback) {
    callback(null, this.getProxyExt().find(selector)[0]);
  }

  pause(timeout, callback) {
    setTimeout(callback, timeout);
  }

  inspect() {
    return `Page [${this.url}]`;
  }
}

module.exports = Page;