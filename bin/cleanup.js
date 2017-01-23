describe("HAVESUITE CLEANUP TASK", function () {
  it("should close session", sync(function () {
    client.page.quit();
  }));
});