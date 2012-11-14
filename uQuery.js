#pragma strict

import System.Text.RegularExpressions;
import System.Collections.Generic;
import System.Reflection;

public class uQuery extends Array {

	public var context : UnityEngine.Component;
	public var rquickExpr : String = "^(?:#([\\w-]+)|(\\w+)|.([\\w-]+))$";
	private var renderer : Component = null;

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
				
				if(type == null) {
					var assembly : System.Reflection.Assembly = System.Reflection.Assembly.Load("UnityEngine");
					type = assembly.GetType("UnityEngine." + match.Groups[3].Value);
				}
				
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
	
	// We'll use Unity's own animations
	//
	// @TODO: Callbacks for animations
	//
	public function animate( attr : String, prop : String, from : float, to: float, speed : float , callback : Function ) {
		return this.each(function(_, ctx : Component) {
		
			var a : AnimationClip = new AnimationClip();
			var affects : UnityEngine.Object[];
			switch(attr.ToLower()) {
				case "color":
					a.SetCurve("", GUITexture, "m_Color." + prop, new AnimationCurve.Linear(0,from,speed,to));
					a.SetCurve("", Material, "_Color." + prop, new AnimationCurve.Linear(0,from,speed,to));
					affects = [ctx.guiTexture as UnityEngine.Object, ctx.renderer as UnityEngine.Object];
					break;
				case "scale":
					affects = [];
					//a.SetCurve("", GUITexture, "m_Color." + prop, new AnimationCurve.Linear(0,from,speed,to));
					a.SetCurve("", Transform, "localScale." + prop, new AnimationCurve.Linear(0,from,speed,to));
			}
			var tmpName : String = "anim" + Time.realtimeSinceStartup;
			
			var cb : AnimationEvent = new AnimationEvent();
			cb.messageOptions = SendMessageOptions.DontRequireReceiver;
			cb.functionName = "AnimationEnded";
			cb.time = speed;
			cb.stringParameter = tmpName;
			a.AddEvent(cb);
			
			var start : AnimationEvent = new AnimationEvent();
			start.functionName = "AnimationStarted";
			start.time = 0;
			a.AddEvent(start);
		
			var anim : Animation = ctx.animation;
			if(anim == null) anim = ctx.gameObject.AddComponent.<Animation>();
			anim.AddClip(a, tmpName);
			anim.PlayQueued(tmpName);
			anim.Play();
			
			var cbHolder : AnimationCallback = ctx.gameObject.AddComponent.<AnimationCallback>();
			cbHolder.caller = tmpName;
			cbHolder.holdCallerAlive = this;
			cbHolder.callback = callback;
			cbHolder.affects = affects;
			cbHolder.setAnimationValues = function() {
				switch(attr.ToLower()) {
					case "scale":
						for(var fill : String in ["x", "y", "z"]) {
							if(fill == prop) return;
							var val : float = parseFloat(uQuery(ctx.transform).attr(fill, "localScale").ToString());
							anim.GetClip(tmpName).SetCurve("", Transform, "localScale." + fill, new AnimationCurve.Linear(0,val,speed,val));
							//Debug.Log(fill + " = " + );
						}
						break;
				}
				
			};
		});
	}
	
	public function fadeIn() {
		return this.animate( "color", "a", 0.0, 1.0, 3.0, function(_) { this.show(); }); 
	}
	
	public function fadeOut() {
		return this.animate( "color", "a", 1.0, 0.0, 3.0, function(_) { this.hide(); });
	}
	
	public function slideOut() {
		return this.animate( "scale", "y", 1.0, 0.0, 3.0, function(_) { this.show(); });
	}
	
	public function slideIn() {
		return this.animate( "scale", "y", 0.0, 1.0, 3.0, function(_) { this.show(); });
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
	
	public function children() : uQuery {
		return uQuery(".Transform", context);
	}
	
	public function attr(property : String, value : Object) {
		var e : PropertyInfo = context.GetType().GetProperty(property);
		if(e != null) {
			e.SetValue(context, value, null);
		}
	}
	
	public function attr(property : String) {
		var e : PropertyInfo = context.GetType().GetProperty(property);
		if(e != null) {
			return e.GetValue(context, null);
		}
		return null;
	}
	
	public function attr(property : String, holder : String) {
		var e1 : PropertyInfo = context.GetType().GetProperty(holder);
		if(e1 != null) {
			var holderObj : Object = e1.GetValue(context, null);
			var e2 : FieldInfo = holderObj.GetType().GetField(property);
			if(e2 != null) {
				return e2.GetValue(holderObj);
			}
		}
		return null;		
	}
}

public class AnimationCallback extends MonoBehaviour {
	
	public var setAnimationValues : Function;
	public var callback : Function;
	public var caller : Object;
	public var holdCallerAlive : uQuery;
	public var affects : UnityEngine.Object[];
	
	public function Awake() {
		this.hideFlags = HideFlags.HideAndDontSave;
	}
	
	public function AnimationStarted() : void {
		for(var a : UnityEngine.Object in affects) {
			if(a != null) {
				uQuery(a).attr("enabled", true);
			}
		}
		if(setAnimationValues != null) setAnimationValues();
	}
	
	public function AnimationEnded(called : String) : void {
		if(called != caller) return;
		if(callback != null) callback(holdCallerAlive);
		animation.RemoveClip(called);
		if(animation.GetClipCount() == 0) Destroy(animation);
		Destroy(this);
	}
}