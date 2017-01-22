const sync = require('synchronize');

/**
 * Creates a new sync Proxy for a WebDriver element
 * @class Element 
 */
class Element {
  constructor(wdElement) {
    this.id = wdElement.value;

    return new Proxy(wdElement, {
      // ES5 Proxy GET interceptor
      get: (wdElement, method) => {
        // Allow for self invocation within the current object from returned Proxy
        if (typeof method !== 'string') return;
        else if (method === 'constructor') return;
        else if (!wdElement[method] && !this[method]) return;
        else if (this[method]) {
          sync(this, method); // Make calls synchronous
          return (...args) => this[method](...args);
        }
        else if (typeof wdElement[method] !== 'function') return wdElement[method];

        /** @todo: consider caching synced methods */
        sync(wdElement, method); // Make calls synchronous
        return (...args) => {
          return wdElement[method].apply(wdElement, args);
        }
      }
    });
  }
  
  inspect(...args) {
    let callback = args.pop();
    callback(null, `Element #${this.id}`);
  }
}

module.exports = Element;