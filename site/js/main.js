// Shared behaviour for the home page nav: background fades in on scroll,
// and the hamburger toggles the full-screen mobile drawer.
(function () {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer = document.querySelector('.mobile-drawer');

  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
    drawer.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
    drawer.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => drawer.classList.remove('open'))
    );
  }
})();
