/* =====================================================================
   ROYAL BAKE — menu.js
   Menu data + tab/grid rendering for the Menu page. Loads only where
   #menuGrid exists. Relies on helpers ($, $$, money, esc, addToCart)
   from site.js, which loads first.
   ===================================================================== */

const MENU = [
  {
    id: "breakfast", label: "Breakfast", ar: "فطور",
    items: [
      { name: "Foul Tahini", ar: "فول بطحينة", desc: "Slow-cooked fava beans blended with tahini, lemon, garlic and olive oil.", options: [{ size: "Medium", price: 8.99 }, { size: "Large", price: 17.99 }] },
      { name: "Foul", ar: "فول بحامض", desc: "Warm fava beans seasoned with lemon juice, garlic and extra virgin olive oil.", options: [{ size: "Medium", price: 8.99 }, { size: "Large", price: 17.99 }] },
      { name: "Fatteh", ar: "فتة بسمنة", desc: "Layered pita with chickpeas, yogurt sauce and a rich clarified-butter topping.", options: [{ size: "Medium", price: 12.99 }, { size: "Large", price: 19.99 }] },
      { name: "Eggplant Fatteh", ar: "فتة باذنجان", desc: "Roasted eggplant layered with crispy pita and creamy yogurt-tahini sauce.", options: [{ size: "Medium", price: 12.99 }, { size: "Large", price: 19.99 }] },
      { name: "Msabbaha", ar: "مسبحة", desc: "Whole chickpeas mixed with tahini, garlic, lemon and warm olive oil.", options: [{ size: "Medium", price: 8.99 }, { size: "Large", price: 17.99 }] },
      { name: "Balila", ar: "بليلة", desc: "Tender chickpeas seasoned with cumin, garlic, lemon and olive oil.", options: [{ size: "Medium", price: 8.99 }, { size: "Large", price: 17.99 }] },
      { name: "Falafel", ar: "فلافل", desc: "Crispy chickpea fritters blended with herbs and traditional Middle Eastern spices.", options: [{ size: "6 pcs", price: 5.99 }, { size: "12 pcs", price: 11.99 }] },
      { name: "Scrambled Eggs", ar: "بيض", desc: "Fresh eggs cooked soft and lightly seasoned for a classic breakfast.", options: [{ size: "", price: 7.99 }] },
      { name: "Eggs & Awarma", ar: "بيض وقاورما", desc: "Eggs sautéed with rich preserved meat and traditional savoury spices.", options: [{ size: "", price: 9.99 }] },
      { name: "Eggs & Sujuk", ar: "بيض وسجق", desc: "Fresh eggs cooked with spicy sujuk sausage and aromatic seasonings.", options: [{ size: "", price: 9.99 }] },
      { name: "Eggs & Veggies", ar: "بيض وبندورة", desc: "Eggs cooked with tomatoes and vegetables for a fresh, hearty breakfast.", options: [{ size: "", price: 9.99 }] },
      { name: "Maqla Lahmeh", ar: "مقلى لحمة", desc: "Tender sautéed meat cooked with onions, spices and traditional seasonings.", options: [{ size: "", price: 14.99 }] },
      { name: "Labneh", ar: "لبنة", desc: "Creamy strained yogurt drizzled with olive oil and served fresh daily.", options: [{ size: "", price: 5.99 }] },
      { name: "Veggies", ar: "خضار", desc: "Fresh seasonal vegetables served crisp with herbs and traditional sides.", options: [{ size: "", price: 4.99 }] },
      { name: "Mamounieh", ar: "مأمونية", desc: "Warm semolina topped with butter and lightly sweetened — a comforting classic.", options: [{ size: "", price: 9.99 }] },
    ],
  },
  {
    id: "appetizers", label: "Appetizers", ar: "مقبلات",
    items: [
      { name: "Hummus", ar: "حمص", desc: "Creamy chickpeas, tahini, olive oil and lemon.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
      { name: "Tabouli Salad", ar: "تبولة", desc: "Parsley, tomatoes, bulgur, lemon and olive oil.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
      { name: "Mutabal", ar: "متبل", desc: "Smoked eggplant blended with tahini and garlic.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
      { name: "Fattoush Salad", ar: "فتوش", desc: "Fresh vegetables tossed with crispy toasted pita.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
      { name: "Baba Ganoush", ar: "بابا غنوج", desc: "Roasted eggplant dip finished with herbs and oil.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
      { name: "Greek Salad", ar: "سلطة يونانية", desc: "Cucumbers, tomatoes, olives, feta and dressing.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
      { name: "Kibbeh", ar: "كبة مقلية", desc: "Crispy beef croquettes with herbs and spices.", options: [{ size: "6 pcs", price: 10.00 }, { size: "12 pcs", price: 20.00 }] },
      { name: "Fries", ar: "بطاطا مقلية", desc: "Golden crispy fries served fresh and perfectly hot.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
      { name: "Grape Leaves", ar: "ورق عنب", desc: "Stuffed vine leaves filled with seasoned rice.", options: [{ size: "6 pcs", price: 4.99 }, { size: "12 pcs", price: 9.99 }] },
      { name: "Garlic Sauce", ar: "صوص الثوم", desc: "Creamy garlic dip whipped fresh every single day.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
      { name: "Muhamara", ar: "محمرة", desc: "Roasted peppers, walnuts, olive oil and spices.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
      { name: "Batata Harra", ar: "بطاطا حره", desc: "Spiced potatoes tossed with garlic and fresh herbs.", options: [{ size: "Medium", price: 5.99 }, { size: "Large", price: 7.99 }] },
    ],
  },
  {
    id: "manakish", label: "Manakish", ar: "مناقيش",
    note: "Make it bigger & thinner for $2 extra · Add veggies for $1.50",
    items: [
      { name: "Zaatar", ar: "زعتر", desc: "Za'atar, olive oil and herbs on warm baked dough.", options: [{ size: "", price: 3.99 }] },
      { name: "Cheese", ar: "جبنة", desc: "Melted cheese baked on soft, freshly made dough.", options: [{ size: "", price: 5.99 }] },
      { name: "Cheese & Zaatar", ar: "جبنة وزعتر", desc: "Melted cheese layered with fragrant za'atar seasoning.", options: [{ size: "", price: 5.99 }] },
      { name: "Four Cheese Blend", ar: "جبنة مشكلة", desc: "Mozzarella, akkawi, feta and cheddar baked golden.", options: [{ size: "", price: 6.99 }] },
      { name: "Zaatar & Labneh", ar: "زعتر ولبنة", desc: "Creamy labneh topped with za'atar and olive oil.", options: [{ size: "", price: 5.99 }] },
      { name: "Kishk", ar: "كشك", desc: "Cracked wheat, yogurt and herbs baked until golden.", options: [{ size: "", price: 5.99 }] },
      { name: "Spinach", ar: "سبانخ", desc: "Fresh spinach, onions, lemon and Mediterranean spices.", options: [{ size: "", price: 3.99 }] },
      { name: "Spinach & Feta", ar: "سبانخ وفيتا", desc: "Fresh spinach baked with a creamy feta filling.", options: [{ size: "", price: 5.99 }] },
      { name: "Meat", ar: "لحمة", desc: "Seasoned ground beef with onions and fresh tomatoes.", options: [{ size: "", price: 4.99 }] },
      { name: "Meat & Cheese", ar: "لحمة وجبنة", desc: "Savoury meat layered with warm melted cheese.", options: [{ size: "", price: 5.99 }] },
      { name: "Kafta", ar: "كفتة", desc: "Ground beef mixed with herbs and Mediterranean spices.", options: [{ size: "", price: 5.99 }] },
      { name: "Kafta & Cheese", ar: "كفتة وجبنة", desc: "Seasoned kafta topped with rich melted cheese.", options: [{ size: "", price: 6.99 }] },
      { name: "Potatoes", ar: "بطاطا", desc: "Seasoned potatoes baked until warm and perfectly crisp.", options: [{ size: "", price: 3.99 }] },
      { name: "Potato & Awarma", ar: "بطاطا وقاورما", desc: "Potatoes layered with rich, seasoned awarma meat.", options: [{ size: "", price: 5.99 }] },
      { name: "Labneh & Awarma", ar: "لبنة وقاورما", desc: "Creamy labneh topped with flavourful awarma and herbs.", options: [{ size: "", price: 6.99 }] },
      { name: "Mahamara", ar: "محمرة", desc: "Roasted pepper spread with walnuts and mild spices.", options: [{ size: "", price: 4.99 }] },
      { name: "Mahamara & Cheese", ar: "محمرة وجبنة", desc: "Sweet pepper spread baked with a melted cheese topping.", options: [{ size: "", price: 5.99 }] },
      { name: "Veggies", ar: "خضرة", desc: "Seasonal vegetables layered over freshly baked dough.", options: [{ size: "", price: 4.99 }] },
      { name: "Veggies & Cheese", ar: "خضرة وجبنة", desc: "Garden vegetables topped with rich melted cheese.", options: [{ size: "", price: 5.99 }] },
      { name: "Sujuk & Cheese", ar: "سجق وجبنة", desc: "Spicy sujuk sausage finished with melted cheese.", options: [{ size: "", price: 6.99 }] },
      { name: "Mortadella & Cheese", ar: "مرتديلا وجبنة", desc: "Mortadella slices baked with warm melted cheese.", options: [{ size: "", price: 6.99 }] },
      { name: "Donair & Cheese", ar: "دونير وجبنة", desc: "Spiced donair meat baked with creamy melted cheese.", options: [{ size: "", price: 6.99 }] },
      { name: "Royal Bake Special", ar: "منقوشة رويال بيك", desc: "Our house signature manoushe — a loaded blend of the flavours we're known for.", options: [{ size: "", price: 9.99 }] },
      { name: "Nutella & Banana", ar: "نوتيلا وموز", desc: "Warm Nutella topped with fresh sliced bananas.", options: [{ size: "", price: 5.99 }] },
    ],
  },
  {
    id: "mini-pies", label: "Mini Pies", ar: "معجنات",
    note: "Sold by the dozen — perfect for sharing, meetings and events.",
    items: [
      { name: "Mini Cheese", ar: "جبنة ميني", desc: "Melted cheese baked on soft, bite-sized dough until golden.", options: [{ size: "Dozen", price: 17.99 }] },
      { name: "Mini Zaatar", ar: "زعتر ميني", desc: "Za'atar and olive oil over warm dough with an aromatic finish.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Mini Kishik", ar: "كشك ميني", desc: "Tangy kishik baked on soft dough with a rich, earthy flavour.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Mini Pizza", ar: "بيتزا ميني", desc: "Tomato sauce and melted cheese on fluffy mini flatbread.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Spinach", ar: "سبانخ", desc: "Fresh spinach and herbs folded into warm dough with citrus notes.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Sfeeha", ar: "صفيحة", desc: "Seasoned meat pastry baked until savoury, tender and golden.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Potato", ar: "فطيرة بطاطا", desc: "Seasoned potato filling wrapped in soft, comforting pastry.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Feta & Walnuts", ar: "فيتا وجوز", desc: "Creamy feta and crunchy walnuts baked together.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Shami Cheese", ar: "جبنة شامية", desc: "Traditional cheese-filled pastry with Middle Eastern flavours.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Cheese Roll", ar: "رقاقات جبنة", desc: "Rolled pastry with melty cheese, baked golden.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Musakhan Roll", ar: "رقاقات مسخن", desc: "Sumac chicken and onions wrapped in pastry with deep savoury flavour.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Chicken Pocket", ar: "فطيرة دجاج", desc: "Flaky pastry filled with seasoned chicken, baked crisp and warm.", options: [{ size: "Dozen", price: 17.99 }] },
      { name: "Cheese Samosa", ar: "سمبوسة جبنة", desc: "Crispy pastry stuffed with melted cheese, baked to a golden finish.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Esh-Bulbul", ar: "عش البلبل", desc: "Crisp layered pastry filled with seasoned meat, baked golden.", options: [{ size: "Dozen", price: 19.99 }] },
      { name: "Mini Cheese Croissant", ar: "ميني كروسان جبنة", desc: "Flaky croissant pastry filled with warm melted cheese.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Mini Zaatar Croissant", ar: "ميني كروسان زعتر", desc: "Buttery croissant layered with za'atar and olive oil.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Mini Hotdog Croissant", ar: "ميني كروسان هوت دوغ", desc: "Mini croissant wrapped around a savoury hotdog with a buttery finish.", options: [{ size: "Dozen", price: 11.99 }] },
      { name: "Mini Nutella Croissant", ar: "ميني كروسان نوتيلا", desc: "Flaky croissant filled with rich Nutella, baked warm.", options: [{ size: "Dozen", price: 11.99 }] },
    ],
  },
  {
    id: "wraps", label: "Wraps", ar: "صندويش",
    items: [
      { name: "Arabi Style Falafel", ar: "فلافل عربي", desc: "Crispy falafel with fresh veggies and tahini — comes with fries and a drink.", options: [{ size: "Combo", price: 15.99 }] },
      { name: "Falafel Wrap", ar: "فلافل", desc: "Crispy chickpea falafel, fresh vegetables and tahini in warm saj bread.", options: [{ size: "", price: 11.99 }] },
      { name: "Shish Tawouk Wrap", ar: "شيش طاووق", desc: "Grilled marinated chicken, garlic sauce and pickles rolled in saj bread.", options: [{ size: "", price: 13.99 }] },
      { name: "Beef Kabab Wrap", ar: "كباب لحمة", desc: "Char-grilled kafta kabab with onions, sumac and fresh vegetables.", options: [{ size: "", price: 13.99 }] },
      { name: "Beef Tenderloin Wrap", ar: "لحمة شقف", desc: "Tender grilled beef, garlic sauce and crisp vegetables in warm bread.", options: [{ size: "", price: 14.99 }] },
      { name: "Fajita Wrap", ar: "فاهيتا", desc: "Grilled chicken, peppers and onions with a smoky fajita seasoning.", options: [{ size: "", price: 13.99 }] },
    ],
  },
  {
    id: "bbq", label: "BBQ & Mains", ar: "مشاوي",
    items: [
      { name: "Lamb Chops", ar: "لحمة شقف", desc: "Tender grilled lamb chops seasoned with spices and cooked over open flame.", options: [{ size: "", price: 20.99 }] },
      { name: "Shish Tawook", ar: "شيش طاووق", desc: "Marinated chicken skewers grilled until smoky, juicy and perfectly charred.", options: [{ size: "", price: 19.99 }] },
      { name: "Kafta Kebab", ar: "كباب كفتة", desc: "Seasoned ground beef kebab grilled with herbs, onions and spices.", options: [{ size: "", price: 19.99 }] },
      { name: "Halabi Kebab", ar: "كباب حلبي", desc: "Traditional Aleppo-style kebab prepared with spices and grilled over charcoal.", options: [{ size: "", price: 19.99 }] },
      { name: "Cheese Kebab", ar: "كباب بالجبنة", desc: "Juicy grilled kebab blended with melted cheese for a rich, savoury flavour.", options: [{ size: "", price: 19.99 }] },
    ],
  },
  {
    id: "bowls", label: "Bowls", ar: "أطباق",
    note: "Choose a fresh garden-salad base or seasoned rice.",
    items: [
      { name: "Beef Kabab Salad Bowl", ar: "", desc: "Char-grilled kafta kabab over a fresh garden salad with house dressing.", options: [{ size: "Salad", price: 14.99 }] },
      { name: "Falafel Salad Bowl", ar: "", desc: "Crispy falafel over a fresh garden salad with tahini and house dressing.", options: [{ size: "Salad", price: 14.99 }] },
      { name: "Shish Tawouk Salad Bowl", ar: "", desc: "Grilled marinated chicken over a crisp garden salad with dressing.", options: [{ size: "Salad", price: 14.99 }] },
      { name: "Shish Tawouk & Beef Kabab Salad Bowl", ar: "", desc: "Grilled chicken and kafta kabab over a fresh salad — the best of both.", options: [{ size: "Salad", price: 14.99 }] },
      { name: "Beef Tenderloin Salad Bowl", ar: "", desc: "Tender grilled beef over a fresh garden salad with house dressing.", options: [{ size: "Salad", price: 17.99 }] },
      { name: "Royal BBQ Salad Bowl", ar: "", desc: "A generous mix of our grilled favourites over a fresh garden salad.", options: [{ size: "Salad", price: 18.99 }] },
      { name: "Beef Kabab Rice Bowl", ar: "", desc: "Char-grilled kafta kabab over seasoned rice with grilled vegetables.", options: [{ size: "Rice", price: 14.99 }] },
      { name: "Falafel Rice Bowl", ar: "", desc: "Crispy falafel over seasoned rice with grilled vegetables and sauce.", options: [{ size: "Rice", price: 14.99 }] },
      { name: "Shish Tawouk Rice Bowl", ar: "", desc: "Grilled marinated chicken over seasoned rice with grilled vegetables.", options: [{ size: "Rice", price: 14.99 }] },
      { name: "Mix BBQ Rice Bowl", ar: "", desc: "An assortment of grilled meats over seasoned rice with vegetables.", options: [{ size: "Rice", price: 14.99 }] },
      { name: "Beef Tenderloin Rice Bowl", ar: "", desc: "Tender grilled beef over seasoned rice with grilled vegetables and sauce.", options: [{ size: "Rice", price: 17.99 }] },
      { name: "Royal BBQ Rice Bowl", ar: "", desc: "A generous mix of our grilled favourites over seasoned rice.", options: [{ size: "Rice", price: 18.99 }] },
    ],
  },
  {
    id: "platters", label: "Family Platters", ar: "صحن عائلي",
    note: "Please allow advance notice for large orders and events.",
    items: [
      { name: "3 People", ar: "٣ أشخاص", desc: "Mixed BBQ platter with shish tawook, kafta kebab, lamb chops, grilled vegetables, rice, fries, garlic sauce and fresh pita.", options: [{ size: "Serves 3", price: 59.99 }] },
      { name: "4 People", ar: "٤ أشخاص", desc: "Large mixed grill with kebabs, chicken tawook, lamb chops, grilled vegetables, rice, fries, pickles and warm pita.", options: [{ size: "Serves 4", price: 79.99 }] },
      { name: "5 People", ar: "٥ أشخاص", desc: "Family-style BBQ with assorted grilled meats, rice, fries, garlic sauce, pickles and freshly baked pita.", options: [{ size: "Serves 5", price: 99.99 }] },
      { name: "10 People", ar: "١٠ أشخاص", desc: "Generous mixed grill tray with assorted kebabs, tawook, lamb chops, rice, fries, sauces, pickles and pita.", options: [{ size: "Serves 10", price: 189.99 }] },
      { name: "20 People", ar: "٢٠ أشخاص", desc: "Catering-style BBQ with assorted grilled meats, traditional sides, sauces, rice, fries and warm pita.", options: [{ size: "Serves 20", price: 349.99 }] },
    ],
  },
  {
    id: "drinks", label: "Drinks", ar: "مشروبات",
    items: [
      { name: "Water", ar: "مياه", desc: "Refreshing bottled water served chilled.", options: [{ size: "", price: 1.99 }], img: "images/menu/drink-water.jpg", photo: true },
      { name: "Pop", ar: "غازيات", desc: "Assorted soft drinks served cold and refreshing.", options: [{ size: "", price: 1.99 }], img: "images/menu/drink-pop.jpg", photo: true },
      { name: "Juice", ar: "عصير", desc: "Refreshing fruit juice served cold with a naturally sweet flavour.", options: [{ size: "", price: 2.99 }] },
      { name: "Ayran", ar: "عيران", desc: "Traditional yogurt drink served cold, smooth and refreshing.", options: [{ size: "", price: 2.99 }] },
      { name: "Redbull", ar: "ريدبول", desc: "Energy drink served chilled for a refreshing boost.", options: [{ size: "", price: 2.99 }] },
      { name: "Arabic Coffee", ar: "قهوة عربية", desc: "Traditional Arabic coffee brewed with cardamom, served warm and aromatic.", options: [{ size: "", price: 4.99 }] },
      { name: "Tea Pot", ar: "إبريق شاي", desc: "Freshly brewed pot of tea served hot with rich aroma.", options: [{ size: "", price: 5.99 }] },
    ],
  },
  { id: "sweets", label: "Sweets", ar: "حلويات", soon: true, items: [] },
];

/* ---------------------------------------------------------------------
   DISH PHOTOS — real Royal Bake artwork in images/menu/<cat>-<slug>.png.
   Wraps, Bowls and the house Special weren't on the old menu → stock.
   --------------------------------------------------------------------- */
const PX = (id) => `images/photos/p-${id}.jpg`;   // self-hosted (was Pexels hotlink)
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const PHOTO_CATS = ["breakfast", "appetizers", "manakish", "mini-pies", "bbq", "platters", "drinks"];

function dishImage(name, cat) {
  if (PHOTO_CATS.includes(cat) && !(cat === "manakish" && /special/i.test(name))) {
    return `images/menu/${cat}-${slugify(name)}.png`;
  }
  if (cat === "bowls") return PX(5083910);
  if (cat === "wraps") return /falafel/i.test(name) ? PX(4722522) : PX(5779364);
  return PX(34349100); // Royal Bake Special
}

/* ---------------------------------------------------------------------
   RENDER (only on the Menu page)
   --------------------------------------------------------------------- */
(function menuPage() {
  const tabsEl = $("#menuTabs");
  const gridEl = $("#menuGrid");
  if (!tabsEl || !gridEl) return;

  let activeCat = MENU[0].id;

  function renderTabs() {
    tabsEl.innerHTML = MENU.map(
      (c) => `<button class="tab${c.id === activeCat ? " is-active" : ""}" role="tab" data-cat="${c.id}" aria-selected="${c.id === activeCat}">
        ${esc(c.label)}${c.ar ? `<span class="ar" dir="rtl">${esc(c.ar)}</span>` : ""}
      </button>`
    ).join("");
  }

  function renderGrid() {
    const cat = MENU.find((c) => c.id === activeCat);
    if (!cat) return;

    if (cat.soon || !cat.items.length) {
      gridEl.innerHTML = `<div class="menu-soon">
        <h3>Coming Soon</h3>
        <p>Our ${esc(cat.label.toLowerCase())} selection is on the way — freshly baked and worth the wait.</p>
      </div>`;
      return;
    }

    const note = cat.note ? `<p class="menu-note center" style="grid-column:1/-1;margin:-1rem 0 1rem">${esc(cat.note)}</p>` : "";

    const cards = cat.items.map((item, i) => {
      const opts = item.options.map((o) => {
        const label = o.size ? `<span class="sz">${esc(o.size)}</span> ` : "";
        return `<button class="add-chip" data-name="${esc(item.name)}" data-size="${esc(o.size)}" data-price="${o.price}">
          <span class="plus">＋</span>${label}${money(o.price)}
        </button>`;
      }).join("");

      const img = item.img || dishImage(item.name, cat.id);

      return `<article class="dish reveal" style="--d:${(i % 4) * 60}ms">
        <div class="dish-thumb${item.photo ? " dish-thumb--photo" : ""}">
          <img src="${esc(img)}" alt="${esc(item.name)}" loading="lazy" decoding="async"
               onerror="this.closest('.dish-thumb').classList.add('no-img'); this.remove();" />
        </div>
        <div class="dish-body">
          <div class="dish-head">
            <h3 class="dish-name">${esc(item.name)}</h3>
            ${item.ar ? `<span class="dish-ar" dir="rtl">${esc(item.ar)}</span>` : ""}
          </div>
          <p class="dish-desc">${esc(item.desc)}</p>
          <div class="dish-options">${opts}</div>
        </div>
      </article>`;
    }).join("");

    gridEl.innerHTML = note + cards;
  }

  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    renderTabs();
    renderGrid();
  });

  gridEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".add-chip");
    if (!chip) return;
    addToCart(chip.dataset.name, chip.dataset.size, parseFloat(chip.dataset.price));
    chip.classList.remove("pulse"); void chip.offsetWidth; chip.classList.add("pulse");
  });

  renderTabs();
  renderGrid();
})();
