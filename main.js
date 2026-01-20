const gameEngine = new GameEngine();
gameEngine.options = {
	debugging: false,
};

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./img/Guy.png");

var char;

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");


	gameEngine.init(ctx);

	let img = ASSET_MANAGER.getAsset("./img/Guy.png");
	let c = char = new AwesomeCharacter(gameEngine, img);
	c.position.y = 250;
	gameEngine.addEntity(c);

	gameEngine.start();
});
