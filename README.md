![HāveSuite](./logo.png)
-------
UI Testing as smooth as butter
-------
-------
**HāveSuite** (derived from the word behave /bəˈhāv/) is a *Mocha-based*, *Selenium powered*, Node.js automated UI Testing framework designed with a focus on simplicity with complex tasks. It aims to provide a simple interface for achieving and maintaining complex test cases.

-------

## Getting Started
Start by installing HāveSuite as a global module:
```
npm install -g havesuite
```
This will allow you to use the `havesuite` command-line tool for launching and parallelizing* tests cases.

-------

## Create a havesuite.json file
`havesuite` command-line tool will look for a `havesuite.json` file for configuration to begin a test suite.

Start by creating a folder for your test cases and adding json file inside:

```
mkdir ./UITests/
cd ./UITests/
touch havesuite.json
```
add `src` property to point to the source files of your tests. Note that this supports glob patterns:
```json
{
  "name": "SampleUITests",
  "src": [
    "./testcases/*/*.js"
  ]
}
```
and adding Selenium or Selenium Grid configuration for remote execution to `havesuite.json`:
```json
{
  ...
  "capabilities": {
    "browserName": "chrome",
    "platform": "MAC",
    "version": "latest"
  },
  "remote": "<URL_TO_SELENIUM_GRID_INCLUDING_USER_AND_PASS>"
}
```
note that you can use the es6 template pattern `${some_key}` to access **environment variables**, this is useful for writing JSON configuration without exposing private key and password information. In the end you should end up with a file like the following:
```json
{
  "name": "SampleUITests",
  "src": [
    "./testcases/*/*.js"
  ],
  "capabilities": {
    "browserName": "chrome",
    "platform": "MAC",
    "version": "latest"
  },
  "remote": "http://${MY_KEY}:${MY_PRIVATE}@hub.example.com/wd/hub"
}
```

-------

## Creating a page object

A page object is necessary to start a test-case. A HāveSuite page object is a simple object returned by `module.exports` that does not get included in `src` property of havesuite.json but rather required by individual test-cases and **opened in the Client/Browser**. The URL for a page is set as either a string or function to the `url` property. *(e.g. ./testcases/first/page/firstPage.js)*

```javascript
module.exports = {
  url: function () {
    return "http://www.google.com";
  }
}
```

-------

## Writing Test-cases

Currently HāveSuite only supports BDD style tests using Mocha.

HāveSuite adds a simple wrapper around the test functions known as `sync()` in order to convert all async calls into Fibers. This is especially important for keeping test code clean. You can begin writing your first test-case by adding a file matching the `src` property in havesuite.json. *(e.g. ./testcases/first/first.js)*
```javascript
const page = require('./page/firstPage');

describe("Example Test Suite", function () {
  this.timeout(30000); // Set timeout of all test cases to 30 seconds
  before(sync(function () { // Note that functions are wrapped around sync()
    client.loadPage(page); // Load page (google.com)
  }));
  it("should include google in the page title", sync(function () {
    client.page.title().should.include("Google");
  }));
  it("should log all link texts from page", sync(function () {
    let texts = client.page.find('._Gs').map((el) => el.text());
    texts.should.include('Privacy');
    texts.should.not.include('someUnknownElementToHaveSuite');
  }));
  it("should fill searchbox", sync(function () {
    client.page.find('#lst-ib').type('behave');
    client.page.find('#lst-ib')[0].getValue().should.equal('behave');
  }));
});
```