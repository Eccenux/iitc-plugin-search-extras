/* global portals, $, BaseSearch */

/**
 * IITC exact search
 * 
 * Adds exact matches with "==" in title.
 */
// eslint-disable-next-line no-unused-vars
class ExactSearch extends BaseSearch {
	constructor() {
		super();
		this.description = 'Exact match';
		this.titlePrefix = '== ';
	}

	/**
	 * Find portals.
	 * @param {Object} query IITC query object (`query.term` is the main search term).
	 */
	find(query) {
		var term = query.term;
		console.log('exact search', query);

		$.each(portals, (guid, portal) => {
			var data = portal.options.data;
			if (!data.title)
				return;
	
			if (data.title == term) {
				this.addResult(query, guid, portal);
			}
		});
	}
}