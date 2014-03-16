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