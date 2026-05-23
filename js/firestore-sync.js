const CACHE_TTL = 5 * 60 * 1000;

function cacheGet(key) {
  var raw = localStorage.getItem('bt_cache_' + key);
  if (!raw) return null;
  try {
    var parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL) {
      localStorage.removeItem('bt_cache_' + key);
      return null;
    }
    return parsed.data;
  } catch (e) { return null; }
}

function cacheSet(key, data) {
  localStorage.setItem('bt_cache_' + key, JSON.stringify({ data: data, ts: Date.now() }));
}

var defaultProducts = [
  {
    id: '1',
    slug: 'pro-trading',
    name: 'Pro Trading',
    price: 1399000,
    description: 'Trọn bộ 33 bài học xây dựng hệ thống giao dịch từ A-Z. Cấu trúc thị trường, điểm vào lệnh, backtest, quản lý vốn.',
    image: 'https://images.pexels.com/photos/5833752/pexels-photo-5833752.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    category: 'course',
    lessons: 33,
    rating: 4.9,
    students: 500,
    active: true
  }
];

async function getProducts(forceRefresh) {
  if (!forceRefresh) {
    var cached = cacheGet('products');
    if (cached) return cached;
  }

  try {
    var { db, collection, getDocs, query, orderBy } = await import('/firebase.js');
    var snapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
    var products = snapshot.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()); });
    if (products.length > 0) {
      cacheSet('products', products);
      return products;
    }
  } catch (e) {
    console.warn('Firestore unavailable, using defaults');
  }

  return defaultProducts;
}

async function getProduct(id) {
  var products = await getProducts();
  return products.find(function(p) { return String(p.id) === String(id); }) || null;
}

async function createOrder(orderData) {
  try {
    var { db, addDoc, collection, serverTimestamp } = await import('/firebase.js');
    var docRef = await addDoc(collection(db, 'orders'), Object.assign({}, orderData, {
      paymentStatus: 'pending',
      createdAt: serverTimestamp()
    }));
    return docRef.id;
  } catch (e) {
    console.warn('Firestore unavailable, order saved locally');
    return orderData.orderNumber;
  }
}

window.DataLayer = {
  getProducts: getProducts,
  getProduct: getProduct,
  createOrder: createOrder,
  cacheGet: cacheGet,
  cacheSet: cacheSet
};
