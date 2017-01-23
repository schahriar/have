const sync = require('synchronize');
const ProxyExt = require('./ProxyExt');

/**
 * Creates a new sync Proxy for a WebDriver element
 * @class Element 
 */
class Element extends ProxyExt {
  constructor(wdElement, selector, List) {
    super({}, wdElement, (method) => {
      if (!wdElement[method] && !this[method]) return;
      if (typeof wdElement[method] !== 'function') return wdElement[method];

      this.setProxyExtMappedSync(wdElement, method);
      return (...args) => {
        return wdElement[method].apply(wdElement, args);
      }
    });

    this._List_ = List; // Circular references are necessary in DOM-style classes
    this._selector_ = selector;
    this.id = wdElement.value;

    return this.getProxyExt();
  }

  find(selector, callback) {
    console.log(this._selector_ + selector, "<<");
    this._List_.createFromSelector(this.getProxyExt(), this._selector_ + selector, callback);
  }

  findOne(selector, callback) {
    callback(null, this.getProxyExt().find(selector)[0]);
  }
  
  inspect(...args) {
    let callback = args.pop();
    callback(null, `Element #${this.id}`);
  }
}

module.exports = Element;