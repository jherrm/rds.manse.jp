var Drawer, DotMaker, Generator;
var uw = 100;
var uh = 450;
var num = 9;
var num2 = 8;
function main() {	

/* #################################################################### */	

	DotMaker = new (function() {
		var self = this;
		var hBase, hJitter, sMin, sD, vMin, vD, render;
		var cvs = _("cvs1");
		cvs.width = uw * num;
		cvs.height = uh;
		var ctx = cvs.getContext("2d");
		
		var unit = document.createElement("canvas");
		unit.width = uw;
		unit.height = uh;
		var uctx = unit.getContext("2d");
		uctx.fillStyle = "#fff";
		uctx.fillRect(0, 0, uw, uh);
		var udat = uctx.getImageData(0, 0, uw, uh);
		
		slider(_("s1_h"), hBase = Math.random() * 360, 0, 360, function(a) {
			hBase = a;
			if (!phone) self.render();
		});
		slider(_("s1_hj"), hJitter = Math.random() * 30, 0, 360, function(a) {
			hJitter = a;
			if (!phone) self.render();
		});
		doubleSlider(_("s1_s"), sMin = 0, 255, 0, 255, function(a,b) {
			sMin = a;
			sD = b - a;
			if (!phone) self.render();
		});
		sD = 255 - sMin;
		doubleSlider(_("s1_v"), vMin = (Math.random() * 0.2 + 0.65) * 255, 255, 0, 255, function(a,b) {
			vMin = a;
			vD = b - a;
			if (!phone) self.render();
		});
		vD = 255 - vMin;
		function hsv2rgb(h, s, v) {
			var r, g, b;
			h = (h + 360) % 360;
			if (s == 0) {
				v = Math.round(v);
				return {r: v, g: v, b: v};
			}
			s /= 255;
			var i = (0|(h / 60)) % 6,
			f = (h / 60) - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s)
			switch (i) {
				case 0: r = v; g = t; b = p; break;
				case 1: r = q; g = v; b = p; break;
				case 2: r = p; g = v; b = t; break;
				case 3: r = p; g = q; b = v; break;
				case 4: r = t; g = p; b = v; break;
				case 5: r = v; g = p; b = q; break;
			}
			
			return {r: 0|r, g: 0|g, b: 0|b};
		}
		this.render = function() {
			var i = 0;
			for (var y = 0; y < uh; y ++) {
				for (var x = 0; x < uw; x ++) {
					var h = hBase + (Math.random() - 0.5) * hJitter;
					var s = sMin + Math.random() * sD;
					var v = vMin + Math.random() * vD;
					var rgb = hsv2rgb(h, s, v);
					udat.data[i++] = rgb.r;
					udat.data[i++] = rgb.g;
					udat.data[i++] = rgb.b;
					i ++;
				}
			}
			for (i = 0; i < num; i ++) {
				ctx.putImageData(udat, uw * i, 0);
			}
		};
		this.getValue = function() {
			return [hBase, hJitter, sMin, sD, vMin, vD];
		};
		this.setValue = function(arr) {
			hBase = arr[0];
			hJitter = arr[1];
			sMin = arr[2];
			sD = arr[3];
			vMin = arr[4];
			vD = arr[5];
		};
		this.getImageData = function(x,y,w,h) {
			return ctx.getImageData(x,y,w,h);
		};
		this.render();
	})();
	

/* #################################################################### */	
	
	Drawer = new (function() {
		var self = this;
		var cvs = _("cvs2");
		var cvs2 = document.createElement("canvas");
		var ctx = cvs.getContext("2d");
		var ctx2 = cvs2.getContext("2d");
		cvs.width = cvs2.width = uw * num2;
		cvs.height = cvs2.height = uh;
		
		var step, data, data2;
		
		ctx.lineCap = ctx2.lineCap = "round";
		ctx2.shadowBlur = 30;
		ctx.strokeStyle = "#000";
		ctx.strokeStyle = ctx.fillStyle = "#000";
		ctx2.shadowColor = ctx2.strokeStyle = ctx2.fillStyle = "#000";
		slider(_("s2_w"), ctx.lineWidth = ctx2.lineWidth = 30, 4, 50, function(a) {
			ctx.lineWidth = ctx2.lineWidth = a;
		});
		
		cvs.ontouchstart = cvs.onmousedown = function (e) {
			var last = getPoint(e);
			var origin = getPosition(cvs);
			document[!phone ? "onmousemove" : "ontouchmove"] = function (e) {
				ctx.beginPath();
				ctx2.beginPath();
				var pos = getPoint(e);
				ctx.moveTo(pos.x - origin.x, pos.y - origin.y);
				ctx.lineTo(last.x - origin.x, last.y - origin.y);
				ctx2.moveTo(pos.x - origin.x, pos.y - origin.y);
				ctx2.lineTo(last.x - origin.x, last.y - origin.y);
				last = pos;
				ctx.stroke();
				ctx2.stroke();
			};
			document[!phone ? "onmouseup" : "ontouchend"] = function() {
				data[step] = ctx.getImageData(0, 0, uw * num2, uh);
				data2[step ++] = ctx.getImageData(0, 0, uw * num2, uh);
				document[!phone ? "onmousemove" : "ontouchmove"] = document[!phone ? "onmouseup" : "ontouchend"] = null;
				resetFinger();
			};
		};
		this.undo = function() {
			if (step <= 1) return;
			step --;
			ctx.putImageData(data[step - 1], 0, 0);
			ctx2.putImageData(data2[step - 1], 0, 0);
		};
		this.clear = function() {
			data = [];
			data2 = [];
			ctx.clearRect(0, 0, uw * num2, uh);
			ctx2.clearRect(0, 0, uw * num2, uh);
			step = 1;
			data = [ctx.getImageData(0, 0, uw * num2, uh)];
			data2 = [ctx2.getImageData(0, 0, uw * num2, uh)];
		};
		this.getImageData = function(x,y,w,h) {
			return ctx2.getImageData(x,y,w,h);
		};
		this.putImageData = function(d) {
			ctx2.putImageData(d,0,0);
		};
		this.clear();
	})();
	

/* #################################################################### */	

	Generator = new (function() {
		var depth, shadow;
		var self = this;
		slider(_("s3_d"), depth = 0.6, 0.1, 0.6, function(a) {
			depth = a;
			if (!phone) self.generate();
		});
		slider(_("s3_e"), shadow = 70, 70, 200, function(a) {
			shadow = Math.floor(a);
			if (!phone) self.generate();
		});
		
		var making = false;
		var cvs = _("cvs3");
		var ctx = cvs.getContext("2d");
		cvs.width = uw * num;
		cvs.height = uh;
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1.5;
		ctx.fillRect(0, 0, uw * num, uh);
		
		this.onChange = function() {
			self.generate();
		};
		this.generate = function() {
			var w = uw * num2;
			var dot = DotMaker.getImageData(0, 0, uw, uh);
			var base = DotMaker.getImageData(0, 0, uw, uh);
			var map = Drawer.getImageData(0, 0, w, uh);
			var i, j, k, l, b = 255 / (255 - shadow);
			for (var z = 0; z < num; z ++) {
				ctx.putImageData(dot, z * uw, 0);
				for (var y = j = 0; y < uh; y ++) {
					k = (y * w + z * uw) * 4 + 3;
					for (var x = 0; x < uw; x ++) {
						l = map.data[k] - shadow;
						if (l <= 0) {
							i = (y * uw + x) * 4;
						} else {
							i = (y * uw + (x + Math.floor(l * b / 16 * depth)) % uw) * 4;
						}
						base.data[j] = dot.data[j++] = base.data[i++];
						base.data[j] = dot.data[j++] = base.data[i++];
						base.data[j] = dot.data[j++] = base.data[i++];
						k+=4;
						j++;
					}
				}
			}
			for (var i = -1; i <= 1; i += 2) {
				ctx.beginPath();
				ctx.arc(uw * num / 2 + i * uw / 2, uh * 0.95, 6, 0, 2 * Math.PI, true);
				ctx.stroke();
				ctx.fill();
			}
		};
		this.save = function() {
			window.open(cvs.toDataURL(), "_blank");
		};
		var n2 = function(num) {
			num = num > 255 ? 255 : num;
			num = num < 0 ? 0 : num;
			num = Math.floor(num);
			return (num < 16 ? "0" : "") + num.toString(16);
		}
		this.shareCallback = function(str) {
			console.log(str);
		};
		this.share = function(obj) {
			if (making) return;
			obj.className = obj.className.split("active").join("disable")
			making = true;
			var data = Drawer.getImageData(0, 0, uw * num2, uh);
			var v = DotMaker.getValue();
			var str = "";
			for (var i = 0; i < 6; i ++) {
				if (i < 2) v[i] = v[i] / 360 * 255;
				str += n2(v[i]);
			}
			
			for (var i = 3; i < data.data.length; i += 4) {
				str += n2(data.data[i]);
			}
			var xhr = null;
			try {
				xhr = new XMLHttpRequest();
			} catch(e) {
				try {
					xhr = new ActiveXObject("Msxml2.XMLHTTP");
				} catch(e) {
					try {
						xhr = new ActiveXObject("Microsoft.XMLHTTP");
					} catch(e) {
						return null;
					}
				}
			}
			if (!xhr) {
				alert("失敗しました。")
				return;
			}
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					window.open("http://twitter.com/?status=" + encodeURIComponent("見えるかな？ http://rds.manse.jp/" + this.responseText + " #rds"), "_blank");
				}
			};
			xhr.open("POST", "share.php", false);
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
			xhr.send("data=" + str.toUpperCase());
		};
	})();
}
