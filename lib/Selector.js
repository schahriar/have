class Selector {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  getElementsByContext(context, callback) {
    switch (this.type) {
      case 'css':
        return context.elementsByCssSelector(this.value, callback);
      case 'name':
        return context.elementsByName(this.value, callback);
      case 'xpath':
        return context.elementsByXPath(this.value, callback);
      case 'tag':
        return context.elementsByTagName(this.value, callback);
      case 'ios':
        return context.elementsByIosUIAutomation(this.value, callback);
      case 'android':
        return context.elementsByAndroidUIAutomator(this.value, callback);
      default:
        return context.elementsByCssSelector(this.value, callback);
    }
  }

  static isSelector(val) {
    return (val instanceof Selector);
  }
}

module.exports = Selector;