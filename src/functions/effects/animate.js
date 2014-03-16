/**
 * We'll use Unity's own animations.
 *
 * @NOTE:
 * Propably will be changed to something like
 * http://prime31.github.com/GoKit/
 * because animations don't allow us to
 * fade from current state but only from
 * fixed states.
 * Another approach would be to dynamically
 * generate animations just before they are
 * fired.
 */

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