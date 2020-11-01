// ==UserScript==
// @author      Eccenux
// @name        IITC plugin: Search extras for FS puzzles
// @id          iitc-plugin-search-extras
// @category    Misc
// @namespace   pl.enux.iitc
// @version     0.0.1
// @description [0.0.1] Search extras for FS puzzles
// @match       https://*.ingress.com/intel*
// @match       http://*.ingress.com/intel*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @match       https://intel.ingress.com/*
// @match       https://intel.ingress.com/*
// @grant       none
// ==/UserScript==

/**
 * Main plugin class.
 */
class MyPlugin {
	constructor (codeName) {
		this.codeName = codeName;
	}

	setup() {
		console.log('MyPlugin setup', this.codeName);
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