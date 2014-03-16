public function addClass(className : String) {
	return this.each(function(_, ctx : Component) {
		if(ctx == null) return;
		ctx.gameObject.AddComponent(className);
	});
}

public function removeClass(className : String) {
	return this.each(function(_, ctx : Component) {
		if(ctx == null) return;
		UnityEngine.Object.Destroy(ctx.gameObject.GetComponent(className));
	});
}

public function toggleClass(className : String) {
	return this.each(function(_, ctx : Component) {
		if(ctx == null) return;
		var c : Component = ctx.gameObject.GetComponent(className);
		if(c == null) ctx.gameObject.AddComponent(className);
		else UnityEngine.Object.Destroy(c);
	});
}

public function hasClass(className : String) : boolean {
	var ctx : Component = context;
	if(ctx == null && this.length > 0) {
		ctx = this[0] as Component;
	}
	if(ctx == null) return false;
	return ctx.gameObject.GetComponent(className) != null;
}