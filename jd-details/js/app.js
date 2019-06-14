$(function() {
	showhide()
	information()
	search()
	moveMiniImg()
	hoverMiniImg()
	addressCut()
	slide()
	bigImg()
	number()
	clickShare()

	//鼠标移入移出,显示与隐藏
	function showhide() {
		$("[name=show_hide]").hover(function() {
			$(this).children(":first").css("border-bottom", "1px solid #fff")
			var id = this.id + "_items"
			$("#" + id).show()
		}, function() {
			$(this).children(":first").css("border-bottom", "1px solid #ddd")
			var id = this.id + "_items"
			$("#" + id).hide()
		})
	}
	//地址栏信息
	function information() {
		$("#jd_address_items>ul>li>a").click(function() {
			$("#jd_address_items>ul>li").removeClass("abc") //暴力清除所有li样式
			$(this).parent().addClass("abc") //为指定的li加上abc
			var name = $(this).html() //读取当前点击的内容
			$("#provinces").html(name) //设置显示的内容
		})
	}

	//输入搜索关键字, 列表显示匹配的结果
	function search() {
		$("#txtSearch")
			.on("keyup focus", function() {
				var txt = this.value.trim() //必须输入框有文本才显示内容
				if(txt) {
					$("#search_hide").show()
				}
			})
			.blur(function()　 {
				$("#search_hide").hide()
			})
	}

	//移动小图片
	function moveMiniImg() {
		var $as = $("#preview_as>a")
		var $backward = $as.first()
		var $forward = $as.last()
		var $ul = $("#icon_list")
		var imgCount = $ul.children("li").length //li的全部个数
		var SHOW_COUNT = 5 //初始显示的li
		var moveCount = 0 //移动的次数
		var liWidth = $ul.children(":first").width() //一个li的宽度

		// 初始化更新
		if(imgCount > SHOW_COUNT) {
			$forward.attr("class", "forward")
		}

		$forward.click(function() { // 给向右的按钮绑定点击监听
			if(moveCount == imgCount - SHOW_COUNT) { //判断是否需要移动,如果不需要就直接结束
				return
			}
			moveCount++
			$backward.attr("class", "backward") //更新向左的按钮
			if(moveCount == imgCount - SHOW_COUNT) {
				$forward.attr("class", "forward_disabled")
			}

			$ul.css({ //移动ul
				left: -moveCount * liWidth
			})
		})

		$backward.click(function() { // 给向左的按钮绑定点击监听
			if(moveCount == 0) { //判断是否需要移动,如果不需要就直接结束
				return
			}
			moveCount--
			$forward.attr("class", "forward") //更新向右的按钮
			if(moveCount == 0) {
				$backward.attr("class", "backward_disabled")
			}

			$ul.css({ //移动ul
				left: -moveCount * liWidth
			})
		})

	}

	//当鼠标悬停在某个小图上,在上方显示对应的中图
	function hoverMiniImg() {
		$("#icon_list>li").hover(function() {
			var $img = $(this).children()
			$img.addClass("hoveredThumb")
			var src = $img.attr("src").replace(".jpg", "-m.jpg")
			$("#mediumImg").attr("src", src)
		}, function() {
			$(this).children().removeClass('hoveredThumb')
		})
	}

	//地址间的切换
	function addressCut() {
		var $address = $("#address_information>li")
		var $contents = $("#jd_post_items>ul:gt(0)")
		$address.click(function() {
			$address.removeClass("current") //暴力清除所有样式
			$(this).addClass("current")
			$contents.hide()
			var index = $(this).index()
			$contents.eq(index).show()
		})
	}

	//店长推荐商品的上下滑动
	function slide() {
		var $ul = $("#coke>ul")
		var $up = $("#boke>a:first")
		var $down = $("#boke>a:last")

		$down.click(function() {
			var result = 0;
			var distance = 225 //总距离
			var time = 300 //总时间   
			var terTime = 50 //间隔时间
			var terDistance = distance / (time / terTime) //每一块的距离

			if(parseInt($ul.css("top")) != -225) {
				var timer = setInterval(function() {
					result -= terDistance
					if(result <= -distance) {
						result = -distance
						clearInterval(timer)
					}
					$ul.css("top", result)
				}, terTime)
			}

		})

		$up.click(function() {
			var result = -225
			var distance = 225 //总距离
			var time = 300 //总时间   
			var terTime = 50 //间隔时间
			var terDistance = distance / (time / terTime) //每一块的距离

			if(parseInt($ul.css("top")) != 0) {
				var timer = setInterval(function() {
					result += terDistance
					if(result >= 0) {
						result = 0
						clearInterval(timer)
					}
					$ul.css("top", result)
				}, terTime)
			}

		})
	}

	//操作大图
	function bigImg() {
		var $mediumImg = $("#mediumImg")
		var $mask = $("#mask")
		var $maskTop = $("#maskTop")
		var $largeImgContainer = $("#largeImgContainer")
		var $loading = $("#loading")
		var $bigImg = $("#bigImg")
		var maskWidth = $mask.width()
		var maskHeight = $mask.height()
		var maskTopWidth = $maskTop.width()
		var maskTopHeight = $maskTop.height()

		$maskTop.hover(function() {
			$mask.show() //显示小黄块

			//动态加载对应的大图
			var src = $mediumImg.attr("src").replace("-m.jpg", "-l.jpg")
			$bigImg.attr("src", src)
			$largeImgContainer.show()
			$bigImg.on("load", function() { //大图加载完成	
				//得到大图的尺寸
				var bigWidth = $bigImg.width()
				var bigHeight = $bigImg.height()
				//绑定mousemove监听
				//移动小黄块
				$maskTop.mousemove(function(event)　 { //在移动过程中反复调用
					var eventLeft = event.offsetX
					var eventTop = event.offsetY
					var left = eventLeft - maskWidth / 2
					var top = eventTop - maskHeight / 2

					if(left < 0) {
						left = 0
					} else if(left > maskTopWidth - maskWidth) {
						left = maskTopWidth - maskWidth
					}

					if(top < 0) {
						top = 0
					} else if(top > maskTopHeight - maskHeight) {
						top = maskTopHeight - maskHeight
					}

					$mask.css({
						left: left,
						top: top
					})

					//移动大图
					//得到大图的坐标
					left = -left * bigWidth / maskTopWidth
					top = -top * bigHeight / maskTopHeight
					//设置大图坐标 
					$bigImg.css({
						left: left,
						top: top
					})
				})
				$bigImg.show()
			})
		}, function() {
			$mask.hide()
			$largeImgContainer.hide()
			$bigImg.hide()
		})
	}
	
	//点击加号减号数字改变
	function number() {
		var num = 1
		//加号
		$("#addSubtract>a:first").click(function() {
			num++
			if(num > 5) {
				$("#defray").css("background","#f7f7f7")
				$("#defray>a").css("color","#ccc")
			}
			$("#addSubtract>input").val(num)
			$("#addSubtract>a:last").css("opacity","1")
		})
		//减号
		$("#addSubtract>a:last").click(function() {
			num--
			if(num < 1) {
				num = 1
				$(this).css("opacity",".7")
			}
			if(num < 6) {
				$("#defray").css("background","red")
				$("#defray>a").css("color","#fff")
			}
			$("#addSubtract>input").val(num)
		})
	}
	
	//点击分享,弹出登录界面
	function clickShare()　{
		//打开登录界面
		$("#share").click(function() {
			$("#toEnter").css("display","block")
		})
		//关闭登录界面
		$("#toEnter>div:first>i").click(function() {
			$("#toEnter").css("display","none")
		})
		//切换扫码登录和账户登录
		$("#login>div>a").click(function() {
			$("#login>div>a").removeClass("switch_a")
			$(this).addClass("switch_a")
			if($(this).html() == "扫码登录") {
				$("#first_login").css("display","block")
				$("#second_login").css("display","none")
			}else {
				$("#second_login").css("display","block")
				$("#first_login").css("display","none")
			}
		})
		
	}
	
	
	
	
	
	
	
	
})