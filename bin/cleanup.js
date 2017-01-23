describe("HAVESUITE CLEANUP TASK", function () {
  it("should close session", function () {
    client.page.quit();
  });
});