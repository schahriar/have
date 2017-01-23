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

      if (!elements.length && (method === 'length')) return 0;
      if (!elements.length) return;

      return (...args) => {
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

  find(selector, callback) {
    List.createFromSelector(this.getProxyExt(), this._selector_ + selector, callback);
  }

  findOne(selector, callback) {
    callback(null, this.getProxyExt().find(selector)[0]);
  }

  inspect() {
    return `List [${this._elements_.map((el) => el.inspect())}]`;
  }

  static createFromSelector(page, selector, callback) {
    page.elementsByCssSelector(selector, (error, elements) => {
      if (error) return callback(error);

      let list = List.createFromWD(elements, selector);

      callback(null, list);
    });
  }

  static createFromWD(wdElements, selector) {
    let processedElements = [];
        
    for (let el in wdElements) {
      processedElements.push(new Element(wdElements[el], selector, List));
    }

    return new List(processedElements, selector);
  }
}

module.exports = List;