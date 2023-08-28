var slidesScenes = [], wheelStop = 0;
jQuery(function($) {

	$(window).load(function(){
		if(_ismobile) return false;
		var controller = new ScrollMagic.Controller();

		$(document).on('click', '.slide-sidebar-scroll span', function(){
			var index = $(this).parent().parent().find('.slide-sidebar-scroll').index($(this).parent()) + 1;
			$("html, body").animate({scrollTop: ($('.slide').eq(index).length)?$('.slide').eq(index).offset().top:$('footer').offset().top}, 500, function(){wheelStop = 0;});
		});

		$('body').on('mousewheel', function(){
		    if(wheelStop) return false;
		});

		$('.slide, footer').on('mousewheel', function(event) {
			if(!_isresponsive){
			    if(wheelStop) return false;
			    
			    if(event.deltaY<0){
			    	var nextSlide = 0;
			    	if($(this).next('.slide').length) nextSlide = $(this).next('.slide');
			    	else if($(this).next('footer').length) nextSlide = $('footer');
			    	if($(this).offset().top -15>=winScr){
			    		wheelStop = 1;
			            event.preventDefault();
						$("html, body").animate({scrollTop: parseInt($(this).offset().top, 10)}, 500, function(){wheelStop = 0;});
			    	}
			        else if($(this).offset().top + $(this).outerHeight() - 15 <= winScr+winH && nextSlide){
			            wheelStop = 1;
			            event.preventDefault();
						$("html, body").animate({scrollTop: parseInt(nextSlide.offset().top, 10)}, 500, function(){wheelStop = 0;});
			        }
			    }
			    else{
			        var prevSlide = 0;
			        if($(this).prev('.slide').length) prevSlide = $(this).prev('.slide'); 
			        if($('footer').offset().top + 15 <= winH + winScr){
			        	wheelStop = 1;
			            event.preventDefault();
						$("html, body").animate({scrollTop: parseInt($('footer').offset().top-winH, 10)}, 500, function(){wheelStop = 0;});
			        }
			   		else if($(this).offset().top+$(this).height()-winH + 15 <= winScr){
			   			wheelStop = 1;
			            event.preventDefault();
						$("html, body").animate({scrollTop: parseInt($(this).offset().top + $(this).height() - winH, 10)}, 500, function(){wheelStop = 0;});
			   		}
			        else if($(this).offset().top + 15 >= winScr && prevSlide){
			            wheelStop = 1;
			            event.preventDefault();
						$("html, body").animate({scrollTop: parseInt(prevSlide.offset().top + prevSlide.height() - winH, 10)}, 500, function(){wheelStop = 0;});
			        }
			    }
			}
		});

		$('.slide-sidebar, header').on('mousewheel', function(){
		    if(!_isresponsive) return false;
		});

		// $.fn.scrollEnd = function(callback, timeout) {          
		//   $(this).scroll(function(){
		//     var $this = $(this);
		//     if ($this.data('scrollTimeout')) {
		//       clearTimeout($this.data('scrollTimeout'));
		//     }
		//     $this.data('scrollTimeout', setTimeout(callback,timeout));
		//   });
		// };

		// $(window).scrollEnd(function(){
		//     var slidesActive = $('.slide.active'),
		//         len = slidesActive.length;
		//     for(var i = 0;i<=len;i++){
		//         var slide = $(slidesActive[i]),
		//             slideTop = slide.offset().top,
		//             slideHeight = slide.height();
		//         if(slideTop > winScr && slideTop - winScr < winH/2){
		//             wheelStop = 1;
		//             $('body, html').stop(true,true).animate({'scrollTop':parseInt(slideTop, 10)}, 500, function(){
		//                 wheelStop = 0;
		//             });
		//             return false;
		//         }
		//         else if(slideTop + slideHeight > winScr && slideTop + slideHeight - winScr >= winH/2){
		//             wheelStop = 1;
		//             $('body, html').stop(true,true).animate({'scrollTop':parseInt(slideTop, 10)}, 500, function(){
		//                 wheelStop = 0;
		//             });
		//             return false;
		//         }
		//     }
		// }, 500);
		

		//====================================================================================================================================
		//SIDEBAR
		//====================================================================================================================================
		var sceneSidebarOff = new ScrollMagic.Scene({
			triggerElement: 'footer',
			triggerHook: 1,
		})
		.setClassToggle(".slide-sidebar", "disabled")
		.addTo(controller);

		var slides = document.querySelectorAll(".slide");

		for (var i=0; i<slides.length; i++) {
			$(slides[i]).data('index', i);
			slidesScenes[i] = new ScrollMagic.Scene({
					triggerElement: slides[i],
					triggerHook: 0,
					duration: $(slides[i]).height()
				})
				.setTween( TweenMax.to('.slide-sidebar-animate', 1, {height: i*11+'%', ease: Linear.easeNone}) )
				.addTo(controller);
		}

	});
});