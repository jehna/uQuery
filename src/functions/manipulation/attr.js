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