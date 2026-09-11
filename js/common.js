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
  btnBite();
  storyDonutRoll();
  doStepScroll();
  rollSlide();
  crewFlow();
});

function btnBite() {
  function rand(min, max) {
    return (min + Math.random() * (max - min)).toFixed(1) + '%';
  }

  $('.btn-round').each(function () {
    for (var i = 0; i < 6; i++) $(this).append('<span class="btn-crumb" aria-hidden="true"></span>');
  }).on('mouseenter focusin', function () {
    this.style.setProperty('--y2', rand(40, 60));
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
      speed: 1200,
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

  function next() {
    var moving = swipers.some(function (swiper) {
      return swiper.animating;
    });
    if (moving) return;
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
