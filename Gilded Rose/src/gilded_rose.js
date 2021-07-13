class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const ITEM = {
  BRIE: "Aged Brie",
  BACKSTAGE: "Backstage passes to a TAFKAL80ETC concert",
  SULFURAS: "Sulfuras, Hand of Ragnaros",
  CONJURED: "Conjured",
};

class Shop {
  constructor(items = []) {
    this.items = items;
  }
  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      var { quality } = this.items[i];
      var { name, quality: tQuality, sellIn } = this.items[i];

      if (/^Conjured/.test(name)) name = ITEM.CONJURED;

      switch (name) {
        case ITEM.BRIE:
          tQuality++;
          if (sellIn <= 0) tQuality++;
          break;
        case ITEM.BACKSTAGE:
          tQuality++;
          if (sellIn <= 10) tQuality++;
          if (sellIn <= 5) tQuality++;
          if (sellIn <= 0) {
            quality = tQuality = 0;
          }

          break;
        case ITEM.SULFURAS:
          break;

        case ITEM.CONJURED:
          tQuality -= 2;
          if (sellIn <= 0) tQuality -= 2;
          break;

        default:
          tQuality--;
          if (sellIn <= 0) tQuality--;
          break;
      }

      tQuality = Math.max(0, Math.min(50, tQuality));

      if (quality >= 50) tQuality = quality;

      sellIn--;
      this.items[i] = { ...this.items[i], quality: tQuality, sellIn };
    }

    return this.items;
  }
}

module.exports = {
  Item,
  Shop,
  ITEM,
};
