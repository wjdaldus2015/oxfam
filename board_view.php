<?php
	$PageName = "MAIN";
	$SubName = "MAIN";
	$PageTitle = "";
	include './include/head.php';
	include './include/header.php';
?>
<div id="container">
  <div class="inner">
    <!-- board view -->
    <p class="board-view-tit">게시글의 제목이 들어갑니다.</p>
    <div class="board-view">
      <p class="board-view-info">작성일 : 2022.09.29&nbsp;&nbsp;&nbsp;&nbsp;조회수 : 133</p>

      <div class="board-view-ct">
        <div class="u-editor">게시자가 에디터로 작성한 내용이 들어갑니다.</div>

        <!-- 첨부 -->
        <ul class="board-view-file">
          <li><a href="#">filename.jpg</a></li>
          <li><a href="#" target="_blank">filename.pdf</a></li>
        </ul>
        <!-- END 첨부 -->
      </div>
      <!-- 이전/다음 컨텐츠 -->
      <ul class="board-view-nav">
        <li>
          <span class="lb">이전글<img src="/image/common/icon_prev.png" alt="" width="8" height="5" /></span>이전글이
          없습니다.
        </li>
        <li>
          <span class="lb">다음글<img src="/image/common/icon_next.png" alt="" width="8" height="5" /></span
          ><a href="#">다음글의 제목이 들어갑니다.</a>
        </li>
      </ul>
      <!-- END 이전/다음 컨텐츠 -->
    </div>
    <a href="" class="board-view-btn">목록으로</a>
  </div>
</div>

<?php include './include/footer.php' ?>
