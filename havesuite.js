const wd = require('wd');
const EventEmitter = require('events').EventEmitter;
const sync = require('synchronize');
const async = require('async');
const List = require('./lib/List');
const Element = require('./lib/Element');
const Page = require('./lib/Page');

class Client extends EventEmitter {
  constructor(options) {
    super();
    sync(this, 'loadPage', 'pause');
    
    this._client = wd.promiseChainRemote(options.remote);
    const clientPromise = this._client.init(options.capabilities || { browserName: 'chrome' });

    clientPromise.then(() => {
      this.emit('ready');
      this.ready = true;
    }, (error) => this.emit('error', error));

    this.name = options.name;
    this.ready = false;
  }

  get page() {
    return this.currentLocalPage;
  }

  set page(value) {
    return null; // Disable page overrides
  }

  loadPage(pageObject, callback) {
    const page = new Page(this._client, pageObject);
    /** @todo: verify page object integrity */
    const url = (typeof page.url === 'function')?page.url():page.url;
    this.currentLocalPage = page;
    const urlPromise = this._client.get(url);
    urlPromise.then(() => callback(), (error) => callback(error));
  }

  pause(...args) {
    this.page.pause(...args);
  }

  getWebDriver() {
    return wd;
  }
}

module.exports = {
  Client: Client
}