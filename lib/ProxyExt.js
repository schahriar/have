const sync = require('synchronize');

class ProxyExt {
  constructor (options, target, interceptor) {
    this._PROXYEXT_SYNCED_MAP = new WeakMap();
    this._PROXYEXT_INTERNAL_PROXY = new Proxy(target, {
      // ES5 Proxy GET interceptor
      get: (target, method) => {
        if (typeof method !== 'string') return;
        // Allow for Array like lookup
        if ((options.indexLookup) && (parseInt(method).toString() === method)) return target[method];
        else if (method === 'constructor') return;
        else if (method === 'getProxyExt') return; // Disallow access to this proxy
        else if (typeof this[method] === 'function') {
          this.setProxyExtMappedSync(this, method);
          return (...args) => this[method](...args);
        } else if (this[method]) {
          return this[method];
        }

        return interceptor(method);
      }
    });
  }

  setProxyExtMappedSync(key, method) {
    const map = this._PROXYEXT_SYNCED_MAP;
    if (!map.has(key) || (!map.get(key).has(method))) {
      let set = map.get(key) || new Set();
      set.add(method);
      map.set(key, set);
      sync(key, method); // Make calls synchronous
    }
  }

  getProxyExt() {
    return this._PROXYEXT_INTERNAL_PROXY;
  }
}

module.exports = ProxyExt;