// ============================================================
// main.js — весь JavaScript для Blumenshop лендінгу
// Структура:
//   1. Мобільне меню (бургер)
//   2. Кнопка у навбарі при скролі
//   3. Анімація появи секцій (Scroll Reveal)
//   4. Слайдер відгуків
//   5. Валідація форми
//   6. Кнопка "Додати в кошик"
//   7. Кнопка "Повернутись нагору"
// ============================================================


// ============================================================
// 1. МОБІЛЬНЕ МЕНЮ (Burger-Menü)
// ============================================================
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', function() {
  // classList.toggle додає клас якщо його немає, або прибирає якщо є
  const isOpen = navLinks.classList.toggle('open');
  // aria-expanded — для читачів екрану (доступність)
  burger.setAttribute('aria-expanded', isOpen);
});

// Закрити меню при кліку на будь-яке посилання
navLinks.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});


// ============================================================
// 2. ПОКАЗ NAV-КНОПКИ ПРИ СКРОЛІ
//    Кнопка "Blumen wählen" з'являється коли Hero зникає з екрану
// ============================================================
const navCta = document.getElementById('navCta');

window.addEventListener('scroll', function() {
  if (window.scrollY > 400) {
    navCta.style.display = 'inline-block';
  } else {
    navCta.style.display = 'none';
  }
});


// ============================================================
// 3. АНІМАЦІЯ ПОЯВИ ПРИ СКРОЛІ (Scroll Reveal)
//    IntersectionObserver — сучасний браузерний API
//    Спостерігає коли елемент входить у видиму область екрану
// ============================================================
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Елемент видно — додаємо клас (CSS робить анімацію)
        entry.target.classList.add('visible');
        // Більше не спостерігаємо цей елемент — він вже appeared
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,              // спрацьовує коли 12% елемента видно
    rootMargin: '0px 0px -40px 0px'  // трохи раніше ніж дійде до краю
  }
);

revealElements.forEach(function(el) {
  observer.observe(el);
});


// ============================================================
// 4. СЛАЙДЕР ВІДГУКІВ
// ============================================================
const track   = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');

let currentIndex = 0; // поточна позиція (індекс картки)

// Повертає ширину однієї картки разом з відступами
function getCardWidth() {
  const card  = track.querySelector('.review-card');
  const style = window.getComputedStyle(card);
  // getBoundingClientRect().width — реальна ширина в px
  return card.getBoundingClientRect().width
       + parseInt(style.marginLeft)
       + parseInt(style.marginRight);
}

// Оновлює позицію слайдера через CSS transform
function updateSlider() {
  const offset = currentIndex * getCardWidth();
  track.style.transform = 'translateX(-' + offset + 'px)';
}

// Кнопка "вперед"
nextBtn.addEventListener('click', function() {
  const totalCards   = track.querySelectorAll('.review-card').length;
  const visibleCards = Math.floor(track.parentElement.offsetWidth / getCardWidth());
  const maxIndex     = totalCards - visibleCards;

  if (currentIndex < maxIndex) {
    currentIndex++;
    updateSlider();
  }
});

// Кнопка "назад"
prevBtn.addEventListener('click', function() {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

// При зміні розміру вікна — скидаємо на початок
window.addEventListener('resize', function() {
  currentIndex = 0;
  updateSlider();
});


// ============================================================
// 5. ВАЛІДАЦІЯ ФОРМИ
// ============================================================
const form        = document.getElementById('orderForm');
const inputName   = document.getElementById('inputName');
const inputPhone  = document.getElementById('inputPhone');
const nameError   = document.getElementById('nameError');
const phoneError  = document.getElementById('phoneError');
const formSuccess = document.getElementById('formSuccess');

// Показати помилку для поля
function showError(input, errorEl) {
  input.classList.add('error');
  errorEl.classList.add('show');
}

// Прибрати помилку
function clearError(input, errorEl) {
  input.classList.remove('error');
  errorEl.classList.remove('show');
}

// Перевірка телефону: дозволяємо +, цифри, пробіли, дужки, тире
function isValidPhone(value) {
  return /^[+\d\s\-\(\)]{7,20}$/.test(value.trim());
}

// Live-валідація — прибираємо помилку під час вводу
inputName.addEventListener('input', function() {
  if (inputName.value.trim() !== '') {
    clearError(inputName, nameError);
  }
});

inputPhone.addEventListener('input', function() {
  if (isValidPhone(inputPhone.value)) {
    clearError(inputPhone, phoneError);
  }
});

// Обробник відправки форми
form.addEventListener('submit', function(event) {
  // preventDefault зупиняє стандартну відправку (перезавантаження сторінки)
  event.preventDefault();

  let isValid = true;
  formSuccess.style.display = 'none';

  // Перевірка імені
  if (inputName.value.trim() === '') {
    showError(inputName, nameError);
    isValid = false;
  } else {
    clearError(inputName, nameError);
  }

  // Перевірка телефону
  if (!isValidPhone(inputPhone.value)) {
    showError(inputPhone, phoneError);
    isValid = false;
  } else {
    clearError(inputPhone, phoneError);
  }

  if (isValid) {
    // У реальному проекті тут буде fetch() до сервера або emailjs
    formSuccess.style.display = 'block';
    form.reset();

    setTimeout(function() {
      formSuccess.style.display = 'none';
    }, 5000);
  }
});


// ============================================================
// 6. КНОПКА "ДОДАТИ В КОШИК"
//    Ця функція викликається з HTML: onclick="addToCart('...')"
// ============================================================
function addToCart(productName) {
  alert('✅ "' + productName + '" wurde zum Warenkorb hinzugefügt!');

  // TODO: розширити до справжнього кошика:
  // const cart = JSON.parse(localStorage.getItem('cart')) || [];
  // cart.push(productName);
  // localStorage.setItem('cart', JSON.stringify(cart));
}


// ============================================================
// 7. КНОПКА "ПОВЕРНУТИСЬ НАГОРУ"
// ============================================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function() {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});