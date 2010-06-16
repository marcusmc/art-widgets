ART.ArrowRect = new Class({

	Extends: ART.Shape,
	
	initialize: function(width, height, radius, arrowWidth, arrowHeight, arrowPosition){
		this.parent();
		if (arguments.length >= 2) this.draw.apply(this, arguments);
	},
	
	draw: function(width, height, radius, pw, ph, pp){

		var path = new ART.Path;
		
		if (!radius) radius = 0;

		if (typeof radius == 'number') radius = [radius, radius, radius, radius];

		var tl = radius[0], tr = radius[1], br = radius[2], bl = radius[3];

		if (tl < 0) tl = 0;
		if (tr < 0) tr = 0;
		if (bl < 0) bl = 0;
		if (br < 0) br = 0;
		
		var sides = {
			top: Math.abs(width) - (tr + tl),
			right: Math.abs(height) - (tr + br),
			bottom: Math.abs(width) - (br + bl),
			left: Math.abs(height) - (bl + tl)
		};
		
		var ps;
		
		pp += 45;
		pp = ((pp %= 360) < 0) ? pp + 360 : pp;
		
		if (pp <= 90){
			ps = 'top'; pp = pp / 90;
		} else if (pp <= 180){
			ps = 'right'; pp = (pp - 90) / 90;
		} else if (pp <= 270){
			ps = 'bottom'; pp = (pp - 180) / 90;
		} else if (pp <= 360){
			ps = 'left'; pp = (pp - 270) / 90;
		}
		
		switch (ps){
			case 'top': path.move(0, ph); break;
			case 'left': path.move(ph, 0); break;
		}

		path.move(0, tl);
		
		pp = ((sides[ps] - pw) * pp);
		var pe = sides[ps] - pp - pw, pw2 = pw / 2;

		if (width < 0) path.move(width, 0);
		if (height < 0) path.move(0, height);
		
		// top

		if (tl > 0) path.arc(tl, -tl);
		if (ps == 'top') path.line(pp, 0).line(pw2, -ph).line(pw2, ph).line(pe, 0);
		else path.line(sides.top, 0);
		
		// right

		if (tr > 0) path.arc(tr, tr);
		if (ps == 'right') path.line(0, pp).line(ph, pw2).line(-ph, pw2).line(0, pe);
		else path.line(0, sides.right);
		
		// bottom

		if (br > 0) path.arc(-br, br);
		if (ps == 'bottom') path.line(-pp, 0).line(-pw2, ph).line(-pw2, -ph).line(-pe, 0);
		else path.line(-sides.bottom, 0);
		
		// left

		if (bl > 0) path.arc(-bl, -bl);
		if (ps == 'left') path.line(0, -pp).line(-ph, -pw2).line(ph, -pw2).line(0, -pe);
		else path.line(0, -sides.left);

		return this.parent(path);
	}

});
