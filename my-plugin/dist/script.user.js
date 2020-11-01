// ==UserScript==
// @author      Eccenux
// @name        IITC plugin: Search extras for FS puzzles
// @id          iitc-plugin-search-extras
// @category    Misc
// @namespace   pl.enux.iitc
// @version     0.0.3
// @description [0.0.3] Extras portal-search types mostly for FS puzzles
// @match       https://*.ingress.com/intel*
// @match       http://*.ingress.com/intel*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @match       https://intel.ingress.com/*
// @match       https://intel.ingress.com/*
// @grant       none
// ==/UserScript==

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
/* global addHook, ExactSearch, AccentLessSearch */

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

		// add new exact search
		var iitcAccentLessSearch = new AccentLessSearch();
		function accentLessSearch(query) {
			iitcAccentLessSearch.find(query);
		}
		addHook('search', accentLessSearch);
	}
}
/* eslint-disable no-undef */

// WARNING!!! Change `puzzleSearchExtras` to a unique code name of the plugin.

let myPlugin = new MyPlugin('puzzleSearchExtras');

// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//use own namespace for plugin
window.plugin.puzzleSearchExtras = myPlugin;

//////////////////////////////////////////////////////////////////////
//WRAPPER START //////////////////////////////////////////////////////

/**
 * IITC plugin wrapper.
 * 
 * Note! The `wrapper` is injected directly to the Ingress Intel web page.
 * That is why you need to use `window.plugin.puzzleSearchExtras` at least for hooks setup.
 */
function wrapper(plugin_info) {

	//////////////////////////////////////////////////////////////////////
	//PLUGIN START ///////////////////////////////////////////////////////

	/**
	 * Some setup (when iitc is ready)
	 * 
	 * See notes for the wrapper!
	 */
	function setup() {
		console.log('puzzleSearchExtras - init')
		window.plugin.puzzleSearchExtras.setup();
	}

	//PLUGIN END /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////

	setup.info = plugin_info; //add the script info data to the function as a property
	if(!window.bootPlugins) window.bootPlugins = [];
	window.bootPlugins.push(setup);
	// if IITC has already booted, immediately run the 'setup' function
	if(window.iitcLoaded && typeof setup === 'function') setup();
}

//WRAPPER END ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);