/**
    Utility for creating and dispatching a CustomEvent
    @param {Element} targetEl - the target of the event
    @param {String} eventName - the name of the event
    @param {Object} data - data to include with the event
    @param {Object} options - additional options to initialize the event with
*/

export function dispatchEvent(targetEl, eventName, data = {}, options = {}) {
	const initObj = {
		detail: data,
		...options,
	};

	const event = new CustomEvent(eventName, initObj);
	targetEl.dispatchEvent(event);
}
