(function() {
  var CART_KEY = 'bt_cart';

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateAllBadges();
  }

  function addProduct(id, name, price) {
    var cart = getCart();
    var exists = cart.find(function(i) { return String(i.id) === String(id); });
    if (exists) return false;
    cart.push({ id: String(id), name: name, price: price, quantity: 1 });
    saveCart(cart);
    return true;
  }

  function removeProduct(id) {
    var cart = getCart().filter(function(i) { return String(i.id) !== String(id); });
    saveCart(cart);
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateAllBadges();
  }

  function getTotal() {
    return getCart().reduce(function(sum, item) { return sum + item.price * item.quantity; }, 0);
  }

  function getCount() {
    return getCart().length;
  }

  function updateAllBadges() {
    var badges = document.querySelectorAll('.cart-badge');
    var count = getCount();
    badges.forEach(function(badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', updateAllBadges);

  window.Cart = {
    get: getCart,
    add: addProduct,
    remove: removeProduct,
    clear: clearCart,
    total: getTotal,
    count: getCount,
    updateBadges: updateAllBadges
  };
})();
