jQuery(function($) {

	var home = $('#map-canvas').attr('data-home'),
		marker = [],
		infowindow = [], 
		map, 
		markerIndex = 0, 
		openIndex = 0, 
		circles = [],
		circlesMarkers = [home+"/img/Map/marker-6.png", home+"/img/Map/marker-7.png", home+"/img/Map/marker-8.png", home+"/img/Map/marker-9.png"];

	function addMarker(location,image,additionalImage,text,index){
        marker[index] = new google.maps.Marker({
            position: location,
            map: map,
			icon: {
				url: image
			},
			mainImage: image,
			additionalImage: additionalImage
        });
        marker[index].setMap(map);

		
		infowindow[index] = new google.maps.InfoWindow({
			content: text
		});
		
		google.maps.event.addListener(marker[index], 'click', function() {
			infowindow[openIndex].close();
			openIndex = index;
			infowindow[index].open(map,marker[index]);
		});
    }

    function map_recenter(map,latlng,offsetx,offsety) {
	    var point1 = map.getProjection().fromLatLngToPoint(
	        (latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
	    );
	    var point2 = new google.maps.Point(
	        ( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom()) ) || 0,
	        ( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom()) ) || 0
	    );  
	    map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(
	        point1.x - point2.x,
	        point1.y + point2.y
	    )));
	}

    Number.prototype.toRad = function() {
       return this * Math.PI / 180;
    };

    Number.prototype.toDeg = function() {
       return this * 180 / Math.PI;
    };

    google.maps.LatLng.prototype.destinationPoint = function(brng, dist) {
		dist = (dist/1000) / 6371;  
		brng = brng.toRad();  

		var lat1 = this.lat().toRad(), lon1 = this.lng().toRad();

		var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + 
		                    Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

		var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
		                            Math.cos(lat1), 
		                            Math.cos(dist) - Math.sin(lat1) *
		                            Math.sin(lat2));

		if (isNaN(lat2) || isNaN(lon2)) return null;

		return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
    };
	
	function initialize() {

		var mapId = $('#map-canvas'),
			lat = mapId.data("lat"),
			lng = mapId.data("lng"),
			mapCenter = new google.maps.LatLng(lat,lng),
			mapZoom = parseInt(mapId.data("zoom")),
			mapImage = mapId.data('image'),
			styles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"weight":"0.94"},{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]}],
			styledMap = new google.maps.StyledMapType(styles,{name: "Стилізована карта"}),
			mapOptions = {
				scrollwheel: false,
				zoom: mapZoom,

				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE,
					position: google.maps.ControlPosition.LEFT_BOTTOM
				},
				streetViewControl: true,
				streetViewControlOptions: {
					position: google.maps.ControlPosition.LEFT_BOTTOM
				},
				
				center: mapCenter,
				mapTypeControlOptions: {
				  	mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style'],
				  	style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				  	position: google.maps.ControlPosition.RIGHT_TOP
				}
			};

		if(mapId.hasClass('zoom')){
			mapOptions = {
				scrollwheel: false,
				zoom: mapZoom,
				disableDefaultUI: true,
				
				center: mapCenter,
				mapTypeControlOptions: {
				  mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
				}
			};
		}

		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		map.mapTypes.set('map_style', styledMap);
  		map.setMapTypeId('map_style');
		
		$('.marker-entry').each(function(){
			var lat = $(this).data('lat'),
				lng = $(this).data('lng'),
				latlng = new google.maps.LatLng(lat, lng),
				image = $(this).data('image'),
				additionalImage = $(this).data('additional-image'),
				text = '<div class="marker-entry">'+$(this).html()+'</div>';
			addMarker(latlng,image,additionalImage,text,markerIndex);	
			$(this).data('index', markerIndex);
			markerIndex++;
		});

		marker[markerIndex] = new google.maps.Marker({
            position: mapCenter,
            map: map,
			icon: {
				url: mapImage,
				anchor: new google.maps.Point(80,80)
			}
        });
		markerIndex++;

		for(var i = 0; i<circlesMarkers.length; i++){
			circles[i] = {};
			circles[i].radius = 500*(i+1);
			circles[i].circle = new google.maps.Circle({
	            strokeColor: '#FFF',
	            strokeWeight: 1.5,
	            fillColor: '#000',
	            fillOpacity: 0.05,
	            map: map,
	            center: mapCenter,
	            radius: circles[i].radius
	        });
            circles[i].markerLeft = new google.maps.Marker({
                position: mapCenter.destinationPoint(-90, circles[i].radius),
                map: map,
    			icon: {
    				url: circlesMarkers[i],
    				anchor: new google.maps.Point(32,32)
    			},
    			zIndex:99999999
            });
            circles[i].markerRight = new google.maps.Marker({
                position: mapCenter.destinationPoint(90, circles[i].radius),
                map: map,
    			icon: {
    				url: circlesMarkers[i],
    				anchor: new google.maps.Point(32,32)
    			},
    			zIndex:99999999
            });
            circles[i].markerRight.setMap(map);
		}

	}

	$('#map-panel-toggle').on('click', function(){
		$(this).toggleClass('active');
		$('.map-panel-wrapper').toggleClass('active');
	});

	$('.map-panel-category').on('click', function(){

		var prevPanel = $('.map-panel-entry.child.active'),
			prevMarkers = prevPanel.find('.marker-entry');
		unselectMarkers(prevPanel, prevMarkers);

		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('.map-panel-wrapper').removeClass('submenuopen');
		}
		else{
			var index = $(this).parent().find('.map-panel-category').index(this),
				thisPanel = $('.map-panel-entry.child').eq(index),
				thisMarkers = thisPanel.find('.marker-entry');

			$('.map-panel-category').removeClass('active');
			$(this).addClass('active');
			$('.map-panel-entry.child').removeClass('active');
			thisPanel.addClass('active');
			$('.map-panel-wrapper').addClass('submenuopen');

			selectMarkers(thisPanel, thisMarkers);
		}
	});

	function selectMarkers(panel, markers){
		var markersLength = markers.length;
		for(var i=0; i<markersLength; i++){
			var j = parseInt($(markers[i]).data('index'), 10);
			marker[j].setIcon(marker[j].additionalImage);
		}
	}

	function unselectMarkers(panel, markers){
		var markersLength = markers.length;
		for(var i=0; i<markersLength; i++){
			var j = parseInt($(markers[i]).data('index'), 10);
			marker[j].setIcon(marker[j].mainImage);
		}
	}

	$('.map-panel-close').on('click', function(){
		var prevPanel = $('.map-panel-entry.child.active'),
			prevMarkers = prevPanel.find('.marker-entry');
		unselectMarkers(prevPanel, prevMarkers);
		if($(this).parent().hasClass('parent')) $('#map-panel-toggle').click();
		else {
			$('.map-panel-entry.child').removeClass('active');
			$('.map-panel-category').removeClass('active');
		}
	});

	$('.marker-entry').on('click', function(){
		console.log($(this).data('index'));
		$('#map-panel-toggle').click();
		var index = parseInt($(this).data('index'),10);
		infowindow[openIndex].close();
		openIndex = index;
		infowindow[index].open(map,marker[index]);
		map.setCenter(new google.maps.LatLng($(this).data('lat'), $(this).data('lng')));
		//map_recenter(map,new google.maps.LatLng($(this).data('lat'), $(this).data('lng')),0,-70);
	});

	$(window).load(function(){
		if($('#slide-9 #map-canvas').length) setTimeout(function(){initialize();}, 1500);
		else initialize();
	});

	//setTimeout(function(){initialize();}, 0);

});