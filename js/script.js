/* =====================================================================
   ROYAL BAKE — script.js
   Menu data + rendering, cart, checkout, nav, scroll reveal.
   No backend: "Place Order" collects the order and hands it off via
   phone / a pre-filled email. Wire CONFIG.orderEmail (or an API call
   inside placeOrder) when you're ready to take orders automatically.
   ===================================================================== */

const CONFIG = {
  restaurant: "Royal Bake",
  phone: "(403) 680 4050",
  orderEmail: "royalbake2025@gmail.com", // change to order@royalbake.ca once set up
  currency: "$",
};

/* ---------------------------------------------------------------------
   MENU DATA
   Descriptions & Arabic names sourced from royalbake.ca; Wraps + Bowls
   added from the in-store menu spreadsheet. Prices may change in store.
   Each item: { name, ar, desc, options:[{ size, price }] }
   - size "" renders as a plain "＋ $price" button
   --------------------------------------------------------------------- */
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
      { name: "Water", ar: "مياه", desc: "Refreshing bottled water served chilled.", options: [{ size: "", price: 1.99 }] },
      { name: "Pop", ar: "غازيات", desc: "Assorted soft drinks served cold and refreshing.", options: [{ size: "", price: 1.99 }] },
      { name: "Juice", ar: "عصير", desc: "Refreshing fruit juice served cold with a naturally sweet flavour.", options: [{ size: "", price: 2.99 }] },
      { name: "Ayran", ar: "عيران", desc: "Traditional yogurt drink served cold, smooth and refreshing.", options: [{ size: "", price: 2.99 }] },
      { name: "Redbull", ar: "ريدبول", desc: "Energy drink served chilled for a refreshing boost.", options: [{ size: "", price: 2.99 }] },
      { name: "Arabic Coffee", ar: "قهوة عربية", desc: "Traditional Arabic coffee brewed with cardamom, served warm and aromatic.", options: [{ size: "", price: 4.99 }] },
      { name: "Tea Pot", ar: "إبريق شاي", desc: "Freshly brewed pot of tea served hot with rich aroma.", options: [{ size: "", price: 5.99 }] },
    ],
  },
  {
    id: "sweets", label: "Sweets", ar: "حلويات",
    soon: true,
    items: [],
  },
];

/* ---------------------------------------------------------------------
   HELPERS
   --------------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const money = (n) => CONFIG.currency + n.toFixed(2);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------------------------------------------------------------------
   DISH PHOTOS
   Representative food photography (Pexels, free to use), matched to each
   dish by keyword so every item shows a relevant picture. To use your OWN
   photo for a dish, drop it in images/menu/ and return that path here
   instead of a Pexels id — e.g. `return "images/menu/hummus.jpg";`
   --------------------------------------------------------------------- */
const PX = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400`;

function dishImage(name, cat) {
  const n = name.toLowerCase();
  const has = (re) => re.test(n);

  switch (cat) {
    case "drinks":
      if (has(/coffee|tea/)) return PX(5113071);   // ornate pot pour
      if (has(/juice/))       return PX(2479242);   // fruit juice
      if (has(/ayran/))       return PX(8620365);   // pale drink
      return PX(9685229);                           // pop / water / redbull
    case "sweets":
      return PX(5323489);                           // baklava
    case "bbq":
      if (has(/tawook|tawouk|chicken/)) return PX(8104932);
      if (has(/lamb/))                  return PX(28086339);
      return PX(8813933);                           // kebab skewers
    case "wraps":
      if (has(/falafel/)) return PX(4722522);
      return PX(5779364);                           // grilled wrap
    case "bowls":
      return PX(5083910);                           // salad/rice bowls
    case "platters":
      return PX(8813933);                           // mixed grill
    case "mini-pies":
      if (has(/pizza/))   return PX(34349100);
      if (has(/nutella/)) return PX(5323489);
      if (has(/spinach/)) return PX(20182330);
      return PX(6889715);                           // fatayer triangles
    default: // breakfast, appetizers, manakish
      if (has(/nutella|chocolate/))              return PX(5323489);
      if (has(/tabouli|tabbouleh|tabouleh/))     return PX(5191811);
      if (has(/fattoush|greek|salad/))           return PX(4899790);
      if (has(/hummus|mutabal|baba|garlic sauce/)) return PX(6419394);
      if (has(/falafel|kibbeh/))                 return PX(4722522);
      if (has(/spinach/))                        return PX(20182330);
      if (has(/veggie|vegetable|khodar|khodra|grape/)) return PX(4899790);
      if (has(/zaatar|za'atar|kishk/))           return PX(7935287);
      if (has(/mahamara|muhamara|muhammara/))    return PX(34349100);
      if (has(/labneh/))                         return PX(2452060);
      if (has(/meat|lahm|kafta|kebab|sujuk|donair|mortadella|awarma|sfeeha|musakhan|maqla/)) return PX(28104857);
      if (has(/cheese/))                         return PX(27359350);
      if (has(/pizza|special/))                  return PX(34349100);
      if (has(/foul|fatteh|msabbaha|balila|fava|egg|beid|scrambled/)) return PX(5191851);
      if (has(/mamounieh/))                      return PX(5323489);
      if (has(/fries|batata|potato/))            return PX(6419394);
      if (cat === "breakfast")  return PX(5191851);
      if (cat === "appetizers") return PX(6419394);
      return PX(27359350);                          // manakish default
  }
}

/* ---------------------------------------------------------------------
   RENDER MENU (tabs + grid)
   --------------------------------------------------------------------- */
const tabsEl = $("#menuTabs");
const gridEl = $("#menuGrid");
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
      <div class="dish-thumb">
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
  observeReveals(gridEl);
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

/* ---------------------------------------------------------------------
   CART
   --------------------------------------------------------------------- */
let cart = []; // { name, size, price, qty }
const cartCountEl = $("#cartCount");
const cartBodyEl = $("#cartBody");
const cartSubtotalEl = $("#cartSubtotal");
const checkoutBtn = $("#checkoutBtn");

const cartKey = (name, size) => name + "||" + size;

function addToCart(name, size, price) {
  const key = cartKey(name, size);
  const found = cart.find((l) => cartKey(l.name, l.size) === key);
  if (found) found.qty++;
  else cart.push({ name, size, price, qty: 1 });
  renderCart();
  bumpCart();
  toast(`Added ${name}${size ? " · " + size : ""}`);
}

function changeQty(key, delta) {
  const line = cart.find((l) => cartKey(l.name, l.size) === key);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart = cart.filter((l) => cartKey(l.name, l.size) !== key);
  renderCart();
}

const removeLine = (key) => { cart = cart.filter((l) => cartKey(l.name, l.size) !== key); renderCart(); };
const cartSubtotal = () => cart.reduce((s, l) => s + l.price * l.qty, 0);
const cartQty = () => cart.reduce((s, l) => s + l.qty, 0);

function renderCart() {
  const qty = cartQty();
  cartCountEl.textContent = qty;
  cartCountEl.dataset.empty = qty === 0 ? "true" : "false";

  if (!cart.length) {
    cartBodyEl.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1 12.2a1.8 1.8 0 01-1.8 1.6H8.8A1.8 1.8 0 017 19.2L6 7z"/><path d="M9 9V6.5a3 3 0 016 0V9"/></svg>
      <p>Your order is empty.<br>Add something delicious from the menu.</p>
    </div>`;
    checkoutBtn.disabled = true;
  } else {
    cartBodyEl.innerHTML = cart.map((l) => {
      const key = cartKey(l.name, l.size);
      return `<div class="cart-item">
        <div class="cart-item-main">
          <div class="cart-item-name">${esc(l.name)}</div>
          ${l.size ? `<div class="cart-item-sz">${esc(l.size)}</div>` : ""}
          <div class="cart-item-price">${money(l.price * l.qty)}</div>
          <div class="qty">
            <button data-key="${esc(key)}" data-act="dec" aria-label="Decrease quantity">–</button>
            <span>${l.qty}</span>
            <button data-key="${esc(key)}" data-act="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-key="${esc(key)}" data-act="rm">Remove</button>
      </div>`;
    }).join("");
    checkoutBtn.disabled = false;
  }
  cartSubtotalEl.textContent = money(cartSubtotal());
}

cartBodyEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const { key, act } = btn.dataset;
  if (act === "inc") changeQty(key, 1);
  else if (act === "dec") changeQty(key, -1);
  else if (act === "rm") removeLine(key);
});

function bumpCart() {
  $("#cartBtn").animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }],
    { duration: 320, easing: "cubic-bezier(.22,.61,.36,1)" }
  );
}

/* ---------------------------------------------------------------------
   DRAWER + OVERLAY
   --------------------------------------------------------------------- */
const overlay = $("#overlay");
const drawer = $("#cartDrawer");

function openDrawer() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); showOverlay(); }
function closeDrawer() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); maybeHideOverlay(); }
function showOverlay() { overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add("show")); }
function maybeHideOverlay() {
  if (drawer.classList.contains("open") || $("#checkoutModal").classList.contains("open")) return;
  overlay.classList.remove("show");
  setTimeout(() => { if (!overlay.classList.contains("show")) overlay.hidden = true; }, 300);
}

$("#cartBtn").addEventListener("click", openDrawer);
$("#cartClose").addEventListener("click", closeDrawer);
overlay.addEventListener("click", () => { closeDrawer(); closeModal(); });

/* ---------------------------------------------------------------------
   CHECKOUT MODAL
   --------------------------------------------------------------------- */
const modal = $("#checkoutModal");
const formStep = $("#checkoutForm");
const doneStep = $("#checkoutDone");
let orderType = "Pickup";

function renderCheckoutSummary() {
  const rows = cart.map((l) =>
    `<div class="row"><span>${l.qty}× ${esc(l.name)}${l.size ? " (" + esc(l.size) + ")" : ""}</span><span>${money(l.price * l.qty)}</span></div>`
  ).join("");
  $("#checkoutSummary").innerHTML = rows + `<div class="row total"><span>Subtotal</span><span>${money(cartSubtotal())}</span></div>`;
}

function openModal() {
  if (!cart.length) return;
  renderCheckoutSummary();
  formStep.hidden = false;
  doneStep.hidden = true;
  $("#orderStatus").textContent = "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  showOverlay();
  setTimeout(() => $("#oName").focus(), 350);
}
function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); maybeHideOverlay(); }

$("#checkoutBtn").addEventListener("click", () => { closeDrawer(); openModal(); });
$("#checkoutClose").addEventListener("click", closeModal);

$$(".seg-btn").forEach((b) =>
  b.addEventListener("click", () => {
    $$(".seg-btn").forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-pressed", "false"); });
    b.classList.add("is-active");
    b.setAttribute("aria-pressed", "true");
    orderType = b.dataset.type;
  })
);

function buildOrderText() {
  const name = $("#oName").value.trim();
  const phone = $("#oPhone").value.trim();
  const time = $("#oTime").value.trim();
  const notes = $("#oNotes").value.trim();
  const L = [];
  L.push(`New ${orderType} order — ${CONFIG.restaurant}`);
  L.push("");
  L.push(`Name: ${name}`);
  L.push(`Phone: ${phone}`);
  if (time) L.push(`Preferred time: ${time}`);
  L.push("");
  L.push("Order:");
  cart.forEach((l) => L.push(`• ${l.qty}x ${l.name}${l.size ? " (" + l.size + ")" : ""} — ${money(l.price * l.qty)}`));
  L.push("");
  L.push(`Subtotal: ${money(cartSubtotal())} (taxes calculated in store)`);
  if (notes) { L.push(""); L.push(`Notes: ${notes}`); }
  return L.join("\n");
}

$("#placeOrder").addEventListener("click", () => {
  const nameInp = $("#oName");
  const phoneInp = $("#oPhone");
  let ok = true;
  [nameInp, phoneInp].forEach((inp) => {
    const field = inp.closest(".field");
    if (!inp.value.trim()) { field.classList.add("invalid"); ok = false; }
    else field.classList.remove("invalid");
  });
  const status = $("#orderStatus");
  if (!ok) { status.textContent = "Please add your name and phone number."; status.classList.add("err"); return; }
  status.textContent = ""; status.classList.remove("err");

  const subject = `${orderType} order — ${CONFIG.restaurant}`;
  const mailto = `mailto:${CONFIG.orderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildOrderText())}`;
  $("#emailOrder").setAttribute("href", mailto);

  $("#doneMsg").innerHTML = `Thanks, <strong>${esc(nameInp.value.trim())}</strong>! We've noted your <strong>${orderType}</strong> order.<br>Online ordering isn't fully live yet — please call to confirm, or email your order below and we'll have it ready.`;
  formStep.hidden = true;
  doneStep.hidden = false;
});

$("#orderAgain").addEventListener("click", () => { cart = []; renderCart(); closeModal(); });

/* ---------------------------------------------------------------------
   CONTACT FORM (mailto — no backend)
   --------------------------------------------------------------------- */
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#cName"), email = $("#cEmail"), msg = $("#cMsg");
  let ok = true;
  [name, email, msg].forEach((inp) => {
    const field = inp.closest(".field");
    const bad = !inp.value.trim() || (inp.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value.trim()));
    field.classList.toggle("invalid", bad);
    if (bad) ok = false;
  });
  const status = $("#contactStatus");
  if (!ok) { status.textContent = "Please fill in every field with a valid email."; status.classList.add("err"); return; }
  const body = `From: ${name.value.trim()} <${email.value.trim()}>\n\n${msg.value.trim()}`;
  const mailto = `mailto:${CONFIG.orderEmail}?subject=${encodeURIComponent("Website message from " + name.value.trim())}&body=${encodeURIComponent(body)}`;
  status.classList.remove("err");
  status.textContent = "Opening your email app to send…";
  window.location.href = mailto;
  e.target.reset();
});

/* ---------------------------------------------------------------------
   NAV: hamburger, close-on-click, header shadow on scroll
   --------------------------------------------------------------------- */
const hamburger = $("#hamburger");
const nav = $("#primaryNav");
hamburger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open ? "true" : "false");
});
$$(".nav-link").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
}));

/* ---------------------------------------------------------------------
   SMOOTH ANCHOR SCROLL  (eased, longer glide than the native jump)
   --------------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function smoothScrollTo(target) {
  const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 72;
  const startY = window.scrollY;
  const destY = Math.max(0, target.getBoundingClientRect().top + startY - headerH);
  const distance = destY - startY;
  if (Math.abs(distance) < 4) return;

  // Duration scales with distance so short hops are quick and long ones glide.
  const duration = Math.min(1200, Math.max(500, Math.abs(distance) * 0.6));
  const html = document.documentElement;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto"; // stop CSS smooth from fighting our animation

  let start = null;
  function step(now) {
    if (start === null) start = now;
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + distance * easeInOutCubic(t));
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      html.style.scrollBehavior = prevBehavior;
    }
  }
  requestAnimationFrame(step);
}

$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#") { e.preventDefault(); return; } // inert placeholder links (e.g. "coming soon")
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target || prefersReducedMotion) return; // let the browser handle it
    e.preventDefault();
    smoothScrollTo(target);
    history.pushState(null, "", id);             // keep the URL hash in sync
  });
});

const header = $("#siteHeader");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });

document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); closeModal(); } });

/* ---------------------------------------------------------------------
   SCROLL REVEAL
   --------------------------------------------------------------------- */
let revealObserver;
function observeReveals(ctx = document) {
  if (!("IntersectionObserver" in window)) { $$(".reveal", ctx).forEach((el) => el.classList.add("in")); return; }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }
  $$(".reveal", ctx).forEach((el) => { if (!el.classList.contains("in")) revealObserver.observe(el); });
}

/* ---------------------------------------------------------------------
   TOAST
   --------------------------------------------------------------------- */
let toastTimer;
function toast(message) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------------------------------------------------------------------
   INIT
   --------------------------------------------------------------------- */
(function init() {
  renderTabs();
  renderGrid();
  renderCart();
  observeReveals(document);
  onScroll();
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
