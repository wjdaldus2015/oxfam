//레니스
const lenis = new Lenis()

lenis.on('scroll', (e) => {
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 800)
})

gsap.ticker.lagSmoothing(0)


//AOS

AOS.init({
  once: true
});

$(function () {
  headerScroll();
  quickMenu();
  visualDonut();
  btnBite();
  storyDonutRoll();
  doStepScroll();
  rollSlide();
  crewFlow();
});

function visualDonut() {
  var section = document.querySelector('.sc-visual');
  if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var to = { autoAlpha: 1, x: 0, y: 0, duration: 1.6, ease: 'power3.out' };

  gsap.fromTo(section.querySelector('.donut01'), { x: 240, y: -240, autoAlpha: 0 }, $.extend({ delay: 0.2 }, to));
  gsap.fromTo(section.querySelector('.donut02'), { x: -240, y: 240, autoAlpha: 0 }, $.extend({ delay: 0.35 }, to));
}

function quickMenu() {
  var menu = document.querySelector('.quick-menu');
  var headerBtn = document.querySelector('.header .btn-round');
  if (!menu || !headerBtn) return;

  var join = menu.querySelector('.quick-join');
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state = false;
  var ghost = null;
  var tl = null;
  var biteTimer = null;

  function biteOnce() {
    clearTimeout(biteTimer);
    $(join).trigger('mouseenter');
    join.classList.add('is-bite');
    biteTimer = setTimeout(function () {
      join.classList.remove('is-bite');
      $(join).trigger('mouseleave');
    }, 1400);
  }

  function rectOf(el) {
    var r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  function morph(show) {
    var target = show ? join : headerBtn;
    var to = rectOf(target);
    var from;

    if (ghost) {
      from = rectOf(ghost);
    } else if (show) {
      var hb = rectOf(headerBtn);
      from = { left: hb.left + (hb.width - to.width) / 2, top: hb.top + (hb.height - to.height) / 2, width: to.width, height: to.height };
    } else {
      from = rectOf(join);
    }

    if (tl) tl.kill();
    clearTimeout(biteTimer);
    join.classList.remove('is-bite', 'is-bitten');
    if (!ghost) {
      ghost = document.createElement('div');
      ghost.className = 'quick-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      document.body.appendChild(ghost);
    }

    var style = getComputedStyle(target);
    ghost.innerHTML = '<span>' + (show ? join.innerHTML.trim() : headerBtn.textContent.trim()) + '</span>';
    ghost.style.fontSize = style.fontSize;
    ghost.style.lineHeight = style.lineHeight;
    ghost.style.textAlign = style.textAlign;

    var label = ghost.firstChild;
    root.classList.add('is-quick');
    gsap.set(join, { autoAlpha: 0 });
    gsap.set(ghost, from);

    tl = gsap.timeline({
      onComplete: function () {
        ghost.remove();
        ghost = null;
        tl = null;
        if (show) {
          gsap.set(join, { autoAlpha: 1 });
          biteOnce();
        } else {
          root.classList.remove('is-quick');
        }
      }
    });

    if (show) {
      tl.fromTo(ghost, { scale: 0.6 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, 0)
        .to(ghost, $.extend({ duration: 1, ease: 'power1.inOut', rotation: 360 }, to), 0)
        .add(function () {
          menu.classList.add('is-show');
        }, 1)
        .to(ghost, { scaleX: 1.08, scaleY: 0.9, duration: 0.12, ease: 'power2.out' }, 1)
        .to(ghost, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      return;
    }

    gsap.set(label, { autoAlpha: 0 });
    tl.to(ghost, $.extend({ duration: 0.8, ease: 'power3.inOut', rotation: 0, scale: 1 }, to), 0)
      .to(label, { autoAlpha: 1, duration: 0.25 }, 0.55);
  }

  function toggle(y) {
    var show = y > window.innerHeight * 0.6;
    if (show === state) return;
    state = show;

    if (reduceMotion) {
      menu.classList.toggle('is-show', show);
      root.classList.toggle('is-quick', show);
      gsap.set(join, { autoAlpha: show ? 1 : 0 });
      return;
    }
    if (!show) menu.classList.remove('is-show');
    morph(show);
  }

  toggle(window.scrollY);
  lenis.on('scroll', function (e) {
    toggle(e.scroll);
  });

  menu.querySelector('.quick-top').addEventListener('click', function () {
    lenis.scrollTo(0, { duration: 1.4 });
    document.querySelector('.header .logo a').focus({ preventScroll: true });
  });
}

function headerScroll() {
  var header = document.querySelector('.header');
  if (!header) return;

  var lastY = window.scrollY;

  function update(y) {
    var delta = y - lastY;
    if (Math.abs(delta) < 5) return;

    if (y > header.offsetHeight && delta > 0) header.classList.add('is-hide');
    else header.classList.remove('is-hide');

    lastY = y;
  }

  lenis.on('scroll', function (e) {
    update(e.scroll);
  });

  header.addEventListener('focusin', function () {
    header.classList.remove('is-hide');
  });
}

function btnBite() {
  var delays = [0, 0.12, 0.24];

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  // 둥근 끝(캡)마다 자국은 하나씩만 두고, 세 번째는 위/아래 직선 변에 둔다.
  // 한 캡에 두 개가 겹치면 곡선이 다 먹혀 끝이 잘린 것처럼 보인다.
  function pickBites(w, h, r, em) {
    function onCap(cx0, deg) {
      var rad = (deg * Math.PI) / 180;
      return { cx: cx0 + r * Math.cos(rad), cy: r + r * Math.sin(rad), deg: deg };
    }

    var top = Math.random() < 0.5;
    var bites = [onCap(w - r, rand(-40, 40)), onCap(r, rand(140, 220))];

    if (w - 2 * r > em * 2) {
      bites.push({ cx: rand(r + em * 0.8, w - r - em * 0.8), cy: top ? 0 : h, deg: top ? -90 : 90 });
    } else {
      bites.push(onCap(r, (top ? -90 : 90) + rand(-20, 20)));
    }
    return bites;
  }

  $('.btn-round').each(function () {
    for (var i = 0; i < 6; i++) $(this).append('<span class="btn-crumb" aria-hidden="true"></span>');
  }).on('mouseleave focusout', function () {
    var btn = this;
    clearTimeout($(btn).data('biteTimer'));
    $(btn).data('biteTimer', setTimeout(function () {
      btn.classList.remove('is-bitten');
    }, 700));
  }).on('mouseenter focusin', function () {
    var btn = this;
    clearTimeout($(btn).data('biteTimer'));
    btn.classList.add('is-bitten');
    var w = btn.offsetWidth;
    var h = btn.offsetHeight;
    var r = h / 2;
    var em = parseFloat(getComputedStyle(btn).fontSize);
    var crumbs = btn.querySelectorAll('.btn-crumb');
    var sizes = [rand(0.5, 0.7), rand(0.8, 1), rand(1.15, 1.35)].sort(function () {
      return Math.random() - 0.5;
    });
    // 둥근 끝에 찍는 자국은 캡 반지름(r)보다 충분히 작아야 곡선이 남는다
    var capMax = (0.6 * r) / em;
    var pill = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><rect width="' + w + '" height="' + h + '" rx="' + r + '"/></svg>';

    btn.style.setProperty('--pill', 'url("data:image/svg+xml,' + encodeURIComponent(pill) + '")');

    pickBites(w, h, r, em).forEach(function (bite, k) {
      var rad = (bite.deg * Math.PI) / 180;
      var cx = bite.cx;
      var cy = bite.cy;
      var n = k + 1;
      var size = k < 2 ? Math.min(sizes[k], capMax) : sizes[k];

      btn.style.setProperty('--b' + n + 'x', cx.toFixed(1) + 'px');
      btn.style.setProperty('--b' + n + 'y', cy.toFixed(1) + 'px');
      btn.style.setProperty('--b' + n + 'a', (bite.deg + 180).toFixed(1) + 'deg');
      btn.style.setProperty('--b' + n + 's', size.toFixed(2));

      for (var j = 0; j < 2; j++) {
        var crumb = crumbs[k * 2 + j];
        var spread = rad + ((j ? 1 : -1) * rand(10, 35) * Math.PI) / 180;
        var dist = em * rand(0.7, 1.1) * size;

        crumb.style.left = cx.toFixed(1) + 'px';
        crumb.style.top = cy.toFixed(1) + 'px';
        crumb.style.setProperty('--dx', (Math.cos(spread) * dist).toFixed(1) + 'px');
        crumb.style.setProperty('--dy', (Math.sin(spread) * dist - em * 0.3).toFixed(1) + 'px');
        crumb.style.animationDelay = (delays[k] + 0.08 + j * 0.03).toFixed(2) + 's';
      }
    });
  });
}

function crewFlow() {
  var $tracks = $('.sc-crew .crew-track');
  if (!$tracks.length) return;

  var edge = 60;

  $tracks.each(function () {
    var $items = $(this).children();
    $(this).append($items.clone(), $items.clone());
  });

  function place() {
    var row01 = document.querySelector('.sc-crew .row01');
    var row02 = document.querySelector('.sc-crew .row02');
    var setWidth = row01.querySelector('.crew-track').scrollWidth / 3;

    row01.style.marginLeft = (window.innerWidth - setWidth * 2 + edge) + 'px';
    row02.style.marginLeft = -edge + 'px';
  }

  function flow() {
    place();
    $tracks.addClass('is-flow');
  }

  place();
  $(window).on('load resize', place);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    flow();
    return;
  }

  gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-crew .crew-rows',
      start: 'top 85%',
      once: true
    },
    onStart: flow
  })
    .fromTo('.sc-crew .row01', { x: -800, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 3.6, ease: 'power3.out' }, 0)
    .fromTo('.sc-crew .row02', { x: 800, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 3.6, ease: 'power3.out' }, 0);
}

function doStepScroll() {
  var section = document.querySelector('.sc-do');
  if (!section) return;

  var items = section.querySelectorAll('.do-list li');
  var deco = section.querySelector('.do-deco');
  var body = deco.querySelector('.char-body');
  var legBack = deco.querySelector('.char-leg-back');
  var legFront = deco.querySelector('.char-leg-front');
  var donut = deco.querySelector('.char02');
  var donutRadius = 98;
  var stride = 45;
  var decoGap = 20;
  var mm = gsap.matchMedia();

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.fromTo(section.querySelector('.do-donut'), {
      x: 240,
      y: -240,
      autoAlpha: 0
    }, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        once: true
      }
    });
  }

  function walk() {
    var x = gsap.getProperty(deco, 'x');
    var swing = Math.sin((x / stride) * Math.PI);
    var bob = -Math.abs(swing) * 3;

    legBack.setAttribute('transform', 'rotate(' + (-14 * swing) + ' 34 95)');
    legFront.setAttribute('transform', 'rotate(' + (14 * swing) + ' 64 97)');
    body.setAttribute('transform', 'translate(0 ' + bob + ')');
    gsap.set(donut, { rotation: (x / donutRadius) * (180 / Math.PI) });
  }

  mm.add('(min-width: 1025px) and (prefers-reduced-motion: no-preference)', function () {
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: function () {
          return window.innerHeight >= section.offsetHeight ? 'top top' : 'center center';
        },
        end: function () {
          return '+=' + window.innerHeight * 3;
        },
        pin: true,
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    tl.fromTo(items, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 1 }, 0)
      .fromTo(deco, { x: 0 }, {
        x: function () {
          return section.clientWidth - deco.offsetWidth - decoGap * 2;
        },
        duration: items.length,
        ease: 'none',
        onUpdate: walk
      }, 0);

    return function () {
      legBack.removeAttribute('transform');
      legFront.removeAttribute('transform');
      body.removeAttribute('transform');
    };
  });
}

function rollSlide() {
  var $frames = $('.sc-roll .roll-frame');
  if (!$frames.length || typeof Swiper === 'undefined') return;

  var slides = $frames.map(function () {
    return $(this).find('.swiper-slide')[0].outerHTML;
  }).get();
  var total = slides.length;
  var swipers = [];

  function syncFocus(swiper) {
    swiper.slides.forEach(function (slide) {
      var active = slide.classList.contains('swiper-slide-active');
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      $(slide).find('a').attr('tabindex', active ? '0' : '-1');
    });
  }

  $frames.each(function (i) {
    var html = '';
    for (var k = 0; k < total; k++) html += slides[(i + k) % total];
    $(this).find('.swiper-wrapper').html(html);

    swipers.push(new Swiper($(this).find('.swiper')[0], {
      loop: true,
      speed: 0,
      effect: 'fade',
      fadeEffect: { crossFade: false },
      allowTouchMove: false,
      a11y: { enabled: false },
      on: {
        afterInit: syncFocus,
        slideChangeTransitionEnd: syncFocus
      }
    }));
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;
  var locked = false;

  function next() {
    if (locked) return;
    locked = true;
    setTimeout(function () {
      locked = false;
    }, 1200);
    swipers.forEach(function (swiper) {
      swiper.slideNext();
    });
  }

  function stop() {
    clearInterval(timer);
  }

  function play() {
    stop();
    if (!reduceMotion) timer = setInterval(next, 5000);
  }

  $('.sc-roll .btn-next').on('click', function () {
    next();
    play();
  });

  $('.sc-roll .roll-slide')
    .on('mouseenter focusin', stop)
    .on('mouseleave focusout', play);

  if (reduceMotion) {
    play();
    return;
  }

  var rollIn = 120;

  gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-roll .roll-list',
      start: 'top 85%',
      once: true
    },
    onComplete: play
  })
    .fromTo($frames.get(), {
      x: rollIn,
      rotation: function (i, el) {
        return (rollIn / (el.offsetWidth / 2)) * (180 / Math.PI);
      },
      autoAlpha: 0
    }, {
      x: 0,
      rotation: 0,
      autoAlpha: 1,
      duration: 1.4,
      ease: 'power3.out',
      stagger: 0.12
    })
    .fromTo('.sc-roll .btn-next', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, '-=0.6');
}

function storyDonutRoll() {
  var section = document.querySelector('.sc-story');
  var svg = section && section.querySelector('.story-track');
  if (!svg) return;

  var guide = svg.querySelector('.track-guide');
  var mask = svg.querySelector('.track-mask');
  var donut = svg.querySelector('.track-donut');
  var total = guide.getTotalLength();
  var radius = 341;
  var endAngle = -96.86;
  var originX = 4042.5;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var startLen = 0;

  function lengthAtX(x) {
    var lo = 0;
    var hi = total;
    for (var i = 0; i < 20; i++) {
      var mid = (lo + hi) / 2;
      if (guide.getPointAtLength(mid).x < x) lo = mid;
      else hi = mid;
    }
    return lo;
  }

  function render(progress) {
    var len = startLen + (total - startLen) * (reduceMotion ? 1 : progress);
    var pt = guide.getPointAtLength(len);
    var angle = endAngle - ((total - len) / radius) * (180 / Math.PI);

    donut.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ') rotate(' + angle + ')');
    mask.setAttribute('width', pt.x);
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    end: 'top top',
    onRefresh: function (self) {
      startLen = lengthAtX(originX - window.innerWidth / 2 - radius);
      render(self.progress);
    },
    onUpdate: function (self) {
      render(self.progress);
    }
  });
}
