describe("HAVE -> Cleanup suite", function () {
  it("should close session", function () {
    return browser.page.quit();
  });
});