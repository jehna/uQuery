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