<!-- 각 메인/서브 메뉴 타이틀명 -->

<?php
	class PageInfo {
		function __construct($src='', $name='', $engName=''){
			$this->url = $src;
			$this->tit = $name;
			$this->eng = $engName;
		}
	};

	//메뉴링크, 메뉴명 정의(영문명이 없을 시 적지 않아도 됨)
	$HOME = new PageInfo('/');

	$K01 = new PageInfo('/sample.php', '메뉴명', 'English');
	$K02 = new PageInfo('/sample.php', '메뉴명', 'English');
	$K03 = new PageInfo('/sample.php', '메뉴명', 'English');
	$K04 = new PageInfo('/sample.php', '메뉴명', 'English');
	$K05 = new PageInfo('/sample.php', '메뉴명', 'English');
?>