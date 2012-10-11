//ユーザーエージェント
var a = navigator.userAgent;
var phone = (~a.indexOf("iPhone") || ~a.indexOf("iPad") || ~a.indexOf("iPod"));

//透明度関数
if (~a.indexOf("MSIE")) {
	function alpha(o, n) {
		n *= 100;
		o.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + n + ')';
		o.style.filter = 'alpha(opacity=' + n + ')';
	}
} else if (~a.indexOf("Mozzila")) {
	function alpha(o, n) {
		o.style.MozOpacity = n;
	}
} else {
	function alpha(o, n) {
		o.style.opacity = n;
	}
}
function _(id) {
	return document.getElementById(id);
}

//ページ移動
var View = new (function() {
	var page = 1;
	var self = this;
	var last = location.href;
	var timer = setInterval(function() {
		if (location.href != last) {
			last = location.href;
			var hash = location.href.indexOf("#");
			if (hash > 0) {
				var p = location.href.substr(hash + 1);
				if (p == "1" || p == "2" || p == "3") {
					page = parseInt(p);
				} else {
					page = 1;
				}
			} else {
				page = 1;
			}
			self.update();
		}
	}, 100);
	this.kill = function() {
		clearInterval(timer);
	};
	this.next = function() {
		page ++;
		location.href = "#" + page;
		last = location.href;
		self.update();
	};
	this.prev = function() {
		page --;
		location.href = "#" + page;
		last = location.href;
		self.update();
	};
	this.setPage = function(n) {
		page = n;
	};
	this.update = function() {
		for (var i = 0; i < 3; i ++) {
			_("cvs" + (i + 1)).style.display = _("step" + (i + 1)).style.display = (page == (i + 1) ? "block" : "none");
		}
		if (page == 3) {
			Generator.onChange();
		}
	};
	
})();


//Twitterから
function twitter() {
	if (!share) return;
	var data = share.substr(12) + " ";
	var chars = [];
	var count = [];
	var j = -1;
	var num = "";
	var sum = 0;
	for (var i = 0; i < data.length; i ++) {
		var c = data.substr(i, 1);
		if (c == "0" || c == "1" || c == "2" || c == "3" || c == "4" || c == "5" || c == "6" || c == "7" || c == "8" || c == "9") {
			num += c;
		} else {
			if (j != -1) {
				if (num) sum += (count[j] = parseInt(num));
				else sum += 1;
			}
			j ++;
			chars[j] = Math.floor((parseInt(c.charCodeAt(0)) - 65) / 12 * 255);
			count[j] = 1;
			num = "";
		}
	}
	if (sum != 360000) return;
	var color = share.substr(0, 12);
	var col = [];
	for (var i = 0; i < 6; i ++) {
		col[i] = parseInt(color.substr(i * 2, 2), 16) | 0;
		if (i < 2) col[i] = col[i] / 255 * 360;
	}
	DotMaker.setValue(col);
	
	var w = uw * num2;
	var data = Drawer.getImageData(0, 0, w, uh);
	var k = 3;
	for (var i = 0; i < chars.length - 1; i ++) {
		for (var j = 0; j < count[i]; j ++) {
			data.data[k] = chars[i];
			k += 4;
		}
	}
	DotMaker.render();
	Drawer.putImageData(data);
	View.kill();
	View.setPage(3);
	View.update();
	_("step3").removeChild(_("last_circ"));
	_("caption3").innerHTML = "";
	_("desc").style.width = "580px";
}


//そのた
function getPosition(obj) {
	var x = y = 0;
	do {
		x += obj.offsetLeft || 0;
		y += obj.offsetTop || 0;
		obj = obj.offsetParent;
	} while (obj);
	return({x:x, y:y});
}


function getPoint(e) {
	if (phone) {
		return {x: e.touches[0].pageX, y: e.touches[0].pageY};
	} else if (e) {
		return {x: e.pageX, y: e.pageY};
	} else {
		return {x: event.x + d.body.scrollLeft, y:event.y + d.body.scrollTop};
	}	 
}

var ease = {
	quadIn: function(t) {
		return t * t;
	},
	quadOut: function(t) {
		return 1.0 - ease.quadIn(1.0 - t);
	},
	quadInOut: function(t) {
		return (t < 0.5) ? ease.quadIn(t * 2.0) * 0.5 : 1 - ease.quadIn(2.0 - t * 2.0) * 0.5;
	},
	cubicIn: function(t) {
		return t * t * t;
	},
	cubicOut: function(t) {
		return 1.0 - ease.cubicIn(1.0 - t);
	},
	cubicInOut: function(t) {
		return (t < 0.5) ? ease.cubicIn(t * 2.0) * 0.5 : 1 - ease.cubicIn(2.0 - t * 2.0) * 0.5;
	}
};

function Face(value, min, max, callback, adjustCallback) {
	var self = this;
	this.elem = document.createElement("div");
	this.elem.className = "face";
	
	this.min = min;
	this.max = max;
	this.value = value;
	this.callback = callback;
	this.left = 190 * (value - min) / (max - min);
	self.elem.style.left = this.left + "px";

	var downFunc = function(e) {
		start = getPoint(e).x;
		last = self.left;
		document[!phone ? "onmousemove" : "ontouchmove"] = moveFunc;
		document[!phone ? "onmouseup" : "ontouchend"] = upFunc;
		if (!phone) return;
		e.stopPropagation();
		e.preventDefault();
	};
	var moveFunc = function(e) {
		self.left = (getPoint(e).x - start) + last;
		adjustCallback(self);
		self.elem.style.left = self.left + "px";
		self.callback(self.value = (self.max - self.min) * (self.left / 190) + self.min);
		if (!phone) return;
		e.stopPropagation();
	};
	var upFunc = function() {
		document[!phone ? "onmousemove" : "ontouchmove"] = document[!phone ? "onmouseup" : "ontouchend"] = null;
		resetFinger();
	};
	this.elem[!phone ? "onmousedown" : "ontouchstart"] = downFunc;
}

function slider(self, value, min, max, callback) {
	var sl = document.createElement("div");
	sl.className = "slider";
	var face = new Face(value, min, max, callback, function(self) {
		if (self.left < 0) self.left = 0;
		else if (self.left > 190) self.left = 190;
	});
	sl.appendChild(face.elem);
	self.appendChild(sl);
};
function doubleSlider(self, value1, value2, min, max, callback) {
	var sl = document.createElement("div");
	sl.className = "slider";
	
	if (value1 > value2) {
		var tmp = value1;
		value1 = value2;
		value2 = tmp;
	}
	
	var p = phone ? 34 : 18;
	var d = p / 190;
	
	var move = function() {
		callback(face1.value * (1 / (1 - d)), (face2.value - d) / (1 - d));
	};
	
	var face1 = new Face(value1, min, max, move, function(self) {
		if (self.left < 0) self.left = 0;
		if (self.left > 190) self.left = 190;
		if (face2.left - p < self.left) self.left = face2.left - p;
	});
	sl.appendChild(face1.elem);

	var face2 = new Face(value2, min, max, move, function(self) {
		if (self.left < 0) self.left = 0;
		if (self.left > 190) self.left = 190;
		if (face1.left + p > self.left) self.left = face1.left + p;
	});
	sl.appendChild(face2.elem);

	self.appendChild(sl);
};

(function() {
	var tweenObj=[],
	tweenValue=[],
	tweenInt,
	tweenFlag=false,
	tweenCount=0,i,twn,sa,now;
	tween = function(name, time, from, to, onchange, oncomplete, ease, prm) {
		if (!tweenObj[name]) {
			tweenCount ++;
			tweenObj[name] = {
				f:(from != null ? from : (tweenValue[name] != undefined ? tweenValue[name] : 0))
			};
		} else {
			tweenObj[name].f = (from != null ? from : tweenObj[name].f + (tweenObj[name].o - tweenObj[name].f) * tweenObj[name].e((new Date().getTime() - tweenObj[name].s) / tweenObj[name].t));
		}
		tweenObj[name].t = time;
		tweenObj[name].o = to;
		tweenObj[name].h = onchange;
		tweenObj[name].p = oncomplete;
		tweenObj[name].e = ease;
		tweenObj[name].a = prm;
		tweenObj[name].s = new Date().getTime();
		if (!tweenFlag) {
			tweenFlag = true;
			tweenInt = setInterval(function () {
				now = new Date().getTime();
				for (i in tweenObj) {
					twn = tweenObj[i];
					sa = now - twn.s;
					if (sa < twn.t) {
						twn.h(twn.f + (twn.o - twn.f) * twn.e(sa / twn.t), twn.a);
					} else {
						twn.h(twn.o, twn.a);
						if (twn.p) twn.p(twn.o, twn.a);
						tweenValue[i] = twn.o;
						delete tweenObj[i];
						tweenCount --;
					}
				}
				if (tweenCount <= 0) {
					clearInterval(tweenInt);
					tweenFlag = false;
				}
			}, 20);
		}
	}
})();

function resetFinger() {
	if (!phone) return;
	var move = false,checkX, checkY;
	document.ontouchstart = function(e) {
		move = false;
		if (e.touches[0]) {
			checkX = e.touches[0].pageX;
			checkY = e.touches[0].pageY;
		}
		e.stopPropagation();
		e.preventDefault();
	};
	document.ontouchmove = function(e) {
		if (!move) {
			if (Math.abs(e.touches[0].pageX - checkX) > 2 || 
				Math.abs(e.touches[0].pageY - checkY) > 2) {
				move = true;
			}
		}
		e.stopPropagation();
	};
	document.ontouchend = function(e) {
		if (!move) {
			var point = e.changedTouches[0];
			var e = document.createEvent("MouseEvents");
			e.initMouseEvent("click", true, true, window, 0, point.screenY, point.screenY, point.clientX, point.clientY, false, false, false, false, 0, null);
			point.target.dispatchEvent(e);
		}
	};
}

window.onload = function() {
	document.body.className = "d " + (phone ? "m" : "p");
	resetFinger();
	main();
	twitter();
	setTimeout(function() {
		tween(0, 400, 1, 0, function(n, j) {
			alpha(j, n);
		}, function(n, j) {
			document.body.removeChild(j);
		}, ease.quadOut, _("cover"));		
	}, 400);
};