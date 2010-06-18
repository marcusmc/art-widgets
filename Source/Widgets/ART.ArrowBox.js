/*
---
name: ART.ArrowBox
description: A positionable box with an arrow
requires: [ART.Sheet, ART.Widget, ART/ART.Rectangle, ART.ArrowRect]
provides: ART.ArrowBox
...
*/

ART.Sheet.define('arrowbox.art', {
	'arrow-width': 10,
	'arrow-height': 8,
	'background-color': ['hsb(0, 0, 100)', 'hsb(0, 0, 100)', 'hsb(0, 0, 95)'],
	'border-color': 'hsb(0, 0, 0, 0.5)',
	'border-radius': [5, 5, 5, 5],
	'border-width': 2,
	'content-padding': [10, 10, 10, 10]
});

(function(){
	
var ArrowBox = ART.ArrowBox = new Class({
	
	Extends: ART.Widget,
	
	name: 'arrowbox',
	
	options: {
		arrowSide: 'top',
		arrowPosition: '50%'
	},
	
	initialize: function(options){
		this.parent(options);
		this.element.setStyles({'position': 'absolute', top: 0, left: 0});
		
		this.layer = new ART.ArrowRect;
		this.canvas.grab(this.layer);
		
		this.contentWrapper = new Element('div').setStyles({'position': 'absolute', top: 0, left: 0}).inject(this.element);
	},
	
	draw: function(newSheet){
		if (!this.content) return this;
		
		var sheet = this.parent(newSheet), cs = this.currentSheet;
		
		if (this.redraw || sheet.contentPadding ||
			sheet.borderRadius ||
			sheet.borderWidth != null ||
			sheet.arrowWidth ||
			sheet.arrowHeight){

			var height = this.contentHeight, width = this.contentWidth;
			
			this.contentWrapper.setStyles({'width': width});
			
			var bw = cs.borderWidth, bw2 = bw / 2, pad = cs.contentPadding;

			var as = this.options.arrowSide, ap = this.options.arrowPosition;
			
			if (as == 'top'){
				this.contentWrapper.setStyles({left: pad[3], top: cs.arrowHeight + pad[0]});
			} else if (as == 'left'){
				this.contentWrapper.setStyles({left: cs.arrowHeight + pad[3], top: pad[0]});
			} else {
				this.contentWrapper.setStyles({left: pad[3], top: pad[0]});
			}
			
			if (as == 'top' || as == 'bottom'){
				this.resize(width + pad[1] + pad[3], height + cs.arrowHeight + pad[0] + pad[2]);
			} else {
				this.resize(width + cs.arrowHeight + pad[1] + pad[3], height + pad[0] + pad[2]);
			}
			
			this.layer.draw(width - bw + pad[1] + pad[3], height - bw + pad[0] + pad[2], cs.borderRadius, cs.arrowWidth, cs.arrowHeight, as, ap);
			
			this.layer.translate(bw2, bw2);
		}
		
		if (sheet.backgroundColor) this.layer.fill.apply(this.layer, $splat(cs.backgroundColor));
		if (sheet.borderColor || sheet.borderWidth) this.layer.stroke.apply(this.layer, [cs.borderColor, cs.borderWidth]);

		return this;
	},
	
	show: function(element, side, position){
		this.content = $(element);
		this.content.setStyles({visibility: 'hidden', position: 'absolute', top: -1000, left: -1000}).inject(document.body);
		this.redraw = (this.contentHeight != this.content.offsetHeight) || (this.contentWidth != this.content.offsetWidth);
		this.contentHeight = this.content.offsetHeight; this.contentWidth = this.content.offsetWidth;
		
		if (side != null) this.options.arrowSide = side;
		if (position != null) this.options.arrowPosition = position;
		
		this.draw();
		this.content.setStyles({visibility: 'visible', position: 'static', top: 0, left: 0}).inject(this.contentWrapper);
		this.element.setStyle('display', 'block');
		return this;
	},
	
	hide: function(){
		this.element.setStyle('display', 'none');
		if (this.content) this.content.dispose();
		return this;
	},
	
	move: function(x, y){
		this.element.setStyles({left: x, top: y});
		return this;
	}
	
});
	
})();
