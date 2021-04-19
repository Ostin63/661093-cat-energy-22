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
