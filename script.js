const revealItems = document.querySelectorAll(".reveal");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const reviewsTrack = document.getElementById("reviews-track");
const prevButton = document.getElementById("reviews-prev");
const nextButton = document.getElementById("reviews-next");
const galleryLoadMoreButton = document.getElementById("gallery-load-more");
const hiddenGalleryCards = document.querySelectorAll(".gallery-card-hidden");
const galleryImages = Array.from(document.querySelectorAll(".gallery-grid img"));
const lightbox = document.getElementById("gallery-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

if (navToggle && navMenu) {
  const closeMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", !expanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}

if (reviewsTrack && prevButton && nextButton) {
  const reviewCards = Array.from(reviewsTrack.children);
  let currentIndex = 0;

  const getCardsPerView = () => {
    if (window.innerWidth <= 640) {
      return 1;
    }
    if (window.innerWidth <= 980) {
      return 2;
    }
    return 3;
  };

  const updateReviews = () => {
    const cardsPerView = getCardsPerView();
    const gap = parseFloat(window.getComputedStyle(reviewsTrack).gap) || 0;
    const cardWidth = reviewCards[0]?.getBoundingClientRect().width || 0;
    const maxIndex = Math.max(0, reviewCards.length - cardsPerView);

    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    const offset = currentIndex * (cardWidth + gap);
    reviewsTrack.style.transform = `translateX(-${offset}px)`;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= maxIndex;
  };

  prevButton.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateReviews();
  });

  nextButton.addEventListener("click", () => {
    const maxIndex = Math.max(0, reviewCards.length - getCardsPerView());
    currentIndex = Math.min(maxIndex, currentIndex + 1);
    updateReviews();
  });

  window.addEventListener("resize", updateReviews);
  window.addEventListener("load", updateReviews);
  updateReviews();
}

if (galleryLoadMoreButton && hiddenGalleryCards.length) {
  galleryLoadMoreButton.addEventListener("click", () => {
    hiddenGalleryCards.forEach((card) => {
      card.style.display = "block";
    });
    galleryLoadMoreButton.classList.add("is-hidden");
  });
}

if (
  lightbox &&
  lightboxImage &&
  lightboxCaption &&
  lightboxClose &&
  lightboxPrev &&
  lightboxNext &&
  galleryImages.length
) {
  let currentGalleryIndex = 0;

  const updateLightbox = () => {
    const activeImage = galleryImages[currentGalleryIndex];
    const caption = activeImage.closest("figure")?.querySelector("figcaption")?.textContent ?? "";

    lightboxImage.src = activeImage.src;
    lightboxImage.alt = activeImage.alt;
    lightboxCaption.textContent = caption;
  };

  const openLightbox = (index) => {
    currentGalleryIndex = index;
    updateLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  };

  const showPrevImage = () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  };

  const showNextImage = () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    updateLightbox();
  };

  galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrevImage);
  lightboxNext.addEventListener("click", showNextImage);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showPrevImage();
    }

    if (event.key === "ArrowRight") {
      showNextImage();
    }
  });
}
