/*
---
name: ART.ArrowTips
description: ArrowTips
requires: [ART.Sheet, ART.Widget, ART/ART.Rectangle]
provides: ART.ArrowTips
...
*/

ART.Sheet.define('arrowtip.art', {
	'arrow-width': 10,
	'arrow-height': 8,
	'background-color': ['hsb(0, 0, 100)', 'hsb(0, 0, 100)', 'hsb(0, 0, 95)'],
	'border-color': 'hsb(0, 0, 0, 0.5)',
	'border-radius': [5, 5, 5, 5],
	'border-width': 2,
	'content-padding': [10, 10, 10, 10]
});

(function(){
	
var ArrowTips = ART.ArrowTips = new Class({

	Implements: [Events, Options],
	
	options: {
		offset: {x: 0, y: 0}, //tip offset, accepts percentages
		fixed: true,
		position: '50%', //only relevant when fixed = true
		side: 'bottom', //only relevant when fixed = true
		arrowPosition: '50%',
		arrowSide: null, //if set will force the arrow side even if fixed, position and side are set.
		windowPadding: {x: 10, y: 10},
		getContent: function(){ //this is the content generator function, so you can customize exactly how the tip content is generated from your element.
			return new Element('span', {text: this.get('data-title')});
		}
	},
	
	initialize: function(elements, options){
		this.setOptions(options);
		this.elements = $$(elements);
		
		var tip = this.tip = new ART.ArrowBox().inject(document.body).hide();
		tip.name = 'arrowtip';
		
		this.options.className.split(' ').each(function(cn){
			tip.addClass(cn);
		});
		
		var self = this;
		
		this.onEnter = function(event){				
			self.showTip(this, event.page.x, event.page.y);
		};

		this.onLeave = function(event){
			self.hideTip(this);
		};

		this.onMove = function(event){
			self.position(this, event.page.x, event.page.y);
		};
		
		this.attach();
		
	},
	
	calculateFixed: function(element){
		var x, y;
		
		var position = element.getPosition(), size = element.getSize();
		var tipSize = $(this.tip).getSize();
		
		var tipPosition = tipPositionX = tipPositionY = this.options.position;
		
		if (typeof tipPosition == 'string'){
			
			if (this.options.side == 'left' || this.options.side == 'bottom') tipPosition = (tipPosition.toFloat() - 100) * -1;
			
			var pct = (tipPosition.toFloat() / 100);
			tipPositionX = (size.x - tipSize.x) * pct; tipPositionY = (size.y - tipSize.y) * pct;
		}
		
		switch (this.options.side){
			case 'top': x = position.x + tipPositionX; y = position.y - tipSize.y; break;
			case 'right': x = position.x + size.x; y = position.y + tipPositionY; break;
			case 'bottom': x = position.x + tipPositionX; y = position.y + size.y; break;
			case 'left': x = position.x - tipSize.x; y = position.y + tipPositionY; break;
		}
		
		return {x: x, y: y};
	},
	
	showTip: function(element, pageX, pageY){
		var arrowSide = this.options.arrowSide;
		
		if (!arrowSide) switch (this.options.side){
			case 'top': arrowSide = 'bottom'; break;
			case 'right': arrowSide = 'left'; break;
			case 'bottom': arrowSide = 'top'; break;
			case 'left': arrowSide = 'right'; break;
		}

		this.tip.show(this.options.getContent.call(element), arrowSide, this.options.arrowPosition);

		var fixed = this.options.fixed;
		if (!fixed){
			x = pageX; y = pageY;
		} else {
			var pos = this.calculateFixed(element);
			x = pos.x; y = pos.y;
		}

		this.position(element, x, y);
	},
	
	hideTip: function(){
		this.tip.hide();
	},
	
	position: function(element, x, y){
		
		var tipElement = $(this.tip),
			size = window.getSize(),
			scroll = window.getScroll(),
			tip = {x: tipElement.offsetWidth, y: tipElement.offsetHeight},
			props = {x: 'left', y: 'top'},
			position = {},
			page = {x: x, y: y},
			wp = this.options.windowPadding;
			
			for (var z in props){
				var offsetZ = this.options.offset[z];
				if (typeof offsetZ == 'string') offsetZ = -(tip[z] * (offsetZ.toFloat() / 100));
				
				position[props[z]] = page[z] + offsetZ;
				if ((position[props[z]] + tip[z] - scroll[z]) > (size[z] - wp[z])) position[props[z]] = size[z] - tip[z] - wp[z];
				else if ((position[props[z]] - scroll[z]) < wp[z]) position[props[z]] = wp[z];
			}

			this.tip.move(position.left, position.top);
	},
	
	attach: function(elements){
		
		if (elements && elements.length){
			this.detach();
			this.elements.combine(elements);
		}
		
		this.elements.addEvents({
			mouseenter: this.onEnter,
			mouseleave: this.onLeave
		});
		
		if (!this.options.fixed) this.elements.addEvent('mousemove', this.onMove);
		
	},
	
	detach: function(){
		
		this.elements.removeEvents({
			mouseenter: this.onEnter,
			mouseleave: this.onLeave
		});
		
		if (!this.options.fixed) this.elements.removeEvent('mousemove', this.onMove);
		
	}
	
});
	
})();
