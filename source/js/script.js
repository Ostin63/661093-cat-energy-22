const header = document.querySelector(".header");
const toggle = header.querySelector(".header__menu-toggle");
const navigation = document.querySelector(".navigation");

toggle.classList.remove("header__menu-toggle--active");
navigation.classList.remove("navigation--active");

toggle.addEventListener("click", function () {
  toggle.classList.toggle("header__menu-toggle--active");
  navigation.classList.toggle("navigation--active");
})

// Map

const footerMap = document.querySelector(".footer__map-img");
if (footerMap) {
  footerMap.classList.add("visually-hidden");
}

// Form

const programm = document.querySelector('.programm');

if (programm) {
  let isStorageSupport = true;
  let storage = '';

  try {
    storage = localStorage.getItem('phone');
  } catch (err) {
    isStorageSupport = false;
  }

  const programmForm = programm.querySelector('.programm__form');
  const fields = programmForm.querySelectorAll('.programm__input--required');

  programmForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      if (!field.value) {
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    }
  })
}

// Slider
/*
const sliderBefore = document.querySelector(".slider__img--before");
const sliderBar = document.querySelector(".slider__bar");
const sliderPin = sliderBar.querySelector(".slider__pin");

let imgWidth = sliderBefore.offsetWidth;

sliderBefore.style.width = (imgWidth / 2) + "px";

let barWidth = sliderBar.offsetWidth;

sliderPin.style.left = (barWidth / 2 - 25) + "px";
*/
