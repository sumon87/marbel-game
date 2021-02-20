var MarbleSmash = MarbleSmash || {};


MarbleSmash.MainMenu = function (game) {


};

MarbleSmash.MainMenu.prototype = {

    create: function () {
    

        this.bg = game.add.image(0,-10,'ssheet','bg');

        this.glow = game.make.image(210,140,'ssheet','logo_glow2');
        this.glow.anchor.setTo(0.5,0.5);
        game.add.existing(this.glow);

        
        this.layer_0 = game.add.group();

        
        game.add.tween(this.glow).to({angle: 359.99},50000,Phaser.Easing.Linear.InOut,true,0,-1);

        this.logo = new Logo(140);

        //this.layer_0.add(this.glow);
        this.layer_0.add(this.logo);
        
        this.startButtons = game.add.group();
        this.playButton = new RoundButton(210,400,'button160x160','label_play',function() {
            this.disappearAppear(this.startButtons,this.modeGroup)
        },this);
        this.playButton.resize = function() {
            this.y = 400 + ((game.height-525)*0.5);
        }
        this.playButton.label.x += 7
        this.playButton.angle = -10;
        game.add.tween(this.playButton).to({angle:10},10000,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);
        game.add.existing(this.playButton);

        this.startButtons.add(this.playButton);
        



        this.modeGroup = game.add.group();
        this.modeGroup.freezeInput = function() {
            this.forEach(function(child) {
                child.inputEnabled = false;
            });
            game.time.events.add(1000,function() {
                this.forEach(function(child) {
                child.inputEnabled = true;
            });
            },this)
        }

        this.puzzleButton = new TextButton(210,0,'PUZZLE',50,'font',function() {
            this.disappearAppear(this.modeGroup,this.puzzleCategory);
        },this);    
        this.puzzleButton.setGroupToFreeze(this.modeGroup);
        this.timeAttackButton = new TextButton(210,90,'TIME ATTACK',50,'font', function() {
            this.goTo('TimeAttack');
        },this);
        this.timeAttackButton.setGroupToFreeze(this.modeGroup);

        this.highscore = game.make.bitmapText(210,132,'font_shadow','Highscore: '+SaveState.data.highscore.toString(), 30);
        this.highscore.anchor.setTo(0.5,0)

        this.modeGroup.addMultiple([this.timeAttackButton,this.puzzleButton,this.highscore]);
        this.modeGroup.alpha = 0;
        this.modeGroup.x = -420;
        this.modeGroup.y = 300;



        this.puzzleCategory = game.add.group();
        this.puzzleCategory.freezeInput = function() {
            this.forEach(function(child) {
                child.inputEnabled = false;
            });
            game.time.events.add(1000,function() {
                this.forEach(function(child) {
                child.inputEnabled = true;
            });
            },this)
        }
        this.veryEasyButton = new TextButton(210,0,'Very Easy',50,'font_shadow',function() {
            
            game.sfx.whoosh.play('',0,0.2);

            game.puzzle_category = 0;
            this.puzzleCategory.freezeInput();
            this.levelLayer.init();
            this.disappearAppear(this.layer_0,this.layer_1);
            this.lockInput(this.puzzleCategory);
        },this);
        this.veryEasyButton.text.tint = 0x8DC63F;
        this.veryEasyButton.setGroupToFreeze(this.puzzleCategory);

        this.easyButton = new TextButton(210,60,'Easy',50,'font_shadow',function() {

            game.sfx.whoosh.play('',0,0.2);

            game.puzzle_category = 1;
            this.puzzleCategory.freezeInput();
            this.levelLayer.init();
            this.disappearAppear(this.layer_0,this.layer_1);
            this.lockInput(this.puzzleCategory);
        },this);
        this.easyButton.text.tint = 0xF2CE00;
        this.easyButton.setGroupToFreeze(this.puzzleCategory);

        this.mediumButton = new TextButton(210,120,'Medium',50,'font_shadow',function() {

            game.sfx.whoosh.play('',0,0.2);         

            game.puzzle_category = 2;
            this.puzzleCategory.freezeInput();
            this.levelLayer.init();
            this.disappearAppear(this.layer_0,this.layer_1);
            this.lockInput(this.puzzleCategory);
        },this);
        this.mediumButton.text.tint = 0xF7941E;
        this.mediumButton.setGroupToFreeze(this.puzzleCategory);

        this.hardButton = new TextButton(210,180,'Hard',50,'font_shadow',function() {

            game.sfx.whoosh.play('',0,0.2);

            game.puzzle_category = 3;
            this.puzzleCategory.freezeInput();
            this.levelLayer.init();
            this.disappearAppear(this.layer_0,this.layer_1);
            this.lockInput(this.puzzleCategory);
        },this);
        this.hardButton.text.tint = 0xEF4136;
        this.hardButton.setGroupToFreeze(this.puzzleCategory);


        this.backButton = new RoundButton(45,210,'button64x64','label_back',function() {
            this.disappearAppear(this.puzzleCategory,this.modeGroup);
        },this);
        this.backButton.freezeAfterBounce = 1500;

        this.backButton.label.x = -3;
        this.backButton.label.y = -3;
        

        this.puzzleCategory.addMultiple([this.veryEasyButton,this.easyButton,this.mediumButton,this.hardButton,this.backButton]);
        this.puzzleCategory.alpha = 0;
        this.puzzleCategory.x = -420;
        this.puzzleCategory.y = 270;
        this.puzzleCategory.resize = function() {
            this.y = 250+((game.height-525)*0.25)
            var spread = 60 + ((game.height-525)/10);
            this.getChildAt(1).y = spread;
            this.getChildAt(2).y = spread*2;
            this.getChildAt(3).y = spread*3;
            //backButton
            this.getChildAt(4).y = game.height-this.y-40; 
        }
        

        
        
        this.layer_0.addMultiple([this.startButtons,this.modeGroup,this.puzzleCategory]);

        
        this.layer_1 = game.add.group();


        this.levelLayer = new LevelLayer();

        
        this.layer_1.add(this.levelLayer);
        this.layer_1.alpha = 0;
        this.layer_1.x = -420;

        this.musicButton = new RoundButton(30,30,'button48x48','label_music',function() {
            game.sound.mute = !game.sound.mute;
            SaveState.data.sound_mute = game.sound.mute;
            SaveState.save();   
        },this);

        this.musicButton.update = function() {
            if (game.sound.mute) {
                this.alpha = Math.max(0.5,this.alpha-0.03);
            }else {
                this.alpha = Math.min(1,this.alpha+0.03);
            }
        }
        this.musicButton.label.x = -2;
        this.musicButton.label.y = -4;
        game.add.existing(this.musicButton);


        if (typeof(game.last_room) === 'undefined') {
            game.add.tween(this.glow).from({alpha: 0},2500,Phaser.Easing.Sinusoidal.Out,true);
            this.logo.startAnimation(1000);
            this.playButton.scale.setTo(0,0);
            game.add.tween(this.playButton.scale).to({x:1,y:1},1000,Phaser.Easing.Elastic.Out,true,3000);
            game.time.events.add(3000,function() {
                game.sfx.whoosh_fast.play();
            })

        }else {

            if (game.last_room == 'puzzle') {
                this.logo.cache();
                this.layer_0.x = -420;
                this.layer_0.alpha = 0;

                this.layer_1.x = 0;
                this.layer_1.alpha = 1;
                this.levelLayer.init();

                this.startButtons.alpha = 0;
                this.startButtons.x = -420;
                this.lockInput(this.startButtons);

                this.modeGroup.alpha = 0;
                this.modeGroup.x = -420;
                this.lockInput(this.modeGroup);

                this.puzzleCategory.x = 0;
                this.puzzleCategory.alpha = 1;

            }

            if (game.last_room == 'timeAttack') {
                this.logo.cache();
                this.startButtons.alpha = 0;
                this.startButtons.x = -420;
                this.lockInput(this.startButtons);

                this.modeGroup.alpha = 1;
                this.modeGroup.x = 0;
            }

            

        }


        this.fade_white = game.add.graphics();
        this.fade_white.beginFill(0xFFFFFF);
        this.fade_white.drawRect(0,0,420,game.height);
        this.fade_white.endFill();
        game.add.tween(this.fade_white).to({alpha: 0}, 300, Phaser.Easing.Quadratic.Out,true);

        this.resize();

    },

    update: function () {

        if (this.layer_1.x == 0) {
            this.glow.alpha = Math.max(0.5,this.glow.alpha-0.03);
        }else {
            this.glow.alpha = Math.min(1,this.glow.alpha+0.03);
        }

    },

    goTo: function(state) {
        game.sfx.transition.play();
        game.add.tween(this.fade_white).to({alpha: 1},300,Phaser.Easing.Quadratic.In,true).onComplete.add(function() {
            game.state.start(state);   
        })
    },

    disappearAppear: function(to_hide,to_reveal) {

        game.add.tween(to_hide).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true,200).onComplete.add(function() {
                to_hide.x = -420
        },this);
        this.lockInput(to_hide);

        this.unlockInput(to_reveal);

        to_reveal.x = 0;
        game.add.tween(to_reveal).to({alpha: 1},500, Phaser.Easing.Sinusoidal.InOut,true,500);

    },

    resize: function() {
        
        this.bg.height = game.height+10;

        this.modeGroup.y = 300 + ((game.height-525)*0.30);

        this.playButton.resize();
        this.puzzleCategory.resize();
        this.levelLayer.resize();

        this.fade_white.clear();
        this.fade_white.beginFill(0xFFFFFF);
        this.fade_white.drawRect(0,0,420,game.height);
        this.fade_white.endFill();

    },

    lockInput: function(group) {
        group.forEach(function(child) {
            if (typeof(child.onInputUp) === 'undefined') return;
            child.onInputUp.active = false;
        })
    },

    unlockInput: function(group) {
        group.forEach(function(child) {
            if (typeof(child.onInputUp) === 'undefined') return;
            child.onInputUp.active = true;
        })
    },


    shutdown: function() {

        this.bg.destroy();
        this.glow.destroy();
        this.layer_0.destroy();
        this.modeGroup.destroy();
        this.puzzleCategory.destroy();
        this.layer_1.destroy();
        this.musicButton.destroy();
        this.fade_white.destroy();

    },

    render: function() {
        //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
        
    }

};