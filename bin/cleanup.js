describe("HAVE -> Cleanup suite", function () {
  it("should close session", function () {
    return client.page.quit();
  });
});