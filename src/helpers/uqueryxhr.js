public class uQueryXHR extends System.Object {
	
	// TODO: Cleanup other callbacks than success function
	
	public var success : function(String, uQueryXHR);
	public var complete : Function;
	public var error : Function;
	public var beforeSend : Function;
	public var form : WWWForm;
	public var cache : boolean = true;
	public var data : Boo.Lang.Hash;
	public var headers : System.Collections.Hashtable;
	public var type : String = "GET";
	public var www : WWW;
	public var url : String;
	public var _always : Function;
	public var _then : Function;
	
	public function done(callback : function(String, uQueryXHR)) {
		this.success = callback;
		return this;
	}
	public function fail(callback : Function) {
		this.error = callback;
		return this;
	}
	public function always(callback : Function) {
		this._always = callback;
		return this;
	}
	public function then(callback : Function) {
		this._then = callback;
		return this;
	}
	public function run() {
		// Inject
		(MonoBehaviour.FindObjectOfType(MonoBehaviour) as MonoBehaviour).StartCoroutine(_run());
	}
	
	private function _run() {
		if (this.type == "GET") {
			if (!url.Contains("?")) {
				this.url += "?";
			}
			
			for( var entry : System.Collections.DictionaryEntry in this.data ) {
				this.url += "&" + entry.Key.ToString() + "=" + entry.Value.ToString();
			}
			
			if (beforeSend != null) beforeSend(this);
			this.www = new WWW(url);
		} else if ( this.type == "POST" ) {
			
			for( var entry : System.Collections.DictionaryEntry in this.data ) {
				this.form.AddField(entry.Key.ToString(), entry.Value.ToString());
			}
			
			if (beforeSend != null) beforeSend(this);
			this.www = new WWW(this.url, this.form.data, this.headers);
		}
		
		yield www;
		
		if(!String.IsNullOrEmpty(this.www.error)) {
			if (this.error != null) this.error(this);
		} else {
			if (this.success != null) this.success(this.www.text, this);
			if (this.complete != null) this.complete(this);
		}
		
		
		if (this._then != null) this._then(this);
		if (this._always != null) this._always(this);
		
	}
}