/* ============================================
   Safal Kunwar — Portfolio JS
   ============================================ */

/* Wait for HTML to fully load before running any JS */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  /* Hide the loading screen 500ms after all resources (images, fonts) finish loading */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 500);
  });

  /* ---------- Navbar scroll behaviour ---------- */
  /* Add "scrolled" class to header when page is scrolled past 50px */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.pageYOffset > 50);
  });

  /* ---------- Mobile menu ---------- */
  /* Toggle the slide-in nav panel and hamburger ☰ / ✕ animation */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = navLinks.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  /* Close mobile menu when any nav link is clicked */
  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Active link highlighting ---------- */
  /* Highlights the nav link matching the section currently in view */
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = navLinks.querySelectorAll('.nav-link:not(.dropdown-toggle)');

  const highlightNav = () => {
    const scrollY = window.pageYOffset + 150; // offset for sticky header

    /* If user has scrolled to the bottom of the page, activate the last section's link */
    const atBottom = (window.innerHeight + window.pageYOffset) >= (document.body.scrollHeight - 50);
    if (atBottom && sections.length) {
      const lastId = sections[sections.length - 1].getAttribute('id');
      const lastLink = navLinks.querySelector(`a[href="#${lastId}"]`);
      if (lastLink) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        lastLink.classList.add('active');
        return;
      }
    }

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  };
  window.addEventListener('scroll', highlightNav);

  /* ---------- Dropdown ---------- */
  /* Toggle the socials dropdown; close it when clicking anywhere else */
  const dropdownToggle = document.getElementById('socialsToggle');
  const dropdownMenu = document.getElementById('socialsMenu');

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent the document click below from immediately closing it
      dropdownToggle.classList.toggle('open');
      dropdownMenu.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      dropdownToggle.classList.remove('open');
      dropdownMenu.classList.remove('open');
    });
  }

  /* ---------- Scroll reveal ---------- */
  /* Adds "active" class to ".reveal" elements when they enter the viewport */
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const trigger = window.innerHeight * 0.88; // trigger at 88% of viewport height
    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) el.classList.add('active');
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // check on page load for elements already in view

  /* ---------- Back to top ---------- */
  /* Show/hide the floating button; scroll to top on click */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.pageYOffset > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Contact form ---------- */
  /* Validates required fields, shows loading state, then simulates a send */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // stop the browser from reloading the page

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      // Show loading state
      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Simulate network delay (replace with fetch() for real backend)
      setTimeout(() => {
        showNotification('Message sent! I\'ll get back to you soon. 🚀', 'success');
        contactForm.reset();
        submitBtn.innerHTML = '<i class="bx bx-send"></i> Send Message';
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  /* ---------- Notification toast ---------- */
  /* Creates a temporary message at the bottom of the screen */
  function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove(); // remove previous toast if any

    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toast.style.cssText = `
      position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(20px);
      padding:14px 28px;border-radius:30px;font-size:.9rem;font-weight:500;
      z-index:10000;opacity:0;transition:all .4s cubic-bezier(.4,0,.2,1);
      background:${type === 'success' ? 'rgba(39,174,96,.12)' : 'rgba(231,76,60,.12)'};
      color:${type === 'success' ? '#27ae60' : '#e74c3c'};
      border:1px solid ${type === 'success' ? 'rgba(39,174,96,.25)' : 'rgba(231,76,60,.25)'};
      backdrop-filter:blur(12px);box-shadow:0 4px 24px rgba(0,0,0,.08);
    `;
    document.body.appendChild(toast);

    // Animate in on next frame
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Auto-dismiss after 3.5s
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ---------- Smooth anchor scrolling ---------- */
  /* Smooth-scrolls to the target section when a #hash link is clicked */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
