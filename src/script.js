import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import anime from "animejs/lib/anime.es.js";
import Lenis from "@studio-freight/lenis";
import * as _ from "lodash";

// Initialize Lenis
const lenis = new Lenis({
  duration: 1,
  easing: (x) => {
    return Math.sin((x * Math.PI) / 2);
  },
  // infinite: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Configure Lenis with GSAP Scroll Trigger
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Resize Window
function onWindowResize() {
  location.reload();
}
const debouncedResize = _.debounce(onWindowResize, 500);
addEventListener("resize", debouncedResize);

/** --------------------------------------------------- Nav Link ---------------------------------------------------*/

const navLinks = document.querySelectorAll("nav > .links > li > a");
const navButtonLinks = document.querySelectorAll("button a");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const navTo = link.getAttribute("href");
    lenis.scrollTo(navTo);
    if (!link.classList.contains("active")) {
      navLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");
    }
  });
});
navButtonLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const navTo = link.getAttribute("href");
    lenis.scrollTo(navTo);
  });
});

/** --------------------------------------------------- GSAP ---------------------------------------------------*/
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.from(".main-heading h2", { opacity: 0, y: 50, duration: 1 });

gsap.from(".serviceBox", {
  opacity: 0,
  scale: 0.5,
  duration: 1,
  stagger: 0.3,
  delay: 0.5,
  scrollTrigger: {
    scrub: 3,
    trigger: ".serviceBox",
    start: "top 80%",
    end: "top center",
    toggleActions: "play none none none",
  },
});

const tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".frame",
    start: "top 80%",
    end: "top 20%",
    toggleActions: "play none none none",
  },
});

tl2
  .from(".frame", { opacity: 0, y: 50, duration: 0.5 })
  .from(".title", { opacity: 0, y: 20, duration: 0.5 });

/** --------------------------------------------------- Dynamic ---------------------------------------------------*/

// Menu
const burgerIcons = document.querySelector(".burger-icons");
const links = document.querySelector(".links");

burgerIcons.addEventListener("click", () => {
  burgerIcons.classList.toggle("clicked");
  links.classList.toggle("show");
});

// Background Animation

// const landingPageBackground = document.querySelector(".landing-page");
const landingPageBackground = document.querySelector(".background");

for (let i = 0; i < 50; i++) {
  const block = document.createElement("div");
  block.classList.add("block");
  landingPageBackground.appendChild(block);
  const size = Math.floor(Math.random() * 20);
  block.style.left = Math.floor(Math.random() * innerWidth) + "px";
  block.style.top = Math.floor(Math.random() * innerHeight) + "px";
  block.style.width = size + "px";
  block.style.height = size + "px";
}

// Define the animation function using Anime.js
const animateBlocks = () => {
  anime({
    targets: ".block",
    translateX: () => anime.random(-700, 700),
    translateY: () => anime.random(-500, 500),
    scale: () => anime.random(1, 5),
    easing: "easeInQuad",
    duration: 3000,
    delay: anime.stagger(10),
    complete: animateBlocks,
  });
};

// Start the animation
animateBlocks();

/**
 * Background parallax /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */
const bgImgsParam = { count: 200 };
const bgContainer = document.querySelector(".background");

for (let i = 0; i < bgImgsParam.count; i++) {
  const block = document.createElement("div");
  block.classList.add("block-static");
  bgContainer.appendChild(block);

  const size = Math.floor(Math.random() * 20);
  block.style.left = Math.floor(Math.random() * innerWidth) + "px";
  block.style.top = Math.floor(Math.random() * innerHeight) + "px";
  block.style.width = size + "px";
  block.style.height = size + "px";
}

const staticBlock = document.querySelectorAll(".block-static");

if (staticBlock.length) {
  addEventListener("wheel", (e) => {
    staticBlock.forEach((block, index) => {
      let shiftY = -(e.deltaY * index) / 100;
      let rotateX = e.deltaY / 3;

      block.style.transition = "transform 0.5s";
      block.style.transform = `perspective(100px) translateY(${shiftY}%) rotateX(${rotateX}deg)`;
      setTimeout(() => {
        block.style.transform = `perspective(100px) translateY(0%) rotateX(0deg)`;
      }, 300);
    });
  });
}

//  ------------------------------------------- Animation Cards -------------------------------------

function commentCards() {
  var cardsContainers = document.querySelectorAll(".cards");

  cardsContainers.forEach(function (cardContainer) {
    var cards = cardContainer.querySelectorAll(".card"),
      currentCard = cardContainer.querySelector(".card--current"),
      nextCard;

    function transitionCards() {
      cards.forEach(function (card) {
        card.classList.remove("card--current", "card--out", "card--next");
      });

      currentCard.classList.add("card--out");
      currentCard = nextCard || cards[0];
      currentCard.classList.add("card--current");
      nextCard = currentCard.nextElementSibling || cards[0];
      nextCard.classList.add("card--next");
    }

    setInterval(transitionCards, 2500);

    cardContainer.addEventListener("animationiteration", function () {
      currentCard.classList.remove("card--out", "card--next");
      currentCard.style.animation = "none";
      /* trigger reflow to restart the animation */
      currentCard.offsetHeight;
      currentCard.style.animation = null;
    });

    if (!currentCard) {
      currentCard = cards[cards.length - 1];
      transitionCards();
    }

    cardContainer.classList.add("cards--active");
  });
}

commentCards();

/** -------------------------------------------- Dark And Light ---------------------------------------------------*/

// When Dark Mode Change Image And The Website
const htmlElement = document.documentElement;
const headerImage = document.querySelector("header img");
const footerImage = document.querySelector("footer img");
const nightModeButton = document.querySelector(
  "header .div-night-mode .content"
);

function toggleNightMode() {
  const isDarkMode = htmlElement.classList.toggle("dark");
  headerImage.src = isDarkMode
    ? "./Images/Logo-white.png"
    : "./Images/Logo-black.png";
  footerImage.src = isDarkMode
    ? "./Images/Logo-white.png"
    : "./Images/Logo-black.png";
  localStorage.setItem("mode", isDarkMode ? "dark" : "white");
}

nightModeButton.addEventListener("click", toggleNightMode);

const savedMode = localStorage.getItem("mode");
if (savedMode === "dark") {
  htmlElement.classList.add("dark");
  headerImage.src = "./Images/Logo-white.png";
  footerImage.src = "./Images/Logo-white.png";
} else {
  htmlElement.classList.remove("dark");
}

/**
 * Elite Solutions
 */

const pin = document.querySelector("#solutions");
const accordion = document.querySelector(".accordion");
const tabs = gsap.utils.toArray(".accordion-tab");

const mm = gsap.matchMedia();

const horizontalTl = gsap.timeline({
  defaults: {
    ease: "none",
  },
  scrollTrigger: {
    trigger: pin,
    pin: pin,
    snap: { snapTo: 0.3325, duration: 1, delay: 0, ease: "power2.out" },
    scrub: true,
    start: `center center`,
    end: () => `+=${accordion.offsetWidth}`,
  },
});
horizontalTl.to(accordion, {
  xPercent: -75,
});

tabs.forEach((tab, index) => {
  horizontalTl
    .addLabel("tab")
    .to(tab.querySelector(".accordion-label"), {
      color: "rgb(54%, 77%, 24%)",
      background: "transparent",
      border: "1px solid rgb(54%, 77%, 24%)",
      scrollTrigger: {
        trigger: tab,
        containerAnimation: horizontalTl,
        scrub: true,
        ease: "power4.out",
        start: "70% 75%",
        end: "75% 75%",
      },
    })
    .from(tab.querySelector(".accordion-content"), {
      transformOrigin: "left",
      scaleX: 0,
      scrollTrigger: {
        trigger: tab,
        containerAnimation: horizontalTl,
        scrub: true,
        ease: "power4.out",
        start: "left 75%",
        end: "25% 75%",
      },
    })
    .from(tab.querySelector(".accordion-content"), {
      marginBlock: 20,
      height: 0,
      padding: 0,
      scrollTrigger: {
        trigger: tab,
        containerAnimation: horizontalTl,
        scrub: true,
        ease: "power4.out",
        start: "20% 75%",
        end: "50% 75%",
      },
    })
    .from(tab.querySelector(".accordion-content > h3"), {
      y: -1000,
      opacity: 0,
      scrollTrigger: {
        trigger: tab,
        containerAnimation: horizontalTl,
        scrub: true,
        ease: "power2.out",
        start: "50% 75%",
        end: "70% 75%",
      },
    })
    .from(
      tab.querySelector(".accordion-content > p"),
      {
        x: -1000,
        opacity: 0,
        scrollTrigger: {
          trigger: tab,
          containerAnimation: horizontalTl,
          scrub: true,
          ease: "power2.out",
          start: "50% 75%",
          end: "70% 75%",
        },
      },
      "<"
    )
    .to(
      tab.querySelector(".accordion-content > .glare1"),
      {
        bottom: "150%",
        scrollTrigger: {
          trigger: tab,
          containerAnimation: horizontalTl,
          scrub: true,
          ease: "ease.inOut",
          start: "50% 75%",
          end: "75% 75%",
        },
      },
      "<"
    )
    .to(
      tab.querySelector(".accordion-content > .glare2"),
      {
        bottom: "300%",
        scrollTrigger: {
          trigger: tab,
          containerAnimation: horizontalTl,
          scrub: true,
          ease: "ease.inOut",
          start: "50% 75%",
          end: "75% 75%",
        },
      },
      "<"
    );
});

/**
 * Hear From Our Clients
 */
const clients = document.querySelector("#clients");

const clientsMainTl = gsap.timeline({
  scrollTrigger: {
    trigger: clients,
    start: "top center",
  },
  defaults: {
    ease: "power2.out",
  },
});

clientsMainTl
  .fromTo(
    clients.querySelector(".wrapper > h2"),
    { opacity: 0, y: 500, duration: 2 },
    { opacity: 100, y: 0 }
  )
  .fromTo(
    clients.querySelector(".wrapper > p"),
    { opacity: 0, y: 500, duration: 2 },
    { opacity: 100, y: 0 }
  );

const rightCards = gsap.utils.toArray(".right > article");
const leftCards = gsap.utils.toArray(".left > article");

const tlRight = gsap.timeline({
  scrollTrigger: {
    trigger: ".right",
    scrub: true,
    start: "top bottom",
    end: "bottom center",
  },
});

const tlLeft = gsap.timeline({
  scrollTrigger: {
    trigger: ".left",
    scrub: true,
    start: "top bottom",
    end: "bottom center",
  },
});

mm.add("(min-width: 768px)", () => {
  leftCards.forEach((card, index) => {
    gsap.set(card, { opacity: 0, xPercent: -100, yPercent: 100 });
    tlLeft.to(card, {
      opacity: 100,
      xPercent: 0,
      yPercent: 0,
      ease: "power4.Out",
    });
  });
  tlLeft.to(".left", {
    yPercent: 5,
  });

  rightCards.forEach((card) => {
    gsap.set(card, { opacity: 0, xPercent: 200, yPercent: 100 });
    tlRight.to(card, {
      opacity: 100,
      xPercent: 0,
      yPercent: 0,
      ease: "power4.Out",
    });
  });
  tlRight.to(".right", {
    yPercent: 20,
  });
});
mm.add("(max-width: 767px)", () => {
  leftCards.forEach((card, index) => {
    gsap.set(card, { opacity: 0, yPercent: 50, scale: 0 });
    tlLeft.to(card, {
      opacity: 100,
      yPercent: 0,
      scale: 1,
      ease: "power4.Out",
    });
  });

  rightCards.forEach((card) => {
    gsap.set(card, { opacity: 0, yPercent: 50, scale: 0 });
    tlRight.to(card, {
      opacity: 100,
      yPercent: 0,
      scale: 1,
      ease: "power4.Out",
    });
  });
});

/**
 * One Click Away
 */
const contactUs = document.querySelector("#contactUs");
const contactUsForm = document.querySelector("#contactUs form");
const contactFormMainTl = gsap.timeline({
  scrollTrigger: {
    trigger: contactUs,
    start: "top center",
  },
  defaults: {
    ease: "power2.out",
  },
});
contactFormMainTl
  .fromTo(
    contactUs.querySelector(".wrapper").children,
    {
      opacity: 0,
      y: 1000,
    },
    {
      opacity: 100,
      y: 0,
      stagger: {
        each: 0.2,
      },
    }
  )
  .from(contactUsForm, {
    transformOrigin: "center",
    scaleX: 0,
  })
  .from(contactUsForm, { transformOrigin: "top", scaleY: 0, padding: 0 })
  .to(contactUsForm.querySelector(".glare1"), {
    bottom: "150%",
  })
  .to(
    contactUsForm.querySelector(".glare2"),
    {
      bottom: "200%",
    },
    "<"
  );

// Budget Range Slider
const range = document.querySelectorAll(".range-slider input");
const progress = document.querySelector(".range-slider .progress");

let gap = 1000;

const inputValue = document.querySelectorAll(".range-number-fields > input");

range.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minRange = parseInt(range[0].value);
    let maxRange = parseInt(range[1].value);
    if (maxRange - minRange < gap) {
      if (e.target.className === "range-min") {
        range[0].value = maxRange - gap;
      } else {
        range[1].value = minRange + gap;
      }
    } else {
      progress.style.left = (minRange / range[0].max) * 100 + "%";
      progress.style.right = 100 - (maxRange / range[1].max) * 100 + "%";
      inputValue[0].value = minRange;
      inputValue[1].value = maxRange;
    }
  });
});

/**
 * Card /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */
const hoverCard = document.querySelectorAll(".hover-card");

if (hoverCard.length) {
  hoverCard.forEach((card) => {
    // Card Rotate
    card.addEventListener("mousemove", (e) => {
      card.style.transition = `transform 0.3s`;
      let rect = card.getBoundingClientRect();
      let rotateX = -(e.clientY - rect.y - rect.height / 2) / 100;
      let rotateY = (e.clientX - rect.x - rect.width / 2) / 500;

      card.style.transform = `perspective(200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener("mouseleave", (e) => {
      card.style.transform = `perspective(100px) rotateX(0deg) rotateY(0deg)`;
    });
  });
}
/**
 * Button /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 */
const btns = document.querySelectorAll(".button");

if (btns.length) {
  btns.forEach((btn) => {
    // Button Hover
    const btnBackground = btn.querySelector(".button-bg");

    if (btnBackground) {
      btn.addEventListener("mouseenter", (e) => {
        let rect = btn.getBoundingClientRect();
        let y = e.clientY - rect.top;
        let x = e.clientX - rect.left;
        let shiftX = (x / rect.width) * 200 - 100;
        let shiftY = (y / rect.height) * 200 - 100;
        btnBackground.animate(
          [
            { transform: `translate(${shiftX}%, ${shiftY}%)` },
            { transform: `translate(0%, 0%)` },
          ],
          {
            duration: 200,
            easing: "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
          }
        );
      });
      btn.addEventListener("mouseleave", (e) => {
        let rect = btn.getBoundingClientRect();
        let y = e.clientY - rect.top;
        let x = e.clientX - rect.left;
        let shiftX = (x / rect.width) * 200 - 100;
        let shiftY = (y / rect.height) * 200 - 100;

        btnBackground.animate(
          [
            { transform: `translate(0%, 0%)` },
            { transform: `translate(${shiftX}%, ${shiftY}%)` },
          ],
          {
            duration: 200,
            easing: "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
          }
        );
      });
    }
  });
}
