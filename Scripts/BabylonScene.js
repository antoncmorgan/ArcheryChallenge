/*********************************************************************
 BabylonScene.js
   Functions for the core scene elements, loading, setup,
   and the manipulation of the scene, including the logicLoop().
*********************************************************************/

//Helpful Info
// X Z are analogous to x and y cartesian coor.
/// 'site.js'
/// 'BabylonMechanics.js'
/// 'input.js'
/// 'timeLoop.js'

Game.CreateStartScene = function() {
    //Creation of the scene 
    var scene = new BABYLON.Scene(Game.engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;
	scene.isErrthingReady = false;
    
    //Adding an Arc Rotate Camera
    //var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
    var Alpha = 3*Math.PI/2;
    var Beta = 0.00000001;
    scene.camera = new BABYLON.ArcRotateCamera("Camera", Alpha, Beta, 40, new BABYLON.Vector3.Zero(), scene);
	scene.camera.attachControl(Game.canvas, true);
    // //set camera to not move
    scene.camera.lowerAlphaLimit = Alpha;
    scene.camera.upperAlphaLimit = Alpha;
    scene.camera.lowerBetaLimit = Beta;
    scene.camera.upperBetaLimit = Beta;
    
	scene.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
	scene.ambientLight.diffuse = new BABYLON.Color3(.98, .95, .9);
	scene.ambientLight.specular = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.groundColor = new BABYLON.Color3(.1, .1, .1);
	scene.ambientLight.intensity = .1;
	
	scene.light= new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 20, 0), scene);
	scene.light.diffuse = new BABYLON.Color3(.18, .15, .1);
	scene.light.specular = new BABYLON.Color3(0, 0, 0);
	
	scene.isLoaded=false;
	
	/******************************************************/
	/*START - STUB CODE*/
	
	//create Asset Manager
	scene.assetsManager = new BABYLON.AssetsManager(scene);
	scene.assetsManager.useDefaultLoadingScreen=false;
	
	//create Asset Tasks
	scene.playerTask = scene.assetsManager.addMeshTask("playerTask", "", "./Assets/", "target-01.b.js");
		
	//Set functions to assign loaded meshes
	scene.playerTask.onSuccess = function (task) {
		//stub function
	}
	
	//Set up Scene after all Tasks are complete
	scene.assetsManager.onFinish = function (tasks) {
		scene.isLoaded=true;
	};
	
	//Load all tasks
	scene.assetsManager.load();

	scene.logicLoop = function () {
		var self = scene;
		switch (Game.engine.loopCounter) {   
			case 500:
				Game.engine.loopCounter=0;
				break;
			default:
				Game.engine.loopCounter++;
				break;
		}
		$('#lps').text('LPS: ' + timedLoop.getLoopTime().toFixed());
		$('#fps').text('FPS: ' + Game.engine.getFps().toFixed());
		//Game.processEnemies(self);
		//processInput(self.player, self.player.speed);
	};
	
	scene.moveMeshes = function () {
		//stub function
	}
	
    scene.registerBeforeRender(function(){
		scene.moveMeshes();
	});
	
	/******************************************************/
	/*END - STUB CODE*/

    return scene;

}

Game.CreateGameScene = function() {
    //Creation of the scene 
    var scene = new BABYLON.Scene(Game.engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
	scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
	scene.collisionsEnabled = true;
	scene.isErrthingReady = false;
	
	// Create Cameras
	Game.cameras(scene);
	Game.cameras.init();
    Game.initPointerLock(scene.activeCamera);
	
	scene.ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 20, 0), scene);
	scene.ambientLight.diffuse = new BABYLON.Color3(.98, .98, .98);
	scene.ambientLight.specular = new BABYLON.Color3(0, 0, 0);
	// scene.ambientLight.groundColor = new BABYLON.Color3(.2, .2, .2);
	scene.ambientLight.intensity = 1.75;
	
	scene.ambientLight2 = new BABYLON.HemisphericLight("ambientLight2", new BABYLON.Vector3(0, -20, 0), scene);
	scene.ambientLight2.diffuse = new BABYLON.Color3(.98, .98, .98);
	scene.ambientLight2.specular = new BABYLON.Color3(0, 0, 0);
	scene.ambientLight2.intensity = .15;
    
    // scene.sunlight = new BABYLON.DirectionalLight("sunlight", new BABYLON.Vector3(-100, -100, -100), scene);
	
	// scene.light = new BABYLON.HemisphericLight("Omni", new BABYLON.Vector3(5, 0, 0), scene);
	// scene.light.diffuse = new BABYLON.Color3(.98, .98, .98);
	// scene.light.specular = new BABYLON.Color3(0, 0, 0);
	
	scene.isLoaded=false;

	/***Helper Functions*****/
	scene.applyOutline = function(mesh, lineWidthMod, apply) {
		mesh.renderOutline = (apply === undefined) ? false : apply;
		mesh.outlineColor = new BABYLON.Color3(0.01,0.01,0.01);

		lineWidthMod = (lineWidthMod === undefined) ? .25 : lineWidthMod;
		mesh.outlineWidth *= lineWidthMod;
	}
	 // Helper functions for creating Environment
	// Use instances instead of clones, since material does not change, but only position, scaling and rotation
	scene.instanceWithChildren = function(parentMesh, baseName, scene, index) {
		index === undefined ? index = 0 : index;
		var childMeshes = parentMesh.getChildren();
		var parentInstance = parentMesh.createInstance(baseName + '-' + index);
		var childInstances = [];
		for (var i_child = 0; i_child < childMeshes.length; i_child++){
			var childMesh = scene.getMeshByName(childMeshes[i_child].name);
			var newChildIndex = childInstances.push(childMesh.createInstance(baseName + '-' + index + '.' + childMeshes[i_child].name)) - 1;
			// Link instance to parent instance and keep the properties of the child mesh
			childInstances[newChildIndex].parent = parentInstance;
			childInstances[newChildIndex].checkCollisions = childMesh.checkCollisions;
			childInstances[newChildIndex].isVisible = childMesh.isVisible;
		}
		return parentInstance;
	}
	
	/******************************************************/
	/*START - STUB CODE*/
	
	//create Asset Manager
	scene.assetsManager = new BABYLON.AssetsManager(scene);
	scene.assetsManager.useDefaultLoadingScreen=false;
	Game.initAssetHelper(scene);
	
	//create Asset Tasks
    // Meshes
	scene.bowModelTask = scene.assetsManager.addMeshTask("bowModelTask", "", "./Assets/", "longBowCenteredwArrow.b.js");
	scene.arrowModelTask = scene.assetsManager.addMeshTask("arrowModelTask", "", "./Assets/", "arrow_wood-01.b.js");
	scene.targetModelTask = scene.assetsManager.addMeshTask("targetModelTask", "", "./Assets/", "target-Normal.b.js");
    scene.targetOneShotModelTask = scene.assetsManager.addMeshTask("targetOneShotModelTask", "", "./Assets/", "target-OneShot.b.js");
	scene.treeModelTask = scene.assetsManager.addMeshTask("treeModelTask", "", "./Assets/", "tree-04.b.js");
	// scene.tree2ModelTask = scene.assetsManager.addMeshTask("tree2ModelTask", "", "./Assets/", "tree-02.b.js");
	scene.fenceModelTask = scene.assetsManager.addMeshTask("fenceModelTask", "", "./Assets/", "fence.b.js");
	scene.rock01ModelTask = scene.assetsManager.addMeshTask("rock01ModelTask", "", "./Assets/", "rock-01.b.js");
	scene.rock03ModelTask = scene.assetsManager.addMeshTask("rock03ModelTask", "", "./Assets/", "rock-03.b.js");
	scene.rock04ModelTask = scene.assetsManager.addMeshTask("rock04ModelTask", "", "./Assets/", "rock-04.b.js");
    // Sounds
	scene.bowShotTask = scene.assetsManager.addBinaryFileTask("bowShotTask", "./Audio/Bow_Shot_Sound.wav");
	scene.arrowHitTask = scene.assetsManager.addBinaryFileTask("arrowHitTask", "./Audio/Target_Hit-03.wav");
		
	//Set functions to assign loaded meshes
	scene.bowModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.bowMesh = task.loadedMeshes[0];
		scene.bowArrowMesh = task.loadedMeshes[1];
		scene.bowMesh.skeletons = task.loadedSkeletons[0];
		scene.bowArrowMesh.parent = scene.bowMesh;
		scene.bowArrowMesh.isVisible = true;
		
		//-- Manipulate model --/
		scene.bowMesh.scaling = new BABYLON.Vector3(2, 2, 2);
		scene.bowMesh.material.ambientColor = new BABYLON.Color3(.1, .1, .1);
		scene.bowMesh.material.subMaterials[0].diffuseColor = new BABYLON.Color3(.5, .5, .5);
		// scene.bowMesh.material.subMaterials[1].diffuseColor = new BABYLON.Color3(.5, .5, .5);
		scene.applyOutline(scene.bowMesh, undefined, true);
		scene.applyOutline(scene.bowArrowMesh, .1, true);
		//create Animation functions
		scene.bowMesh.drawArrow = function () {
			if (scene.bowMesh.animatable) {
				scene.bowMesh.animatable.stop();
			}
			scene.bowMesh.animatable = {};
			scene.bowMesh.animatable = scene.beginAnimation(scene.bowMesh.skeletons, 0, 40, false, 1, function () {
				// scene.arrowMeshes[scene.activeArrow].arrowDrawing = false;
			});
		}
		scene.bowMesh.shootArrow = function () {
			var completionRatio = 1; // used to calculate initial speed of arrow and start frame of shoot animation
			if (scene.bowMesh.animatable) {
				var lengthOfAnim = scene.bowMesh.animatable.toFrame - scene.bowMesh.animatable.fromFrame;
				// _animations represents each bone, which are all animating for the bow there are currently 9 bones, using 0 will be good
				completionRatio = scene.bowMesh.animatable._animations[0].currentFrame / lengthOfAnim;
				scene.bowMesh.animatable.stop();
			}
			scene.bowMesh.animatable = {};
			scene.arrowMeshes[scene.activeArrow].speed = 60*3*completionRatio;
			scene.bowMesh.animatable = scene.beginAnimation(scene.bowMesh.skeletons, 105 - 5*(completionRatio), 105, false, 2, function () {
				scene.arrowMeshes[scene.activeArrow].isVisible = true;
				scene.bowArrowMesh.isVisible = false;
                scene.activeCamera.rotation.y += (Math.random() > 0.5) ? (0.01 + Math.random()*.02) : (-Math.random()*.02 - 0.01);
			});
		}
	}
	scene.arrowModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.arrowMesh = task.loadedMeshes[1];
        scene.imposterArrowTip = task.loadedMeshes[0];
        scene.imposterArrowTip.parent = scene.arrowMesh;
        scene.imposterArrowTip.isVisible = false;
		
		//-- Manipulate model --/
		scene.arrowMesh.scaling = new BABYLON.Vector3(2, 2, 2);
		scene.arrowMesh.isVisible = false;
		scene.applyOutline(scene.arrowMesh, .1);
	}
	
	scene.targetModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.targetMesh = task.loadedMeshes[0];
		
		//-- Manipulate model --/
		scene.targetMesh.scaling = new BABYLON.Vector3(3, 3, 3);
		scene.targetMesh.rotation = new BABYLON.Vector3(0, 0, 0);
		scene.targetMesh.position = new BABYLON.Vector3(0, 6, -15);
		scene.applyOutline(scene.targetMesh);
	}
	scene.targetOneShotModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.targetOneShotMesh = task.loadedMeshes[0];
		
		//-- Manipulate model --/
		scene.targetOneShotMesh.scaling = new BABYLON.Vector3(3, 3, 3);
		scene.targetOneShotMesh.rotation = new BABYLON.Vector3(0, 0, 0);
		scene.targetOneShotMesh.position = new BABYLON.Vector3(0, 6, 20);
		scene.applyOutline(scene.targetOneShotMesh);
        scene.targetOneShotMesh.isVisible = false;
	}
	
    // Environment Meshes
	scene.treeModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.treeMesh = task.loadedMeshes[4];
		scene.treeLeavesMesh = [];
        for (var i_tree = 0; i_tree < 4; i_tree++) {
            scene.treeLeavesMesh.push(task.loadedMeshes[i_tree]);
            scene.treeLeavesMesh[i_tree].parent = scene.treeMesh;
            scene.applyOutline(scene.treeLeavesMesh[i_tree], .5);
        }
        
        scene.imposterTrunk = BABYLON.Mesh.CreateCylinder("imposterTrunk", 10, 0.5, 0.5, 6, 1, scene, false);
		scene.imposterTrunk.parent = scene.treeMesh;
        scene.imposterTrunk.isVisible = false;
        scene.imposterTrunk.position.y = 3;
		
		scene.treeMesh.material.diffuseColor.r*=1;
		scene.treeMesh.material.diffuseColor.g*=1.6;
		scene.treeMesh.material.diffuseColor.b*=1.8;
		
		//-- Manipulate model --/
		scene.treeMesh.scaling = new BABYLON.Vector3(3, 3, 3);
		scene.treeMesh.position = new BABYLON.Vector3(20, 0, 40);
		scene.applyOutline(scene.treeMesh);
	}
    scene.fenceModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		scene.fenceMesh = task.loadedMeshes[3];
		scene.fenceMeshes = [];
		scene.fenceMeshes.push(task.loadedMeshes[1]);
		scene.fenceMeshes[0].parent = scene.fenceMesh;
		scene.applyOutline(scene.fenceMeshes[0]);
		scene.fenceMeshes.push(task.loadedMeshes[2]);
		scene.fenceMeshes[1].parent = scene.fenceMesh;
		scene.applyOutline(scene.fenceMeshes[1]);
        
        task.loadedMeshes[0].isVisible = false;
        
		//-- Manipulate model --/
		scene.fenceMesh.material.diffuseColor.r*=1.4;
		scene.fenceMesh.material.diffuseColor.g*=1.8;
		scene.fenceMesh.material.diffuseColor.b*=2;
		scene.fenceMesh.scaling = new BABYLON.Vector3(5, 4, 5);
		scene.fenceMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
		scene.fenceMesh.position = new BABYLON.Vector3(0, 0, -40);
        scene.fenceMesh.checkCollisions = true;
        scene.fenceMeshes[0].checkCollisions = true;
        scene.fenceMeshes[1].checkCollisions = true;
		scene.applyOutline(scene.fenceMesh);
    }
    scene.rockMesh = [];
    scene.rock01ModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		var index = scene.rockMesh.push(task.loadedMeshes[0]) - 1;
        
		//-- Manipulate model --/
		scene.rockMesh[index].scaling = new BABYLON.Vector3(3, 3, 3);
		scene.rockMesh[index].position = new BABYLON.Vector3(-20, 0, 10);
		scene.applyOutline(scene.rockMesh[index]);
    }
    scene.rock03ModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		var index = scene.rockMesh.push(task.loadedMeshes[0]) - 1;
        
		//-- Manipulate model --/
		scene.rockMesh[index].scaling = new BABYLON.Vector3(3, 3, 3);
		scene.rockMesh[index].position = new BABYLON.Vector3(0, 0, 40);
		scene.applyOutline(scene.rockMesh[index]);
    }
    scene.rock04ModelTask.onSuccess = function(task) {
		//-- Load known meshes from model --//
		var index = scene.rockMesh.push(task.loadedMeshes[0]) - 1;
        
		//-- Manipulate model --/
		scene.rockMesh[index].scaling = new BABYLON.Vector3(3, 3, 3);
		scene.rockMesh[index].position = new BABYLON.Vector3(30, 0, 30);
		scene.applyOutline(scene.rockMesh[index]);
    }
	
	// On success Audio Tasks
	scene.audio = {};
	scene.bowShotTask.onSuccess = function (task) {
		scene.audio.bowShot = new BABYLON.Sound("BowShot", task.data, scene, function () {}, { loop: false });
	}
	scene.arrowHitTask.onSuccess = function (task) {
		scene.audio.targetHit = new BABYLON.Sound("targetHit", task.data, scene, function () {}, { loop: false });
	}
	
	// scene.octree = scene.createOrUpdateSelectionOctree(64, 2);
	// Set up Players
	scene.Players = [];
	scene.activePlayer = scene.Players.push(new Player({points: 0})) - 1;
    scene.isfloatingScoreActive = false;
	//Set up Scene after all Tasks are complete
	scene.assetsManager.onFinish = function (tasks) {
		// If audio is not working (seems to be something wrong with Chrome and BJS?)
		if (scene.audio.bowShot == undefined) {
			scene.audio.bowShot = new Howl({
				urls: ['./Audio/Bow_Shot_Sound.wav']
			});
		}
		if (scene.audio.targetHit == undefined) {
			scene.audio.targetHit = new Howl({
				urls: ['./Audio/Target_Hit-03.wav']
			});
		}
		
		// Create Skybox
		scene.skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
		scene.skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		scene.skyboxMaterial.backFaceCulling = false;
		scene.skyboxMaterial.disableLighting = true;
		scene.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		// scene.skyboxMaterial.diffuseColor = new BABYLON.Color3(.2, .6, 1);
		scene.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		scene.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./Textures/TropicalSunnyDay/TropicalSunnyDay", scene);
		scene.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		scene.skybox.material = scene.skyboxMaterial;
		scene.skybox.infiniteDistance = true;
		
		// Bind Bow Mesh to camera
		scene.bowMesh.parent = scene.activeCamera;
		// scene.bowMesh.position = new BABYLON.Vector3(.125, -.3, 3.1);
		// scene.bowMesh.rotation = new BABYLON.Vector3(-Math.PI/16, .05, -Math.PI/16);
		scene.bowMesh.position = new BABYLON.Vector3(.05, -.3, 3.1);
		scene.bowMesh.rotation = new BABYLON.Vector3(.02, 0, -Math.PI/16);
		
		Game.initArrows(scene);
		// Create First arrow
		scene.activeArrow = scene.createNewArrow();

		scene.ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "./Textures/heightmap_Valley.jpg", 800, 800, 30, 0, 100, scene, false, function (mesh) {
			scene.ground.material = new BABYLON.StandardMaterial("textureGround", scene);
			scene.ground.material.diffuseTexture = new BABYLON.Texture('./Textures/texture_Grass-03.jpg', scene);
			scene.ground.material.diffuseTexture.uScale=16;
			scene.ground.material.diffuseTexture.vScale=16;
			// scene.ground.material.diffuseColor = new BABYLON.Color3(.01, .1, .01);
			scene.ground.checkCollisions = true;
			scene.activeCamera.checkCollisions = true;
			scene.activeCamera.ellipsoid = new BABYLON.Vector3(10, 4, 10);
		});
		// scene.ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 2, scene);
        scene.imposterTrunk.checkCollisions = true;
		
		// Generate some random trees
		scene.generateTrees();
        
        // Set up the fence
		scene.fenceMeshes = [];
        var xMult = 9;
        var xOffset = xMult/2;
        scene.fenceMesh.position = new BABYLON.Vector3(xOffset, 0, -40);
        var newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, 0)) - 1; // create new Fence
		scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3(-(newFenceIndex + 1)*xMult + xOffset, 0, -40);
        for (var i=0; i < 10; i++) {
            newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, (newFenceIndex + 1))) - 1; // create new Fence
            scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3(-(newFenceIndex + 1)*xMult + xOffset, 0, -40);
        }
        
		newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, (newFenceIndex + 1))) - 1; // create new Fence
        var rightStart = newFenceIndex;
		scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3((newFenceIndex - rightStart + 1)*xMult + xOffset, 0, -40);
        for (var i=0; i < 14; i++) {
            newFenceIndex = scene.fenceMeshes.push(scene.instanceWithChildren(scene.fenceMesh, 'fenceClone', scene, (newFenceIndex + 1))) - 1; // create new Fence
            scene.fenceMeshes[newFenceIndex].position = new BABYLON.Vector3((newFenceIndex - rightStart + 1)*xMult + xOffset, 0, -40);
        }
		
		// // Set up Collisions
		// scene.player.mesh.checkCollisions = true;
		// scene.player.mesh.isVisible = true;
		// scene.player.mesh.ellipsoid = new BABYLON.Vector3(3, .1, 3);
		// scene.player.mesh.ellipsoidOffset = new BABYLON.Vector3(0, .2, 0);
		
		// //Set the ellipsoid around the camera (e.g. your player's size)
		// scene.player.weaponMesh.parent = scene.player.mesh;
		// // Assign Rotation Offset
		// scene.player.mesh.rotationOffset = new BABYLON.Vector3(0,0,0);
		// scene.player.mesh.previousRotation = scene.player.mesh.rotation.y;
		
		// scene.player.mesh.playerAnimations = new Game.importedAnimations(scene.player);
		// scene.player.mesh.playerAnimations.init(scene);
		
        // Apply Gravity and shadows
		// scene.enablePhysics();
		// scene.setGravity(new BABYLON.Vector3(0, -10, 0));
		scene.activeCamera.applyGravity = true;
		
        // scene.shadowGenerator = new BABYLON.ShadowGenerator(1024, scene.sunlight);
        // scene.shadowGenerator.useVarianceShadowMap = true;
        // for (var i_shadows=0; i_shadows < scene.meshes.length; i_shadows++) {
        //     if (scene.meshes[i_shadows].isVisible) {
        //         scene.shadowGenerator.getShadowMap().renderList.push(scene.meshes[i_shadows]);
        //     }
        // }
        // scene.ground.receiveShadows = true;
		
		scene.isLoaded=true;
	};
	
	//Load all tasks
	scene.assetsManager.load();
	
	if (Game.debug) {
		scene.joystick = {};
		scene.joystickAction = {};
		scene.joystick.deltaJoystickVector = new BABYLON.Vector2(0,0);
		scene.joystickAction._isPressed = false;
	}
	else if (Game.enableJoystick) {
		scene.joystick = new BABYLON.GameFX.VirtualJoystick(true,"white");
		scene.joystickAction = new BABYLON.GameFX.VirtualJoystick(false,"yellow");
	}

	scene.logicLoop = function () {
		var self = scene;
		switch (Game.engine.loopCounter) {   
			case 500:
				Game.engine.loopCounter=0;
				break;
			default:
				Game.engine.loopCounter++;
				break;
		}
		// $('#lps').text('LPS: ' + timedLoop.getLoopTime().toFixed());
		$('#fps').text('FPS: ' + Game.engine.getFps().toFixed());
		//Game.processEnemies(self);
		// processInput(self.player, self.player.speed);
	};
	
	scene.cameraCounter = 0;
	scene.easingCounter = 0;
	scene.targetCounter = 0;
	scene.moveMeshes = function () {
		var self = scene;
		var i=0;
		var tempVal;
		var animationRatio = self.getAnimationRatio();
		
		var arrowRot = new BABYLON.Vector3(0,0,0);
		var activeArrowMesh = scene.arrowMeshes[scene.activeArrow];
		
		if (scene.Players[scene.activePlayer].arrows != 0) {
			if ((SpacebarState == KeyState.Down) && activeArrowMesh.arrowDrawing == false && activeArrowMesh.arrowFiring == false) {
				// This gets called once for drawing the arrow
				scene.bowMesh.drawArrow();
				SpacebarState = KeyState.Clear;
				activeArrowMesh.arrowDrawing = true;
				scene.easingCounter=0;
			}
			else if ((SpacebarState == KeyState.Up) && activeArrowMesh.arrowFiring == false && activeArrowMesh.arrowDrawing) {
				// This gets called once for shooting the arrow
				activeArrowMesh.currentCameraPos = new BABYLON.Vector3(1,1,1).multiply(scene.activeCamera.position);
				activeArrowMesh.currentCameraRot = new BABYLON.Vector3(1,1,1).multiply(scene.activeCamera.rotation);
				var arrowPos = activeArrowMesh.position;
				
				SpacebarState = KeyState.Clear;
				activeArrowMesh.arrowDrawing = false;
				scene.Players[scene.activePlayer].arrowFired();
				$('#arrowInfo').html('x ' + pad(scene.Players[scene.activePlayer].arrows,2));
				
				scene.bindActionToArrow(scene.activeArrow); // Create onIntersectMesh Action
				scene.audio.bowShot.play(); // Play Shooting sound
				
				arrowRot = activeArrowMesh.rotation;
                var worldMat = activeArrowMesh.getWorldMatrix();
                var newTranslation = new BABYLON.Vector3();
                var newQuaterion = new BABYLON.Quaternion();
                var newScale = new BABYLON.Vector3();
                worldMat.decompose(newScale, newQuaterion, newTranslation);
				activeArrowMesh.parent = null;
				
				// Translate from local to global
				// activeArrowMesh.rotation = new BABYLON.Vector3(0, arrowRot.y + activeArrowMesh.currentCameraRot.y, arrowRot.z + activeArrowMesh.currentCameraRot.x);
				// var newPos = translateAlongVector(activeArrowMesh.currentCameraPos, arrowPos, activeArrowMesh.currentCameraRot.y, activeArrowMesh.currentCameraRot.x);
                
                activeArrowMesh.rotationQuaternion = newQuaterion;
                activeArrowMesh.initialRot = new BABYLON.Vector3(1,1,1).multiply(activeArrowMesh.rotation);
				activeArrowMesh.position = newTranslation;
				
				activeArrowMesh.arrowFiring = true;
				scene.bowMesh.shootArrow();
				// Make sure timer is not active, if it is kill it
				if (scene.timerId) {
					clearTimeout(scene.timerId);
				}
				scene.timerId = setTimeout(function () {
					if (scene.arrowMeshes[scene.activeArrow].arrowFiring) {
						scene.arrowMeshes[scene.activeArrow].arrowFiring = false;
						scene.arrowMeshes[scene.activeArrow].position.y = 0.0;
						// Create a new arrow
						if (scene.Players[scene.activePlayer].arrows != 0) {
							scene.activeArrow = scene.createNewArrow();
						}
                        else {
                            setTimeout(function () {
                                Game.startNextRound(scene.Players[scene.activePlayer], scene);
                            }, 2000);
                        }
					}
				}, 5000); // drop arrow after 5 seconds
			}
		}
		if (activeArrowMesh.arrowFiring) {
			// Handles the arrow firing
            var deltaTime = 1.0/Game.engine.getFps();
			var motion = calcProjectileMotion(activeArrowMesh.position.x, activeArrowMesh.position.y, activeArrowMesh.position.z, activeArrowMesh.speed, deltaTime, activeArrowMesh.currentCameraRot.y, activeArrowMesh.currentCameraRot.x);
			// var motion = calcProjectileMotion(activeArrowMesh.position.x, activeArrowMesh.position.y, activeArrowMesh.position.z, activeArrowMesh.speed, animationRatio, activeArrowMesh.rotation.y - Math.PI/1.999, activeArrowMesh.rotation.z - .02);
			activeArrowMesh.position.x = motion.x;
			activeArrowMesh.position.y = motion.y;
			activeArrowMesh.position.z = motion.z;
			activeArrowMesh.speed = motion.v;
		}
		
        if (Game.debug) {
            $('#debugInfo').html('Camera<br />rY: ' + scene.activeCamera.rotation.y + '<br />rX: ' + scene.activeCamera.rotation.x + '<br />X: ' + scene.activeCamera.position.x + '<br />Y: ' + scene.activeCamera.position.y + '<br />Z: ' + scene.activeCamera.position.z +
            '<br />Arrow<br />X: ' + activeArrowMesh.position.x + '<br />Y: ' + activeArrowMesh.position.y + '<br />Z: ' + activeArrowMesh.position.z +
            '<br />rX: ' + activeArrowMesh.rotation.x + '<br />rY: ' + activeArrowMesh.rotation.y + '<br />rZ: ' + activeArrowMesh.rotation.z);
        }
		
		// Move camera up and down to simulate breathing
		scene.cameraCounter += .01;
		scene.bowMesh.position.y += .0001*Math.cos(scene.cameraCounter);
		// scene.arrowMeshes[scene.activeArrow].position.y += .000025*Math.cos(scene.cameraCounter);
		// scene.arrowMeshes[scene.activeArrow].rotation.z += .000015*Math.sin(scene.cameraCounter - .4);
        
        if (scene.isfloatingScoreActive) {
            // keep score at previous arrow
            var screenCoords = BABYLON.Vector3.Project(scene.arrowMeshes[scene.activeArrow-1].position, BABYLON.Matrix.Identity(), scene.getTransformMatrix(), scene.activeCamera.viewport.toGlobal(Game.engine));
            $('.floatingHitScore').css({'left': ((screenCoords.x - 40) / window.devicePixelRatio) + 'px', 'top': ((screenCoords.y - (40 + scene.floatingTextCounter)) / window.devicePixelRatio) + 'px'});
            scene.floatingTextCounter += 1;
        }
        
		
		// scene.targetCounter += .01;
		// scene.targetMesh.position.z += .1*Math.cos(scene.targetCounter);
		
		//----For movement, this needs updated every frame, otherwise it would not update----//
		//tempVal = new BABYLON.Vector3(self.player.velocity.magnitude.x*animationRatio,self.player.velocity.magnitude.y*animationRatio,self.player.velocity.magnitude.z*animationRatio);
		// tempVal = self.player.velocity.magnitude.multiply(new BABYLON.Vector3(animationRatio,animationRatio,animationRatio));
		// self.player.mesh.moveWithCollisions(tempVal);
		
		if (KDown == true) {
			if (Game.preferences.cameraType != Game.cameraType.Normal) {
				Game.preferences.cameraType = Game.cameraType.Debug;
				// Game.cameras.switch(Game.cameraType.Debug);
			}
			else {
				Game.preferences.cameraType = Game.cameraType.Normal;
				// Game.cameras.switch(Game.cameraType.Normal);
			}
		}
	}
	
    scene.registerBeforeRender(function(){
		scene.moveMeshes();
	});
	
	/******************************************************/
	/*END - STUB CODE*/

    return scene;

}

this.getScale = function () {
    this.viewportScale = undefined;
    // Calculate viewport scale 
    this.viewportScale = screen.width / window.innerWidth;
    return this.viewportScale;
}

// This is for creating textures for native BJS objects
function createMaterials(activeScene) {
	//var activeScene = Game.scene[Game.activeScene];
	//Create me some textures
	var randomColor = new BABYLON.Color3(Game.getRandomInt(0,10)/10, Game.getRandomInt(0,10)/10, Game.getRandomInt(0,10)/10);
	// randomColor =  new BABYLON.Color3(0,0,0); // awesome black tiles
	activeScene.transportRingMaterial = function () {
		var fireTexture = new BABYLON.FireProceduralTexture("fire", 128, activeScene);
		fireTexture.fireColors = BABYLON.FireProceduralTexture.PurpleFireColors;
		
		$.extend(this,new BABYLON.StandardMaterial("transportRingMaterial", activeScene));
		this.diffuseTexture = fireTexture;
		this.opacityTexture = fireTexture;
	}
}
