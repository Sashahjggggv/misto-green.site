/*================*/
/* 01 - VARIABLES */
/*================*/
var swipers = [], winW, winH, pageH, winScr, _isresponsive, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);
var _functions = {};

jQuery(function($) {

	"use strict";

	//preload
    function showprogress() {
        if (document.images.length === 0) {return false;}
        var loaded = 0;
        for (var i=0; i<document.images.length; i++) {
            if (document.images[i].complete) {
                loaded++;
            }
        }
        percentage  = (loaded / document.images.length);
    }
    var ID, percentage;

	//replace default state object at first page loading
	if(!_ismobile){
		if (typeof(history.replaceState) !== "undefined") {
			history.replaceState({url:location.href}, null, null);
		}

	    window.addEventListener("popstate", function(event) {
		    window.location = event.state.url;
		});
	}

	function setLocation(curLoc){
		var state = {url:location.href};
        history.pushState(state, null, curLoc);
		return false;
    }

	/*========================*/
	/* 02 - page calculations */
	/*========================*/
	var thisW, thisH, thisM;
	_functions.pageCalculations = function(){
		winW = $(window).width();
		winH = $(window).height();
		pageH = ($('header').hasClass('animation'))?winH:winH-70;
		_isresponsive = $('.is-responsive').is(':visible')?true:false;
		$('.page-height').css({'height':pageH});
		$('.page-height-half').css({'height':pageH/2});
		if(winW/pageH > 16/9) {
			thisW = parseInt($('.slide-bg-layer').last().parent().width(),10);
			thisH = parseInt(9*$('.slide-bg-layer').last().parent().width()/16, 10);
			thisM = (-thisH/2+pageH/2) + 'px 0 0 0';
			//thisM = '0px';
		}
		else {
			thisW = parseInt(16*$('.slide-bg-layer').last().parent().height()/9, 10);
			thisH = parseInt($('.slide-bg-layer').last().parent().height(), 10);
			thisM = '0 0 0 '+(-thisW/2+winW/2)+'px';
		}
		$('.slide-bg-layer').css({'width':thisW,'height':thisH,'margin':thisM});
		$('#advantages-slide .content, .advantages-content').css({'min-height':winH});
	};

	_functions.initSelect = function(){
		if(!$('.SlectBox').length) return false;
		$('.SlectBox').SumoSelect({ csvDispCount: 3, search: false, searchText:'Search', noMatch:'No matches for "{0}"', floatWidth: 0, okCancelInMulti: true, placeholder: 'This is a placeholder' });
	};

	/*=================================*/
	/* 03 - function on document ready */
	/*=================================*/
	if(_ismobile) $('body, html').addClass('mobile');
	_functions.pageCalculations();
	_functions.initSelect();

	/*============================*/
	/* 04 - function on page load */
	/*============================*/
	$(window).load(function(){
		_functions.initSwiper();
		setTimeout(function(){$('body, html').addClass('loaded');},500);
		$('#loader-wrapper').fadeOut();

		if($('.map-slide .slide-bg-layer-wrapper').length){
			$('.map-slide .slide-bg-layer-wrapper').scrollLeft(($('.slide-bg-layer').width()-winW)/2);
		}
		if($('.map-slide-content').length){
			$('.map-slide-content').scrollLeft(($('.map-slide-image-wrapper').width()-winW)/2);
		}
		if($('.slide .slide-bg-layer-wrapper').length){
			$('.slide .slide-bg-layer-wrapper').last().scrollLeft(($('.slide .slide-bg-layer-wrapper').last().find('.slide-bg-layer').width()-winW)/2);
		}
	});

	/*==============================*/
	/* 05 - function on page resize */
	/*==============================*/
	_functions.resizeCall = function(){
		_functions.pageCalculations();
	};
	if(!_ismobile){
		$(window).resize(function(){
			_functions.resizeCall();
		});
	} else{
		window.addEventListener("orientationchange", function() {
			_functions.resizeCall();
		}, false);
	}

	/*==============================*/
	/* 06 - function on page scroll */
	/*==============================*/
	$(window).scroll(function(){
		_functions.scrollCall();
	});

	_functions.scrollCall = function(){
		winScr = $(window).scrollTop();
		if(winScr>150) {
			$('header').addClass('scrolled');
			$('.slide-sidebar').addClass('active');
		}
		else{
			$('header').removeClass('scrolled');
			$('.slide-sidebar').removeClass('active');
		}
	};

	_functions.scrollCall();

	$(document).on('click', '.button-scroll', function(){
		$("html, body").animate({scrollTop: $(this).closest('.slide').next().offset().top - (($('header').hasClass('animation'))?0:70)}, 500, function(){if (typeof wheelStop !== 'undefined') wheelStop = 0;});
	});

	/*=====================*/
	/* 07 - swiper sliders */
	/*=====================*/
	var initIterator = 0;
	function setParams(swiper, dataValue, returnValue){
		return (swiper.is('[data-'+dataValue+']'))?((typeof swiper.data(dataValue)!="string")?parseInt(swiper.data(dataValue), 10):swiper.data(dataValue)):returnValue;
	}
	_functions.initSwiper = function(){
		$('.swiper-container').not('.initialized').each(function(){								  
			var $t = $(this);	

			var index = 'swiper-unique-id-'+initIterator;

			$t.addClass('swiper-'+index+' initialized').attr('id', index);
			$t.find('.swiper-pagination').addClass('swiper-pagination-'+index);
			$t.parent().find('.swiper-button-prev').addClass('swiper-button-prev-'+index);
			$t.parent().find('.swiper-button-next').addClass('swiper-button-next-'+index);

			swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
				pagination: '.swiper-pagination-'+index,
		        paginationClickable: true,
		        nextButton: '.swiper-button-next-'+index,
		        prevButton: '.swiper-button-prev-'+index,
		        slidesPerView: setParams($t,'slides-per-view',1),
		        slidesPerGroup: ($t.data('center')!='1')?setParams($t,'slides-per-view',1):1,
		        autoHeight: setParams($t,'autoheight',0),
		        loop: setParams($t,'loop',0),
				autoplay: setParams($t,'autoplay',0),
				centeredSlides: setParams($t,'center',0),
		        breakpoints: ($t.is('[data-breakpoints]'))? { 
		        	767: { slidesPerView: ($t.attr('data-xs-slides')!='auto')?parseInt($t.attr('data-xs-slides'), 10):'auto', slidesPerGroup: ($t.attr('data-xs-slides')!='auto' && $t.data('center')!='1')?parseInt($t.attr('data-xs-slides'), 10):1 }, 
		        	991: { slidesPerView: ($t.attr('data-sm-slides')!='auto')?parseInt($t.attr('data-sm-slides'), 10):'auto', slidesPerGroup: ($t.attr('data-sm-slides')!='auto' && $t.data('center')!='1')?parseInt($t.attr('data-sm-slides'), 10):1 }, 
		        	1199: { slidesPerView: ($t.attr('data-md-slides')!='auto')?parseInt($t.attr('data-md-slides'), 10):'auto', slidesPerGroup: ($t.attr('data-md-slides')!='auto' && $t.data('center')!='1')?parseInt($t.attr('data-md-slides'), 10):1 }, 
		        	1370: { slidesPerView: ($t.attr('data-lt-slides')!='auto')?parseInt($t.attr('data-lt-slides'), 10):'auto', slidesPerGroup: ($t.attr('data-lt-slides')!='auto' && $t.data('center')!='1')?parseInt($t.attr('data-lt-slides'), 10):1 } } : {},
		        initialSlide: setParams($t,'initialslide',0),
		        speed: setParams($t,'speed',500),
		        parallax: setParams($t,'parallax',0),
		        slideToClickedSlide: setParams($t,'clickedslide',0),
		        mousewheelControl: setParams($t,'mousewheel',0),
		        direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
		        spaceBetween: setParams($t,'space',0),
		        watchSlidesProgress: true,
		        keyboardControl: true,
		        mousewheelReleaseOnEdges: true,
		        preloadImages: false,
		        lazyLoading: true,
		        lazyLoadingInPrevNext: true,
		        lazyLoadingInPrevNextAmount: 1,
		        lazyLoadingOnTransitionStart: true,
		        loopedSlides: 3,
		        roundLengths: true,
		        onProgress: function(swiper, progress){

		        },
		        onSlideChangeStart: function(swiper){
		        	var activeIndex = ($t.data('loop')=='1')?swiper.activeLoopIndex:swiper.activeIndex;
		        }
			});
			swipers['swiper-'+index].update();
			initIterator++;
		});
		$('.swiper-container.swiper-control-top').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-bottom').attr('id')];
		});
		$('.swiper-container.swiper-control-bottom').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.swipers-couple-wrapper').find('.swiper-control-top').attr('id')];
		});
	};

	/*==============================*/
	/* 08 - buttons, clicks, hovers */
	/*==============================*/

	//open and close popup
	_functions.openPopup = function(foo){
		$('.popup-content').removeClass('active');
		$('.popup-wrapper').addClass('active');
		foo.addClass('active');
		$('html').addClass('overflow-hidden');
	};

	_functions.bookPopup = function(){
		_functions.openPopup($('#book-popup'));

	};

	$(document).on('click', '.book:not(.sold)', function(e){
		e.preventDefault();
		var type = $(this).attr('data-type'),
			form = $('#book-popup');
		form.find('.request-type').val(type);
		if(type=='parking'){
			form.find('.section').hide();
			form.find('.floor').hide();
			form.find('.flat').hide();
			form.find('.parking').show().find('.parking-index-popup').text($(this).attr('data-index'));
		}
		if(type=='flat') {
			form.find('.section').show().find('.section-index-popup').text($('.section-index').text());
			form.find('.floor').show().find('.floor-index-popup').text($('.floor-index').text());
			form.find('.flat').show().find('.flat-index-popup').text($('.flat-index').text());
			form.find('.parking').hide();
		}
		if(type=='commercial') {
			form.find('.section').show().find('.section-index-popup').text($('.section-index').text());
			form.find('.floor').hide();
			form.find('.flat').hide();
			form.find('.parking').hide();
		}

		_functions.bookPopup();
	});

	_functions.closePopup = function(){
		$('.popup-wrapper, .popup-content').removeClass('active');
		$('.popup-iframe').html('');
		$('html').removeClass('overflow-hidden');
		$('#video-popup iframe').remove();
	};

	_functions.textPopup = function(title, message){
		$('#text-popup .text-popup-title').html(title);
		$('#text-popup .text-popup-message').html(message);
		_functions.openPopup($('#text-popup'));
	};

	_functions.videoPopup = function(src){
		$('#video-popup .embed-responsive').html('<iframe src="'+src+'"></iframe>');
		_functions.openPopup($('#video-popup'));
	};

	$(document).on('click', '.open-popup', function(e){
		e.preventDefault();
		_functions.openPopup($('.popup-content[id="'+$(this).data('rel')+'"]'));
	});

	$(document).on('click', '.popup-wrapper .button-close, .popup-wrapper .layer-close', function(e){
		e.preventDefault();
		_functions.closePopup();
	});

	$('.video').on('click', function(e){
		e.preventDefault();
		_functions.videoPopup($(this).data('src'));
	});

	//header
	$('.header-menu .icon').on('click', function(){
		$(this).toggleClass('active');
	});

	$('header .hamburger').on('click', function(){
		$('header .hamburger, header').toggleClass('active');
	});

	//parking
	$('.parking .lightbox-icon').on('click', function(){
		$('.parking').toggleClass('zoom');
	});

	//map area
	$(document).on('mouseover', 'map[name="main-map"] area:not(.sold), map[name="section-map"] area:not(.sold)', function(){
		var parent = $(this).parent().parent();
		parent.find('.map-overlay').not('[data-rel="'+$(this).data('rel')+'"]').addClass('active');
		parent.find('.popup-overlay[data-rel="'+$(this).data('rel')+'"]').addClass('active');
	});
	$(document).on('mouseover', 'map[name="floor-map"] area, map[name="commercial-map"] area, map[name="commercialdetail-map"] area, map[name="parking-map"] area', function(){
		// var parent = $(this).parent().parent();
		// parent.find('.map-overlay[data-rel="'+$(this).data('rel')+'"]').addClass('active');
		// parent.find('.popup-overlay[data-rel="'+$(this).data('rel')+'"]').addClass('active');
		var foo = document.createElement("canvas"),
			bar = $(this).parent().parent();
		bar.find('.popup-overlay[data-rel="'+$(this).data('rel')+'"]').addClass('active');
        foo.width = bar.width();
        foo.height = bar.height();
        drawPoly($(this).attr('coords'), foo, ($(this).hasClass('sold'))?'rgba(127,127,127,0.7)':'rgba(106,191,74,0.7)');
        $(this).closest('.map-slide').find('.canvas-wrapper').html(foo);
	});
	$(document).on('mouseleave', 'map area', function(){
		$('.map-overlay, .popup-overlay').removeClass('active');
		$('.canvas-wrapper').html('');

	});
	function drawPoly(coordinates, canvas, color)
    {
        var context = canvas.getContext('2d');
        //context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = 0;
        var mCoords = coordinates.split(',');
        var i, n;
        n = mCoords.length;
        context.beginPath();
        context.moveTo(mCoords[0], mCoords[1]);
        for (i=2; i<n; i+=2)
        {
            context.lineTo(mCoords[i], mCoords[i+1]);
        }
        context.lineTo(mCoords[0], mCoords[1]);
        //context.stroke();
        context.fill();
    }


	//tabs menu
	$('.tabs-menu .title').on('click', function(){
		$(this).toggleClass('active');
	});

	//floor dropdown
	$('.floor-title').on('click', function(){
		$(this).toggleClass('active');
	});

	//touch scroll
	$('.touch-scroll').on('click', function(){
		$(this).addClass('active');
	});

	//gallery icon
	$('.swiper-container .lightbox-icon').on('click', function(){
		$(this).closest('.swiper-container').find('.swiper-slide-active .lightbox').click();
	});

	//tabs
	function updateAdvantagesTabs(foo){
		$('.advantages-tabs a').removeClass('active');
		foo.addClass('active');
		foo.parent().prev().text(foo.text()).removeClass('active');
	}
	$('.advantages-tabs a').on('click', function(){
		$('.advantages-content').removeClass('active');
		$('.advantages-content[data-rel="'+$(this).data('rel')+'"]').addClass('active');
		updateAdvantagesTabs($(this));
	});

	var a = 0;
	$('.advantages-background .point-entry').on('click', function(e){
		if(a) return false;
		a = 1;
		var self = $(this);
		$('.advantages-content.active').removeClass('active').addClass('prev');
		$('.advantages-content[data-rel="'+$(this).data('rel')+'"]').addClass('new active');
		$('.advantages-background .point-entry').removeClass('active');
		$(this).addClass('active');
		setTimeout(function(){
			a = 0;
			$(window).scrollTop(self.closest('.slide').offset().top);
			$('.advantages-content').removeClass('prev new');
			//sceneSidebar2.duration($('#slide-wrapper-2').height());
			slidesScenes[parseInt(self.closest('.slide').data('index'), 10)].duration(self.closest('.slide').height());
			updateAdvantagesTabs($('.advantages-tabs a[data-rel="'+self.data('rel')+'"]'));
		},500);
	});

	//advantages
	var ajaxFinish = 0, ajax_url = '/wp-admin/admin-ajax.php';

	//floor ajax load
	if($('.block-img').length>0) {
		var img = $('.block-img');
			if (!_ismobile && !_isresponsive) {

				//var url = $(this).attr('href');

				$('.temp-loader').addClass('active');

				$.post({
					url: ajax_url,
					data: {
						action: 'get_section',
						section: img.attr('data-section')
					},
					success: function (response) {
						console.log(response); //return;
						$(response).addClass('active').insertBefore($('.map-slide'));
						_functions.pageCalculations();
						setLocation($('.floor-link.active').attr('href'));
						ID = window.setInterval(function () {
							showprogress();
							if (percentage == 1) {
								window.clearInterval(ID);
								$('.map-slide').removeClass('active');
								setTimeout(function () {
									percentage = 0;
									ajaxFinish = 0;
									$(window).scrollTop(0);
									$('.temp-loader').removeClass('active');

									$('map').imageMapResize();
								}, 500);
							}
						}, 500);
					}
				});
			}
	}

	$('map[name="commercial-map"] area:not(.sold)').on('click', function(e){
        var area=$(this);
		if(!_ismobile && !_isresponsive){

			e.preventDefault();
			if($(this).hasClass('active') || ajaxFinish || !$(this).attr('data-section-id')) return false;
			ajaxFinish = 1;

			//var url = $(this).attr('href');

			$('.temp-loader').addClass('active');

			//setLocation(url);
			$.post({
				url: ajax_url,
				data:{
					action: 'get_commercial',
					section_id: $(this).attr('data-section-id')
				},
				success:function(response){
					//console.log(response);
					$(response).addClass('active').insertBefore($('.map-slide'));
					_functions.pageCalculations();
					setLocation(area.attr('href'));
					ID = window.setInterval(function(){
						showprogress();
						if (percentage == 1) {
							window.clearInterval(ID);
							$('.map-slide').removeClass('active');
							setTimeout(function(){
								percentage = 0;
								ajaxFinish = 0;
								$(window).scrollTop(0);
								$('.temp-loader').removeClass('active');

								$('map').imageMapResize();
							}, 500);
						}
					}, 500);
				}
			});
		}
	});


	//flats sections back click
	$(document).on('click', '#sections-back', function(e){
		if(!_ismobile && !_isresponsive){
			e.preventDefault();
			$('.map-slide:first').addClass('active');
			setTimeout(function(){$('.map-slide:first').remove();},500);
			var url = $(this).attr('href');
			setLocation(url);
		}
		
	});

	//flats floor click
	$(document).on('click', '.flat.floor-link', function(e){
		if(!_ismobile && !_isresponsive){
			
			e.preventDefault();
			if(($(this).hasClass('active') && $('.map-slide-content-wrapper').length) || ajaxFinish || !$(this).attr('data-floor-id')) return false;
			ajaxFinish = 1;

			var thisIndex = $(this).parent().find('.floor-link').index(this),
				prevIndex = $('.floor-link').index($('.floor-link.active')),
				url = $(this).attr('href'),
				className = (thisIndex<prevIndex)?'left':'right';

			$('.floor-link').removeClass('active');
			$(this).addClass('active');
			$('.temp-loader').addClass('active');

			//setLocation(url);
			$.post({
				url: ajax_url,
				data:{
					action: 'get_floor',
					floor_id: $(this).attr('data-floor-id'),
					floor_num: $(this).text()
				},
				success:function(response){
					var floor = $(response).data('floor');
					var section = $(response).data('section');
					var price = $(response).data('price');
					setLocation($('.floor-link.active').attr('href'));
					if($('.map-slide-content-wrapper').length){
						$(response).addClass('new-'+className).insertAfter($('.map-slide-content'));
						ID = window.setInterval(function(){
							showprogress();
							if (percentage == 1) {
								window.clearInterval(ID);
								$('.map-slide-content').addClass('active-'+className);
								if(floor) $('.floor-index').text(floor);
								if(section) $('.section-index').text(section);
								if(price) {
									console.log(2);
									$('.mtprice .h3.white span>span').text(price);
									$('.mtprice').fadeIn();
								} else {
									$('.mtprice').fadeOut();
								}
								setTimeout(function(){
									percentage = 0;
									ajaxFinish = 0;
									$('.temp-loader').removeClass('active');
									$('.map-slide-content').not('[class*="new-"]').remove();
									$('.map-slide-content').removeClass('active-left active-right new-left new-right');

									$('map').imageMapResize();
								}, 1000);
							}
						}, 500);
					}
					else{
						response = '<div class="map-slide-ajax-1">'+
						    '<div class="map-slide-content-wrapper">'+
						        '<a class="button-radius swiper-button-prev" href="#"></a>'+
						        '<div class="map-slide-align page-height">'+
						            '<div class="map-slide-ajax-2">'+
						                response +
						            '</div>'+
						        '</div>'+
						        '<a class="button-radius swiper-button-next" href="#"></a>'+
						    '</div>'+
						'</div>';
						$(response).addClass('active').insertAfter($('.map-slide-ajax-1'));
						_functions.pageCalculations();
						ID = window.setInterval(function(){
							showprogress();
							if (percentage == 1) {
								window.clearInterval(ID);
								$('.map-slide-ajax-1').not('.active').addClass('new');
								$('.map-slide-ajax-1.active').removeClass('active');
								if(floor) $('.floor-index').text(floor);
								if(section) $('.section-index').text(section);
								setTimeout(function(){
									percentage = 0;
									ajaxFinish = 0;
									$('.temp-loader').removeClass('active');
									$('.map-slide-ajax-1.new').remove();

									$('map').imageMapResize();
								}, 1000);
							}
						}, 500);
					}
				}
			});
			

		}
		
	});

    $(document).on('click', '.commercial.floor-link', function(e){
        if(!_ismobile && !_isresponsive){

            e.preventDefault();
            if(($(this).hasClass('active') && $('.map-slide-content-wrapper').length) || ajaxFinish || !$(this).attr('data-section-id')) return false;
            ajaxFinish = 1;

            var thisIndex = $(this).parent().find('.floor-link').index(this),
                prevIndex = $('.floor-link').index($('.floor-link.active')),
                url = $(this).attr('href'),
                className = (thisIndex<prevIndex)?'left':'right';

            $('.floor-link').removeClass('active');
            $(this).addClass('active');
            $('.temp-loader').addClass('active');

            //setLocation(url);
            $.post({
                url: ajax_url,
                data:{
                    action: 'get_commercial_area',
                    section_id: $(this).attr('data-section-id')
                },
                success:function(response){
                    var floor = $(response).data('floor');
                    var section = $(response).data('section');
					setLocation($('.floor-link.active').attr('href'));
                    if($('.map-slide-content-wrapper').length){
                        $(response).addClass('new-'+className).insertAfter($('.map-slide-content'));
                        ID = window.setInterval(function(){
                            showprogress();
                            if (percentage == 1) {
                                window.clearInterval(ID);
                                $('.map-slide-content').addClass('active-'+className);
                                if(floor) $('.floor-index').text(floor);
                                if(section) $('.section-index').text(section);
                                setTimeout(function(){
                                    percentage = 0;
                                    ajaxFinish = 0;
                                    $('.temp-loader').removeClass('active');
                                    $('.map-slide-content').not('[class*="new-"]').remove();
                                    $('.map-slide-content').removeClass('active-left active-right new-left new-right');

                                    $('map').imageMapResize();
                                }, 1000);
                            }
                        }, 500);
                    }
                    else{
                        response = '<div class="map-slide-ajax-1">'+
                        '<div class="map-slide-content-wrapper">'+
                        '<a class="button-radius swiper-button-prev" href="#"></a>'+
                        '<div class="map-slide-align page-height">'+
                        '<div class="map-slide-ajax-2">'+
                        response +
                        '</div>'+
                        '</div>'+
                        '<a class="button-radius swiper-button-next" href="#"></a>'+
                        '</div>'+
                        '</div>';
                        $(response).addClass('active').insertAfter($('.map-slide-ajax-1'));
                        _functions.pageCalculations();
                        ID = window.setInterval(function(){
                            showprogress();
                            if (percentage == 1) {
                                window.clearInterval(ID);
                                $('.map-slide-ajax-1').not('.active').addClass('new');
                                $('.map-slide-ajax-1.active').removeClass('active');
                                if(floor) $('.floor-index').text(floor);
                                if(section) $('.section-index').text(section);
                                setTimeout(function(){
                                    percentage = 0;
                                    ajaxFinish = 0;
                                    $('.temp-loader').removeClass('active');
                                    $('.map-slide-ajax-1.new').remove();

                                    $('map').imageMapResize();
                                }, 1000);
                            }
                        }, 500);
                    }
                }
            });


        }

    });



    $(document).on('click', '.map-slide-content-wrapper .swiper-button-prev', function(e){
		e.preventDefault();
		if($('.floor-link.active').next().hasClass('floor-link')) $('.floor-link.active').next().click();
		else $('.floor-link:first').click();
	});

	$(document).on('click', '.map-slide-content-wrapper .swiper-button-next', function(e){
		e.preventDefault();
		if($('.floor-link.active').prev().hasClass('floor-link')) $('.floor-link.active').prev().click();
		else $('.floor-link:last').click();
	});

	//flats flat click
	$(document).on('click', 'map[name="floor-map"] area:not(.sold)', function(e){
		if(!_ismobile && !_isresponsive){
			e.preventDefault();
			if($(this).hasClass('active') || ajaxFinish || !$(this).attr('data-flat-id')) return false;
			ajaxFinish = 1;

			var url = $(this).attr('href');

			$('.temp-loader').addClass('active');

			//setLocation(url);
			$.post({
				url: ajax_url,
				data:{
					action: 'get_flat',
					flat_id: $(this).attr('data-flat-id')
				},
				success:function(response){
					$(response).addClass('new').insertAfter($('.map-slide-ajax-1'));
					_functions.pageCalculations();
					setLocation(url);
					ID = window.setInterval(function(){
						showprogress();
						if (percentage == 1) {
							window.clearInterval(ID);
							$('.map-slide-ajax-1').not('.new').addClass('active');
							$('.map-slide-ajax-1.new').removeClass('new');
							setTimeout(function(){
								percentage = 0;
								ajaxFinish = 0;
								$(window).scrollTop(0);
								$('.temp-loader').removeClass('active');
								$('.map-slide-ajax-1.active').remove();
							}, 1000);
						}
					}, 500);
				}
			});
		}
	});

	/*header phone*/
	$('html.mobile .phones-header .icon, .phones-header .button-close').on('click', function(){
		$('.phones-header').toggleClass('active');
	});

});

/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});