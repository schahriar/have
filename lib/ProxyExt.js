const sync = require('synchronize');

class ProxyExt {
  constructor (options, target, interceptor) {
    this._PROXYEXT_INTERNAL_PROXY = new Proxy(target, {
      // ES5 Proxy GET interceptor
      get: (target, method) => {
        if (typeof method !== 'string') return;
        // Allow for Array like lookup
        if ((options.indexLookup) && (parseInt(method).toString() === method)) return target[method];
        else if (method === 'constructor') return;
        else if (method === 'getProxyExt') return; // Disallow access to this proxy
        else if (typeof this[method] === 'function') {
          sync(this, method); // Make calls synchronous
          return (...args) => this[method](...args);
        } else if (this[method]) {
          return this[method];
        }

        return interceptor(method);
      }
    });
  }

  getProxyExt() {
    return this._PROXYEXT_INTERNAL_PROXY;
  }
}

module.exports = ProxyExt;