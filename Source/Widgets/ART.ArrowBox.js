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
	'border-radius': [5, 5, 5, 5],
	'border-width': 2,
	'content-padding': 15,
	'width': 200
});

(function(){
	
var ArrowBox = ART.ArrowBox = new Class({
	
	Extends: ART.Widget,
	
	name: 'arrowbox',
	
	options: {},
	
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
		
		if (sheet.contentPadding != null ||
			sheet.borderRadius ||
			sheet.borderWidth != null ||
			sheet.arrowWidth ||
			sheet.arrowHeight ||
			sheet.arrowAngle != null){
			
			this.content.setStyles({visibility: 'hidden', position: 'absolute', top: -1000, left: -1000}).inject(document.body);
			var height = this.content.offsetHeight, width = this.content.offsetWidth;
			this.contentWrapper.setStyles({'width': width});
			
			this.resize(width + cs.arrowHeight + cs.contentPadding * 2, height + cs.arrowHeight + cs.contentPadding * 2);
			var angle = cs.arrowAngle;
			angle = ((angle %= 360) < 0) ? angle + 360 : angle;
			
			var bw = cs.borderWidth, bw2 = bw / 2;
			
			this.layer.draw(width - bw + cs.contentPadding * 2, height - bw + cs.contentPadding * 2, cs.borderRadius, cs.arrowWidth, cs.arrowHeight, angle);
			
			if ((angle >= 315 && angle < 360) || (angle >= 0 && angle <= 45)){ //top
				this.contentWrapper.setStyles({top: cs.arrowHeight + cs.contentPadding, left: cs.contentPadding});
			} else if (angle > 225 && angle < 315){ //left
				this.contentWrapper.setStyles({left: cs.arrowHeight + cs.contentPadding, top: cs.contentPadding});
			} else {
				this.contentWrapper.setStyles({left: cs.contentPadding, top: cs.contentPadding});
			}
			
			this.layer.translate(bw2, bw2);
			
			this.content.setStyles({visibility: 'visible', position: 'static', top: 0, left: 0}).inject(this.contentWrapper);
		}
		
		if (sheet.backgroundColor) this.layer.fill.apply(this.layer, $splat(cs.backgroundColor));
		if (sheet.borderColor || sheet.borderWidth) this.layer.stroke.apply(this.layer, [cs.borderColor, cs.borderWidth]);

		return this;
	},
	
	show: function(element){
		this.content = element;
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
