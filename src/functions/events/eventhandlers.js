// Basic bahviour of callbacks
// 
// @TODO: Pass data with callback
//
public function bind(property : String, callback : Function) {
	return this.on(property, callback);
}

public function on(property : String, callback : Function) {
	return this.each(function(_, ctx : Component) {
		var event : uQueryEvent = ctx.gameObject.GetComponent.<uQueryEvent>();
		if(event == null) event = ctx.gameObject.AddComponent.<uQueryEvent>();
		event.add(property, callback);
	});
}

public function trigger(property : String) {
	return this.each(function(_, ctx : Component) {
		var event : uQueryEvent = ctx.gameObject.GetComponent.<uQueryEvent>();
		if(event == null) return;
		event.trigger(property);
	});
}