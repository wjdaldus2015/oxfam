<!DOCTYPE html>
<html lang="ko">

<head>
  <title><?php if($PageTitle!=""){echo $PageTitle . " - ";}?>타이틀</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
  <meta name="format-detection" content="telephone=no" />
  <!-- OG -->
  <!--
    <meta property="og:type" content="website" />
    <meta property="og:title" content="<?php if($PageTitle!=''){echo $PageTitle . ' - ';}?>타이틀" />
    <meta name="description" content="사이트설명" />
    <meta property="og:description" content="사이트설명" />
    <meta property="og:image" content="대표이미지주소(full_url):관리자등록권장/이미지크기(1200x630px)">
    <meta property="og:url" content="웹사이트url">
    <meta name="url" content="웹사이트url">
    <link rel="canonical" href="웹사이트url" />
    -->
  <!-- //OG -->
  <!-- favicon -->
  <!-- //favicon -->
  <!-- fonts -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.3.9/static/pretendard.css"
    integrity="sha512-NzqTHTrO48HsIamogmIaVhTXoSgRF24Cn+ynrNYrFuKrY0AdDbmcNieiOHsQARS/r0Gax9VwV3/rVMHs3ipUlg=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <!-- //fonts -->
  <link type="text/css" rel="stylesheet" href="/css/base.css?t=<?php echo time(); ?>" />
  <link type="text/css" rel="stylesheet" href="/css/board.css?t=<?php echo time(); ?>" />
  <link type="text/css" rel="stylesheet" href="/css/common.css?t=<?php echo time(); ?>" />
  <link type="text/css" rel="stylesheet" href="/css/layout.css?t=<?php echo time(); ?>" />
  <link type="text/css" rel="stylesheet" href="/css/main.css?t=<?php echo time(); ?>" />
  <link type="text/css" rel="stylesheet" href="/css/sub.css?t=<?php echo time(); ?>" />
  <script>
  window.addEventListener('DOMContentLoaded', function() {
    if (window.navigator.userAgent.match(/MSIE|Internet Explorer|Trident/i)) {
      alert('본 사이트는 Internet Explore 이용이 불가능합니다.');
      window.open('microsoft-edge:' + window.location.href);
    } else {
      document.getElementById('wrap').style.visibility = 'inherit';
    }
  });
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
    integrity="sha512-MXe5EK5gyK+fbhwQy/dukwz9fw71HZcsM4KsyDBDTvMyjymkiO0M5qqU0lF4vqLI4VnKf1+DIKf1GM6RFkO8PA=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.js"
    integrity="sha512-+k1pnlgt4F1H8L7t3z95o3/KO+o78INEcXTbnoJQ/F2VqDVhWoaiVml/OEHv9HsVgxUaVW+IbiZPUJQfF/YxZw=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script defer type="text/javascript" src="/js/common.js?t=<?php echo time(); ?>"></script>
  <script defer type="text/javascript" src="/js/script.js?t=<?php echo time(); ?>"></script>
  <script defer type="text/javascript" src="/js/sub.js?t=<?php echo time(); ?>"></script>
</head>

<body>
  <!--Wrap-->
  <div id="wrap">