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
  storyTextUp();
  whoIntro();
  doMobileSlide();
  doStepScroll();
  rollSlide();
  goalReveal();
  crewFlow();
  // 고정(pin) 구간이 모두 만들어진 뒤에 걸어야 아래쪽 제목의 시작 위치가 맞다
  titleFadeUp();
});

function visualDonut() {
  var section = document.querySelector('.sc-visual');
  if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var to = { autoAlpha: 1, x: 0, y: 0, duration: 1.6, ease: 'power3.out' };

  // 문구(titleFadeUp, 0.2초)가 먼저 떠오르고 조금 뒤 도넛이 들어온다
  gsap.fromTo(section.querySelector('.donut01'), { x: 240, y: -240, autoAlpha: 0 }, $.extend({ delay: 0.8 }, to));
  gsap.fromTo(section.querySelector('.donut02'), { x: -240, y: 240, autoAlpha: 0 }, $.extend({ delay: 0.95 }, to));
}

function quickMenu() {
  var menu = document.querySelector('.quick-menu');
  var headerBtn = document.querySelector('.header .btn-round');
  if (!menu || !headerBtn) return;

  var join = menu.querySelector('.quick-join');
  var header = document.querySelector('.header');
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

  // 헤더는 스크롤 방향에 따라 위로 숨는 중일 수 있다. 그 이동량을 빼서
  // 숨어 있든 내려오는 중이든 헤더 버튼의 제자리를 기준으로 삼는다
  function headerBtnRect() {
    var r = rectOf(headerBtn);
    var value = header && getComputedStyle(header).transform;
    var nums = value && value !== 'none' && value.match(/\(([^)]+)\)/);
    var list = nums ? nums[1].split(',') : null;
    var shift = list ? parseFloat(list.length > 6 ? list[13] : list[5]) || 0 : 0;

    r.top -= shift;
    return r;
  }

  // 헤더 버튼이 우하단 퀵버튼 자리로 굴러 내려오고, 올라갈 땐 알약 모양으로 되돌아간다.
  // 실제 두 버튼은 감춰 두고 같은 모양의 대역 요소(ghost) 하나만 움직인다
  function morph(show) {
    // 올라갈 땐 헤더가 숨어 있으면 착지할 자리가 없다. 먼저 내려 둔다
    if (!show && header) header.classList.remove('is-hide');

    var target = show ? join : headerBtn;
    var to = show ? rectOf(join) : headerBtnRect();
    var from;

    if (ghost) {
      from = rectOf(ghost);
    } else if (show) {
      var hb = headerBtnRect();
      from = { left: hb.left + (hb.width - to.width) / 2, top: hb.top + (hb.height - to.height) / 2, width: to.width, height: to.height };
    } else {
      from = rectOf(join);
    }

    if (tl) tl.kill();
    clearTimeout(biteTimer);
    join.classList.remove('is-bite');
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
    var plain = reduceMotion;
    var show = y > window.innerHeight * 0.6;
    if (show === state) return;
    state = show;

    if (plain) {
      if (tl) tl.kill();
      tl = null;
      if (ghost) {
        ghost.remove();
        ghost = null;
      }
      menu.classList.toggle('is-show', show);
      root.classList.toggle('is-quick', show);
      gsap.set(join, { autoAlpha: show ? 1 : 0 });

      clearTimeout(biteTimer);
      join.classList.remove('is-bite');
      if (show && !reduceMotion) biteTimer = setTimeout(biteOnce, 620);
      return;
    }

    if (!show) menu.classList.remove('is-show');
    morph(show);
  }

  toggle(window.scrollY);
  lenis.on('scroll', function (e) {
    toggle(e.scroll);
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

  // 부스러기 출발점: 둥근 끝 양쪽에 하나씩, 세 번째는 위/아래 직선 변 중 무작위
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
  }).on('mouseenter focusin', function () {
    var btn = this;
    var w = btn.offsetWidth;
    var h = btn.offsetHeight;
    var r = h / 2;
    var em = parseFloat(getComputedStyle(btn).fontSize);
    var crumbs = btn.querySelectorAll('.btn-crumb');
    var sizes = [rand(0.5, 0.7), rand(0.8, 1), rand(1.15, 1.35)].sort(function () {
      return Math.random() - 0.5;
    });

    pickBites(w, h, r, em).forEach(function (bite, k) {
      var rad = (bite.deg * Math.PI) / 180;
      // 출발점을 부스러기 크기만큼 가장자리 바깥으로 밀어 처음부터 버튼과 겹치지 않게 한다
      var cx = bite.cx + Math.cos(rad) * em * 0.25;
      var cy = bite.cy + Math.sin(rad) * em * 0.25;
      var size = sizes[k];

      for (var j = 0; j < 2; j++) {
        var crumb = crumbs[k * 2 + j];
        var tilt = ((j ? 1 : -1) * rand(10, 35) * Math.PI) / 180;
        var spread = rad + tilt;
        // 바깥쪽 이동량이 최소 1em은 되게 해 부스러기가 항상 버튼 밖에 머물게 한다
        var dist = Math.max(em * rand(0.7, 1.1) * size, em / Math.cos(tilt));
        var dx = Math.cos(spread) * dist;
        var dy = Math.sin(spread) * dist - em * 0.3;
        var fall = em * 1.4;

        // 위쪽으로 튄 부스러기는 떨어지는 양을 줄여 버튼 위로 되돌아오지 않게 한다
        if (Math.sin(rad) < 0) {
          fall = Math.max(0, Math.min(fall, (dx * Math.cos(rad) + dy * Math.sin(rad) - em * 0.4) / -Math.sin(rad)));
        }

        crumb.style.left = cx.toFixed(1) + 'px';
        crumb.style.top = cy.toFixed(1) + 'px';
        crumb.style.setProperty('--dx', dx.toFixed(1) + 'px');
        crumb.style.setProperty('--dy', dy.toFixed(1) + 'px');
        crumb.style.setProperty('--fall', fall.toFixed(1) + 'px');
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

    // 줄은 60초에 한 세트 폭만큼 흐른다. 그 속도에 맞춰 도넛 자전·걷기 주기를 맞춘다
    var speed = setWidth / 60;
    var donut = row01.querySelector('li:not(.char) img');
    var boy = document.querySelector('.crew-track .char .cream-boy');
    if (!speed || !donut || !boy) return;

    var root = document.documentElement;
    root.style.setProperty('--crew-spin', (Math.PI * donut.offsetHeight / speed).toFixed(2) + 's');
    // What We Do와 같은 비율의 보폭(표시 높이 136.8px에 170px)
    root.style.setProperty('--crew-walk', ((170 * boy.offsetHeight / 136.8) / speed).toFixed(2) + 's');
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

function whoIntro() {
  var section = document.querySelector('.sc-who');
  if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var deco = section.querySelector('.who-deco');
  var sprs = deco.querySelectorAll('.spr');
  var random = gsap.utils.random;

  // 솟아오르는 동안엔 둥실 모션을 꺼 둔다(GSAP가 CSS translate·rotate를 읽어 위치가 겹친다)
  deco.classList.add('is-burst');
  gsap.set(sprs, { autoAlpha: 0 });

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      once: true
    }
  })
    .fromTo(section.querySelector('.who-film'), { scale: 0.96, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0);

  // 폭죽처럼: 한참 아래에서 빠르게 솟아 제자리보다 살짝 위까지 튀었다가 내려앉고, 그때부터 둥실 모션을 잇는다
  sprs.forEach(function (el) {
    var spin = random(180, 360) * (Math.random() < 0.5 ? -1 : 1);
    // 좌우 반전(.flip) 스프링클은 가로 배율 부호를 유지해야 도중에 뒤집히지 않는다
    var sx = el.classList.contains('flip') ? -1 : 1;

    tl.add(gsap.timeline()
      .fromTo(el, {
        x: random(-60, 60),
        y: function () {
          return window.innerHeight * random(0.45, 0.7);
        },
        scaleX: 0.4 * sx,
        scaleY: 0.4,
        rotation: spin,
        autoAlpha: 0
      }, {
        x: 0,
        y: random(-70, -40),
        scaleX: 1.15 * sx,
        scaleY: 1.15,
        rotation: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: 'power3.out'
      })
      .to(el, {
        y: 0,
        scaleX: sx,
        scaleY: 1,
        duration: 0.9,
        ease: 'sine.inOut',
        // 인라인 transform을 지워 .flip(scaleX(-1))을 CSS로 되돌리고 둥실 모션을 0에서 시작한다
        clearProps: 'transform,opacity,visibility',
        onComplete: function () {
          el.classList.add('is-float');
        }
      }), 0.2 + random(0, 0.35));
  });
}

/* 브랜드필름 스토리보드(CSS/JS 애니메이션 버전) — 실제 영상으로 교체 예정이라 보류
function whoFilm() {
  var box = document.querySelector('.sc-who .who-film');
  if (!box) return;

  var stage = box.querySelector('.film-stage');
  var scenes = stage.querySelectorAll('.film-scene');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fit() {
    stage.style.transform = 'scale(' + box.clientWidth / 1440 + ')';
  }

  fit();
  window.addEventListener('resize', fit);
  if (reduceMotion) return;

  function s(n) {
    return stage.querySelector('.s' + (n < 10 ? '0' : '') + n);
  }

  var tl = gsap.timeline({ repeat: -1, paused: true });

  function cut(n, at, fade) {
    tl.to(s(n), { autoAlpha: 1, duration: fade || 0.4 }, at);
    if (n > 1) tl.to(s(n - 1), { autoAlpha: 0, duration: fade || 0.4 }, at);
  }

  tl.set(scenes, { autoAlpha: 0 }, 0);

  // 1. 세상은 저절로 굴러가지 않는다
  cut(1, 0, 0.5);
  tl.fromTo(s(1).querySelector('.film-txt'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, 0);

  // 2~3. 불평등 / 환경문제 사진
  cut(2, 2, 0.3);
  tl.fromTo(s(2).querySelector('.film-photo'), { scale: 1.05 }, { scale: 1, duration: 3, ease: 'power1.inOut' }, 2.5);
  cut(3, 5, 0.3);
  tl.fromTo(s(3).querySelector('.film-photo'), { scale: 1.05 }, { scale: 1, duration: 3, ease: 'power1.inOut' }, 5);

  // 4~6. 두 단어 + 물결 사진 띠 + 캐릭터 등장
  cut(4, 8, 0.3);
  cut(5, 10, 0.3);
  tl.fromTo(s(5).querySelector('.wave01'), { x: -500 }, { x: 0, duration: 2.5, ease: 'power2.out' }, 10)
    .fromTo(s(5).querySelector('.wave02'), { x: 500, scaleX: -1 }, { x: 0, scaleX: -1, duration: 2.5, ease: 'power2.out' }, 10)
    .fromTo(s(5).querySelector('.char-green'), { x: 400 }, { x: 0, duration: 2, ease: 'power2.out' }, 10)
    .fromTo(s(5).querySelector('.char-blue'), { x: -400 }, { x: 0, duration: 2, ease: 'power2.out' }, 10);
  cut(6, 12.5, 0.3);
  tl.fromTo(s(6).querySelector('.wave01'), { x: 600 }, { x: 750, duration: 3, ease: 'power2.out' }, 12.5)
    .fromTo(s(6).querySelector('.wave02'), { x: -600, scaleX: -1 }, { x: -750, scaleX: -1, duration: 3, ease: 'power2.out' }, 12.5)
    .fromTo(s(6).querySelector('.char-green'), { x: 200 }, { x: 0, duration: 2, ease: 'power2.out' }, 12.5)
    .fromTo(s(6).querySelector('.char-blue'), { x: -200 }, { x: 0, duration: 2, ease: 'power2.out' }, 12.5);

  // 7. 세상이 더 잘 굴러가도록
  cut(7, 15, 0.3);
  tl.fromTo(s(7).querySelector('.char-green'), { x: 300, rotation: -15 }, { x: 0, rotation: 0, duration: 2, ease: 'power2.out' }, 15)
    .fromTo(s(7).querySelector('.char-blue'), { x: -300, rotation: 15 }, { x: 0, rotation: 0, duration: 2, ease: 'power2.out' }, 15)
    .fromTo(s(7).querySelector('.film-txt'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, 16.5);

  // 8. 여러분의 행동이 더해질수록 도넛은 더 크게 굴러갑니다
  cut(8, 18, 0.3);
  tl.fromTo(s(8).querySelector('.film-donut'), { rotation: 270, scale: 0.5 }, { rotation: 90, scale: 1, duration: 2.5, ease: 'power2.inOut' }, 18);

  // 9. 세상을 굴리는 힘
  cut(9, 20.5, 0.3);
  tl.fromTo(s(9).querySelector('.film-donut'), { rotation: 120 }, { rotation: 90, duration: 2, ease: 'power2.out' }, 20.5)
    .fromTo(s(9).querySelectorAll('.film-word'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.5 }, 20.5);

  // 10. 도넛 크루가 되어 주세요
  cut(10, 24, 0.3);
  tl.fromTo(s(10).querySelector('.row01'), { x: 200 }, { x: -200, duration: 3.5, ease: 'none' }, 24)
    .fromTo(s(10).querySelector('.row02'), { x: -200 }, { x: 200, duration: 3.5, ease: 'none' }, 24);

  // 11. 로고
  cut(11, 27, 0.3);
  tl.fromTo(s(11).querySelector('.film-logo'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1, ease: 'power2.out' }, 27)
    .to({}, { duration: 2.5 }, 27.5);

  ScrollTrigger.create({
    trigger: box,
    start: 'top 85%',
    end: 'bottom 15%',
    onEnter: function () { tl.play(); },
    onEnterBack: function () { tl.play(); },
    onLeave: function () { tl.pause(); },
    onLeaveBack: function () { tl.pause(); }
  });
}
*/

// 슬라이드로 넘길 때는 카드가 화면 끝까지 이어져 흐르고, 여백은 처음(왼쪽)과 끝(오른쪽)에만 남긴다.
// 컨테이너 여백이 폭마다 달라(퍼센트·max-width가 섞여 좌우도 다름) CSS 대신 실제 값을 재서 맞춘다
function bleedSwiper(swiper, active) {
  var el = swiper.el;
  var inner = el.closest('.inner');
  var section = el.closest('section');
  if (!inner || !section) return;

  function fit() {
    if (swiper.destroyed) return;

    var on = !active || active();
    var s = section.getBoundingClientRect();
    var i = inner.getBoundingClientRect();
    var left = on ? Math.round(i.left - s.left) : 0;
    var right = on ? Math.round(s.right - i.right) : 0;
    // 슬라이드 폭을 컨테이너 기준으로 잡을 수 있게 넘겨 준다 (스와이퍼 상자는 화면 폭이라 %로는 안 됨)
    var width = Math.round(i.width) + 'px';

    if (swiper.params.slidesOffsetBefore === left && swiper.params.slidesOffsetAfter === right &&
      el.style.getPropertyValue('--inner-w') === width) return;

    el.style.setProperty('--inner-w', width);
    el.style.marginLeft = left ? -left + 'px' : '';
    el.style.marginRight = right ? -right + 'px' : '';
    swiper.params.slidesOffsetBefore = left;
    swiper.params.slidesOffsetAfter = right;
    swiper.update();
  }

  fit();
  swiper.on('resize', fit);
}

// 피드백: 모바일에서는 네 항목을 좌우로 넘겨 보게 한다.
// 창 크기가 경계를 넘나들 수 있으므로 스와이퍼 구조를 그때그때 씌우고 걷어낸다
function doMobileSlide() {
  var list = document.querySelector('.sc-do .do-list');
  var pager = document.querySelector('.sc-do .do-pager');
  if (!list || typeof Swiper === 'undefined') return;

  var swiper = null;
  var wrap = null;
  var timer = null;

  function build() {
    if (swiper) return false;

    list.classList.add('swiper-wrapper');
    $(list).children().addClass('swiper-slide');

    wrap = document.createElement('div');
    wrap.className = 'swiper do-swiper';
    list.parentNode.insertBefore(wrap, list);
    wrap.appendChild(list);

    // 카드 폭은 CSS가 정한다(모바일: 컨테이너의 88.4% = 360에서 283, 태블릿: 340)
    swiper = new Swiper(wrap, {
      slidesPerView: 'auto',
      spaceBetween: 22,
      a11y: { enabled: false },
      scrollbar: {
        el: pager,
        draggable: true
      },
      // 태블릿 폭에서는 카드를 시안 크기(340)로 두고 들어가는 만큼만 보여 준다
      breakpoints: {
        769: {
          slidesPerView: 'auto',
          spaceBetween: 27
        }
      }
    });
    bleedSwiper(swiper);

    return true;
  }

  // PC 폭으로 넓어지면 걷어내야 한다. 그대로 두면 네 항목이 한 칸 폭에 갇힌다
  function destroy() {
    if (!swiper) return false;

    swiper.destroy(true, true);
    swiper = null;

    wrap.parentNode.insertBefore(list, wrap);
    wrap.parentNode.removeChild(wrap);
    wrap = null;

    list.classList.remove('swiper-wrapper');
    $(list).children().removeClass('swiper-slide');
    $(pager).empty();

    return true;
  }

  // 네 장이 한 줄에 들어가기 어려워지는 폭부터 슬라이드로 바꾼다 (핀 연출도 같은 기준)
  function update() {
    var changed = window.innerWidth <= 1024 ? build() : destroy();
    if (changed && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  update();

  $(window).on('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(update, 200);
  });
}

function doStepScroll() {
  var section = document.querySelector('.sc-do');
  if (!section) return;

  var items = section.querySelectorAll('.do-list li');
  var deco = section.querySelector('.do-deco');
  var char = deco.querySelector('.char01');
  var donut = deco.querySelector('.char02');
  var donutRadius = 98;
  // 크림보이 걷기 스프라이트(가로 한 줄 24프레임)와 양발 한 사이클에 나아가는 거리.
  // 거리가 길수록 다리가 천천히 움직인다. 크루 줄의 초록 크림보이(170)의 절반 속도로 걷게 한다
  var walkFrames = 24;
  var stride = 340;
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
    var phase = (x / stride) % 1;
    if (phase < 0) phase += 1;

    var frame = Math.floor(phase * walkFrames) % walkFrames;
    var pos = (frame / (walkFrames - 1)) * 100 + '% 0';

    char.style.webkitMaskPosition = pos;
    char.style.maskPosition = pos;
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
          return deco.parentElement.clientWidth - deco.offsetWidth;
        },
        duration: items.length,
        ease: 'none',
        onUpdate: walk
      }, 0);

    // 좁은 창에서 PC 폭으로 넓히면 이 핀이 가장 나중에 만들어져, 아래 섹션들이 핀 길이를 빼고 계산돼
    // 목표 섹션 고정이 일찍 걸려 튀었다 → 페이지 순서대로 다시 정렬해 핀 길이를 반영하게 한다
    ScrollTrigger.sort();

    return function () {
      char.style.webkitMaskPosition = '';
      char.style.maskPosition = '';
    };
  });

  // 핀 구간을 스크롤하던 중 창을 좁히면 카드가 숨김 상태로 남아 분홍 배경만 보였다.
  // 좁은 구간으로 넘어올 때마다 핀 애니메이션이 남긴 인라인 스타일을 걷어낸다
  mm.add('(max-width: 1024px), (prefers-reduced-motion: reduce)', function () {
    // 스와이퍼가 슬라이드에 넣는 width는 건드리면 안 되므로 핀 연출이 쓰는 속성만 지운다
    var used = 'opacity,visibility,transform,translate,rotate,scale';

    function clear() {
      gsap.set(items, { clearProps: used });
      gsap.set(deco, { clearProps: used });
    }

    clear();
    ScrollTrigger.addEventListener('refresh', clear);

    return function () {
      ScrollTrigger.removeEventListener('refresh', clear);
    };
  });
}

// 피드백: 원 안에서 사진만 바뀌던 방식 대신 목록이 좌우로 밀려 이동하는 캐러셀
function rollSlide() {
  var el = document.querySelector('.sc-roll .roll-swiper');
  if (!el || typeof Swiper === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 슬라이드로 바뀌는 폭은 스크롤바로 위치를 보여 주므로 순환하지 않는다 (순환하면 스크롤바가 튄다)
  var isMobile = window.innerWidth <= 1024;

  var swiper = new Swiper(el, {
    loop: !isMobile,
    speed: 700,
    a11y: { enabled: false },
    // 화면에 걸린 카드에만 swiper-slide-visible이 붙는다 (바깥 카드를 CSS로 감춘다)
    watchSlidesProgress: true,
    // 피드백: 자동 넘김을 끈다 (다시 켤 경우 대비해 보류)
    autoplay: false,
    // autoplay: reduceMotion ? false : {
    //   delay: 5000,
    //   disableOnInteraction: false,
    //   pauseOnMouseEnter: true
    // },
    slidesPerGroup: 1,
    // 모바일에 옆으로 넘길 수 있다는 표시를 둔다
    scrollbar: {
      el: '.sc-roll .roll-pager',
      draggable: true
    },
    // 좁은 화면은 손으로 밀어 보고, PC는 컨테이너를 4등분해 카드 폭을 딱 맞춘다
    breakpoints: {
      // 간격은 CSS margin이 아니라 여기서 줘야 끝까지 넘겼을 때 마지막 카드가 잘리지 않는다
      0: {
        slidesPerView: 'auto',
        spaceBetween: 5,
        allowTouchMove: true
      },
      1025: {
        slidesPerView: 4,
        spaceBetween: 7,
        allowTouchMove: false
      }
    }
  });

  // PC는 네 장이 컨테이너에 딱 맞으므로 슬라이드로 바뀌는 폭에서만 화면 끝까지 흐르게 한다
  bleedSwiper(swiper, function () {
    return window.innerWidth <= 1024;
  });

  $('.sc-roll .btn-next').on('click', function () {
    swiper.slideNext();
  });

  if (reduceMotion) return;

  var rollIn = 140;
  // 처음 화면에 보이는 카드만 굴러 들어온다.
  // (자동 넘김을 다시 켜면: 등장 전에 넘어가 카드가 어긋나지 않게 여기서 멈췄다가 등장이 끝나면 다시 시작)
  // swiper.autoplay.stop();

  var cards = el.querySelectorAll('.roll-frame.swiper-slide-visible');
  gsap.set(cards, { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: '.sc-roll .roll-slide',
    start: 'top 85%',
    once: true,
    onEnter: function () {
      gsap.timeline({
        // onComplete: function () {
        //   swiper.autoplay.start();
        // }
      })
        .fromTo(cards, {
          x: rollIn,
          rotation: function (i, target) {
            return (rollIn / (target.offsetWidth / 2)) * (180 / Math.PI);
          },
          autoAlpha: 0
        }, {
          x: 0,
          rotation: 0,
          autoAlpha: 1,
          duration: 2.2,
          ease: 'power2.out',
          stagger: 0.3,
          // 인라인 opacity가 남으면 화면 밖 카드를 감추는 CSS를 덮어쓴다
          clearProps: 'opacity,visibility,transform'
        })
        .fromTo('.sc-roll .btn-next', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, '-=0.8');
    }
  });
}

// 모든 섹션의 제목 공통: 아래에서 부드럽게 떠오른다.
// 제목 묶음은 영문 제목 → 한글 제목 차례로, 인트로 배너 문구는 한 덩어리로
var TITLE_STEP = 0.22;
// 화면 아래 85%에서 시작하면 섹션이 반도 안 들어왔을 때 이미 재생돼 버린다 → 60%
var TITLE_START = 'top 60%';

function titleFadeUp() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function rise(targets, trigger, start) {
    gsap.fromTo(targets, { autoAlpha: 0, y: 40 }, {
      autoAlpha: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: TITLE_STEP,
      clearProps: 'opacity,visibility,transform',
      scrollTrigger: {
        trigger: trigger,
        start: start || TITLE_START,
        once: true
      }
    });
  }

  gsap.utils.toArray('.main .tit-group').forEach(function (group) {
    rise(group.children, group);
  });

  // 인트로 문구는 위쪽 padding(387px, 모바일 267px) 아래에 글자가 있어 박스 윗변 기준이면
  // 글자가 화면에 들어오기 전에 재생된다 → 글자 윗변이 화면 60%에 올 때 시작
  var intro = document.querySelector('.sc-intro .tit');
  if (intro) {
    rise(intro, intro, function () {
      return 'top+=' + parseFloat(getComputedStyle(intro).paddingTop) + ' 60%';
    });
  }

  // 히어로 문구는 처음부터 보이는 화면이라 스크롤을 기다리지 않고 도넛과 함께 떠오른다
  var hero = document.querySelector('.sc-visual .tit');
  if (hero) {
    gsap.fromTo(hero, { autoAlpha: 0, y: 40 }, {
      autoAlpha: 1,
      y: 0,
      duration: 1.1,
      delay: 0.2,
      ease: 'power3.out',
      clearProps: 'opacity,visibility,transform'
    });
  }
}

// Donut Story는 제목 묶음(공통) 두 줄 뒤에 나머지 글이 세 번째로 이어서 떠오른다
function storyTextUp() {
  var section = document.querySelector('.sc-story');
  if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 나머지 글은 여러 덩어리라도 한꺼번에 올라와야 세 등분이 된다
  gsap.fromTo(section.querySelectorAll('.story-txt, .story-point, .story-note'), { autoAlpha: 0, y: 40 }, {
    autoAlpha: 1,
    y: 0,
    duration: 1.1,
    ease: 'power3.out',
    delay: TITLE_STEP * 2,
    clearProps: 'opacity,visibility,transform',
    scrollTrigger: {
      trigger: section.querySelector('.tit-group'),
      start: TITLE_START,
      once: true
    }
  });
}

// 사진이 둥근 카드에서 화면 가득 펼쳐지며 어두워지고, 뒤이어 문구가 떠오른다.
// 섹션이 화면을 채울 때 딱 끝나도록 맞춰 스크롤 길이를 더 늘리지 않는다
function goalReveal() {
  var section = document.querySelector('.sc-goal');
  if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var bg = section.querySelector('.goal-bg');
  var photo = section.querySelector('.goal-bg .bg');
  var tit = section.querySelector('.tit');
  function build(trigger) {
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: trigger })
      .fromTo(bg, {
        width: '72%',
        height: '45%',
        borderRadius: 16
      }, {
        width: '100%',
        height: '100%',
        borderRadius: 0,
        duration: 7
      })
      // 펼쳐질수록 사진이 어두워져 문구가 또렷해진다
      .fromTo(photo, { opacity: 0.72 }, { opacity: 0.4, duration: 7 }, '<')
      .fromTo(tit, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 3 }, 6);
  }

  // 화면 크기와 상관없이 섹션을 고정해 두고 그 자리에서 펼친다
  build({
    trigger: section,
    start: 'top top',
    end: '+=100%',
    scrub: 1,
    pin: true,
    // anticipatePin은 스크롤 속도로 미리 고정하는데, Lenis와 함께 빠르게 스크롤하면
    // 고정 지점 전에 박스가 한 번에 튀어 올라 쓰지 않는다
    invalidateOnRefresh: true
  });
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
  var viewWidth = svg.viewBox.baseVal.width;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var startLen = 0;

  function isMobile() {
    return window.innerWidth <= 768;
  }

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
    // 모바일은 도넛이 섹션 바닥 쪽에 있어 바닥 기준으로 구간을 잡는다.
    // 피드백으로 구간을 2배로 늘려 도넛이 더 천천히 굴러오게 했다
    start: function () {
      return isMobile() ? 'bottom bottom+=800' : 'top bottom';
    },
    end: function () {
      return isMobile() ? 'bottom bottom-=40' : 'top top-=' + window.innerHeight * 0.6;
    },
    onRefresh: function (self) {
      // 화면 왼쪽 가장자리를 SVG 좌표로 환산해 도넛이 화면 밖에서 출발하게 한다 (모바일은 SVG가 축소됨)
      var rect = svg.getBoundingClientRect();
      startLen = lengthAtX(-rect.left / (rect.width / viewWidth) - radius);
      render(self.progress);
    },
    onUpdate: function (self) {
      render(self.progress);
    }
  });
}
