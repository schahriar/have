const wd = require('wd');
const Element = require('./Element');

/** 
 * A list containing multiple elements with aggregation capabilities
 * @class List
 */
class List {
  constructor(elements, selector) {
    this._internalElements_ = elements;
    this._internalSelector_ = selector;
    this._internalProxy_ = new Proxy(elements, {
      // ES5 Proxy GET interceptor
      get: (elements, method) => {
        // Allow for self invocation within the current object from returned Proxy
        if (typeof method !== 'string') return;
        // Allow for Array like lookup
        if (parseInt(method).toString() === method) return elements[method];
        else if (method === 'constructor') return;
        else if (this[method]) {
          sync(this, method); // Makes calls synchronous? (this function itself isn't a Fiber but Element.js is just to prepare you for async/sync mixups)
          return (...args) => this[method](...args);
        } else if (elements[method]) {
          return (...args) => elements[method](...args);
        }

        return (...args) => {
          if (!elements.length) throw new Error("No Elements found");
          
          return elements.map((el) => {
            return el[method].apply(el, args);
          }).filter((el) => !el);
        }
      }
    });

    return this._internalProxy_;
  }

  inspect() {
    return `List [${this._internalElements_.map((el) => el.inspect())}]`;
  }

  static createFromWD(wdElements, selector) {
    let processedElements = [];
        
    for (let el in wdElements) {
      processedElements.push(new Element(wdElements[el]));
    }

    return new List(processedElements, selector);
  }
}

module.exports = List;