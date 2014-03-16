// Shorthands for callbacks
//
public function click(callback : Function) {
	return this.bind("click", callback);
}

public function mousedown(callback : Function) {
	return this.bind("mousedown", callback);
}

public function mouseup(callback : Function) {
	return this.bind("mouseup", callback);
}

public function mouseenter(callback : Function) {
	return this.bind("mouseenter", callback);
}

public function mouseleave(callback : Function) {
	return this.bind("mouseleave", callback);
}

public function mouseout(callback : Function) {
	return this.bind("mouseleave", callback);
}

public function mouseover(callback : Function) {
	return this.bind("mouseover", callback);
}