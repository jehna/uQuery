#pragma strict

import System.Text.RegularExpressions;

public class uQuery extends Array {
	
	public var context : UnityEngine.Component;
	public var rquickExpr : String = "^(?:#([\\w-]+)|(\\w+)|.([\\w-]+))$";
	
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
	
	public function Find(selector : String) {
		
		var match : System.Text.RegularExpressions.Match = Regex.Match(selector, rquickExpr);
		
		var i : int = 0;
		var a : Array = new Array();
		if(match.Success) {
			
			// #ID
			if(match.Groups[1].Value) {
				var path : String = this.GetAbsolutePathFrom(context);
				var foundGO : GameObject = GameObject.Find(path + match.Groups[1].Value);
				if(foundGO != null) a.Push(foundGO.transform);
			
			// TAG
			} else if(match.Groups[2].Value) {
				var gameObjectsWithTag : GameObject[] = GameObject.FindGameObjectsWithTag(match.Groups[2].Value);
				if(context != null) {
					for(var children : Transform in context.GetComponentsInChildren.<Transform>()) {
						var children : GameObject = children.gameObject;
						for(var gameObjectWithTag : GameObject in gameObjectsWithTag) {
							if(match == children) a.Push(match);
						}
					}
				} else {
					for(; i<gameObjectsWithTag.length; ) {
						a.Push(gameObjectsWithTag[i++].transform);
					}
				}
			
			// .CLASS
			} else if(match.Groups[3].Value) {
				var type : System.Type = System.Type.GetType(match.Groups[3].Value);
				if(type != null) {
					if(context != null) a = context.GetComponentsInChildren(type);
					else a = UnityEngine.Object.FindSceneObjectsOfType(type);
				}
				
			}
			
		}
		
		for(i = 0; i < a.length; ) {
			this[i] = a[i++];
		}
		
	}
	
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
	
	// Helper for getting unity object's paths
	public function GetAbsolutePathFrom(target : Component) : String {
		if(target == null) return "";
		
		var ret : String = "";
		var curr : Transform = target.transform;
		while(curr.parent != null) {
			ret += curr.name + "/";
		}
		ret = "/" + ret;
		
		return ret;
	}
	
	// Show and hide functions
	public function hide() {
		return this.each(function(_, ctx : Component) {
			if(ctx == null) return;
			ctx.gameObject.SetActiveRecursively(false);
		});
	}
	
	public function show() {
		return this.each(function(_, ctx : Component) {
			if(ctx == null) return;
			ctx.gameObject.SetActiveRecursively(true);
		});
	}
	
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
}
