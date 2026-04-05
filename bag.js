(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  window.toggleTheme = function() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = next === 'dark' ? 'Light' : 'Dark';
  };
  document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      const cur = document.documentElement.getAttribute('data-theme');
      btn.textContent = cur === 'dark' ? 'Light' : 'Dark';
    }
  });
  function getBag() {
    try { return JSON.parse(localStorage.getItem('bag') || '[]'); } catch { return []; }
  }
  function saveBag(bag) {
    localStorage.setItem('bag', JSON.stringify(bag));
  }
  window.addToBag = function(code, name, price, size) {
    const bag = getBag();
    const existing = bag.find(i => i.code === code && i.size === size);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      bag.push({ code, name, price, size, qty: 1 });
    }
    saveBag(bag);
    renderBag();
    openBag();
  };
  window.removeFromBag = function(code, size) {
    let bag = getBag().filter(i => !(i.code === code && i.size === size));
    saveBag(bag);
    renderBag();
  };
  function renderBag() {
    const bag = getBag();
    const itemsEl = document.getElementById('bagItems');
    const countEl = document.getElementById('bagCount');
    const totalEl = document.getElementById('bagTotal');
    if (!itemsEl) return;
    const total_qty = bag.reduce((s, i) => s + (i.qty || 1), 0);
    if (countEl) countEl.textContent = total_qty > 0 ? `(${total_qty})` : '';
    if (bag.length === 0) {
      itemsEl.innerHTML = '<p class="bag-empty">Your bag is empty.</p>';
      if (totalEl) totalEl.textContent = '$0';
      return;
    }
    itemsEl.innerHTML = bag.map(item => `
      <div class="bag-item">
        <div class="bag-item-info">
          <div class="bag-item-code">${item.code}</div>
          <div class="bag-item-name">${item.name}</div>
          <div class="bag-item-size">Size: ${item.size}${item.qty > 1 ? ` &times; ${item.qty}` : ''}</div>
        </div>
        <div class="bag-item-price">$${item.price}</div>
        <button class="bag-item-remove" onclick="removeFromBag('${item.code}','${item.size}')">×</button>
      </div>
    `).join('');
    const total = bag.reduce((s, i) => s + parseFloat(String(i.price).replace(/,/g,'')) * (i.qty || 1), 0);
    if (totalEl) totalEl.textContent = '$' + total.toLocaleString();
  }
  window.openBag = function() {
    document.getElementById('bagOverlay').classList.add('open');
    renderBag();
  };
  window.closeBag = function() {
    document.getElementById('bagOverlay').classList.remove('open');
  };
  document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('bagOverlay');
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeBag();
      });
    }
    renderBag();
  });

})();
