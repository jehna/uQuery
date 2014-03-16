// Show and hide functions
public function hide() {
	return this.each(function(_, ctx : Component) {
		if(ctx == null) return;
		
		uQuery(ctx).children().each(function(_, ctx) {
			if(ctx != null) uQuery(ctx).toggleVisible(false);
		});
		
	});
}

public function show() {
	return this.each(function(_, ctx : Component) {
		if(ctx == null) return;
		
		uQuery(ctx).children().each(function(_, ctx) {
			if(ctx != null) uQuery(ctx).toggleVisible(true);
		});
	});
}

public function toggleVisible(visibility : boolean) {
	
	if(context.renderer) {
		context.renderer.enabled = visibility;
	}
	if(context.guiTexture) {
		context.guiTexture.enabled = visibility;
	}
	
}

public function toggleVisible() {
	this.toggleVisible(!this.isVisble());
}