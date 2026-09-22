// ─────────────────────────────────────────────
// Facebook Pixel — Track InitiateCheckout
// ─────────────────────────────────────────────
document.querySelectorAll('.payment-link').forEach(function(link) {
  link.addEventListener('click', function() {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'InitiateCheckout');
    }
  });
});

// ─────────────────────────────────────────────
// Compte à rebours — expire à minuit chaque jour
// ─────────────────────────────────────────────
(function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  // Récupère ou crée la date d'expiration (fin de la journée)
  const key = 'artisan360_expire';
  let expireMs = parseInt(localStorage.getItem(key) || '0', 10);
  const now = Date.now();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  if (!expireMs || expireMs <= now) {
    expireMs = endOfDay.getTime();
    localStorage.setItem(key, expireMs);
  }

  function tick() {
    const left = expireMs - Date.now();
    if (left <= 0) {
      el.textContent = 'EXPIRÉ';
      document.querySelector('.urgency-text').textContent = 'Offre terminée — Prix normal';
      document.querySelector('.urgency-link').style.display = 'none';
      return;
    }
    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);
    el.textContent =
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
})();

// ─────────────────────────────────────────────
const config = window.ARTISAN360 || {};
const hasPaymentLink = /^https?:\/\//.test(config.paymentUrl || "");

// Mise à jour de tous les emplacements de prix
if (config.price) {
  document.querySelectorAll('.price-placeholder').forEach((el) => {
    el.textContent = config.price;
  });
}

// Gestion des liens de paiement et des boutons
document.querySelectorAll('.payment-link').forEach((link) => {
  if (hasPaymentLink) {
    link.href = config.paymentUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener('click', (event) => {
      const isOrderBoxBtn = link.classList.contains('order-button');
      if (isOrderBoxBtn) {
        event.preventDefault();
        alert('Le lien de paiement sera activé dès que Chariow sera configuré.');
      } else {
        // Défilement doux vers la boîte de commande
        event.preventDefault();
        const orderSection = document.querySelector('#commande');
        if (orderSection) {
          orderSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
});

// Année automatique dans le footer
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Apparition intelligente du CTA flottant sur mobile
const mobileSticky = document.querySelector('#mobile-sticky');
const orderBox = document.querySelector('.order-box');

if (mobileSticky) {
  let isThrottled = false;

  const handleScroll = () => {
    if (isThrottled) return;
    isThrottled = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;
      const heroThreshold = 380;
      
      let isOverOrderBox = false;
      if (orderBox) {
        const rect = orderBox.getBoundingClientRect();
        // Si la boîte de commande est visible à l'écran
        if (rect.top < window.innerHeight && rect.bottom > 100) {
          isOverOrderBox = true;
        }
      }

      if (scrollY > heroThreshold && !isOverOrderBox) {
        mobileSticky.classList.add('visible');
      } else {
        mobileSticky.classList.remove('visible');
      }

      isThrottled = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();
}

