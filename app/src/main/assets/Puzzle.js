var MarbleSmash = MarbleSmash || {};


MarbleSmash.Puzzle = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

MarbleSmash.Puzzle.prototype = {

    create: function () {

        game.last_room = 'puzzle';
        
        this.bg_group = game.add.group();

        this.bg = game.add.image(0,-10,'ssheet','bg');
        this.bg.height = game.height+10;

        this.bg_black = game.add.image(210,0,'ssheet','bg_black');
        this.bg_black.anchor.setTo(0.5,0);
        this.bg_black.alpha = 0.95;

        this.bg_group.add(this.bg);
        this.bg_group.add(this.bg_black);


        this.grid = new MarbleSmash.GameGrid();
        grid = this.grid;
        
        var resize_array = this.resizeGrid();
        
        this.grid.init((5+game.puzzle_category),(5+game.puzzle_category),resize_array[0],resize_array[1],true);
        this.grid.loadPuzzle(Puzzles[game.puzzle_category][game.puzzle_nr]);
        

        //game.input.onDown.add(this.clickProcess,this);
        this.clickBinding = game.input.onDown.add(this.grid.click,this.grid);
        this.resizeBgBlack();





        this.bottomButtons = game.add.group();
        this.bottomButtons.y = game.height-45;
        this.bottomButtons.x = 210;

        this.undoButton = new RoundButton(-145,0,'button64x64','label_undo',function() {
            if (this.grid.undo_index == 0) return;


                if (game.jsonSettings.cost_of_undo <= this.coins.coins) {
                    this.coins.removeMoney(game.jsonSettings.cost_of_undo);
                    game.partSystem.explodeMoney(this.bottomButtons.x-145,this.bottomButtons.y-5,game.jsonSettings.cost_of_undo);
                    this.grid.undo();
                    this.noMoreMovesTxt.hide();
                }else {
                    if (!this.noMoreCoinsTxt.visible && !this.noMoreMovesTxt.visible) {
                        this.noMoreCoinsTxt.visible = true;
                        this.noMoreCoinsTxt.alpha = 1;
                        this.noMoreCoinsTxt.popUpAnimation();
                        game.add.tween(this.noMoreCoinsTxt).to({alpha: 0},300,Phaser.Easing.Sinusoidal.InOut,true,1600).onComplete.add(function() {
                            this.noMoreCoinsTxt.visible = false;
                        },this)
                    }
                }
                



        },this);
        this.undoButton.label.y -= 6;
        this.undoButton.alpha = 0.5;


        this.restartButton = new RoundButton(0,-10,'button64x64','label_restart',function() {
            game.sfx.whoosh.play();
            this.grid.restart();
            this.noMoreMovesTxt.hide();
        },this);
        this.restartButton.label.y -= 4;

        this.hintButton = new RoundButton(145,0,'button64x64','label_hint',function() {
            if (this.grid.hint_available) {
                if (game.jsonSettings.cost_of_hint <= this.coins.coins) {

                    if (this.grid.hint()) {
                        this.coins.removeMoney(game.jsonSettings.cost_of_hint);
                        game.sfx.cash_register.play();
                        game.partSystem.explodeMoney(this.bottomButtons.x+145,this.bottomButtons.y-5,game.jsonSettings.cost_of_hint);

                    }

                }else {
                    if (!this.noMoreCoinsTxt.visible) {
                        this.noMoreCoinsTxt.visible = true;
                        this.noMoreCoinsTxt.alpha = 1;
                        this.noMoreCoinsTxt.popUpAnimation();
                        game.add.tween(this.noMoreCoinsTxt).to({alpha: 0},300,Phaser.Easing.Sinusoidal.InOut,true,1600).onComplete.add(function() {
                            this.noMoreCoinsTxt.visible = false;
                        },this)
                    }
                }
                
            }
        },this);
        this.hintButton.label.y -= 2;

        this.bottomButtons.addMultiple([this.undoButton,this.restartButton,this.hintButton]);

        


        this.grid.allCleared.add(this.win, this);

        this.grid.noMoreMoves.add(function() {
            this.noMoreMovesTxt.show();
        },this);


        this.noMoreCoinsTxt = new MLbitmapText(210,this.grid.marbleGroup.y+((this.grid.height*this.grid.tilesize)*0.5),'You have no coins!',400,400,'font_shadow',30);
        this.noMoreCoinsTxt.visible = false;

        this.noMoreMovesTxt  = new MLbitmapText(210,this.grid.marbleGroup.y+((this.grid.height*this.grid.tilesize)*0.5)-10,'NO MORE MOVES!',400,400,'font_shadow',60);
        this.noMoreMovesTxt.tweenArray = JSON.parse("[9.998476951563912,9.993908270190957,9.986295347545738,9.975640502598242,9.961946980917455,9.945218953682733,9.92546151641322,9.902680687415703,9.876883405951379,9.84807753012208,9.81627183447664,9.781476007338057,9.743700647852352,9.702957262759965,9.659258262890683,9.612616959383189,9.563047559630355,9.510565162951535,9.455185755993169,9.396926207859083,9.335804264972017,9.271838545667872,9.205048534524403,9.135454576426008,9.063077870366499,8.98794046299167,8.910065241883679,8.829475928589268,8.746197071393958,8.660254037844386,8.571673007021122,8.480480961564258,8.38670567945424,8.290375725550415,8.191520442889917,8.090169943749475,7.986355100472928,7.88010753606722,7.77145961456971,7.660444431189781,7.547095802227721,7.431448254773945,7.313537016191707,7.193398003386513,7.071067811865478,6.946583704589976,6.819983600624989,6.691306063588586,6.560590289905077,6.427876096865397,6.293203910498378,6.156614753256587,6.0181502315204884,5.877852522924738,5.735764363510468,5.5919290347074755,5.446390350150279,5.299192642332057,5.150380749100549,5.000000000000009,4.848096202463379,4.694715627858919,4.539904997395476,4.383711467890783,4.226182617407001,4.06736643075801,3.9073112848927423,3.7460659341591267,3.5836794954530085,3.4202014332566915,3.255681544571571,3.0901699437494763,2.9237170472273704,2.756373558169991,2.5881904510252074,2.4192189559966772,2.2495105434386486,2.0791169081775918,1.9080899537654457,1.736481776669299,1.5643446504023029,1.391731009600651,1.2186934340514668,1.0452846326765268,0.8715574274765743,0.6975647374412439,0.5233595624294303,0.3489949670249999,0.1745240643728252,-1.0658141036401503e-14,-0.1745240643728465,-0.348994967025023,-0.5233595624294534,-0.697564737441267,-0.8715574274765956,-1.0452846326765517,-1.2186934340514917,-1.391731009600674,-1.564344650402326,-1.7364817766693204,-1.9080899537654687,-2.079116908177614,-2.249510543438671,-2.4192189559967012,-2.588190451025227,-2.7563735581700133,-2.92371704722739,-3.0901699437494994,-3.2556815445715905,-3.4202014332567146,-3.5836794954530298,-3.7460659341591462,-3.9073112848927654,-4.067366430758028,-4.2261826174070265,-4.383711467890803,-4.539904997395494,-4.694715627858937,-4.848096202463401,-5.000000000000032,-5.150380749100574,-5.299192642332077,-5.446390350150301,-5.591929034707501,-5.735764363510487,-5.87785252292476,-6.018150231520508,-6.156614753256605,-6.293203910498399,-6.427876096865415,-6.56059028990509,-6.691306063588598,-6.819983600625001,-6.946583704589987,-7.07106781186549,-7.193398003386523,-7.313537016191717,-7.431448254773954,-7.547095802227727,-7.660444431189788,-7.771459614569714,-7.880107536067225,-7.9863551004729345,-8.090169943749476,-8.191520442889917,-8.290375725550415,-8.386705679454238,-8.480480961564261,-8.571673007021122,-8.660254037844382,-8.746197071393954,-8.829475928589265,-8.910065241883672,-8.987940462991663,-9.063077870366495,-9.135454576426003,-9.205048534524394,-9.271838545667865,-9.335804264972012,-9.396926207859078,-9.45518575599316,-9.51056516295153,-9.563047559630348,-9.612616959383182,-9.659258262890674,-9.702957262759956,-9.743700647852343,-9.78147600733805,-9.816271834476634,-9.848077530122076,-9.876883405951371,-9.902680687415696,-9.925461516413215,-9.94521895368273,-9.96194698091745,-9.975640502598239,-9.986295347545738,-9.993908270190953,-9.998476951563909,-10,-10,-10,-10,-9.998476951563909,-9.993908270190953,-9.986295347545738,-9.975640502598239,-9.96194698091745,-9.94521895368273,-9.925461516413215,-9.902680687415696,-9.876883405951371,-9.848077530122076,-9.816271834476634,-9.78147600733805,-9.743700647852343,-9.702957262759956,-9.659258262890674,-9.612616959383182,-9.563047559630348,-9.51056516295153,-9.45518575599316,-9.396926207859078,-9.335804264972012,-9.271838545667865,-9.205048534524394,-9.135454576426003,-9.063077870366495,-8.987940462991663,-8.910065241883672,-8.829475928589265,-8.746197071393954,-8.660254037844382,-8.571673007021122,-8.480480961564261,-8.386705679454238,-8.290375725550415,-8.191520442889917,-8.090169943749476,-7.9863551004729345,-7.880107536067225,-7.771459614569714,-7.660444431189788,-7.547095802227727,-7.431448254773954,-7.313537016191717,-7.193398003386523,-7.07106781186549,-6.946583704589987,-6.819983600625001,-6.691306063588598,-6.56059028990509,-6.427876096865415,-6.293203910498399,-6.156614753256605,-6.018150231520508,-5.87785252292476,-5.735764363510487,-5.591929034707501,-5.446390350150301,-5.299192642332077,-5.150380749100574,-5.000000000000032,-4.848096202463401,-4.694715627858937,-4.539904997395494,-4.383711467890803,-4.2261826174070265,-4.067366430758028,-3.9073112848927654,-3.7460659341591462,-3.5836794954530298,-3.4202014332567146,-3.2556815445715905,-3.0901699437494994,-2.92371704722739,-2.7563735581700133,-2.588190451025227,-2.4192189559967012,-2.249510543438671,-2.079116908177614,-1.9080899537654687,-1.7364817766693204,-1.564344650402326,-1.391731009600674,-1.2186934340514917,-1.0452846326765517,-0.8715574274765956,-0.697564737441267,-0.5233595624294534,-0.348994967025023,-0.1745240643728465,-1.0658141036401503e-14,0.1745240643728252,0.3489949670249999,0.5233595624294303,0.6975647374412439,0.8715574274765743,1.0452846326765268,1.2186934340514668,1.391731009600651,1.5643446504023029,1.736481776669299,1.9080899537654457,2.0791169081775918,2.2495105434386486,2.4192189559966772,2.5881904510252074,2.756373558169991,2.9237170472273704,3.0901699437494763,3.255681544571571,3.4202014332566915,3.5836794954530085,3.7460659341591267,3.9073112848927423,4.06736643075801,4.226182617407001,4.383711467890783,4.539904997395476,4.694715627858919,4.848096202463379,5.000000000000009,5.150380749100549,5.299192642332057,5.446390350150279,5.5919290347074755,5.735764363510468,5.877852522924738,6.0181502315204884,6.156614753256587,6.293203910498378,6.427876096865397,6.560590289905077,6.691306063588586,6.819983600624989,6.946583704589976,7.071067811865478,7.193398003386513,7.313537016191707,7.431448254773945,7.547095802227721,7.660444431189781,7.77145961456971,7.88010753606722,7.986355100472928,8.090169943749475,8.191520442889917,8.290375725550415,8.38670567945424,8.480480961564258,8.571673007021122,8.660254037844386,8.746197071393958,8.829475928589268,8.910065241883679,8.98794046299167,9.063077870366499,9.135454576426008,9.205048534524403,9.271838545667872,9.335804264972017,9.396926207859083,9.455185755993169,9.510565162951535,9.563047559630355,9.612616959383189,9.659258262890683,9.702957262759965,9.743700647852352,9.781476007338057,9.81627183447664,9.84807753012208,9.876883405951379,9.902680687415703,9.92546151641322,9.945218953682733,9.961946980917455,9.975640502598242,9.986295347545738,9.993908270190957,9.998476951563912]")
        this.noMoreMovesTxt.visible = false;
        this.noMoreMovesTxt.tweenIndex = 0;
        this.noMoreMovesTxt.tweenArrayLength = this.noMoreMovesTxt.tweenArray.length;

        this.noMoreMovesTxt.update = function() {
            if (!this.visible) return;

            this.tweenIndex++;
            if (this.tweenIndex == this.tweenArrayLength) {
                this.tweenIndex = 0;
            }
            this.angle = this.tweenArray[this.tweenIndex];
        }

        this.noMoreMovesTxt.hide = function() {
            if (!this.visible) return;

             game.sfx.whoosh_fast.play();

            game.add.tween(this.scale).to({x:2,y:2},500,Phaser.Easing.Exponential.Out,true);
            game.add.tween(this).to({alpha: 0},500,Phaser.Easing.Exponential.Out,true).onComplete.add(function() {
                    this.visible = false;
                },this);
        }

        this.noMoreMovesTxt.show = function() {
            game.sfx.whoosh_short.play();
            this.tweenIndex = 30;
            this.scale.setTo(1,1);
            this.alpha = 1;
            this.visible = true;
            this.popUpAnimation();

        }


        


        this.fade_black = game.add.graphics();
        this.fade_black.beginFill(0x000000);
        this.fade_black.drawRect(0,0,420,game.height);
        this.fade_black.endFill();
        this.fade_black.alpha = 0;


        this.closeButton = new RoundButton(390,30,'button48x48','label_close_small',function() {
            this.goTo('MainMenu');
        },this);
        this.closeButton.label.y = -3;
        game.add.existing(this.closeButton);


        if (SaveState.data.tutorial_puzzle) {
            this.tutorial = new Tutorial();
            this.tutorial.startTutorial(true);
        }

        game.partSystem = new Particles();
        game.add.existing(game.partSystem);
        game.partSystem.resize(resize_array[0]);

        this.winGroup = game.add.group();
        this.winGroup.y = this.grid.marbleGroup.y+((this.grid.height*this.grid.tilesize)*0.5);
        this.win_buttons = game.add.group();
        this.win_buttons.x = 210;


        this.puzzleTxt = game.add.bitmapText(70,10,'font_shadow','Puzzle '+(game.puzzle_nr+1).toString(), 30);

        this.coins = new Coins(355,10);

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

        this.fade_white = game.add.graphics();
        this.fade_white.beginFill(0xFFFFFF);
        this.fade_white.drawRect(0,0,420,game.height);
        this.fade_white.endFill();
        game.add.tween(this.fade_white).to({alpha: 0}, 300, Phaser.Easing.Quadratic.Out,true);

        
    },

    update: function () {
       this.undoButton.alpha = (this.grid.undo_index == 0 || (this.noMoreMovesTxt.visible && game.jsonSettings.cost_of_hint > this.coins.coins)) ? Math.max(0.5,this.undoButton.alpha-0.02) : Math.min(1,this.undoButton.alpha+0.02);
       this.hintButton.alpha = this.grid.hint_available  ? Math.min(1,this.hintButton.alpha+0.02) : Math.max(0.5,this.hintButton.alpha-0.02);
    },

    goTo: function(state) {
        game.sfx.transition.play();
        game.add.tween(this.fade_white).to({alpha: 1},300,Phaser.Easing.Quadratic.In,true).onComplete.add(function() {
            game.state.start(state);   
        })
    },

    resize: function() {

        this.bg_group.cacheAsBitmap = false;

        this.bg.height = game.height+10;
        

        this.bottomButtons.y = game.height-45;

        var resize_array = this.resizeGrid();
        this.grid.resize(resize_array[0],resize_array[1]);
        this.noMoreMovesTxt.y = this.grid.marbleGroup.y+((this.grid.height*this.grid.tilesize)*0.5)-10;
        this.noMoreCoinsTxt.y = this.noMoreMovesTxt.y;
        this.resizeBgBlack();
        game.partSystem.resize(resize_array[0]);


        var center_of_field = this.grid.marbleGroup.y+((this.grid.height*this.grid.tilesize)*0.5)
        this.winGroup.y = center_of_field;
        this.win_buttons.y = center_of_field+120;


        this.noMoreCoinsTxt.y = this.grid.marbleGroup.y+((this.grid.height*this.grid.tilesize)*0.5);
        this.bg_group.cacheAsBitmap = true;

        this.fade_black.clear();
        this.fade_black.beginFill(0x000000);
        this.fade_black.drawRect(0,0,420,game.height);
        this.fade_black.endFill();

        this.fade_white.clear();
        this.fade_white.beginFill(0xFFFFFF);
        this.fade_white.drawRect(0,0,420,game.height);
        this.fade_white.endFill();


    },


    resizeGrid: function() {
        var margin_top = 75;
        var margin_bottom = 125;
        var margin_side = 20;

        var available_width = game.width-margin_side-margin_side;
        var available_height = game.height-margin_top-margin_bottom;

        var tilesize = Math.floor(Math.min(available_width,available_height)/(5+game.puzzle_category));
        var size_of_puzzles = tilesize*(5+game.puzzle_category);
        var yy = margin_top + Math.floor((available_height - size_of_puzzles)/2);

        return [tilesize,yy];
    },

    resizeBgBlack: function() {


        this.bg_black.scale.y = (this.grid.height*this.grid.tilesize)/(493-100);
        this.bg_black.scale.x = this.bg_black.scale.y;
        this.bg_black.y = this.grid.m_y-(50*this.bg_black.scale.y);

    },


    win: function() {


        if (SaveState.passLevel()) {

            game.time.events.add(1600,function() {
                this.coins.addMoney(game.jsonSettings.coins_for_completing_puzzle);
            },this)

        }


        this.bottomButtons.forEach(function(child) {
            child.input.enabled = false;
        });
        this.closeButton.input.enabled = false;

        game.add.tween(this.fade_black).to({alpha: 0.5},1000,Phaser.Easing.Sinusoidal.InOut,true);

        game.add.tween(this.closeButton).to({alpha: 0}, 1000, Phaser.Easing.Sinusoidal.InOut,true);
        game.add.tween(this.bottomButtons).to({alpha: 0}, 1000, Phaser.Easing.Sinusoidal.InOut,true);
        


        var center_of_field = this.grid.marbleGroup.y+((this.grid.height*this.grid.tilesize)*0.5)
        game.time.events.add(600,function() {

            game.sfx.win.play();
            this.glow = game.add.image(210,0,'ssheet','logo_glow2');
            this.glow.anchor.setTo(0.5,0.5);
            this.glow.alpha = 0.5;
            game.add.tween(this.glow).from({alpha: 0},2500,Phaser.Easing.Sinusoidal.Out,true);
            game.add.tween(this.glow).to({angle: 359.99},50000,Phaser.Easing.Linear.InOut,true,0,-1);

            game.partSystem.explodeStars(210,center_of_field);

            this.win_txt = new MLbitmapText(210,-10,'YOU WON!',400,400,'font_shadow',60);
            this.win_txt.popUpAnimation();

            this.winGroup.addMultiple([this.glow,this.win_txt]);

        },this);

        game.time.events.add(1200,function() {
            this.win_buttons.x = 210;
            this.win_buttons.y = game.height + 200;
            this.win_buttons.scale.setTo(2.5,2.5);

            game.add.tween(this.win_buttons).to({y: center_of_field},300,Phaser.Easing.Sinusoidal.InOut).to({y: center_of_field+120},300,Phaser.Easing.Sinusoidal.InOut).start();
            game.add.tween(this.win_buttons.scale).to({x: 1, y:1},600,Phaser.Easing.Sinusoidal.InOut,true);

            this.win_button_menu = new RoundButton(-80,0,'button100x100','label_menu',function() {
                this.goTo('MainMenu');
            },this);
            this.win_button_menu.label.y = -3;
            this.win_buttons.add(this.win_button_menu);


            if (game.puzzle_nr < 99) {
                this.win_button_next_level = new RoundButton(80,0,'button100x100','label_next_level',function() {
                    game.puzzle_nr++;
                    this.goTo('Puzzle');
                },this);
                this.win_button_menu.label.y = -3;
                this.win_button_menu.label.x = 2;
                this.win_buttons.add(this.win_button_next_level);
            } else {
                this.win_button_menu.x = 0;
            }

            
            
        },this)
        
    },


    render: function() {
       //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    
    },


    bottomButtonsAnimation: function() {

        this.bottomButtons.y = game.height+150;
        this.bottomButtons.scale.setTo(2,2);

        game.add.tween(this.bottomButtons).to({y: game.height-200},500,Phaser.Easing.Sinusoidal.InOut).to({y: game.height-45},500,Phaser.Easing.Sinusoidal.InOut).start();
        game.add.tween(this.bottomButtons.scale).to({x: 1, y:1},1000,Phaser.Easing.Sinusoidal.InOut,true);


    },

    bottomButtonsAnimation2: function() {
        this.bottomButtons.y = game.height-45;
        this.bottomButtons.scale.setTo(1,1);

        game.add.tween(this.bottomButtons).to({y: game.height-200},250,Phaser.Easing.Sinusoidal.InOut).to({y: game.height+150},250,Phaser.Easing.Sinusoidal.InOut).start();
        game.add.tween(this.bottomButtons.scale).to({x: 2, y:2},500,Phaser.Easing.Sinusoidal.InOut,true);
    },

    shutdown: function() {
        this.bg_group.destroy()
        this.grid.destroy();
        this.bottomButtons.destroy();
        this.noMoreMovesTxt.destroy();
        this.noMoreCoinsTxt.destroy();
        this.fade_black.destroy();
        this.closeButton.destroy();
        game.partSystem.finish();
        this.winGroup.destroy();
        this.win_buttons.destroy();
        this.puzzleTxt.destroy();
        this.coins.destroy();
        this.musicButton.destroy();
        this.fade_white.destroy();
    }

};