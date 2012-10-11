<?php
$path = $_SERVER['REQUEST_URI'];
$str = '';
if (isset($path)) {
	$path = substr($path, 1);
	if(strlen($path) == 7 && !preg_match('/[^0-9a-zA-Z]/', $path) && file_exists('log/' . $path)) {
		$str = file_get_contents('log/' . $path);
	} elseif($path) {
		header('Location: /');
		exit;
	}
}
?>
<!DOCTYPE html>
<html lang="ja" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1024" />
<meta name="apple-mobile-web-app-capable" content="yes" /> 
<link rel="stylesheet" type="text/css" href="style.css" />
<link rel="apple-touch-icon" href="icon.png" />
<script type="text/javascript">
var share = "<?php echo $str;?>";
</script>
<script type="text/javascript" src="http://rds.manse.jp/assist.js"></script>
<script type="text/javascript" src="http://rds.manse.jp/rds.js"></script>
<title>Random Dot Stereogram</title>
</head>
<body>
<div id="shadow"></div>
<div id="overlay" class="g"></div>
<style type="text/css">
html, body {
	background: url(back.gif) center #589556;
}
</style>
<div id="container">
	<h1 id="logo"><a href="/">Random Dot Stereogram</a></h1>
	<div id="stage">
		<canvas id="cvs1" class="g" width="1" height="1"></canvas>
		<canvas id="cvs2" class="g" width="1" height="1"></canvas>
		<canvas id="cvs3" class="g" width="1" height="1"></canvas></div>
	</body>
	<div id="navi">
		<div class="step" id="step1">
			<h2>Step.1 ドット画を生成します</h2>
			<table>
				<tr>
					<td>色相</td>
					<td id="s1_h"></td>
					<td></td>
					<td>彩度</td>
					<td id="s1_s"></td>
				</tr>
				<tr>
				</tr>
				<tr>
					<td>色相のジッター</td>
					<td id="s1_hj"></td>
					<td></td>
					<td>明度</td>
					<td id="s1_v"></td>
				</tr>
			</table>
			<div class="button circle_small round"><div class="round face active" onclick="DotMaker.render();">再描画</div></div>
			<div class="button next circle round">
				<div class="left"><div class="round face disable">前へ</div></div>
				<div class="right"><div onclick="View.next();" class="round face active">次へ</div></div>
			</div>
		</div>
		<div class="step" id="step2">
			<h2>Step.2 立体視の絵を描きます</h2>
			<table>
				<tr>
					<td>線の太さ</td>
					<td id="s2_w"></td>
					<td width="20"></td>
					<td class="undo_td" rowspan="2" valign="top"><div class="button round"><div onclick="Drawer.undo();" class="face round active">取り消し</div></div></td>
					<td rowspan="2" width="20"></td>
					<td rowspan="2" valign="top"><div class="button round"><div onclick="Drawer.clear();" class="face round active">すべて消去</div></div></td>
				</tr>
				<tr>
					<td colspan="3"><br /><br /></td>
				</tr>
			</table>
			<div class="button next circle round">
				<div class="left"><div onclick="View.prev();" class="round face active">前へ</div></div>
				<div class="right"><div onclick="View.next();" class="round face active">次へ</div></div>
			</div>
		</div>
		<div class="step" id="step3">
			<h2 id="caption3">Step.3 立体視をします</h2>
			<table>
				<tr>
					<td>深さ</td>
					<td id="s3_d"></td>
					<td rowspan="2"></td>
					<td rowspan="2" valign="top">
						<div class="desc">
							<p id="desc">
								1.寄り眼をして目の焦点を画面より手前に合わせます。<br />
								2.２つの白い点が中央に寄るので、重なるように焦点を調節してください。（点がちょうど３つに見えます。）<br />
								3.点が重なった状態で絵を見ると、描いた絵が凹んで見えます。
							</p>
						</div>
					</td>
				</tr>
				<tr>
					<td>エンボス</td>
					<td id="s3_e"></td>
				</tr>
			</table>
			<div class="button round circle_small"><div onclick="Generator.generate();" class="round face active">再描画</div></div>
			<div class="button next circle round" id="last_circ">
				<div class="left"><div onclick="View.prev();" class="round face active">前へ</div></div>
				<div class="right"><div onclick="Generator.share(this);" class="round face active twitter">共有</div></div>
			</div>
		</div>
	</div>
	<p id="copyright">copyright c manse.jp all rights reserved.</p>
</div>
<div id="cover" class="g"></div>
</body>
</html>