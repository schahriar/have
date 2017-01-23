const HAVESUITE_CLEANUP_FUNCTION = function () {
  client.page.quit();
};

switch (global.havesuite.options.interface) {
  case 'tdd':
    suite("HAVESUITE CLEANUP TASK", () => test("should close session", HAVESUITE_CLEANUP_FUNCTION));
  break;
  default:
    describe("HAVESUITE CLEANUP TASK", () => it("should close session", HAVESUITE_CLEANUP_FUNCTION));
}