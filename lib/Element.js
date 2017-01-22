const sync = require('synchronize');
const ProxyExt = require('./ProxyExt');

/**
 * Creates a new sync Proxy for a WebDriver element
 * @class Element 
 */
class Element extends ProxyExt {
  constructor(wdElement) {
    super({}, wdElement, (method) => {
      if (!wdElement[method] && !this[method]) return;
      if (typeof wdElement[method] !== 'function') return wdElement[method];

      this.setProxyExtMappedSync(wdElement, method);
      return (...args) => {
        return wdElement[method].apply(wdElement, args);
      }
    });

    this.id = wdElement.value;

    return this.getProxyExt();
  }
  
  inspect(...args) {
    let callback = args.pop();
    callback(null, `Element #${this.id}`);
  }
}

module.exports = Element;