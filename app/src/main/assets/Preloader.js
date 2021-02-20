var MarbleSmash = MarbleSmash || {};


MarbleSmash.Preloader = function (game) {

};


MarbleSmash.Preloader.prototype = {

	preload: function () {

		this.launched = false;

		this.bg = game.add.image(0,-10,'loader_bg');
		this.bg.height = game.height+10;

		this.ball_emitter = game.add.emitter(0,0,40);
		this.ball_emitter.makeParticles(['loader_1','loader_2','loader_3','loader_4','loader_5']);
		  //this.emitter.start(false, 1000, 5);
		this.ball_emitter.gravity = 1000;
		this.ball_emitter.setXSpeed(-100, 100);
		this.ball_emitter.emitX = 210;
		this.ball_emitter.emitY = -20;
		this.ball_emitter.width = 400;
		this.ball_emitter.setScale(1, 1.5, 1, 1.5, 1500, Phaser.Easing.Sinusoidal.Out, false)
		this.ball_emitter.start(false, 1500, 250);


		this.cm_logo = game.add.image(220,10,'loader_cmlogo');
    	this.cm_logo.anchor.setTo(0.5,0);


		this.loading_bg = game.add.image(50,319,'loader_loadingbar_bg');

	    this.loading = game.add.image(50,319,'loader_loadingbar');
	    this.load.setPreloadSprite(this.loading);
	  
    	


    	this.fade_white = game.add.graphics();
        this.fade_white.beginFill(0xFFFFFF);
        this.fade_white.drawRect(0,0,420,1000);
        this.fade_white.endFill();
        this.fade_white.alpha = 0;

    	




		game.load.atlasJSONHash('ssheet','spritesheet.png','spritesheet.json');
		
		game.load.bitmapFont('font_shadow','font-shadow.png','font-shadow.txt',null,1);
		game.load.bitmapFont('font-lvl','font-lvl.png','font-lvl.txt',null,0);
		game.load.bitmapFont('font','font.png','font.txt',null,1);
		game.load.bitmapFont('font_hl','font_hl.png','font_hl.txt',null,1);


		game.load.audio('music',['music.ogg','music.mp3']);
    	game.load.audio('button',['button.mp3','button.ogg']);
    	game.load.audio('transition',['transition.mp3','transition.ogg']);
    	game.load.audio('whoosh',['whoosh.mp3','whoosh.ogg']);
    	game.load.audio('win',['win.mp3','win.ogg']);
    	game.load.audio('pop1',['pop1.mp3','pop1.ogg']);
    	game.load.audio('pop2',['pop2.mp3','pop2.ogg']);
    	game.load.audio('beep1',['beep1.mp3','beep1.ogg']);
    	game.load.audio('beep2',['beep2.mp3','beep2.ogg']);
    	game.load.audio('click',['click.mp3']);
    	game.load.audio('label_pop',['label_pop.mp3','label_pop.ogg']);
    	game.load.audio('powerup_spawn',['powerup_spawn.mp3','powerup_spawn.ogg']);
    	game.load.audio('whoosh_short',['whoosh_short.mp3','whoosh_short.ogg']);
    	game.load.audio('whoosh_fast',['whoosh_fast.mp3','whoosh_fast.ogg']);
    	game.load.audio('end_of_game',['end_of_game.mp3','end_of_game.ogg']);
    	game.load.audio('explosion',['explosion.mp3','explosion.ogg']);
    	game.load.audio('cash_register',['cash_register.mp3','cash_register.ogg','cash_register.m4a']);
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decode

		game.sfx = {};
	    game.sfx.music = game.add.audio('music',0.2,true);
	    game.sfx.button = game.add.audio('button',1,false);
	    game.sfx.transition = game.add.audio('transition',1,false);
	    game.sfx.whoosh = game.add.audio('whoosh',1,false);
	    game.sfx.win = game.add.audio('win',0.7,false);
	    game.sfx.end_of_game = game.add.audio('end_of_game',1,false);
	    game.sfx.whoosh_short = game.add.audio('whoosh_short',1,false);
	    game.sfx.whoosh_fast = game.add.audio('whoosh_fast',1,false);
	    game.sfx.explosion = game.add.audio('explosion',0.5,false);
	    game.sfx.click = game.add.audio('click',1,false);
	    game.sfx.label_pop = game.add.audio('label_pop',1,false);
	    game.sfx.powerup_spawn = game.add.audio('powerup_spawn',0.5,false);
	    game.sfx.cash_register = game.add.audio('cash_register',1,false);
	    game.sfx.beep1 = game.add.audio('beep1',1,false);
	    game.sfx.beep2 = game.add.audio('beep2',1,false);
	    game.sfx.pop = {
	    	pop1: game.add.audio('pop1',1,false),
	    	pop2: game.add.audio('pop2',1,false),

	    	play: function() {
	    		this['pop'+game.rnd.between(1,2)].play();
	    	}

	    }

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.launched) return;

		if (this.cache.isSoundDecoded('music')) {

			this.launched = true;
			game.sfx.music.play();
			game.sound.mute = SaveState.data.sound_mute;

			game.add.tween(this.fade_white).to({alpha: 1},300,Phaser.Easing.Quadratic.In,true).onComplete.add(function() {
            	game.state.start('MainMenu');  
        	})
			
			
		}
		
		

	},

	resize: function() {
		this.bg.height = game.height+10;
	},


	shutdown: function() {
		this.ball_emitter.destroy();
		this.loading_bg.destroy();
		this.loading.destroy();
		this.cm_logo.destroy();
		this.fade_white.destroy();
	}

};