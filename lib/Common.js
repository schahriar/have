const ProxyExt = require('./ProxyExt');

class Common extends ProxyExt {
  constructor(List, options, target, handler) {
    super(options, target, handler);
    this._EXT_LIST = List; // Workaround circular references necessary in this case
  }

  find(selector, callback) {
    let cssSelector = (this._selector_)?(this._selector_ + selector):selector;
    this._EXT_LIST.createFromSelector(this.getProxyExt(), cssSelector, callback);
  }

  findOne(selector, callback) {
    try {
      let element = this.getProxyExt().find(selector)[0];
      callback(null, element);
    } catch (error) {
      callback(error);
    }
  }
}

module.exports = Common;