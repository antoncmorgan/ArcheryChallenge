/*********************************************************************
 site.js 
   Entry point > calls $(document).ready() and creates Game variable
	-> BabylonMechanics.js sets up the Babylon render loops
	-> BabylonScene.js sets up the scene and all of the objects in it, including
	   the logic loop
	-> Everything else are helpers tha should get called inside the above
	
	Note: In order to load locally in Chrome, open it with security disabled.
	You can create a shortcut to this locally:
	"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security
*********************************************************************/

var onStartScreen=1;
var Game = new function () {
	this.debug = true;
	this.mapSize=2;
	this.map = {};
	this.canvas = document.getElementById("renderCanvas");
	this.engine = new BABYLON.Engine(this.canvas, true);
	//this.engine.renderEvenInBackground = false;
	this.engine.loopCounter = 0;
	this.scene = [];
	this.sceneType = {
		Start: 0,
		Game: 1
	};
	this.activeScene = this.sceneType.Game;
	this.ltArray = lookupTableATan2();
	this.activeRooms=0;
	this.difficultyLevel = 1;
	this.enemyCount = 0;
	this.bossCount = 0;
	
	this.performance = new function () {
		this.quality = 1;
		this.particleDensity;
		this.viewDistance = 200;
	}
}

$(document).ready(function () {
	// modal('Browser not supported. Download latest version of Chrome here: https://www.google.com/chrome/browser/');
	// Check support
	if (!BABYLON.Engine.isSupported()) {
		window.alert('Browser not supported.');
		//TO DO: Display a different screen
	} 
	else {
		//Game.map = Game.GenerateMap(Game.mapSize,Game.mapSize);
		Game.initStartScene();
		Game.initGameScene();
		// Resize
		window.addEventListener("resize", function () {
			// Game.scene[Game.activeScene].camera.aspectRatio = $( window ).width()/$( window ).height();
			// Game.scene[Game.activeScene].camera.orthoTop = Math.abs(1 - 1/scene.camera.aspectRatio)*scene.camera.magnification;
			// Game.scene[Game.activeScene].camera.orthoBottom = -Math.abs(1 - 1/scene.camera.aspectRatio)*scene.camera.magnification;
			// Game.scene[Game.activeScene].camera.orthoLeft = -Math.abs(1 - scene.camera.aspectRatio)*scene.camera.magnification;
			// Game.scene[Game.activeScene].camera.orthoRight = Math.abs(1 - scene.camera.aspectRatio)*scene.camera.magnification;
			Game.engine.resize();
		});
		Game.runRenderLoop();
	};
});

//function for modal pop-up
function modal(Html,okFunction,data) {

	alertBoxDefault = function () {
        var htmlTemplate = "<div class=\"btn-group\"> \
                    <button id=\"alertBox-Ok\" type=\"button\" class=\"btn btn-default btn-width btn-shadow\">Ok</button> \
                </div> \
                <div class=\"btn-group\"> \
                    <button id=\"alertBox-Cancel\" type=\"button\" class=\"btn btn-default btn-width btn-shadow\">Cancel</button> \
                </div>";

        return htmlTemplate;
    }

    $('#modalDiv').html(Html);

    //Fade in Div and foreground overlay
    $('#modal').fadeIn(100, function () {
        $('#modalButtons').html(alertBoxDefault());
        $('#modalCancel').click(function () {
            // Close alert Box
            $('#modal').fadeOut(50, function () {
                $('#modalDiv').html('');
            });
        });
        $('#modalConfirm').click(function () {
            var closeModal;
            if (okFunction != undefined) {
                closeModal = okFunction(data); // execute Callback function
                //Allows function to return a value to defer closing modal
                if (closeModal == undefined) {
                    closeModal = 1;
                }
            }
            // Close alert Box
            if (closeModal == 1) {
                $('#modal').fadeOut(50, function () {
                    $('#modalDiv').html('');
                });
            }
        });
    });
}
