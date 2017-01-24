const sync = require('synchronize');
const Common = require('./Common');

/**
 * Creates a new sync Proxy for a WebDriver element
 * @class Element 
 */
class Element extends Common {
  constructor(wdElement, selector, List) {
    super(List, {}, wdElement, (method) => {
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

  inspect(...args) {
    let callback = args.pop();
    callback(null, `Element #${this.id}`);
  }
}

module.exports = Element;