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