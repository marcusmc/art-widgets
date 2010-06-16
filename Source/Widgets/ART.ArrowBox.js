/*
---
name: ART.ArrowBox
description: A positionable box with an arrow
requires: [ART.Sheet, ART.Widget, ART/ART.Rectangle, ART.ArrowRect]
provides: ART.ArrowBox
...
*/

ART.Sheet.define('arrowbox.art', {
	'arrow-width': 15,
	'arrow-height': 10,
	'arrow-angle': 0,
	'background-color': 'hsb(0, 0, 100)',
	'border-color': 'hsb(0, 0, 0, 0.4)',
	'border-radius': [3, 3, 3, 3],
	'border-width': 2,
	'width': 200
});

(function(){
	
var ArrowBox = ART.ArrowBox = new Class({
	
	Extends: ART.Widget,
	
	name: 'arrowbox',
	
	options: {

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
		
		if (sheet.width || sheet.borderRadius || sheet.borderWidth || sheet.arrowWidth || sheet.arrowHeight || sheet.arrowAngle != null){
			this.contentWrapper.setStyles({'width': cs.width});
			
			var height = this.content.offsetHeight;
			this.resize(cs.width + cs.arrowHeight, height + cs.arrowHeight);
			var angle = cs.arrowAngle;
			angle = ((angle %= 360) < 0) ? angle + 360 : angle;
			
			this.layer.draw(cs.width - 2, height - 2, cs.borderRadius, cs.arrowWidth, cs.arrowHeight, angle);
			
			if ((angle >= 315 && angle < 360) || (angle >= 0 && angle <= 45)){ //top
				this.contentWrapper.setStyles({top: cs.arrowHeight, left: 0});
			} else if (angle > 225 && angle < 315){ //left
				this.contentWrapper.setStyles({left: cs.arrowHeight, top: 0});
			} else {
				this.contentWrapper.setStyles({left: 0, top: 0});
			}
			
			this.layer.translate(1, 1);
		}
		
		if (sheet.backgroundColor) this.layer.fill.apply(this.layer, $splat(cs.backgroundColor));
		if (sheet.borderColor || sheet.borderWidth) this.layer.stroke.apply(this.layer, [cs.borderColor, cs.borderWidth]);

		return this;
	},
	
	show: function(element){
		this.content = element;
		this.content.inject(this.contentWrapper);
		this.element.setStyle('display', 'block');
		this.deferDraw();
		return this;
	},
	
	hide: function(){
		if (this.content) this.content.dispose();
		this.element.setStyle('display', 'none');
		return this;
	},
	
	move: function(x, y, angle){
		this.element.setStyles({top: y, left: x});
		if (angle != null) this.deferDraw({arrowAngle: angle});
		return this;
	}
	
});
	
})();
