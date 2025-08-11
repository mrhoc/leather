let checkrecaptcha = false, windowsize = $(window).width();
const Wanda = {
	init: function(){
		windowsize <= 991 ? this.menumobile() : this.quickview();
		this.header();
		this.smartsearch();
		this.modalcontact();
		this.wlgroup();
		this.firstcbwl();
		if(tbag_varible.template == 'index'){this.hometabajax();} 
		if(tbag_radom.item.length > 0 && tbag_varible.sgnotify == 'true' && !tbag_varible.template.includes('product') && windowsize > 767){this.suggess_notify();}
		if(tbag_varible.template == 'index' || tbag_varible.template.includes('product')){this.collectionsale();}
		this.scrollcallback();
		if(!tbag_varible.template.includes('product')){Wanda.slidercallback();}
	},
	quickview: () => {
		$("body").on("click",".product-block .btn_quickview",function(){
			let url_qv = $(this).data('url')+'?view=quickview-nochoose', data_result = $("#pro-qv-wanda");
			data_result.modal({
				fadeDuration: 100
			});
			getdatasite(url_qv,data_result,'false');
		})
		$("body").on('click','#add-to-cart-qv',function(){
			let id = $(this).parents('#add-item-form-qv').find('#product-select-qv').val(),quantity = $(this).parents('#add-item-form-qv').find('#quantity').val();
			Wanda.addtocartmodal(id,quantity);
		})
	},
	plusQuantity: $this => {
		if($this.siblings('input[name="quantity"]').val() != undefined ) {
			let currentVal = parseInt($this.siblings('input[name="quantity"]').val());
			if(!isNaN(currentVal)) {
				$this.siblings('input[name="quantity"]').val(currentVal + 1);
			}else {
				$this.siblings('input[name="quantity"]').val(1);
			}
		}
	},
	minusQuantity: $this => {
		if($this.siblings('input[name="quantity"]').val() != undefined ) {
			let currentVal = parseInt($this.siblings('input[name="quantity"]').val());
			if(!isNaN(currentVal) && currentVal > 1) {
				$this.siblings('input[name="quantity"]').val(currentVal - 1);
			}
		}
	},
	header: () =>{
		$("body").on('click','.btn-support',function(){
			$(this).toggleClass('active-show');
			$(this).prev().toggleClass('active');
			$(".social-fixed ul").hasClass('active') ? setTimeout(() =>{$(this).prev().addClass('overflow-active')},250) : $(".social-fixed ul").removeClass('overflow-active');
		})
		$(document).on('click','.modal-backdrop.in.search-tog',function(event){
			$('.list-inline-item').removeClass('show-search');
			$(this).removeClass('in search-tog')
		});
		$(".js-search-desktop").click(function(e){
			e.preventDefault();
			$(this).parent().toggleClass('show-search');
			$(".modal-backdrop").toggleClass('in search-tog');
		})
		$("body").on("click",".js-call-minicart",function(e){
			e.preventDefault();
			$.when(Wanda.cartmini()).done(() =>{
				$("#cart-mini-wanda").modal({
					fadeDuration: 300
				});
			});
		})
		$("body").on("click",".back-to-top",() =>{$('html,body').animate({scrollTop: 0}, 500);});
		$("body").on("click",".list-variants-img li",function(){
			let data_src = $(this).find('span').data('img');
			$(this).siblings('li').removeClass('active');
			$(this).addClass('active');
			$(this).parents('.product-block').find('.img-first').attr('src',data_src)
		})
		$('body').on('click','#wanda-close-mb-sw,#site-overlay-sw',function(){
			$('#wandave-theme').removeClass('show-add-cart-mb unless-product');
		});
		$('body').on('click','#add-to-cart-sw',function(){
			let id = $('#product-select-sw').val(),quantity = $('#add-item-form-mb').find('#quantity-sw').val();
			Wanda.addtocartmodal(id,quantity);
			$('#wandave-theme').removeClass('show-add-cart-mb buy-now-ss add-now-ss');
		});
	},
	scrollcallback: () =>{
		$(window).scroll(function(){
			let scrolltop = $(window).scrollTop();
			Wanda.scrolltopcallback(scrolltop);
			Wanda.recaptcha(scrolltop);
		})
	},
	addtocartmodal: (id,quantity,url) =>{
		let params = {
			type: 'POST',
			url: '/cart/add.js',
			async: false,
			data: 'quantity=' + quantity + '&id=' + id,
			dataType: 'json',
			success: Wanda.successadtocart,
			error: function(XMLHttpRequest, textStatus) {
				Wanda.errormodal('Sáº£n pháº©m báº¡n vá»«a mua Ä‘Ã£ vÆ°á»£t quÃ¡ tá»“n kho'); 
			}
		};
		jQuery.ajax(params);
	},
	addtocartcheckout: (id,quantity,url) =>{
		let params = {
			type: 'POST',
			url: '/cart/add.js',
			async: false,
			data: 'quantity=' + quantity + '&id=' + id,
			dataType: 'json',
			success: function (cart){
				window.location.href = url;
			},
			error: function(XMLHttpRequest, textStatus) {
				Wanda.errormodal('Sáº£n pháº©m báº¡n vá»«a mua Ä‘Ã£ vÆ°á»£t quÃ¡ tá»“n kho');
			}
		};
		jQuery.ajax(params);
	},
	successadtocart: (jqXHR, textStatus, errorThrown) =>{
		$.ajax({
			type: 'GET',
			url: '/cart.js',
			async: false,
			cache: false,
			dataType: 'json',
			success: function (cart){
				$(".js-number-cart").html(cart.item_count)
			}
		});
		$("#pro-qv-wanda .close-modal").trigger('click');
		let modaltemplate = `<div class="media-left"><span class="quantity">${jqXHR['quantity']}</span><div class="thumb-cart"><img width="70px" src="${Haravan.resizeImage(jqXHR['image'], 'small')}" alt="${jqXHR['title']}"></div></div>
<div class="media-body"><div class="product-title">${jqXHR['title']}</div><div class="product-new-price"><span>${Haravan.formatMoney(jqXHR['price'],formatMoney)}</span></div></div>`;
		$("#success-cart-wanda .media-success").html(modaltemplate);
		$("#success-cart-wanda").modal({
			fadeDuration: 200
		});
		setTimeout(() =>{
			$("#success-cart-wanda .close-modal").trigger('click');
		},2000)
	},
	menumobile: () =>{
		getdatasite("/?view=menu-mobile",$("#menu-mobile .mb-menu"),'false');
		$(document).on('click','.menu-active #site-overlay,#wanda-close-handle',function(event){
			$("#wandave-theme").removeClass('menu-active');
		});
		$("body").on("click",".btn-menu-mb",function(){
			$("body").toggleClass('menu-active');
		})
		$('body').on('click','.cl-open',function(event){
			$(this).next().slideToggle('fast')
			$(this).toggleClass('minus-menu');
		});
	},
	cartmini: () =>{
		$.ajax({
			url: '/cart?view=mini',
			type: 'GET',
			dataType: 'json',
			async: true,
			success: function(data){
				let item = '',index = 0;
				if(data.length > 2){
					$.each(data, function(i, v){
						if(i < data.length - 2){
							item += `<tr class="list-item" data-line="${v.line}"><td class="img"><a href="${v.url}" title="${v.title}"><img src="${v.image}" alt="${v.title}"></a></td><td class="item"> <a class="pro-title-view" href="${v.url}" title="${v.title}">${v.title}</a> <span class="variant">${v.variant_title}</span><div class="quantity-area-cartmini"> <input type="button" value="â€“" onclick="Wanda.minusqt_minicart($(this))" class="qty-btn btn-left-quantity"><input type="text" id="quantity_minicart" name="quantity_minicart" value="${v.quantity}" min="1" class="quantity-mini"><input type="button" value="+" onclick="Wanda.plusqt_minicart($(this))" class="qty-btn btn-right-quantity"></div> <span class="pro-price-view">${v.price}</span> <span class="remove_link remove-cart"><a href="javascript:void(0);" onclick="Wanda.deletecart(${v.line})"><i class="fa fa-times"></i></a></span></td></tr>`;
						}
						index = i;
					});
					$("#cart-mini-wanda #cart-view tbody").html(item);
					$("#cart-mini-wanda .table-total #total-view-cart").html(data[index -1].total_price);
					$(".js-number-cart").html(data[index].total_size);
				}
				else{
					$("#cart-mini-wanda #cart-view tbody").html(`<tr><td class="mini_cart_header text-center" style="padding-right:0;"><svg width="60" height="60" viewBox="0 0 81 70"><g transform="translate(0 2)" stroke-width="4" stroke="#000" fill="none" fill-rule="evenodd"><circle stroke-linecap="square" cx="34" cy="60" r="6"></circle><circle stroke-linecap="square" cx="67" cy="60" r="6"></circle><path d="M22.9360352 15h54.8070373l-4.3391876 30H30.3387146L19.6676025 0H.99560547"></path></g></svg><p>Hiá»‡n chÆ°a cÃ³ sáº£n pháº©m</p></td></tr>`);
					$("#cart-mini-wanda .table-total #total-view-cart").html('0â‚«');
					$(".js-number-cart").html('0');
				}
			}
		})
	},
	deletecart: line =>{
		let params = {
			type: 'POST',
			url: '/cart/change.js',
			data: 'quantity=0&line=' + line,
			dataType: 'json',
			success: function(cart) {
				Wanda.cartmini();
			},
			error: (XMLHttpRequest, textStatus) => {
				Wanda.errormodal(textStatus);
			}
		};
		jQuery.ajax(params);
	},
	plusqt_minicart: $this => {
		if ( $this.siblings('input[name="quantity_minicart"]').val() != undefined ) {
			let currentVal = parseInt($this.siblings('input[name="quantity_minicart"]').val());
			if (!isNaN(currentVal)) {$this.siblings('input[name="quantity_minicart"]').val(currentVal + 1);} else {$this.siblings('input[name="quantity_minicart"]').val(1);}}
		let line_plus = $this.parents('.list-item').attr('data-line'), qty_plus = parseInt($this.siblings('input[name="quantity_minicart"]').val());
		Wanda.update_cart_mini(line_plus,qty_plus)
	},
	minusqt_minicart: $this => {
		if ($this.siblings('input[name="quantity_minicart"]').val() != undefined ) {
			let currentVal = parseInt($this.siblings('input[name="quantity_minicart"]').val());if (!isNaN(currentVal) && currentVal > 1) {	$this.siblings('input[name="quantity_minicart"]').val(currentVal - 1);}
			let line_mn = $this.parents('.list-item').attr('data-line'),qty_mn = parseInt($this.siblings('input[name="quantity_minicart"]').val());
			Wanda.update_cart_mini(line_mn,qty_mn);
		}
	},
	update_cart_mini: (line,qty) =>{
		let params = {
			type: 'POST',
			url: '/cart/change.js',
			data: 'quantity='+qty+'&line=' + line,
			dataType: 'json',
			success: function(cart) {
				Wanda.cartmini();
			},
			error: (XMLHttpRequest, textStatus) =>{
				Haravan.onError(XMLHttpRequest, textStatus);
			}
		};
		jQuery.ajax(params);
	},
	smartsearch: () =>{
		let $input = $('.wanda-mxm-search .search-input');
		$input.keyup(function(){
			let key = $(this).val(),$results = $(this).parents('.site_search').find('#wanda-smart-search .results-seach');
			if(key.indexOf('script') > -1 || key.indexOf('>') > -1){
				alert('Tá»« khÃ³a cá»§a báº¡n cÃ³ chá»©a mÃ£ Ä‘á»™c háº¡i ! Vui lÃ²ng nháº­p láº¡i key word khÃ¡c');
				$(this).val('');
				$input.val('');
			}
			else{
				if(key.length > 0 ){
					$input.val(key);
					$(this).attr('data-history', key);
					let str = '';
					setTimeout(() =>{
						str = '/search?q=filter='+encodeURIComponent('((title:product ** ' + key + ')||(product_type:product ** ' + key + '))')+'&view=smart-json';
						let locationhref = '/search?q=filter='+encodeURIComponent('((title:product ** ' + key + ')||(product_type:product ** ' + key + '))');
						$.ajax({
							url: str,
							type: 'GET',
							dataType: "json",
							async: true,
							success: function(data){
								let item = '',index = 0;
								if(data.length > 2){
									$.each(data, function(i, v){
										if(i < data.length - 2){
											item += `<div class="item-ult"><div class="thumbs"><a href="${v.url}"><img alt="${v.title}" src="${v.thumbnail}" /></a></div><div class="title"><a href="${v.url}" class="title-pro" title="${v.title}">${v.title}</a><p class="f-initial">${v.price}<del data-price="${v.compare_at_price}">${v.compare_at_price}</del></p></div></div>`;}
										index = i;
									});
									$results.html(item);
									if(parseInt(data[index -1].viewmore) > 0){
										$results.append('<a class="view-more-search" href="'+locationhref+'">Xem thÃªm ' + data[index-1].viewmore + ' káº¿t quáº£ tÃ¬m kiáº¿m</a>')
									}else{
										$results.append('<a class="view-more-search" href="'+locationhref+'">CÃ³ <span>' +data[index].total_search+ '</span> káº¿t quáº£ tÃ¬m kiáº¿m</a>')
									}
								}else{
									$results.html('KhÃ´ng cÃ³ sáº£n pháº©m phÃ¹ há»£p!');
								}
							}
						});
					},300)								 
					setTimeout(() =>{$results.fadeIn();},450)
				}
				else{
					$input.val(key);
					$results.fadeOut();
				}
			}
		});
		$("form[action='/search']").submit(function(e){
			e.preventDefault();
			let key = encodeURIComponent($(this).find('input[name="q"]').val()),locationhref = '/search?q=filter=((title:product ** ' + key + ')||(product_type:product ** ' + key + '))';
			window.location.href = locationhref;
		})
	},
	hometabajax: () =>{
		$("#home-tab-col li a").click(function(e){
			e.preventDefault();
			let $this = $(this),dataid = $this.attr('href'),url= $this.attr('data-url'),selector_tab = $(dataid);
			$(".tab-result .tab-pane").hide();
			$("#home-tab-col li a").removeClass('active');
			$this.addClass('active');
			if(!$this.hasClass('success-ajax')){
				$.when(getdatasite(url,selector_tab,'false')).then(setTimeout(()=>{Wanda.firstcbwl()},100));
				$this.addClass('success-ajax');
			}
			$(dataid).show();
		})
	},
	scrolltopcallback: scrolltop =>{
		if(scrolltop > 100){$(".back-to-top,.social-fixed").addClass('show')}else{$(".back-to-top,.social-fixed").removeClass('show')};
	},
	recaptcha: scrolltop =>{
		if(checkrecaptcha == false && scrolltop > 500){
			setTimeout(() =>{
				grecaptcha.ready(function() {grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {$('.form-ft-wanda input[name="g-recaptcha-response"]').val(token);});});
			},1000);
			checkrecaptcha = true;
		}
	},
	errormodal: data =>{
		$("#modal-error p").html(data);
		$("#modal-error").modal({
			fadeDuration: 200
		});
	},
	modalcontact: () =>{
		if(sessionStorage.modal_sub == null ){
			sessionStorage.modal_sub = 'show' ;			
			setTimeout(() =>{
				$("#modal-subscribe").modal({
					fadeDuration: 200
				});
			},3000);
		}
		let checkrecappopup = false;
		if(checkrecappopup == false){
			setTimeout(() =>{
				grecaptcha.ready(function() {grecaptcha.execute('6LdD18MUAAAAAHqKl3Avv8W-tREL6LangePxQLM-', {action: 'submit'}).then(function(token) {$('#modal-subscribe form input[name="g-recaptcha-response"]').val(token);});});
			},3000);
			checkrecappopup = true;
		}
		$('#modal-subscribe form,.form-ft-wanda form').submit(function(e){
			e.preventDefault();
			let self = $(this);
			let emaill = self.find('input[name="contact[email]"]').val(),tag = self.find('input[name="contact[tags]"]').val(),recapcha = self.find('input[name="g-recaptcha-response"]').val();
			$.ajax({
				type: 'POST',
				url:'/account/contact',
				dataType:'json',
				data: "form_type=customer&utf8=âœ“&contact[email]="+emaill+"&contact[tags]="+tag+"&g-recaptcha-response="+recapcha,
				complete: function(responseText){
					Wanda.modalsubsucess();
					self.trigger('reset');
				}
			})
		});
	},
	modalsubsucess: () =>{
		$("#success-subcribe-wanda").modal({
			fadeDuration: 200
		});
		setTimeout(() =>{
			$("#success-subcribe-wanda .close-modal").trigger('click');
		},3000)
	},
	wlgroup: () =>{
		let lcwishlist = '';
		if(localStorage.getItem('wishlist_tbag') == null){
			localStorage.setItem('wishlist_tbag', '[]');
			localStorage.setItem('wishlist_tbag_arr', '[]');
		}
		const localpro = JSON.parse(localStorage.getItem('wishlist_tbag')),jsonpro = JSON.parse(localStorage.getItem('wishlist_tbag_arr'));
		$(".js-number-like").html(localpro.length)
		$("body").on("click",".wishlist-loop",function(){
			let handle = $(this).data('handle');
			$(`.wishlist-loop[data-handle="${handle}"]`).toggleClass('active');
			if($(this).hasClass('active')){
				$(`.wishlist-loop[data-handle="${handle}"]`).attr('data-original-title','Bá» yÃªu thÃ­ch');
				$(`.wishlist-loop[data-handle="${handle}"]`).find('img').attr('src',tbag_varible.heartactive);
				localpro.push(handle)
				localStorage.setItem('wishlist_tbag', JSON.stringify(localpro));
				fetch('/products/'+handle+'.js')
					.then(function(response) {
					return response.json();
				})
					.then(product =>{
					jsonpro.push(product)
					console.log(product)
					localStorage.setItem('wishlist_tbag_arr', JSON.stringify(jsonpro));
				})
					.catch(function(error){
					console.log(error);
				});
			}
			else{
				$(`.wishlist-loop[data-handle="${handle}"]`).attr('data-original-title','YÃªu thÃ­ch');
				$(`.wishlist-loop[data-handle="${handle}"]`).find('img').attr('src',tbag_varible.heart);
				for( let i = 0; i < localpro.length; i++){ 
					if(localpro[i] == handle){
						localpro.splice(i, 1); 
						localStorage.setItem('wishlist_tbag', JSON.stringify(localpro));
					}
				}
				for( let i = 0; i < jsonpro.length; i++){ 
					if(jsonpro[i].handle == handle){
						jsonpro.splice(i, 1); 
						localStorage.setItem('wishlist_tbag_arr', JSON.stringify(jsonpro));
					}
				}
			} 
			$(".js-number-like").html(localpro.length)
		});
	},
	firstcbwl: () =>{
		let firstcb = JSON.parse(localStorage.getItem('wishlist_tbag'));
		for( let i = 0; i < firstcb.length; i++){ 
			$(`.wishlist-loop[data-handle="${firstcb[i]}"]`).addClass('active').find('img').attr('src',tbag_varible.heartactive);
			$(`.wishlist-loop[data-handle="${firstcb[i]}"]`).attr('data-original-title','Bá» yÃªu thÃ­ch');
		}
	},
	suggess_notify: () =>{
		const ivtsg = setInterval(function() {
			let item = "/products/"+ tbag_radom.item[Math.floor(Math.random() * tbag_radom.item.length)] + ".js",
					name = tbag_radom.name[Math.floor(Math.random() * tbag_radom.name.length)],
					time = tbag_radom.time[Math.floor(Math.random() * tbag_radom.time.length)];
			fetch(item)
				.then(function(response) {
				return response.json();
			})
				.then(product =>{
				let tpsg = 
						`<div class="item">
<div class="d-flex d-flex-center">
<div class="image">
<img src="${Haravan.resizeImage(product.featured_image, 'medium')}" width="100" height="70" alt="${product.title}">
</div>
<div class="content">
<p class="custom-notification-content">
${name}<br>vá»«a mua <a href="${product.url}"><b>${product.title}</b></a>
<small>${time}</small>
</p>
</div>
</div>
<div class="close-notify"></div>
</div>`;
				$(".suggest-notify").html(tpsg).removeClass('anislideOutDown').addClass('anislideInUp');
				setTimeout(() =>{
					$(".suggest-notify").removeClass('anislideInUp').addClass('anislideInDown');
				},5000)
			}) 
				.catch(function(error) {
				console.log(error);
			});
		},10000);
		$("body").on("click",".close-notify",function(){
			clearInterval(ivtsg);
			$(".suggest-notify").removeClass('anislideInUp').addClass('anislideInDown');
		})
	},
	collectionsale: () =>{
		const second = 1000,minute = second * 60,hour = minute * 60,day = hour * 24,countDown = new Date($(".countdown-deal").data('countdown')).getTime();
		let x = setInterval(function() {
			let now = new Date().getTime(),
					distance = countDown - now,
					countday = Math.floor(distance / (day)),
					counthour = Math.floor((distance % (day)) / (hour)),
					countminute = Math.floor((distance % (hour)) / (minute)),
					countsecond = Math.floor((distance % (minute)) / second);
			countday > 9 ? $('.countdown-deal .days').text(countday) : $('.countdown-deal .days').text('0'+countday);
			counthour > 9 ? $('.countdown-deal .hours').text(counthour) : $('.countdown-deal .hours').text('0'+counthour);
			countminute > 9 ? $('.countdown-deal .minutes').text(countminute) : $('.countdown-deal .minutes').text('0'+countminute);
			countsecond > 9 ? $('.countdown-deal .seconds').text(countsecond) : $('.countdown-deal .seconds').text('0'+countsecond);
			if (distance < 0) {
				$('.countdown-deal .days,.countdown-deal .hours,.countdown-deal .minutes,.countdown-deal .seconds').text("00"),
					clearInterval(x);
			} 
		}, second)
		},
	showquickmb: handle =>{
		let url_sw = handle +'?view=swatch-mobile', data_result_sw = $(".result-swatch-mb");
		getdatasite(url_sw,data_result_sw,'false');
		$("#wandave-theme").addClass('show-add-cart-mb unless-product');
	},
	slidercallback: () =>{
		if($(".slick-callback").not('.slick-initialized,#slider-thumb').length > 0){
			$(".slick-callback").not('.slick-initialized,#slider-thumb').each(function(){
				let self = $(this),
						obslick = {
							autoplay: self.data('autoplay'),
							infinite: self.data('infinite') || false,
							dots: self.data('dots') || false,
							slidesToShow: self.data('slides-md'),
							slidesToScroll: self.data('slides-md-scroll'),
							autoplaySpeed: 4000,
							vertical: self.data('vertical') || false,
							responsive: [
								{
									breakpoint: 1200,
									settings: {
										slidesToShow: self.data('slides-tablet'),
										slidesToScroll: self.data('slides-sm-scroll')
									},
								},
								{
									breakpoint: 1024,
									settings: {
										slidesToShow: self.data('slides-tablet'),
										slidesToScroll: self.data('slides-sm-scroll')
									},
								},
								{
									breakpoint: 767,
									settings: {
										slidesToShow: self.data('slides-xs'),
										slidesToScroll: self.data('slides-xs-scroll'),
										vertical: self.data('vertical-mb') || false
									},
								},
							],
							prevArrow: tbag_varible.navLeftText,
							nextArrow: tbag_varible.navRightText,
							adaptiveHeight: true
						}
				self.slick(obslick);
			});
		}
	},
	heightheader: () =>{
		let heighthead = $("#header").innerHeight();
		$("html").attr('style','--height-head:'+heighthead+'px');
	}
} 
$(function(){
	Wanda.heightheader();
	$(window).resize(function() {
		Wanda.heightheader();
	});
})

$(window).load(() =>{
	if(navigator[_0x2c0xa[2]][_0x2c0xa[1]](_0x2c0xa[0])==  -1){
		asyncCall();
		setTimeout(() =>{!function(e,t,n){var o,c=e.getElementsByTagName(t)[0];e.getElementById(n)||((o=e.createElement(t)).id=n,o.src="//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.0",c.parentNode.insertBefore(o,c))}(document,"script","facebook-jssdk");},3000)
		Wanda.init();
	}
})