const gameEngine = new GameEngine();
gameEngine.options = {
	debugging: false,
};

const imgName = "./img/Guy.png";

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload(imgName);

var char;

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");


	gameEngine.init(ctx);

	let img = ASSET_MANAGER.getAsset(imgName);
	let c = char = new AwesomeCharacter(gameEngine, img);
	c.position.y = 125;
	gameEngine.addEntity(c);

	gameEngine.start();
});
