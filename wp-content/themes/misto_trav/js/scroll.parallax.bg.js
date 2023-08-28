jQuery(function($) {

	$(window).load(function(){
		if(_ismobile) return false;
		var controller = new ScrollMagic.Controller();

		var tween1 = new TimelineMax()
			.fromTo('#slide-2 .slide-background-wrapper', 1, 
				{autoAlpha: 0, scale: 1, position: 'fixed'},
				{autoAlpha: 1, scale: 1, ease: Linear.easeNone}
			)
			.fromTo('#slide-1 .button-scroll', 1, 
				{autoAlpha: 1},
				{autoAlpha: 0, ease: Linear.easeNone}, 0
			);

		var scene1 = new ScrollMagic.Scene({
			triggerElement: '#slide-2',
			triggerHook: 1,
			duration: "100%"
		})
		.setTween(tween1)
		.addTo(controller); 


		var tween2 = new TimelineMax()
			.fromTo('.plan .slide-background-wrapper', 1, 
				{y: "0%"}, 
				{y: -$('footer').height(), ease: Linear.easeNone}
			)
			.fromTo('.map-slide .slide-background-wrapper', 1, 
				{y: "0%"}, 
				{y: -$('footer').height(), ease: Linear.easeNone}, 0
			);

		var scene2 = new ScrollMagic.Scene({
			triggerElement: 'footer',
			triggerHook: 1,
			duration: $('footer').height()
		})
		.setTween(tween2)
		.addTo(controller); 

	});
});