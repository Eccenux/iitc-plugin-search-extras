/* global zoomToAndShowPortal, renderPortalDetails, map */

/**
 * IITC search
 */
// eslint-disable-next-line no-unused-vars
class BaseSearch {
	constructor() {
		this.svg = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="12" height="12" version="1.1">
			<g style="fill:white;stroke:none">
				<path d="m 6,12 -2,-12  4,0 z" />
				<path d="m 6,12 -4, -8  8,0 z" />
				<path d="m 6,12 -6, -4 12,0 z" />
			</g>
		</svg>`;
		this.icon = 'data:image/svg+xml;base64,' + btoa(this.svg);
		/**
		 * Found item description.
		 * Override `addResult` for more advanced desc.
		 */
		this.description = 'Extra search';
		/**
		 * Prefix of title of a found item.
		 * Override `addResult` for more advanced transform.
		 */
		this.titlePrefix = '';
	}

	/**
	 * Find portals.
	 * @param {Object} query IITC query object (`query.term` is the main search term).
	 */
	find(query) {
		/* when found use:
			this.addResult(query, guid, portal);
		*/
	}

	/**
	 * Add found item to search results.
	 * 
	 * @param {Object} query IITC query object.
	 * @param {String} guid Portal GUID.
	 * @param {Object} portal Portal data (from `portals`).
	 */
	addResult(query, guid, portal) {
		var data = portal.options.data;
		query.addResult({
			title: this.titlePrefix + data.title,
			description: this.description,
			position: portal.getLatLng(),
			icon: this.icon,
			onSelected: this.onSelect(guid, portal),
		});
	}

	/**
	 * Standard select action.
	 * 
	 * @param {String} guid Portal GUID.
	 * @param {Object} portal Portal data (from `portals`).
	 */
	onSelect(guid, portal) {
		return function (result, event) {
			if (event.type == 'dblclick') {
				zoomToAndShowPortal(guid, portal.getLatLng());
			} else if (window.portals[guid]) {
				if (!map.getBounds().contains(result.position))
					map.setView(result.position);
				renderPortalDetails(guid);
			} else {
				window.selectPortalByLatLng(portal.getLatLng());
			}
			return true;
		};
	}
}