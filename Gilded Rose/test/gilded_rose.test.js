const { Shop, Item, ITEM } = require("../src/gilded_rose");

describe("Normal item creation and quality update", function () {
  it("create item with name foo", function () {
    const itemName = "foo";
    const gildedRose = new Shop([new Item(itemName, 0, 0)]);
    const items = gildedRose.updateQuality();

    const actualName = items[0].name;

    expect(actualName).toBe(itemName);
  });

  it.each([1, 2, 3, 4, 5, 10, 49])(
    "update quality before sellIn quality %i",
    function (q) {
      const itemName = "foo";
      const quality = q;
      const sellIn = 10;
      const gildedRose = new Shop([new Item(itemName, sellIn, quality)]);
      const items = gildedRose.updateQuality();

      const expectedQuality = q - 1;
      const actualQuality = items[0].quality;

      expect(actualQuality).toBe(expectedQuality);
    }
  );

  it.each([2, 3, 4, 5, 10, 49])(
    "update quality before sellIn quality %i",
    function (q) {
      const itemName = "foo";
      const quality = q;
      const sellIn = -1;
      const gildedRose = new Shop([new Item(itemName, sellIn, quality)]);
      const items = gildedRose.updateQuality();

      const expectedQuality = q - 2;
      const actualQuality = items[0].quality;

      expect(actualQuality).toBe(expectedQuality);
    }
  );

  it("update quality after sellIn from 1 to 0", function () {
    const itemName = "foo";
    const quality = 1;
    const sellIn = -1;
    const gildedRose = new Shop([new Item(itemName, sellIn, quality)]);
    const items = gildedRose.updateQuality();

    const expectedQuality = 0;
    const actualQuality = items[0].quality;

    expect(actualQuality).toBe(expectedQuality);
  });
});

describe("Check if quality cannot be negative ", function () {
  describe.each(Object.keys(ITEM))("itemName %s", function (itemKey) {
    describe.each([0, 1, -1, 10])("sellIn %i", function (s) {
      it.each([0, 1, 5, 10, 47, 48, 49, 50, 51, 52, 55, 70, 80, 100])(
        "quality %i",
        function (q) {
          const itemName = ITEM[itemKey];
          const sellIn = s;
          const shop = new Shop([new Item(itemName, sellIn, q)]);
          const items = shop.updateQuality();

          const actualQuality = items[0].quality;
          expect(actualQuality).toBeGreaterThanOrEqual(0);
        }
      );
    });
  });
});

describe("Test Brie", function () {
  it("quality before sellIn starting from 0 to 1", function () {
    const itemName = ITEM.BRIE;
    const quality = 0;
    const sellIn = 10;
    const gildedRose = new Shop([new Item(itemName, sellIn, quality)]);
    const items = gildedRose.updateQuality();

    const expectedQuality = 1;
    const actualQuality = items[0].quality;

    expect(actualQuality).toBe(expectedQuality);
  });

  it("quality before sellIn starting from 5 to 6", function () {
    const itemName = ITEM.BRIE;
    const quality = 5;
    const sellIn = 10;
    const gildedRose = new Shop([new Item(itemName, sellIn, quality)]);
    const items = gildedRose.updateQuality();

    const expectedQuality = 6;
    const actualQuality = items[0].quality;

    expect(actualQuality).toBe(expectedQuality);
  });

  it("quality before sellIn starting from 10 to 11", function () {
    const itemName = ITEM.BRIE;
    const quality = 10;
    const sellIn = 10;
    const gildedRose = new Shop([new Item(itemName, sellIn, quality)]);
    const items = gildedRose.updateQuality();

    const expectedQuality = 11;
    const actualQuality = items[0].quality;

    expect(actualQuality).toBe(expectedQuality);
  });

  it("quality before sellIn after sellIn from 10 to 12", function () {
    const itemName = ITEM.BRIE;
    const quality = 10;
    const sellIn = -1;
    const gildedRose = new Shop([new Item(itemName, sellIn, quality)]);
    const items = gildedRose.updateQuality();

    const expectedQuality = 12;
    const actualQuality = items[0].quality;

    expect(actualQuality).toBe(expectedQuality);
  });

  it("increase in quality after sellIn from 49 to 50", function () {
    const itemName = ITEM.BRIE;
    const quality = 49;
    const sellIn = -1;
    const gildedRose = new Shop([new Item(itemName, sellIn, quality)]);
    const items = gildedRose.updateQuality();

    const expectedQuality = 50;
    const actualQuality = items[0].quality;

    expect(actualQuality).toBe(expectedQuality);
  });

  it("increase in quality after sellIn from 51 to 51", function () {
    const itemName = ITEM.BRIE;
    const quality = 51;
    const sellIn = -1;
    const gildedRose = new Shop([new Item(itemName, sellIn, quality)]);
    const items = gildedRose.updateQuality();

    const expectedQuality = 51;
    const actualQuality = items[0].quality;

    expect(actualQuality).toBe(expectedQuality);
  });
});

describe("Test Sulfuras", function () {
  it.each([0, 5, 10, 48, 49, 50, 51, 80])(
    "quality before sellIn",
    function (a) {
      const itemName = ITEM.SULFURAS;
      const sellIn = 10;

      const gildedRose = new Shop([new Item(itemName, sellIn, a)]);
      const itemsAfter = gildedRose.updateQuality();

      const expectedQuality = a;
      const actualQuality = a;

      expect(actualQuality).toEqual(expectedQuality);
    }
  );

  it.each([0, 5, 10, 48, 49, 50, 51, 80])("quality after sellIn", function (a) {
    const itemName = ITEM.SULFURAS;
    const sellIn = -1;

    const gildedRose = new Shop([new Item(itemName, sellIn, a)]);
    const itemsAfter = gildedRose.updateQuality();

    const expectedQuality = a;
    const actualQuality = a;

    expect(actualQuality).toEqual(expectedQuality);
  });
});

describe("Test Backstage", function () {
  it.each([0, 5, 10, 48, 49])("quality sellIn equal 11", function (q) {
    const itemName = ITEM.BACKSTAGE;
    const sellIn = 11;
    const gildedRose = new Shop([new Item(itemName, sellIn, q)]);
    const items = gildedRose.updateQuality();

    const expectedQualities = q + 1;
    const actualQualities = items[0].quality;

    expect(actualQualities).toEqual(expectedQualities);
  });

  it.each([0, 5, 10, 48])("quality sellIn equal 10", function (q) {
    const itemName = ITEM.BACKSTAGE;
    const sellIn = 10;
    const gildedRose = new Shop([new Item(itemName, sellIn, q)]);
    const items = gildedRose.updateQuality();

    const expectedQualities = q + 2;
    const actualQualities = items[0].quality;

    expect(actualQualities).toEqual(expectedQualities);
  });

  it.each([0, 5, 10, 48])("quality sellIn equal 9", function (q) {
    const itemName = ITEM.BACKSTAGE;
    const sellIn = 9;
    const gildedRose = new Shop([new Item(itemName, sellIn, q)]);
    const items = gildedRose.updateQuality();

    const expectedQualities = q + 2;
    const actualQualities = items[0].quality;

    expect(actualQualities).toEqual(expectedQualities);
  });

  it.each([0, 5, 10, 48])("quality sellIn equal 7", function (q) {
    const itemName = ITEM.BACKSTAGE;
    const sellIn = 7;
    const gildedRose = new Shop([new Item(itemName, sellIn, q)]);
    const items = gildedRose.updateQuality();

    const expectedQualities = q + 2;
    const actualQualities = items[0].quality;

    expect(actualQualities).toEqual(expectedQualities);
  });

  it.each([0, 5, 10, 47])("quality sellIn equal 3", function (q) {
    const itemName = ITEM.BACKSTAGE;
    const sellIn = 3;
    const gildedRose = new Shop([new Item(itemName, sellIn, q)]);
    const items = gildedRose.updateQuality();

    const expectedQualities = q + 3;
    const actualQualities = items[0].quality;

    expect(actualQualities).toEqual(expectedQualities);
  });

  it.each([0, 5, 10, 48, 49, 50, 51, 80])("quality after sellIn", function (q) {
    const itemName = ITEM.BACKSTAGE;
    const sellIn = -1;
    const gildedRose = new Shop([new Item(itemName, sellIn, q)]);
    const items = gildedRose.updateQuality();

    const expectedQualities = 0;
    const actualQualities = items[0].quality;

    expect(actualQualities).toEqual(expectedQualities);
  });
});

describe("Check if quality less equal than 50 ", function () {
  describe.each(Object.keys(ITEM))("itemName %s", function (itemKey) {
    describe.each([0, 1, -1, 10])("sellIn %i", function (s) {
      it.each([0, 1, 5, 10, 47, 48, 49, 50])("quality %i", function (q) {
        const itemName = ITEM[itemKey];
        const sellIn = s;
        const shop = new Shop([new Item(itemName, sellIn, q)]);
        const items = shop.updateQuality();

        const actualQuality = items[0].quality;
        expect(actualQuality).toBeLessThanOrEqual(50);
      });
    });
  });
});

describe("Check if quality greater than 50 ", function () {
  describe.each(Object.keys(ITEM))("itemName %s", function (itemKey) {
    describe.each([1, 2, 10])("sellIn %i", function (s) {
      it.each([51, 52, 55, 70, 80, 100])("quality %i", function (q) {
        const itemName = ITEM[itemKey];
        const sellIn = s;
        const shop = new Shop([new Item(itemName, sellIn, q)]);
        const items = shop.updateQuality();

        const actualQuality = items[0].quality;

        expect(actualQuality).toBe(q);
      });
    });
  });
});
