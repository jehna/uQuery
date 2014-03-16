public class uQueryEvent extends MonoBehaviour {
	
	private var handlers : Dictionary.<String, Array> = new Dictionary.<String, Array>();
	
	public function Awake() {
		this.hideFlags = HideFlags.HideAndDontSave;
	}
	
	public function add(types : String, handler : Function) {
		for(var type : String in types.Split(" "[0])) {
			var currHandler : Array;
			try {
				currHandler = handlers[type];
			} catch(e) {
				handlers[type] = currHandler = new Array();
				currHandler.Push(handler);
			}
		}
	}
	
	public function remove(types : String, handler : Function) {
		for(var type : String in types.Split(" "[0])) {
			var currHandler : Array = handlers[type];
			if(currHandler == null) continue;
			
			// if no handler provided, clear all
			if(handler != null) {
				handlers['type'] = new Array();
			} else {
				for( var i : int = 0; i < currHandler.length; i++ ) {
					if(currHandler[i] != null && currHandler[i] == handler) currHandler.Splice(i, 1);
				}
			}
		}		
	}
	
	public function trigger(eventType : String) {
		var currHandlers : Array;
		try {
			currHandlers = handlers[eventType];
		} catch(e) {
			return;
		}
		
		for(var f : Function in currHandlers.ToBuiltin(Function) as Function[]) {
			if(f != null) f(this);
		}
	}
	
	public function Update() {
		trigger("update");
	}
	
	public function LateUpdate() {
		trigger("lateupdate");
	}
	
	public function FixedUpdate() {
		trigger("fixedupdate");
	}
	
	public function OnMouseEnter() {
		trigger("mouseenter");
	}
	
	public function OnMouseOver() {
		trigger("mouseover");
	}
	
	public function OnMouseExit() {
		trigger("mouseleave");
	}
	
	public function OnMouseDown() {
		trigger("mousedown");
	}
	
	public function OnMouseUp() {
		trigger("mouseup");
	}
	
	public function OnMouseUpAsButton() {
		trigger("click");
	}
	
	// TODO: Collision triggers
	// TODO: keyboard click triggers
}