ART.Sheet.defineStyle('window.browser', {
	'header-height': 60
});

ART.Sheet.defineStyle('history.browser', {
	'top':30,
	'padding': '0 8px 0 10px'
});

ART.Sheet.defineStyle('history input', {
	'left': 66
});

ART.Sheet.defineStyle('history input.disabled', {
	'left': 66
});

ART.Browser = new Class({

	Extends: ART.Window,

	options: {
		className: 'browser'
	},
	
	build: function(){
		this.parent.apply(this, arguments);
		this.history = new ART.History({
			className: 'browser',
			editable: true
		});
		$(this.history).inject(this.header);
		this.history.resize();
	},
	
	render: function(){
		this.parent.apply(this, arguments);
		if (this.history) this.history.render();
	},
	
	resize: function(){
		this.parent.apply(this, arguments);
		if (this.history) this.history.resize();
	}

});