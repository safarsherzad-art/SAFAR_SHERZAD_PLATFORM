const products = [
 {id:1,name:"iPhone 16 Pro",category:"مۆبایل و تابلێت",price:1250000,emoji:"📱",rating:"4.8",reviews:124,badge:"نوێ"},
 {id:2,name:"Samsung Galaxy S24",category:"مۆبایل و تابلێت",price:980000,emoji:"📲",rating:"4.6",reviews:98,badge:"پێشنیار"},
 {id:3,name:"PlayStation 5",category:"یاری",price:1480000,emoji:"🎮",rating:"4.9",reviews:210,badge:"نوێ"},
 {id:4,name:"Lenovo Legion 5",category:"کۆمپیوتەر و لەپتۆپ",price:1350000,emoji:"💻",rating:"4.7",reviews:86,badge:"پێشنیار"},
 {id:5,name:"AirPods Pro 2",category:"تەکنەلۆژیای ماڵ",price:520000,emoji:"🎧",rating:"4.8",reviews:156,badge:"نوێ"},
 {id:6,name:"Smart Watch Ultra",category:"تەکنەلۆژیای ماڵ",price:450000,emoji:"⌚",rating:"4.5",reviews:72,badge:"پێشنیار"},
 {id:7,name:"Gaming Controller",category:"یاری",price:125000,emoji:"🕹️",rating:"4.6",reviews:64,badge:""},
 {id:8,name:"Ultrabook 14",category:"کۆمپیوتەر و لەپتۆپ",price:890000,emoji:"🖥️",rating:"4.4",reviews:39,badge:""},
 {id:9,name:"Smart Speaker",category:"تەکنەلۆژیای ماڵ",price:175000,emoji:"🔊",rating:"4.5",reviews:51,badge:""}
];
let cart = [];
let wishlist = new Set();
let activeCategory = "هەموو";
let searchTerm = "";
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat("en-US").format(n) + " د.ع";
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600)}
function renderProducts(){
 const filtered=products.filter(p=>(activeCategory==="هەموو"||p.category===activeCategory)&&(`${p.name} ${p.category}`.toLowerCase().includes(searchTerm.toLowerCase())));
 $("#productGrid").innerHTML=filtered.map(p=>`<article class="product-card"><div class="product-visual"><span class="product-badge">${p.badge||p.category}</span><button class="heart ${wishlist.has(p.id)?"liked":""}" data-heart="${p.id}" aria-label="زیادکردن بۆ دڵخواز">♡</button><span class="product-emoji">${p.emoji}</span></div><h3>${p.name}</h3><div class="product-meta"><span class="star">★</span><b>${p.rating}</b><span>(${p.reviews})</span></div><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-cart" data-add="${p.id}" aria-label="زیادکردن بۆ سەبەتە">🛒</button></div></article>`).join("");
 $("#resultCount").textContent=`${filtered.length} بەرهەم`;
 $("#emptyState").classList.toggle("hidden",filtered.length>0);
}
function renderCart(){
 $("#cartCount").textContent=cart.reduce((sum,i)=>sum+i.qty,0);
 $("#cartItems").innerHTML=cart.length?cart.map(i=>`<div class="cart-line"><div class="mini-emoji">${i.emoji}</div><div><b>${i.name}</b><small>${money(i.price)}</small><div class="qty"><button data-qty="${i.id}" data-delta="-1">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-delta="1">+</button></div></div><button class="remove" data-remove="${i.id}">سڕینەوە</button></div>`).join(""):'<div class="empty"><span>🛒</span><h3>سەبەتەکەت بەتاڵە</h3><p>بەرهەمێک زیاد بکە بۆ دەستپێکردنی کڕین.</p></div>';
 $("#cartTotal").textContent=money(cart.reduce((sum,i)=>sum+i.price*i.qty,0));
}
function openDrawer(){renderCart();$("#overlay").classList.remove("hidden")}
function closeDrawer(){$("#overlay").classList.add("hidden")}
function openModal(content){$("#modalContent").innerHTML=content;$("#modalOverlay").classList.remove("hidden")}
function closeModal(){$("#modalOverlay").classList.add("hidden")}
function chooseCategory(category){activeCategory=category;document.querySelectorAll("[data-category]").forEach(b=>b.classList.toggle("active",b.classList.contains("nav-item")&&b.dataset.category===category));document.querySelectorAll(".chip").forEach(b=>b.classList.toggle("selected",b.dataset.category===category));renderProducts();$("#products").scrollIntoView({behavior:"smooth",block:"start"})}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){const p=products.find(x=>x.id===Number(add.dataset.add));const old=cart.find(x=>x.id===p.id);old?old.qty++:cart.push({...p,qty:1});renderCart();toast(`${p.name} زیادکرا بۆ سەبەتە`);return}
 const heart=e.target.closest("[data-heart]");if(heart){const id=Number(heart.dataset.heart);wishlist.has(id)?wishlist.delete(id):wishlist.add(id);renderProducts();toast(wishlist.has(id)?"زیادکرا بۆ دڵخوازەکان":"لە دڵخوازەکان لابرا");return}
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<1)cart=cart.filter(x=>x.id!==item.id)}renderCart();return}
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>x.id!==Number(rem.dataset.remove));renderCart();return}
 const cat=e.target.closest("[data-category]");if(cat){chooseCategory(cat.dataset.category);return}
 const service=e.target.closest("[data-service]");if(service){openModal(`<span class="eyebrow">داوای خزمەتگوزاری</span><h2>${service.dataset.service}</h2><p>زانیارییەکانت بنووسە تا داواکارییەکە ئامادە بکرێت. لەم وەشانەدا فۆرمەکە دیمۆیە و نانێردرێت بۆ سێرڤەر.</p><form id="serviceForm"><label>ناوت</label><input required placeholder="ناوی تەواو"><label>ژمارەی مۆبایل یان ئیمەیڵ</label><input required placeholder="پەیوەندی"><label>وردەکاری داواکاری</label><textarea rows="3" placeholder="پێویستیت چییە؟"></textarea><button class="primary">تۆمارکردنی دیمۆ</button></form>`);return}
});
$("#searchInput").addEventListener("input",e=>{searchTerm=e.target.value;renderProducts()});
$("#searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("#products").scrollIntoView({behavior:"smooth"})});
$("#cartJump").addEventListener("click",openDrawer);$("#closeDrawer").addEventListener("click",closeDrawer);$("#overlay").addEventListener("click",e=>{if(e.target===$("#overlay"))closeDrawer()});
$("#closeModal").addEventListener("click",closeModal);$("#modalOverlay").addEventListener("click",e=>{if(e.target===$("#modalOverlay"))closeModal()});
$("#shopNow").addEventListener("click",()=>$("#products").scrollIntoView({behavior:"smooth"}));$("#servicesJump").addEventListener("click",()=>$("#services").scrollIntoView({behavior:"smooth"}));
$("#wishlistJump").addEventListener("click",()=>{activeCategory="هەموو";searchTerm="";$("#searchInput").value="";const ids=[...wishlist];$("#productGrid").innerHTML=products.filter(p=>ids.includes(p.id)).map(p=>`<article class="product-card"><div class="product-visual"><span class="product-emoji">${p.emoji}</span></div><h3>${p.name}</h3><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-cart" data-add="${p.id}">🛒</button></div></article>`).join("");$("#resultCount").textContent=`${ids.length} دڵخواز`;$("#emptyState").classList.toggle("hidden",ids.length>0);$("#products").scrollIntoView({behavior:"smooth"})});
$("#accountBtn").addEventListener("click",()=>openModal('<span class="eyebrow">بە زوویی</span><h2>هەژماری بەکارهێنەر</h2><p>لە وەشانی دیمۆدا چوونەژوورەوە چالاک نییە. بۆ هەژماری ڕاستەقینە پێویستە سێرڤەر و سیستەمی پاراستنی وشەی نهێنی زیاد بکرێت.</p><button class="primary" id="modalOkay">باشە</button>'));
$("#checkoutBtn").addEventListener("click",()=>{if(!cart.length){toast("سەبەتەکە بەتاڵە");return}closeDrawer();openModal(`<span class="eyebrow">داواکاری دیمۆ</span><h2>داواکارییەکەت ئامادەیە</h2><p>کۆی گشتی: <strong>${money(cart.reduce((s,i)=>s+i.price*i.qty,0))}</strong></p><p>ئەمە تەنها دیمۆیە؛ داواکارییەکە نانێردرێت و پارەدان ناکرێت. بۆ چالاککردنی گەیاندن و پارەدان، پێویستە backend و داتابەیس زیاد بکرێت.</p><button class="primary" id="modalOkay">تێگەیشتم</button>`);});
$("#modalContent").addEventListener("click",e=>{if(e.target.id==="modalOkay")closeModal()});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("سوپاس! فۆرمەکە دیمۆیە و ئیمەیڵەکە نانێردرێت.");e.target.reset()});
$("#resetSearch").addEventListener("click",()=>{searchTerm="";activeCategory="هەموو";$("#searchInput").value="";chooseCategory("هەموو")});
renderProducts();renderCart();
