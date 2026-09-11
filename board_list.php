<?php
	$PageName = "MAIN";
	$SubName = "MAIN";
	$PageTitle = "";
	include './include/head.php';
	include './include/header.php';
?>
<div id="container">
  <div class="inner">
    <div class="board-search">
      <select name="" id="">
        <option value="">제목</option>
        <option value="">내용</option>
      </select>

      <div>
        <input type="text" />
        <button>
          <img src="/image/common/submit_icon.png" alt="" />
        </button>
      </div>
    </div>

    <div class="board-list">
      <div class="board-list__header">
        <div class="board-list__num">번호</div>
        <div class="board-list__tit">제목</div>
        <div class="board-list__date">날짜</div>
      </div>
      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">10</div>
        <div class="board-list__tit">Lorem ipsum dolor</div>
        <div class="board-list__date">2022.09.29</div>
      </a>

      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">9</div>
        <div class="board-list__tit">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolore, aperiam ad illum consectetur harum,
          nihil ex, non doloribus aut ipsam ea expedita voluptatibus? Perspiciatis fugiat nam aspernatur dignissimos
          cum.
        </div>
        <div class="board-list__date">2022.09.29</div>
      </a>

      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">8</div>
        <div class="board-list__tit">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolore, aperiam ad illum consectetur harum,
          nihil ex, non doloribus aut ipsam ea expedita voluptatibus? Perspiciatis fugiat nam aspernatur dignissimos
          cum.
        </div>
        <div class="board-list__date">2022.09.29</div>
      </a>

      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">7</div>
        <div class="board-list__tit">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolore, aperiam ad illum consectetur harum,
          nihil ex, non doloribus aut ipsam ea expedita voluptatibus? Perspiciatis fugiat nam aspernatur dignissimos
          cum.
        </div>
        <div class="board-list__date">2022.09.29</div>
      </a>

      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">6</div>
        <div class="board-list__tit">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolore, aperiam ad illum consectetur harum,
          nihil ex, non doloribus aut ipsam ea expedita voluptatibus? Perspiciatis fugiat nam aspernatur dignissimos
          cum.
        </div>
        <div class="board-list__date">2022.09.29</div>
      </a>

      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">5</div>
        <div class="board-list__tit">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolore, aperiam ad illum consectetur harum,
          nihil ex, non doloribus aut ipsam ea expedita voluptatibus? Perspiciatis fugiat nam aspernatur dignissimos
          cum.
        </div>
        <div class="board-list__date">2022.09.29</div>
      </a>

      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">4</div>
        <div class="board-list__tit">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolore, aperiam ad illum consectetur harum,
          nihil ex, non doloribus aut ipsam ea expedita voluptatibus? Perspiciatis fugiat nam aspernatur dignissimos
          cum.
        </div>
        <div class="board-list__date">2022.09.29</div>
      </a>

      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">3</div>
        <div class="board-list__tit">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolore, aperiam ad illum consectetur harum,
          nihil ex, non doloribus aut ipsam ea expedita voluptatibus? Perspiciatis fugiat nam aspernatur dignissimos
          cum.
        </div>
        <div class="board-list__date">2022.09.29</div>
      </a>

      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">2</div>
        <div class="board-list__tit">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolore, aperiam ad illum consectetur harum,
          nihil ex, non doloribus aut ipsam ea expedita voluptatibus? Perspiciatis fugiat nam aspernatur dignissimos
          cum.
        </div>
        <div class="board-list__date">2022.09.29</div>
      </a>

      <a href="/board_view.php" class="board-list__record">
        <div class="board-list__num">1</div>
        <div class="board-list__tit">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod dolore, aperiam ad illum consectetur harum,
          nihil ex, non doloribus aut ipsam ea expedita voluptatibus? Perspiciatis fugiat nam aspernatur dignissimos
          cum.
        </div>
        <div class="board-list__date">2022.09.29</div>
      </a>
    </div>

    <div class="list-pager">
      <a href=""><img src="/image/common/pager_first.png" alt="" /></a>
      <a href=""><img src="/image/common/pager_prev.png" alt="" /></a>
      <a href="" class="active">1</a>
      <a href="">2</a>
      <a href="">3</a>
      <a href="">4</a>
      <a href="">5</a>
      <a href=""><img src="/image/common/pager_next.png" alt="" /></a>
      <a href=""><img src="/image/common/pager_last.png" alt="" /></a>
    </div>
  </div>
</div>

<?php include './include/footer.php' ?>
