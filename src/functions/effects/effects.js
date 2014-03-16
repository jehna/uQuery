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