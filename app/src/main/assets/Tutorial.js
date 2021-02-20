var Tutorial = function(y) {  
  Phaser.Group.call(this, game);

  

}

Tutorial.prototype = Object.create(Phaser.Group.prototype);  
Tutorial.prototype.constructor = Tutorial;

Tutorial.prototype.startTutorial = function(puzzle) {

  this.state = game.state.getCurrentState();

  this.puzzle = puzzle;

  if (this.puzzle) {
    this.state.hintButton.onInputUp.active = false;
    this.state.undoButton.onInputUp.active = false;
    this.state.restartButton.onInputUp.active = false;
  } 
  
  this.state.fade_black.alpha = 0.5;
  this.state.grid.marbleGroup.alpha = 0;
  this.state.clickBinding.active = false;

  game.add.tween(this).from({alpha: 0}, 1000, Phaser.Easing.Sinusoidal.InOut,true);

  this.step = 0;

  this.marbleGroup = game.make.group();
  this.marbleGroup.x = 210;
  this.marbleGroup.y = (525*0.50)+30;


  this.tutorialText = new MLbitmapText(210,525*0.35,'Tap group of 3 or more marbles of the same color!',400,500,'font_shadow',30);

  this.hl = game.make.image(220,(525*0.55)+10,'ssheet','ball_hl');
  this.hl.anchor.setTo(0.5,0.5);
  this.hl.alpha = 0.6;
  this.tween1 = game.add.tween(this.hl.scale).to({x:1.5,y:1.5},500,Phaser.Easing.Sinusoidal.In,true,0,-1,false);
  this.tween2 = game.add.tween(this.hl).to({alpha: 0},500,Phaser.Easing.Sinusoidal.In,true,0,-1,false);
  this.hand = game.make.image(220, (525*0.55)+10, 'ssheet', 'tutorial_hand');
  this.hand.scale.setTo(0.7,0.7);
  this.hand.alpha = 0.5;

  this.addMultiple([this.tutorialText,this.marbleGroup,this.hl,this.hand]);
  

  this.marbleGroup.add(this.makeMarble(-60,0,'1x60',this.goToStep1,this));
  this.marbleGroup.add(this.makeMarble(0,0,'1x60',this.goToStep1,this));
  this.marbleGroup.add(this.makeMarble(60,0,'1x60',this.goToStep1,this));


}

Tutorial.prototype.endTutorial = function() {
    game.add.tween(this.state.fade_black).to({alpha: 0},1500,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
      

      
      this.tween1.pendingDelete = true;
      this.tween2.pendingDelete = true;

      if (this.puzzle) {
        this.state.clickBinding.active = true;
        this.state.hintButton.onInputUp.active = true;
        this.state.undoButton.onInputUp.active = true;
        this.state.restartButton.onInputUp.active = true;
        SaveState.data.tutorial_puzzle = false;
        SaveState.save();
      } else {
        SaveState.data.tutorial_timeAttack = false;
        SaveState.save();
        this.state.countdown();
      }

      this.destroy();


    },this);

    game.add.tween(this.state.grid.marbleGroup).to({alpha: 1},1500,Phaser.Easing.Sinusoidal.InOut,true)
}


Tutorial.prototype.makeMarble = function(x,y,sprite,callback,context) {

  var button = game.make.button(x,y,null,callback,context);
  button.anchor.setTo(0.5,0.5);
  button.loadTexture('ssheet',sprite);

  return button;

}

Tutorial.prototype.goToStep1 = function() {

  game.sfx.pop.play();

  this.marbleGroup.removeAll();

  game.partSystem.explodeMarble(new Phaser.Point(210-60,this.marbleGroup.y),1);
  game.partSystem.explodeMarble(new Phaser.Point(210,this.marbleGroup.y),1);
  game.partSystem.explodeMarble(new Phaser.Point(210+60,this.marbleGroup.y),1);

  game.add.tween(this).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true);

  if (this.puzzle) {

    this.endTutorial();
    
  } else {

    game.time.events.add(500,function() {
      this.goToStep2(); 
    },this)

  }

}

Tutorial.prototype.goToStep2 = function() {
  this.tutorialText.destroy();
  this.tutorialText = new MLbitmapText(210,525*0.35,'Tap group of 6 or more marbles to gain power-up!',400,500,'font_shadow',30);
  this.add(this.tutorialText);
  this.hand.y += 60;
  this.hl.y += 60;

  this.marbleGroup.add(this.makeMarble(-60,0,'2x60',this.goToStep3,this));
  this.marbleGroup.add(this.makeMarble(0,0,'2x60',this.goToStep3,this));
  this.marbleGroup.add(this.makeMarble(60,0,'2x60',this.goToStep3,this));
  this.marbleGroup.add(this.makeMarble(-60,60,'2x60',this.goToStep3,this));
  this.marbleGroup.add(this.makeMarble(0,60,'2x60',this.goToStep3,this));
  this.marbleGroup.add(this.makeMarble(60,60,'2x60',this.goToStep3,this));

  game.add.tween(this).to({alpha: 1},500,Phaser.Easing.Sinusoidal.InOut,true);
}

Tutorial.prototype.goToStep3 = function() {

  game.add.tween(this.tutorialText).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
    this.tutorialText.destroy();
  },this)

  game.sfx.powerup_spawn.play();

  game.time.events.add(510,function() {
    this.tutText = new MLbitmapText(210,525*0.35,'Tap on power-up to use it!',400,500,'font_shadow',30);
    this.add(this.tutText);
    game.add.tween(this.tutText).from({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true);
  },this)

  this.marbleGroup.removeAll();
  game.partSystem.explodeMarble(new Phaser.Point(210-60,this.marbleGroup.y),1);
  game.partSystem.explodeMarble(new Phaser.Point(210,this.marbleGroup.y),1);
  game.partSystem.explodeMarble(new Phaser.Point(210+60,this.marbleGroup.y),1);
  game.partSystem.explodeMarble(new Phaser.Point(210-60,this.marbleGroup.y+60),1);
  game.partSystem.explodeMarble(new Phaser.Point(210+60,this.marbleGroup.y+60),1);
  game.partSystem.emitHlBall(210,this.marbleGroup.y+60);
  game.partSystem.emitGlow(new Phaser.Point(210,this.marbleGroup.y+60));
  this.marbleGroup.add(this.makeMarble(0,60,'p1x60',this.goToStep4,this));

}

Tutorial.prototype.goToStep4 = function() {

  this.marbleGroup.removeAll();
  var point = new Phaser.Point(210,this.marbleGroup.y+60)
  game.partSystem.emitHlBall(point.x,point.y);
  game.partSystem.emitGlow(point);
  game.partSystem.emitGlow(point);
  game.sfx.explosion.play();

  this.endTutorial();
  game.add.tween(this).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true);

}