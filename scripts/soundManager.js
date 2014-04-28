(function() {
	window.lobe = window.lobe || {};
	window.lobe.SoundManager = {};
	var self = window.lobe.SoundManager;

	self.preloadAudioClips = function () {

		// if (!createjs.Sound.initializeDefaultPlugins()) {return;}

	    var audioPath = "resources/";
	    var manifest = [
	        {id:"C4", src:"resources/scale_C4.wav"},
	        {id:"D4", src:"resources/scale_D4.wav"},
	        {id:"E4", src:"resources/scale_E4.wav"},
	        {id:"F4", src:"resources/scale_F4.wav"},
	        {id:"G4", src:"resources/scale_G4.wav"},
	        {id:"A4", src:"resources/scale_A4.wav"},
	        {id:"B4", src:"resources/scale_B4.wav"}
	    ];

		var queue = new createjs.LoadQueue();
		createjs.Sound.alternateExtensions = ["mp3"];
		queue.installPlugin(createjs.Sound);
		queue.loadFile({id:"C4", src:"resources/scale_C4.wav"});
	}

	self.handleComplete = function (event) {
		console.log('load complete!');
	    // This is fired for each sound that is registered.
	    // var instance = createjs.Sound.play("C4");  // play using id.  Could also use full source path or event.src.
	    // instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
	    // instance.volume = 0.5;
	}

}) ();