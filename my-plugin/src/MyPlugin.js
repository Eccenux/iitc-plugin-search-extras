/* global addHook, ExactSearch */

/**
 * Main plugin class.
 */
// eslint-disable-next-line no-unused-vars
class MyPlugin {
	constructor (codeName) {
		this.codeName = codeName;
	}

	setup() {
		console.log('MyPlugin setup', this.codeName);

		// add new exact search
		var iitcExactSearch = new ExactSearch();
		function exactSearch(query) {
			iitcExactSearch.find(query);
		}
		addHook('search', exactSearch);		
	}
}