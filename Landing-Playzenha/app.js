const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');
    const toast = document.getElementById('toast');
    const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
    const gameCards = Array.from(document.querySelectorAll('.game-card'));
    const phoneTitle = document.getElementById('phoneTitle');
    const phoneTag = document.getElementById('phoneTag');
    const phonePrompt = document.getElementById('phonePrompt');

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('is-visible');
      window.clearTimeout(showToast.timer);
      showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
    }

    function goToSection(selector) {
      const target = document.querySelector(selector);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.pageYOffset - 74;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    menuButton.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('menu-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.addEventListener('click', (event) => {
      if (event.target.matches('a')) {
        document.body.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll('.js-cta').forEach((button) => {
      button.addEventListener('click', () => {
        const plan = button.dataset.plan;
        showToast(plan ? `${plan}: convite pronto para compartilhar.` : 'Link de jogo pronto para a galera.');
      });
    });

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
        gameCards.forEach((card) => {
          const visible = filter === 'all' || card.dataset.category === filter;
          card.hidden = !visible;
        });
      });
    });

    gameCards.forEach((card) => {
      card.addEventListener('click', () => {
        gameCards.forEach((item) => item.classList.remove('is-selected'));
        card.classList.add('is-selected');
        phoneTitle.textContent = card.dataset.title;
        phoneTag.textContent = card.dataset.tag;
        phonePrompt.textContent = card.dataset.prompt;
        showToast(`${card.dataset.title} aberto no mockup.`);
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (href.length > 1) {
          event.preventDefault();
          goToSection(href);
        }
      });
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
