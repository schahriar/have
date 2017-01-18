const wd = require('wd');
const EventEmitter = require('events').EventEmitter;
const Fiber = require('fibers');
const Future = require('fibers/future');

class Browser extends EventEmitter {
  constructor(name) {
    super();
    this._browser = wd.promiseChainRemote();
    const browserPromise = this._browser.init({ browserName: this.name || 'chrome' });

    browserPromise.then(() => {
      this.emit('ready');
      this.ready = true;
    }, (error) => this.emit('error', error));

    this.name = name || 'chrome';
    this.ready = false;

  }

  get page() {
    const page = this._browser;
    return this._browser;
  }

  loadPage(page) {
    return new Promise((resolve, reject) => {
      const pageLoader = () => {
        if (page.isUninitializedPage) page = new page();
        this.localPage = page;
        const urlPromise = this._browser.get(page.url);
        urlPromise.then(resolve, reject);
      };

      // Load guard
      if (!this.ready) {
        this.on('ready', () => pageLoader());
      } else {
        pageLoader();
      }
    });
  }

  getWebDriver() {
    return wd;
  }
}

class Page {
  get url() {
    return "http://example.com";
  }

  static get isUninitializedPage() {
    return true;
  }
}

module.exports = {
  Browser: Browser,
  Page: Page
}