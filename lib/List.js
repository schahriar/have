const wd = require('wd');
const sync = require('synchronize');
const ProxyExt = require('./ProxyExt');
const Element = require('./Element');

/** 
 * A list containing multiple elements with aggregation capabilities
 * @class List
 */
class List extends ProxyExt {
  constructor(elements, selector) {
    super({ indexLookup: true }, elements, (method) => {
      if (typeof elements[method] === 'function') {
        return (...args) => elements[method](...args);
      } else if (elements[method]) {
        return elements[method];
      }

      return (...args) => {
        if (!elements.length) throw new Error("No Elements found");

        let response = elements.map((el) => {
          return el[method].apply(el, args);
        }).filter((el) => {
          return !!el;
        });

        switch (method) {
          case 'text':
            return response.join('');
          default:
            return response
        }
      }
    });

    this._elements_ = elements;
    this._selector_ = selector;

    return this.getProxyExt();
  }

  inspect() {
    return `List [${this._elements_.map((el) => el.inspect())}]`;
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