var LevelButton = function(x, y, level_number) {  

  Phaser.Button.call(this, game, x, y, null, this.bounce, this);

  this.anchor.setTo(0.5,0.5);

  this.number = game.make.bitmapText(0,8,'font-lvl',level_number,55);
  this.number.anchor.setTo(0.5,0.5);
  this.number.scale.setTo(0.8,0.8);

  this.lock = game.make.image(0,-4,'ssheet','lvl_lock');
  this.lock.anchor.setTo(0.5,0.5);

  this.addChild(this.number);
  this.addChild(this.lock);

  this.changeLevelWithoutAnimation(level_number);

  this.onInputUp.add(this.clickLevel,this);
}



LevelButton.prototype = Object.create(Phaser.Button.prototype);  
LevelButton.prototype.constructor = LevelButton;


LevelButton.prototype.bounce = function() {

  game.sfx.button.play();
	this.onInputUp.active = false;
	game.time.events.add(400,function() {
		this.onInputUp.active = true;
	},this)
	game.add.tween(this.scale).to({x:1.1,y:1.1},200,Phaser.Easing.Sinusoidal.InOut,true,0,0,true);
	game.add.tween(this.label.scale).to({x:0.8,y:0.8},200,Phaser.Easing.Sinusoidal.InOut,true,0,0,true);
}

LevelButton.prototype.clickLevel = function() {
  

  if (this.unlocked) {
    game.puzzle_nr = this.lvl_number;
    game.time.events.add(200,function() {
      game.state.getCurrentState().goTo('Puzzle');
    })
  }
}

LevelButton.prototype.changeLevel = function(lvl_number) {


  this.onInputUp.active = false;
  game.time.events.add(400,function() {
    this.onInputUp.active = true;
  },this)

  this.scale.x = 1;
  this.scale.y = 1;

  game.add.tween(this.scale).to({x:0,y:0},200,Phaser.Easing.Sinusoidal.InOut,true,(lvl_number%20)*20,0,true);

  this.lvl_number = lvl_number;

  game.time.events.add(((lvl_number%20)*20)+200,function() {
    this.passed = SaveState.data.puzzle[game.puzzle_category][lvl_number];
    this.unlocked = lvl_number < SaveState.data.puzzles_unlocked[game.puzzle_category];
    this.label = this.unlocked ? this.number : this.lock;
    this.number.visible = this.unlocked;
    this.lock.visible = !this.unlocked;
    this.number.setText((lvl_number+1).toString());
    

    this.loadTexture('ssheet', this.passed ? 'button_lvl_1' : 'button_lvl_0');
    if (!this.unlocked) this.loadTexture('ssheet','button_lvl_locked');
  },this);

}


LevelButton.prototype.changeLevelWithoutAnimation = function(lvl_number) {

  this.onInputUp.active = false;
  game.time.events.add(400,function() {
    this.onInputUp.active = true;
  },this)

  this.scale.x = 1;
  this.scale.y = 1;


  this.lvl_number = lvl_number;


    this.passed = SaveState.data.puzzle[game.puzzle_category][lvl_number];
    this.unlocked = lvl_number < SaveState.data.puzzles_unlocked[game.puzzle_category];
    this.label = this.unlocked ? this.number : this.lock;
    this.number.visible = this.unlocked;
    this.lock.visible = !this.unlocked;
    this.number.setText((lvl_number+1).toString());
    this.loadTexture('ssheet', this.passed ? 'button_lvl_1' : 'button_lvl_0');
    if (!this.unlocked) this.loadTexture('ssheet','button_lvl_locked');

}