/**
 * jquery.line-drawing.js v1.0.0
 * http://joeyclouvel.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
	
	var body = $('body');
	var classname = 'animated-line';
	var classnameSVG = 'animated-line-svg';
	var idname = 'animatedline';
	var i = 0;
	
	$.lineDrawing = function() {
		init();
		
		initAnimations();
		draw();
	}
	
	function init() {
		$('.'+classname).each(function() {
			var data = {};
				data.width = $(this).outerWidth();
				data.height = $(this).outerHeight();
				data.pos = $(this).offset();
				data.id = idname+(i++);
				data.type = getType($(this));
				data.radius = getRadius($(this));
			
			$(this).addClass('hide');
			
			createSVG(data);
		});
	}
	
	function getType(el) {
		if(el.hasClass('text')) {
			return 'text';
		}
		else if(el.hasClass('circle')) {
			return 'circle';
		}
		else {
			return 'default';
		}
	}
	
	function getRadius(el) {
		if(el.hasClass('text')) {
			return {
					'topLeft': 10,
					'topRight': 10,
					'bottomRight': 10,
					'bottomLeft': 10
					};
		}
		else {
			return {
					'topLeft': parseInt(el.css('border-top-left-radius')) || 0,
					'topRight': parseInt(el.css('border-top-right-radius')) || 0,
					'bottomRight': parseInt(el.css('border-bottom-right-radius')) || 0,
					'bottomLeft': parseInt(el.css('border-bottom-left-radius')) || 0,
					};
		}
	}
	
	function createSVG(data) {
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute('width', data.width);
		svg.setAttribute('height', data.height);
		svg.setAttribute('class', classnameSVG);
		svg.setAttribute('id', data.id);
		svg.setAttribute('style', 'top:'+data.pos.top+'px;left:'+data.pos.left+'px');
		svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
		body.append(svg);
		
		$('#'+data.id).append(getPath(data));
	}
	
	function getPath(data) {
		var p = document.createElementNS("http://www.w3.org/2000/svg", 'path');
		
		if(data.type=='circle') {
			var path = "M "+(data.width/2)+", "+(data.height/2);
			path += "m "+(-1*data.width/2)+", 0 ";
			path += "a "+(data.width/2)+","+(data.width/2)+" 0 1,0 "+(data.width)+",0 ";
			path += "a "+(data.width/2)+","+(data.width/2)+" 0 1,0 -"+(data.width)+",0";
			
			p.setAttribute("class", "line-round");
		}
		else {
			var indice = 0.5;
		
			var path = "m"+data.radius.topLeft+" 0 l"+(data.width-data.radius.topLeft-data.radius.topRight)+" 0";
			path += "c"+data.radius.topRight+",0 "+data.radius.topRight+","+(data.radius.topRight*indice)+" "+data.radius.topRight+","+data.radius.topRight+"";
			path += "l0 "+(data.height-data.radius.topRight-data.radius.bottomRight);
			path += "c0,"+data.radius.bottomRight+" "+(-1*data.radius.bottomRight*indice)+","+data.radius.bottomRight+" "+(-1*data.radius.bottomRight)+","+data.radius.bottomRight+"";
			path += "l"+(-1*(data.width-data.radius.bottomRight-data.radius.bottomLeft))+" 0";
			path += "c"+(-1*data.radius.bottomLeft*indice)+",0 "+(-1*data.radius.bottomLeft)+","+(-1*data.radius.bottomLeft*indice)+" "+(-1*data.radius.bottomLeft)+","+(-1*data.radius.bottomLeft)+"";
			path += "l0 "+(-1*(data.height-data.radius.bottomLeft-data.radius.topLeft));
			path += "c0,"+(-1*data.radius.topLeft*indice)+" "+(data.radius.topLeft*indice)+","+(-1*data.radius.topLeft)+" "+data.radius.topLeft+","+(-1*data.radius.topLeft)+"";
			path += "z";
		}
		
		p.setAttribute("d", path);
		
		return p;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * The portion below is provided as a courtesy of Codrops
	 * svganimations2.js v1.0.0
	 * http://www.codrops.com
	 *
	 * the svg path animation is based on http://24ways.org/2013/animating-vectors-with-svg/ by Brian Suda (@briansuda)
	 *
	 * Licensed under the MIT license.
	 * http://www.opensource.org/licenses/mit-license.php
	 * 
	 * Copyright 2013, Codrops
	 * http://www.codrops.com
	 */
	
	window.requestAnimFrame = function(){
		return (
			window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback){
				window.setTimeout(callback, 1000 / 60);
			}
		);
	}();

	window.cancelAnimFrame = function(){
		return (
			window.cancelAnimationFrame       || 
			window.webkitCancelAnimationFrame || 
			window.mozCancelAnimationFrame    || 
			window.oCancelAnimationFrame      || 
			window.msCancelAnimationFrame     || 
			function(id){
				window.clearTimeout(id);
			}
		);
	}();

	var svgs = Array.prototype.slice.call( document.querySelectorAll( 'svg' ) ),
		hidden = Array.prototype.slice.call( document.querySelectorAll( '.hide' ) ),
		current_frame = 0,
		total_frames = 60,
		path = new Array(),
		length = new Array(),
		handle = 0;

	function initAnimations() {
		[].slice.call( document.querySelectorAll( 'path' ) ).forEach( function( el, i ) {
			path[i] = el;
			var l = path[i].getTotalLength();
			length[i] = l;
			path[i].style.strokeDasharray = l + ' ' + l; 
			path[i].style.strokeDashoffset = l;
		} );
	}

	function draw() {
		var progress = current_frame/total_frames;
		if (progress > 1) {
			window.cancelAnimFrame(handle);
			showPage();
		} else {
			current_frame++;
			for(var j=0; j<path.length;j++){
				path[j].style.strokeDashoffset = Math.floor(length[j] * (1 - progress));
			}
			handle = window.requestAnimFrame(draw);
		}
	}

	function showPage() {
		$('.'+classnameSVG).fadeOut(500, function() {
			$(this).remove();
		});
		$('.'+classname).animate({'opacity': 1}, 500, function() {
			$(this).removeClass('hide');
		});
	}

}(jQuery));