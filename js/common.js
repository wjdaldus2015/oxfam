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
  // 피드백: 버튼 호버는 확대만 남기고 부스러기 모션을 뺀다 (되돌릴 경우 대비해 보류)
  // btnBite();
  storyDonutRoll();
  storyTextUp();
  whoIntro();
  doMobileSlide();
  doStepScroll();
  rollSlide();
  // 피드백: 목표 배너 섹션 모션 전체 삭제 (PC·모바일, 되돌릴 경우 대비해 보류)
  // goalReveal();
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
  // (피드백으로 굴러 내려오는 모션을 쓰지 않는다 — 되돌릴 경우 대비해 보류)
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

  // 피드백: 모바일은 헤더 버튼이 없어 처음부터 보여 주되, 마지막 섹션(도넛 크루)부터는 감춘다
  var mobile = window.matchMedia('(max-width: 768px)');
  var crew = document.querySelector('.sc-crew');

  // 피드백: 굴러 내려오는 모션(morph)을 쓰지 않는다. PC는 상단 흰색 바가 스크롤로 벗어나는 순간부터 보인다.
  // 등장은 CSS(.quick-menu.is-show)가 제자리에서 살짝 커지며 나타나게 한다
  function toggle(y) {
    // 모바일은 도넛 크루 섹션이 화면 절반까지 올라오면 감춘다 (그 전엔 목표 배너를 보는 중)
    var show = mobile.matches ?
      !crew || crew.getBoundingClientRect().top > window.innerHeight * 0.5 :
      y > header.offsetHeight;
    if (show === state) return;
    state = show;

    menu.classList.toggle('is-show', show);
    root.classList.toggle('is-quick', show);
  }

  toggle(window.scrollY);
  lenis.on('scroll', function (e) {
    toggle(e.scroll);
  });

  // 창 크기가 모바일 기준을 넘나들면 그 폭의 방식으로 다시 맞춘다
  mobile.addEventListener('change', function () {
    toggle(lenis.scroll);
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

  var mobile = window.matchMedia('(max-width: 768px)');

  $tracks.each(function () {
    var $items = $(this).children();
    $(this).append($items.clone(), $items.clone());
  });

  function place() {
    var row01 = document.querySelector('.sc-crew .row01');
    var row02 = document.querySelector('.sc-crew .row02');
    var setWidth = row01.querySelector('.crew-track').scrollWidth / 3;
    // 1920보다 넓은 화면은 CSS(--u)처럼 여백도 화면 폭에 비례해 키운다
    var edge = 60 * Math.max(1, window.innerWidth / 1920);

    row01.style.marginLeft = (window.innerWidth - setWidth * 2 + edge) + 'px';
    row02.style.marginLeft = -edge + 'px';

    // 줄은 60초(모바일은 CSS와 같이 30초)에 한 세트 폭만큼 흐른다. 그 속도에 맞춰 도넛 자전·걷기 주기를 맞춘다
    var speed = setWidth / (mobile.matches ? 30 : 60);
    // 피드백: 2줄은 세트 폭이 조금 짧아 같은 시간이면 느리게 흘러 걸음과 어긋났다 → 폭에 비례한 시간으로 1줄과 같은 속도를 낸다
    if (speed) row02.querySelector('.crew-track').style.animationDuration = (row02.querySelector('.crew-track').scrollWidth / 3 / speed).toFixed(2) + 's';
    var donut = row01.querySelector('li:not(.char) img');
    var boy = document.querySelector('.crew-track .char .cream-boy');
    if (!speed || !donut || !boy) return;

    var root = document.documentElement;
    root.style.setProperty('--crew-spin', (Math.PI * donut.offsetHeight / speed).toFixed(2) + 's');
    // What We Do와 같은 비율의 보폭(표시 높이 136.8px에 170px)
    root.style.setProperty('--crew-walk', ((170 * boy.offsetHeight / 136.8) / speed).toFixed(2) + 's');

    // 피드백: 복제한 크림보이(위 append)나 모바일에서 새로 보이는 크림보이는 걷기 시작 시점이 달라
    // 윗줄·아랫줄 다리 동작이 1~2프레임씩 어긋나 보였다 → 모든 걷기 애니메이션의 시작 시점을 같게 맞춘다
    if (document.getAnimations) {
      document.getAnimations().forEach(function (a) {
        if (a.animationName === 'crewWalk') a.startTime = 0;
      });
    }
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

  // 피드백: 모바일은 줄이 화면 밖 800px에서 3.6초 동안 들어오느라 크림보이가 늦게 보였다 →
  // 짧은 거리를 빠르게 들어와 첫 화면부터 크림보이가 보이게 한다
  var shift = mobile.matches ? 120 : 800;
  var enter = mobile.matches ? 1.2 : 3.6;

  gsap.timeline({
    scrollTrigger: {
      trigger: '.sc-crew .crew-rows',
      start: 'top 85%',
      once: true
    },
    onStart: flow
  })
    .fromTo('.sc-crew .row01', { x: -shift, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: enter, ease: 'power3.out' }, 0)
    .fromTo('.sc-crew .row02', { x: shift, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: enter, ease: 'power3.out' }, 0);
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
  });

  // 피드백: 영상 진입 모션 삭제 (PC 고정·확대, 좁은 화면 떠오르기 모두 — 되돌릴 경우 대비해 보류)
  /*
  var film = section.querySelector('.who-film');
  var mm = gsap.matchMedia();

  // 피드백: 7섹션(목표 배너)에서 뺀 모션을 여기에 모은다. PC는 섹션 윗변을 화면 위에 고정하고,
  // 작은 카드였던 영상이 스크롤을 따라 제자리 크기로 커진다
  mm.add('(min-width: 1025px)', function () {
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=60%',
        scrub: 1,
        pin: true,
        // 바로 아래 What We Do도 고정 구간이라, 이 고정 길이가 먼저 계산돼야 그 시작점이 밀리지 않는다
        // (순서가 뒤바뀌면 What We Do가 648px 일찍 고정되며 화면 위로 튀어 올랐다)
        refreshPriority: 2,
        invalidateOnRefresh: true
      }
    })
      .fromTo(film, { scale: 0.7, borderRadius: 24 }, { scale: 1, borderRadius: 0 });

    ScrollTrigger.sort();
  });

  // 좁은 화면은 고정 없이 섹션에 들어올 때 한 번 떠오른다
  mm.add('(max-width: 1024px)', function () {
    gsap.fromTo(film, { scale: 0.96, autoAlpha: 0 }, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        once: true
      }
    });
  });
  */

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

// 자동 넘김은 슬라이드가 화면에 들어와 있을 때만 돈다. 스크롤해 내려왔을 때 첫 카드부터 2초 보여 주기 위해
// 처음엔 멈춰 두고, 화면에 들어오면 시작한다. canPlay가 false인 동안(등장 연출 중)은 시작하지 않는다
function autoplayInView(swiper, trigger, canPlay) {
  if (!swiper.params.autoplay || !swiper.params.autoplay.enabled) return null;

  swiper.autoplay.stop();

  return ScrollTrigger.create({
    trigger: trigger,
    start: 'top 80%',
    end: 'bottom 20%',
    onToggle: function (self) {
      if (self.isActive && (!canPlay || canPlay())) swiper.autoplay.start();
      else swiper.autoplay.stop();
    }
  });
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
  var play = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function build() {
    if (swiper) return false;

    list.classList.add('swiper-wrapper');
    $(list).children().addClass('swiper-slide');

    wrap = document.createElement('div');
    wrap.className = 'swiper do-swiper';
    list.parentNode.insertBefore(wrap, list);
    wrap.appendChild(list);

    // 모바일은 참고 사이트(water_2026 sec3)처럼 한 장씩(스와이퍼 안쪽 여백을 뺀 폭, 간격 15),
    // 태블릿은 CSS가 정한 카드 폭(340)으로 들어가는 만큼만 보여 준다
    swiper = new Swiper(wrap, {
      slidesPerView: 1,
      spaceBetween: 15,
      a11y: { enabled: false },
      // 참고 사이트와 같은 속도: 1.5초 보여 준 뒤 1초 동안 넘긴다.
      // 끝에 닿으면 처음으로 되감는다 (순환하면 스크롤바가 튄다)
      speed: 1000,
      autoplay: reduceMotion ? false : {
        delay: 1500,
        disableOnInteraction: false
      },
      rewind: true,
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
    // 모바일은 CSS가 스와이퍼를 화면 끝까지 넓히고 안쪽 여백으로 카드를 가운데 두므로 태블릿에서만 맞춘다
    bleedSwiper(swiper, function () {
      return window.innerWidth > 768;
    });
    play = autoplayInView(swiper, wrap);

    // 아래 크림보이가 카드 넘김에 맞춰 걷도록 진행 비율(0~1)을 알린다 (doStepScroll)
    swiper.on('slideChange', function () {
      var last = Math.max(1, swiper.snapGrid.length - 1);
      list.closest('section').dispatchEvent(new CustomEvent('doslide', { detail: Math.min(swiper.snapIndex / last, 1) }));
    });

    return true;
  }

  // PC 폭으로 넓어지면 걷어내야 한다. 그대로 두면 네 항목이 한 칸 폭에 갇힌다
  function destroy() {
    if (!swiper) return false;

    if (play) play.kill();
    play = null;
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

  // 보폭·도넛 반지름은 PC 크기(크림보이 높이 136.8) 기준이라 모바일처럼 줄어든 크기에 맞춰 비례로 줄인다.
  // 왼쪽으로 걸을 땐(좌우 반전) 이동 방향을 뒤집어 다리·도넛이 앞으로 굴러가게 한다
  function walk() {
    var x = gsap.getProperty(deco, 'x');
    var dir = gsap.getProperty(deco, 'scaleX') < 0 ? -1 : 1;
    var k = char.offsetHeight / 136.8 || 1;
    var phase = ((dir * x) / (stride * k)) % 1;
    if (phase < 0) phase += 1;

    var frame = Math.floor(phase * walkFrames) % walkFrames;
    var pos = (frame / (walkFrames - 1)) * 100 + '% 0';

    char.style.webkitMaskPosition = pos;
    char.style.maskPosition = pos;
    gsap.set(donut, { rotation: ((dir * x) / (donutRadius * k)) * (180 / Math.PI) });
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
        // 위 Who We Are 고정(2) 다음, 나머지 트리거보다 먼저 계산한다
        refreshPriority: 1,
        invalidateOnRefresh: true
      }
    });

    // 피드백: 떠오르기 시작할 때 카드가 아래 크림보이·도넛과 겹치지 않도록 출발 위치를 60 → 20으로 줄이고 조금 작게 시작한다
    tl.fromTo(items, { autoAlpha: 0, y: 20, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1, stagger: 1 }, 0)
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
    }

    // 크림보이·도넛은 아래(슬라이드에 맞춰 걷기)가 위치를 쓰므로 들어올 때 한 번만 걷어낸다
    gsap.set(deco, { clearProps: used });
    clear();
    ScrollTrigger.addEventListener('refresh', clear);

    return function () {
      ScrollTrigger.removeEventListener('refresh', clear);
    };
  });

  // 피드백: 슬라이드로 보는 폭에서는 위 카드가 자동으로 넘어갈 때마다 크림보이가 도넛을 밀며
  // 그 진행 비율만큼 좌우로 걸어간다 (처음으로 되감길 땐 돌아서서 왼쪽으로). 넘김 속도(1초)와 같은 시간
  mm.add('(max-width: 1024px) and (prefers-reduced-motion: no-preference)', function () {
    // 피드백: 멈출 때 다리가 어색하게 모여 있었다 → 다리를 활짝 편 프레임(0번·12번, 반 걸음 간격)에서
    // 출발하고 멈추도록, 이동 거리를 반 걸음의 정수배로 나눠 보폭을 그때그때 맞춘다
    var rest = 0;

    function setFrame(phase) {
      var p = ((phase % 1) + 1) % 1;
      var frame = Math.min(Math.round(p * walkFrames), walkFrames) % walkFrames;
      var pos = (frame / (walkFrames - 1)) * 100 + '% 0';

      char.style.webkitMaskPosition = pos;
      char.style.maskPosition = pos;
    }

    function onSlide(e) {
      var to = (deco.parentElement.clientWidth - deco.offsetWidth) * e.detail;
      var from = gsap.getProperty(deco, 'x');
      var dist = Math.abs(to - from);
      if (dist < 1) return;

      var k = char.offsetHeight / 136.8 || 1;
      var steps = Math.max(1, Math.round(dist / (stride * k / 2)));
      var start = rest;

      gsap.set(deco, { scaleX: to < from ? -1 : 1 });
      gsap.to(deco, {
        x: to,
        duration: 1,
        ease: 'power1.inOut',
        overwrite: 'auto',
        onUpdate: function () {
          var x = gsap.getProperty(deco, 'x');
          var dir = to < from ? -1 : 1;

          setFrame(start + (Math.abs(x - from) / dist) * (steps / 2));
          gsap.set(donut, { rotation: ((dir * x) / (donutRadius * k)) * (180 / Math.PI) });
        },
        onComplete: function () {
          rest = (start + steps / 2) % 1;
          setFrame(rest);
        }
      });
    }

    setFrame(rest);

    section.addEventListener('doslide', onSlide);

    return function () {
      section.removeEventListener('doslide', onSlide);
      gsap.killTweensOf(deco);
      gsap.set(deco, { clearProps: 'transform' });
      char.style.webkitMaskPosition = '';
      char.style.maskPosition = '';
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
  var swiper = null;
  var play = null;
  var timer = null;
  // 처음 화면에 보이는 카드가 굴러 들어오는 동안은 자동 넘김을 시작하지 않는다
  var rolled = reduceMotion;

  // 순환(loop)·되감기(rewind)·자동 넘김은 만들 때 정해져 창 폭이 바뀌어도 따라가지 않는다.
  // PC 폭으로 연 뒤 좁히면 순환이 남아 끝 카드 뒤에 첫 카드가 붙고 끝 여백이 사라졌다 → 기준(1024)을 넘으면 다시 만든다
  function build() {
    swiper = new Swiper(el, {
      loop: !isMobile,
      speed: 700,
      a11y: { enabled: false },
      // 화면에 걸린 카드에만 swiper-slide-visible이 붙는다 (바깥 카드를 CSS로 감춘다)
      watchSlidesProgress: true,
      // PC는 자동 넘김을 끈다(이전 피드백). 슬라이드로 바뀌는 폭은 What We Do와 같이
      // 2초 보여 준 뒤 자동으로 넘기고 끝에서 처음으로 되감는다(피드백)
      autoplay: reduceMotion || !isMobile ? false : {
        delay: 2000,
        disableOnInteraction: false
      },
      rewind: isMobile,
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

    play = autoplayInView(swiper, '.sc-roll .roll-slide', function () {
      return rolled;
    });
  }

  build();

  $(window).on('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if ((window.innerWidth <= 1024) === isMobile) return;

      isMobile = !isMobile;
      if (play) play.kill();
      swiper.destroy(true, true);
      // 화면 끝까지 넓히느라 넣은 여백은 새로 만들 때 다시 잰다
      el.style.marginLeft = '';
      el.style.marginRight = '';
      build();
      ScrollTrigger.refresh();
    }, 200);
  });

  $('.sc-roll .btn-next').on('click', function () {
    swiper.slideNext();
  });

  if (reduceMotion) return;

  var rollIn = 140;

  var cards = el.querySelectorAll('.roll-frame.swiper-slide-visible');
  gsap.set(cards, { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: '.sc-roll .roll-slide',
    start: 'top 85%',
    once: true,
    onEnter: function () {
      gsap.timeline({
        onComplete: function () {
          rolled = true;
          if (play && play.isActive && swiper.params.autoplay.enabled) swiper.autoplay.start();
        }
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
    // PC Donut Story 제목은 본문과 한 줄씩 이어 뜬다 (storyTextUp)
    if (group.closest('.sc-story') && window.innerWidth > 768) return;
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

// Donut Story 끝 지점(스크롤 위치): 모바일은 마지막 글 덩어리(강조 문구)가 화면 70%에 오는 곳(PC는 아래 참고).
// 다만 화면이 낮으면 그때 제목(모바일은 제목 옆 지구)이 위로 잘리므로, 그 윗변이 화면 맨 위에 닿기 전으로 당긴다.
// 지구 도넛(storyDonutRoll)은 여기서 멈추고 마지막 글(storyTextUp)은 여기서 떠올라, 한 화면에서 함께 끝난다
function storyEndScroll() {
  var section = document.querySelector('.sc-story');
  var gap = 20 * Math.max(1, window.innerWidth / 1920);
  var top = function (el) {
    return el.getBoundingClientRect().top + window.scrollY;
  };
  var head = window.innerWidth <= 768 ? section.querySelector('.track-donut') : section.querySelector('.tit-group');

  // 피드백(PC): 섹션이 화면에 다 들어오는 위치에서 추가 스크롤 없이 모두 끝나 있어야 한다 →
  // 맨 아래 주석 글이 화면 95% 안에 들어오는 순간 끝낸다
  if (window.innerWidth > 768) {
    var note = section.querySelector('.story-note');
    return Math.min(top(note) + note.offsetHeight - window.innerHeight * 0.95, top(head) - gap);
  }

  // 피드백(모바일): 제목이 화면 위에서 15% 아래에 있을 때(제목·본문 세 문단이 보이는 위치) 모두 끝나 있게 한다
  return Math.min(
    top(section.querySelector('.story-point')) - window.innerHeight * 0.7,
    top(head) - gap,
    top(section.querySelector('.tit-group')) - window.innerHeight * 0.15
  );
}

// Donut Story: 시안 메모(소개 영역 — 스크롤에 따라 텍스트를 나눠 보여 준다)대로 네 덩어리로 나눠 떠오른다.
// ① 제목 묶음(공통 titleFadeUp) ② 첫 두 문단 ③ 세 번째 문단 ④ 강조 문구 + 주석.
// 한 번에 여러 덩어리가 화면에 들어오면 앞 덩어리가 시작한 뒤 0.35초씩 차례로 이어서 떠오른다
function storyTextUp() {
  var section = document.querySelector('.sc-story');
  if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 피드백(PC): 제목부터 초록 강조 문구·주석까지 한 줄씩 빠르게 차례로 떠오른다.
  // 각 줄은 화면 아래 90%에 들어올 때 뜨되, 늦어도 지구 도넛이 멈추는 지점(storyEndScroll)에서는 떠서
  // 섹션이 다 보이는 위치에선 모두 떠 있다 (제목도 여기서 함께 다뤄 titleFadeUp에서는 뺀다)
  if (window.innerWidth > 768) {
    var lines = gsap.utils.toArray(section.querySelectorAll('.tit-group > *, .story-txt p, .story-point, .story-note'));
    var lineGap = 0.12;
    var lineNext = 0;

    gsap.set(lines, { autoAlpha: 0, y: 30 });
    lines.forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: function () {
          // 멈추는 지점과 똑같으면 거기 서 있을 때 트리거가 걸리지 않아 조금 앞당긴다
          return Math.min(el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.9, storyEndScroll() - 2);
        },
        once: true,
        onEnter: function () {
          var now = gsap.ticker.time;
          var delay = Math.max(0, lineNext - now);
          lineNext = now + delay + lineGap;

          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            delay: delay,
            ease: 'power2.out',
            clearProps: 'opacity,visibility,transform'
          });
        }
      });
    });
    return;
  }

  var p = section.querySelectorAll('.story-txt p');
  var steps = [
    [p[0], p[1]],
    [p[2]],
    [section.querySelector('.story-point'), section.querySelector('.story-note')]
  ];
  var gap = 0.35;
  var next = 0;

  steps.forEach(function (items, i) {
    gsap.set(items, { autoAlpha: 0, y: 40 });

    ScrollTrigger.create({
      trigger: items[0],
      // 첫 덩어리가 제목(화면 60%에서 시작)보다 먼저 뜨지 않도록 조금 더 올라왔을 때 시작.
      // 마지막 덩어리는 지구 도넛이 멈추는 지점(storyEndScroll)에서 함께 떠오르고,
      // 나머지도 늦어도 그 지점에서는 뜬다 (같은 지점이면 거기 서 있을 때 걸리지 않아 조금 앞당긴다)
      start: function () {
        var end = storyEndScroll() - 2;
        if (i === steps.length - 1) return end;
        return Math.min(items[0].getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.7, end);
      },
      once: true,
      onEnter: function () {
        var now = gsap.ticker.time;
        var delay = Math.max(0, next - now);
        next = now + delay + gap;

        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          delay: delay,
          ease: 'power3.out',
          clearProps: 'opacity,visibility,transform'
        });
      }
    });
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
  var mm = gsap.matchMedia();

  // 피드백: 스크롤을 덜 해도 완성되도록 사진이 처음부터 크게 확대된 상태(72%×45% → 86%×70%)에서 시작한다
  function build(trigger) {
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: trigger })
      .fromTo(bg, {
        width: '86%',
        height: '70%',
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

  // 섹션을 고정해 두고 그 자리에서 펼친다. 피드백으로 고정 길이를 화면 높이의 100% → 50%로 줄였다
  mm.add('(min-width: 769px)', function () {
    build({
      trigger: section,
      start: 'top top',
      end: '+=50%',
      scrub: 1,
      pin: true,
      // anticipatePin은 스크롤 속도로 미리 고정하는데, Lenis와 함께 빠르게 스크롤하면
      // 고정 지점 전에 박스가 한 번에 튀어 올라 쓰지 않는다
      invalidateOnRefresh: true
    });
  });

  // 모바일은 배너가 화면보다 낮아(네 사람이 다 보이게 줄임) 고정하면 다음 섹션이 비친다.
  // 고정 없이 배너가 올라오는 동안 펼쳐져 화면 가운데에 올 때 완성된다
  mm.add('(max-width: 768px)', function () {
    build({
      trigger: section,
      start: 'top 90%',
      end: 'center center',
      scrub: 1,
      invalidateOnRefresh: true
    });
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
  // 피드백: 다 굴러왔을 때 북반구가 위로 똑바로 서게(원래 그림 각도 0) 한다.
  // 지구 크기는 롤링 패스와 비율이 맞도록 SVG 전체를 CSS에서 줄인다 (.story-track)
  var radius = 341;
  var endAngle = 0;
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
    // 피드백: 스크롤을 따라 굴러오다 마지막 글이 떠오르는 지점(storyEndScroll)에서 글 옆에 멈춘다.
    // 그 순간 제목·글·지구가 한 화면에 함께 보인다
    start: function () {
      return isMobile() ? 'top 90%' : 'top 80%';
    },
    end: storyEndScroll,
    onRefresh: function (self) {
      // 화면 왼쪽 가장자리를 SVG 좌표로 환산해, 도넛이 화면 밖이 아니라 왼쪽 끝 롤링 패스 위에서 출발하게 한다
      // (모바일은 SVG가 축소됨)
      var rect = svg.getBoundingClientRect();
      startLen = lengthAtX(-rect.left / (rect.width / viewWidth) + radius);
      render(self.progress);
    },
    onUpdate: function (self) {
      render(self.progress);
    }
  });
}
