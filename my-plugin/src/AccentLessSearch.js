/* global portals, $, BaseSearch */

/**
 * IITC accent-less search (diacritic insensitive).
 * 
 * Adds accent-insenstive matches.
 */
// eslint-disable-next-line no-unused-vars
class AccentLessSearch extends BaseSearch {
	constructor() {
		super();
		this.description = 'No accent match';
		this.titlePrefix = '~= ';
	}

	/**
	 * Find portals.
	 * @param {Object} query IITC query object (`query.term` is the main search term).
	 */
	find(query) {
		var term = query.term;
		var termTransformed = this.transform(term);
		console.log('accent-less search', query);

		$.each(portals, (guid, portal) => {
			var data = portal.options.data;
			if (!data.title) {
				return;
			}
			// skip exact match
			if (data.title == term) {
				return;
			}

			var titleTransformed = this.transform(data.title);
			if (titleTransformed.indexOf(termTransformed) >= 0) {
				this.addResult(query, guid, portal);
			}
		});
	}
}