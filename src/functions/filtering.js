public function isVisble() : boolean {
	
	var ret : boolean = false;
	
	if(context.renderer) {
		ret = context.renderer.enabled;
	}
	if(context.guiTexture) {
		ret = ret || context.guiTexture.enabled;
	}
	
	return ret;
}