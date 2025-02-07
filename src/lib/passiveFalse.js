export function passiveFalse(node, callback) {
	function handler(event) {
		callback(event);
	}

	node.addEventListener("touchstart", handler, { passive: false });

	return {
		destroy() {
			node.removeEventListener("touchstart", handler);
		},
	};
}
