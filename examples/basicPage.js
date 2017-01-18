const Page = require('../have').Page;

class basicPage extends Page {
  get url() {
    return "http://www.google.com";
  }
}

module.exports = basicPage;