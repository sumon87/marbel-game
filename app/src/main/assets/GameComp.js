var MarbleSmash = MarbleSmash || {};

MarbleSmash.GameComp = function (game) {

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

MarbleSmash.GameComp.prototype = {

    create: function () {

        
        this.bg = game.add.image(0,-10,'bg');
        bg = this.bg;

        this.bg_black = game.add.image(210,0,'bg_black');
        this.bg_black.anchor.setTo(0.5,0);
        this.bg_black.scale.setTo(1.05,1.05);
        this.bg_black.alpha = 0.85;
        bg_black = this.bg_black;

        this.tilesize = 40;

        this.grid = new MarbleSmash.GameGridComputer();
        grid = this.grid;
        this.grid.init(8,8,40,10,53);
        //this.grid.fillRandom();

        game.partSystem = new Particles();
        game.add.existing(game.partSystem);

        this.click_value = 0;

        this.grid_graphics = game.add.graphics();
        
        //game.input.onDown.add(this.clickProcess,this);
        //game.input.onDown.add(this.grid.click,this.grid);
        
        this.k_z = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.k_z.onDown.add(function() {
            this.click_value = Math.max(0,this.click_value-1);
        },this);

        this.k_x = game.input.keyboard.addKey(Phaser.Keyboard.X);
        this.k_x.onDown.add(function() {
            this.click_value = Math.min(4,this.click_value+1);
        },this);
        
        this.k_c = game.input.keyboard.addKey(Phaser.Keyboard.C);
        this.k_c.onDown.add(function() {
            this.grid.checkLoop();
        },this);

         this.k_v = game.input.keyboard.addKey(Phaser.Keyboard.V);
        this.k_v.onDown.add(function() {
            this.grid.moveDown();
        },this);

        this.k_b = game.input.keyboard.addKey(Phaser.Keyboard.B);
        this.k_b.onDown.add(function() {
            this.grid.fillRandom();
        },this);


        this.k_q = game.input.keyboard.addKey(Phaser.Keyboard.Q);



        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    },

    update: function () {
        if (this.k_q.isDown) {
            this.grid_graphics.alpha = 1;
            this.renderGrid(this.tilesize);
        }else {
            this.grid_graphics.alpha = 0;
        }
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    },

    clickProcess: function() {
        if (this.grid.input_active) return;
        if (!this.grid.mouseInRange()) return;

        var mouse_cell_x = this.grid.changePxToCell(game.input.x-this.grid.m_x);
        var mouse_cell_y = this.grid.changePxToCell(game.input.y-this.grid.m_y);

        if (this.grid.blockGrid[mouse_cell_x][mouse_cell_y] == 0) {
            this.grid.makeNewMarble(mouse_cell_x,mouse_cell_y,this.click_value)
        } else {
            this.grid.blockGrid[mouse_cell_x][mouse_cell_y].destroy();
            this.grid.blockGrid[mouse_cell_x][mouse_cell_y] = 0;
            this.grid.makeNewMarble(mouse_cell_x,mouse_cell_y,this.click_value)
        }



    },

    render: function() {
        game.debug.text(this.click_value, 2, 14, "#00ff00");
        game.debug.text(Math.floor((game.input.x-this.grid.m_x)/40)+"x"+Math.floor((game.input.y-this.grid.m_y)/40), 2, 28, "#00ff00");
    
    },





    renderGrid: function() {
        this.grid_graphics.clear();
        for (var xx = 0; xx < this.grid.width; xx++) {
            for (var yy = 0; yy < this.grid.height; yy++) {
                var cell_val = this.grid.getVal(xx,yy);

                switch (cell_val) {
                    case 0:
                        this.grid_graphics.beginFill(0xFFFFFF, 1);
                        break;
                    case 1:
                        this.grid_graphics.beginFill(0x00a2e8, 1);
                        break;
                    case 2:
                        this.grid_graphics.beginFill(0x22b14c, 1);
                        break;
                    case 3:
                        this.grid_graphics.beginFill(0xffaec9, 1);
                        break;
                    case 4:
                        this.grid_graphics.beginFill(0xed1c24, 1);
                        break;
                    case 5:
                        this.grid_graphics.beginFill(0xfff200, 1);
                        break;
                }

                this.grid_graphics.drawRect(xx*this.tilesize, yy*this.tilesize, this.tilesize, this.tilesize);
                this.grid_graphics.endFill();
            
            } 
        } 

    }

};