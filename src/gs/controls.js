"use strict";

gs.controls = {
	init() {
		gs.controls.status = "stopped";
	},
	play() {
		if ( gs.controls.status !== "playing" ) {
			gs.controls.status = "playing";
			env.togglePlay
				? wa.grids.playMain()
				: wa.grids.playPattern( gs.currCmp.patternOpened );
			ui.controls.play();
			gs.controls._loopOn();
		}
	},
	pause() {
		if ( gs.controls.status === "playing" ) {
			gs.controls.status = "paused";
			wa.grids.stop();
			ui.controls.pause();
			gs.controls._loopOff();
		}
	},
	stop() {
		if ( gs.controls.status !== "stopped" ) {
			gs.controls.status = "stopped";
			wa.grids.stop();
			ui.controls.stop();
			gs.controls._loopOff();
		}
	},
	ended() {
		gs.controls.stop();
		( env.togglePlay
			? gs.controls.mainTime
			: gs.controls.patternTime )( 0 );
	},
	togglePlay() {
		ui.controls.togglePlay( env.togglePlay = !env.togglePlay );
		if ( gs.controls.status === "playing" ) {
			wa.grids.stop();
			env.togglePlay
				? wa.grids.playMain()
				: wa.grids.playPattern();
		}
	},
	mainTime( beat ) {
		if ( beat == null ) {
			return gs.controls._tmpMainTime || 0;
		}
		gs.controls._tmpMainTime = beat;
		ui.controls.mainTime( beat );
	},
	patternTime( beat ) {
		if ( beat == null ) {
			return gs.controls._tmpPatternTime || 0;
		}
		gs.controls._tmpPatternTime = beat;
		ui.controls.patternTime( beat );
	},

	// private:
	_loopOn() {
		gs.controls._loop();
	},
	_loopOff() {
		cancelAnimationFrame( gs.controls._frameId );
	},
	_loop() {
		var beat = wa.grids.currentTime();

		( env.togglePlay
			? ui.controls.mainTime
			: ui.controls.patternTime )( beat );
		gs.controls._frameId = requestAnimationFrame( gs.controls._loop );
	}
};
