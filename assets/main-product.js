(function () {
  const initProductAccordion = () => {
    const aboutToggleItems = $('.about__accordion-toggle');

    aboutToggleItems.each(function () {
      const currentToggle = $(this);
      const siblingToggles = currentToggle.siblings('.about__accordion-description');

      currentToggle.click(function () {
        if (!currentToggle.hasClass('active')) {
          aboutToggleItems.each(function () {
            const siblingToggle = $(this);
            siblingToggle.removeClass('active');
            siblingToggle.siblings('.about__accordion-description').stop().slideUp(300);
          });

          currentToggle.addClass('active');

          siblingToggles.stop().slideDown(300);
        } else {
          currentToggle.removeClass('active');
          siblingToggles.stop().slideUp(300);
        }
      });
    });
  };

  const initZoomImage = () => {
    const imagesWrapper = document.querySelector('.product-media-modal__content');
    const images = imagesWrapper?.querySelectorAll('.js-image-zoom') || [];

    images.forEach((el) => {
      el.addEventListener('click', (e) => {
        imagesWrapper.classList.toggle('zoom');
      });
    });
  };

  const formatFreeShippingAmount = (value) => {
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = theme.moneyFormat;

    return formatString.replace(placeholderRegex, value);
  };

  const setTotalFreeShipping = () => {
    if (document.querySelector('.js-free-shipping')) {
      const freeShippingTotal = document.querySelector('.free-shipping-total');
      if (freeShippingTotal) {
        const minSpend = Number(freeShippingTotal.dataset.minSpend);
        if (minSpend && minSpend > 0) {
          freeShippingTotal.innerText = `${formatFreeShippingAmount(
            Math.round(minSpend * (Shopify.currency.rate || 1)),
          )}`;
        }
      }
    }
  };

  const revealStickyAddToCart = (section) => {
    if (!section && section.classList.contains('.product-section')) return;
    const buyButtons = section.querySelector('.product__buy-buttons > product-form');
    const stickyBar = section.querySelector('.sticky-add-to-cart');
    const footerBottom = document.querySelector(
      '.shopify-section-group-footer-group .footer__content-bottom',
    );

    if (!stickyBar) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.01,
    };

    const isElementBelowScroll = (element) => {
      return element ? element.getBoundingClientRect().top > 0 : false;
    };

    const toggleStickyBar = (isVisible) => {
      if (isVisible || isElementBelowScroll(buyButtons)) {
        stickyBar.classList.remove('active');
      } else {
        stickyBar.classList.add('active');
      }
    };

    const handleIntersect = (entries) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);
      toggleStickyBar(isVisible);
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    if (buyButtons) observer.observe(buyButtons);
    if (footerBottom) observer.observe(footerBottom);
  };

  document.addEventListener('shopify:section:load', function (event) {
    initProductAccordion();
    initZoomImage();
    setTotalFreeShipping();
    revealStickyAddToCart(event.target);
  });

  initProductAccordion();
  initZoomImage();
  setTotalFreeShipping();
  revealStickyAddToCart(document.currentScript.parentElement);
})();
