const wd = require('wd');
const sync = require('synchronize');
const Common = require('./Common');
const Element = require('./Element');
const Selector = require('./Selector');

/** 
 * A list containing multiple elements with aggregation capabilities
 * @class List
 */
class List extends Common {
  constructor(elements, selector) {
    super(List, { indexLookup: true }, elements, (method) => {
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

  inspect() {
    return `List [${this._elements_.map((el) => el.inspect())}]`;
  }

  static createFromSelector(context, selector, callback) {
    if (!Selector.isSelector(selector)) selector = new Selector('css', selector);

    selector.getElementsByContext(context, (error, elements) => {
      if (error) return callback(error);

      let list = List.createFromWD(elements, selector);

      callback(null, list);
    });
  }

  static createFromWD(wdElements, selector) {
    let processedElements = [];
        
    for (let el in wdElements) {
      processedElements.push(new Element(wdElements[el], selector.value, List));
    }

    return new List(processedElements, selector.value);
  }
}

module.exports = List;