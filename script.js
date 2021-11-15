'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScroolTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScroolTo.addEventListener('click', e => {
  // console.log(e.target.getBoundingClientRect());
  // console.log('current scroll (x/y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  //scrolling
  // window.scrollTo(
  // left: s1coords.left + window.pageXOffset,
  //     top: s1coords.top + window.pageYOffset,
  // );
  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' }); // modern way of scrolling
});

// page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1. Add event listener to the common parent
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});

const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const tabs = document.querySelectorAll('.operations__tab');

// butonların parent elementine event ekliyoruz
// default behavioru engelliyoruz
// hangi butona basıldığını belirliyoruz butonun içinde element varsa closest metodunu kullanarak butonun clasını seçiyoruz(e.target ile beraber(nereye basıldığını belirliyor)) (e.currentTarget === this)
// eğer buton dışında bi alana basıldıysa acil return yapıp fonksiyonu tamamlamıyoruz
// bütün linkleriden active classını kaldırıyoruz
// basılan butona active classını ekliyoruz
// contentlerdeki active classını kaldırıyoruz
// basılan butondaki data attributeuna göre basılan butondaki contente active classını ekliyoruz

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(el => {
    el.classList.remove('operations__tab--active');
  });
  clicked.classList.add('operations__tab--active');

  tabContent.forEach(el => {
    el.classList.remove('operations__content--active');
  });

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation

const nav = document.querySelector('.nav');

// parent element seçildi
// mouseover olunan link belirlendi
// tıklanan link belirlendi
// bütün linkler siblings olarak belirlendi
// tıklanan link ile siblinglerin aynı olmaması koşulunda siblinglerin opacitysi düşürüldü
// logonun da opacitysi düşürüldü
// tekrarlanan kodları yeni bir fonksiyona atayıp kod düzenlendi

const fadefunc = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity; // bind ile bağlanırsa this kullanılır parametre olarak
      }
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', function (e) {
  fadefunc(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  fadefunc(e, 1);
});

// sticky navigation

// const initialcoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   // if (window.scrollY > initialcoords.top) {
//   //   nav.classList.add('sticky');
//   // } else {
//   //   nav.classList.remove('sticky');
//   // }
// });

// sticky nav better way
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
// 0 percenti viewportta olduğu zaman yani header ekrandan çıktığı zaman IntersectionObserver oluşturulacak

const headerDOM = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting === false) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObs.observe(headerDOM);

//reveal elements when you scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

// Lazy Loading Images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // REPLACE SRC WITH DATA-SRC
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.15,
  rootMargin: '-100px',
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});

//SLIDER

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let currentSlide = 0;
const maxSlide = slides.length - 1;

slides.forEach((s, i) => {
  s.style.transform = `translateX(${100 * i}%)`;
});

btnRight.addEventListener('click', function () {
  if (currentSlide === maxSlide) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  });
  activeDot(currentSlide);
});
btnLeft.addEventListener('click', function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide;
  } else {
    currentSlide--;
  }
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  });
  activeDot(currentSlide);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
    activeDot(currentSlide);
  }
  if (e.key === 'ArrowRight') {
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
    activeDot(currentSlide);
  }
});

const dotContainer = document.querySelector('.dots');
const createDots = function () {
  slides.forEach((s, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `
      <button class="dots__dot" data-slide="${i}"></button>
      `
    );
  });
};
createDots();

const activeDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const picked = e.target.dataset.slide;
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - picked)}%)`;
    });
    activeDot(picked);
  }
});

// const h1 = document.querySelector('h1');

// const alertH1 = e => {
//   // alert('addEventListener : Great! You are reading the heading :)');

//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

// const randomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };

// const randomColor = () => {
//   return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// };

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

// h1.onmouseenter = e => {
//   alert('onmouseenter : Great! You are reading the heading :)');
// };

////////////////

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);
// document.getElementById('section--1');

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// // creating and inserting elements
// // .insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionalty and analytics';
// message.innerHTML =
//   'We use cookies for improved functionalty and analytics <button class="btn btn--close--cookies">Got it!</button>';

// const header = document.querySelector('.header');
// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));

// // header.before(message);
// // header.after(message);

// document.querySelector('.btn--close--cookies').addEventListener('click', () => {
//   message.remove();
// });

// // styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(getComputedStyle(message).color);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // attributes

// const logo = document.querySelector('.nav__logo');

// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// logo.alt = 'Beautiful minimalist logo';

// console.log(logo.getAttribute('class'));

// const link = document.querySelector('.twitter-link');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // data attributes

// console.log(logo.dataset.versionNumber);

// // classes

// logo.classList.add('c', 'j');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');
