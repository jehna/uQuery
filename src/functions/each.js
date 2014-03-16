public function each( /*obj : System.Object,*/ callback : Function ) {
	var isObj : boolean = !this.GetType().IsSubclassOf(Array);
	var i : int = 0;

	if( isObj ) {
		// Confusing, in which case we would have an object?

	} else {
		for( ; i < this.length; ) {
			//(this[i++] as System.Object).call(callback);
			callback.Call([this[i], this[i++] as Component]);
		}
	}
	return this;
}