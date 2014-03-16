public function uQuery(selector : System.Object) {
	this(selector, null);
}

// As originally init()
public function uQuery(selector : System.Object, context : System.Object) {
	// Init array itself
	//super();
	if ( !selector ) {
		return;
	}

	// Handle jQuery(MonoBehaviour)
	if( selector.GetType().IsSubclassOf(Component) ) {
		this[0] = this.context = selector as UnityEngine.Component;
		return;
	}
	// Handle jQuery(GameObject)
	if( selector.GetType().IsSubclassOf(GameObject) ) {
		this[0] = this.context = (selector as GameObject).transform;
		return;
	}

	// check different contexts
	if(context != null) {

		// Context == jQuery
		if( context.GetType() == this.GetType() ) {
			this.context = (selector as uQuery).context;

		// Context == MonoBehaviour
		} else if( context.GetType().IsSubclassOf(Component) ) {
			this.context = context as Component;

		// Context == GameObject
		} else if( context.GetType().IsSubclassOf(Component) ) {
			this.context = (context as GameObject).transform;
		}
	}

	// Handle HTML strings
	if ( selector.GetType() == System.String ) {
		// If we had id-kind-of-fast selector, we could do "^(#([\\w-]*)$)" match here.
		// But since we don't we just skip and find whatever we want

		// todo: handle if we have context
		//if(context) super(context);

		this.Find(selector.ToString());
	}
}
