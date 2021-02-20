var Particles = function() {  

  Phaser.Group.call(this, game);

  this.ball_hl_emitter = game.add.emitter(0,0,64);
  this.ball_hl_emitter.makeParticles('ssheet','ball_hl');
  this.ball_hl_emitter.setAlpha(1, 0, 1000, Phaser.Easing.Sinusoidal.InOut, false);
  this.ball_hl_emitter.setScale(1, 2, 1, 2, 1000, Phaser.Easing.Sinusoidal.InOut, false)
  //this.emitter.start(false, 1000, 5);
  this.ball_hl_emitter.setSize(1,1);
  this.ball_hl_emitter.gravity = 0;
  this.ball_hl_emitter.setXSpeed(0, 0);
  this.ball_hl_emitter.setYSpeed(0, 0);

  this.glow_emitter = game.add.emitter(0,0,10);
  this.glow_emitter.makeParticles('ssheet','pflare');
  this.glow_emitter.setXSpeed(0, 0);
  this.glow_emitter.setYSpeed(0, 0);
  this.glow_emitter.setAlpha(0, 1, 200, Phaser.Easing.Linear.None, true);
  this.glow_emitter.setScale(0.5, 1, 0.5, 1, 200, Phaser.Easing.Linear.None, true);
  this.glow_emitter.gravity = 0;
  this.glow_emitter.setRotation(-200,200);


  this.star_emitter = game.add.emitter(0,0,50);
  this.star_emitter.makeParticles('ssheet','star_part');
  this.star_emitter.setAlpha(1, 0, 800);
  //this.emitter.start(false, 1000, 5);
  this.star_emitter.setSize(16,16);
  this.star_emitter.setXSpeed(-300, 300);
  this.star_emitter.setYSpeed(-800, 100);
  this.star_emitter.gravity = 2000;
  this.star_emitter.setScale(1, 2, 1, 2,800); 


  this.coin_emitter = game.add.emitter(0,0,50);
  this.coin_emitter.makeParticles('ssheet','coin_ico');
  this.coin_emitter.setXSpeed(-200, 200);
  this.coin_emitter.setYSpeed(-800, -100);
  this.coin_emitter.setAlpha(1,0,1500);
  this.coin_emitter.gravity = 2000;

  this.marble_emitter = []
  for (var i = 1; i < 6; i++) {
    this.marble_emitter[i] = game.add.emitter(0,0,20);
    this.marble_emitter[i].setXSpeed(-300, 300);
    this.marble_emitter[i].setYSpeed(-1300, -500);
    this.marble_emitter[i].setAlpha(1,0,1500);
    this.marble_emitter[i].gravity = 3000;
  }



  
};


Particles.prototype = Object.create(Phaser.Group.prototype);  
Particles.prototype.constructor = Particles;


Particles.prototype.resize = function(new_tilesize) {
  var start = new_tilesize/40;
  var end = start*2;

  this.ball_hl_emitter.setScale(start, end, start, end, 1000, Phaser.Easing.Sinusoidal.InOut, false);



  //MARBLES EMITTER

  if (new_tilesize <= 40) {
    this.textureSize = 40;
  }else if (new_tilesize <= 50) {
    this.textureSize = 50;
  }else if (new_tilesize <= 60) {
    this.textureSize = 60;
  }else if (new_tilesize <= 70) {
    this.textureSize = 70;
  }else {
    this.textureSize = 80;
  }

  var start_scale = new_tilesize/this.textureSize
  var end_scale = start_scale*1.5;

  for (var i = 1; i < 6; i++) {
    this.marble_emitter[i].removeAll();
    this.marble_emitter[i].makeParticles('ssheet',i.toString()+'x'+this.textureSize);
    this.marble_emitter[i].setScale(start_scale, end_scale, start_scale, end_scale,1500);
  }

}

Particles.prototype.explodeMarble = function(point,number) {
	this.ball_hl_emitter.emitX = point.x;
	this.ball_hl_emitter.emitY = point.y;
	this.ball_hl_emitter.explode(1000,1);
	this.star_emitter.emitX = point.x;
	this.star_emitter.emitY = point.y;
	this.star_emitter.explode(800,4);
  this.emittMarble(point.x,point.y,number);
}


Particles.prototype.becomePowerUp = function() {
  
}



Particles.prototype.explodeStars = function(xx,yy) {
  this.star_emitter.emitX = xx;
  this.star_emitter.emitY = yy;
  this.star_emitter.setAlpha(1, 0, 3000);
  this.star_emitter.gravity = 200;
  this.star_emitter.setXSpeed(-200, 200);
  this.star_emitter.setYSpeed(-300, 100);
  this.star_emitter.explode(3000,15);
}

Particles.prototype.emitHlBall = function(xx,yy) {
  this.ball_hl_emitter.emitX = xx;
  this.ball_hl_emitter.emitY = yy;
  this.ball_hl_emitter.explode(1000,1);
}

Particles.prototype.explodeMoney = function(xx,yy,amount) {
  this.coin_emitter.emitX = xx;
  this.coin_emitter.emitY = yy;
  this.coin_emitter.explode(1500,amount);
}

Particles.prototype.emittMarble = function(xx,yy,number) {
  this.marble_emitter[number].emitX = xx;
  this.marble_emitter[number].emitY = yy;
  this.marble_emitter[number].explode(1000,1);
}

Particles.prototype.emitGlow = function(point) {
  this.glow_emitter.emitX = point.x;
  this.glow_emitter.emitY = point.y;
  this.glow_emitter.explode(200,1);
}

Particles.prototype.finish = function() {
  this.ball_hl_emitter.destroy();
  this.glow_emitter.destroy();
  this.star_emitter.destroy();
  this.coin_emitter.destroy();
  this.marble_emitter[1].destroy();
  this.marble_emitter[2].destroy();
  this.marble_emitter[3].destroy();
  this.marble_emitter[4].destroy();
  this.marble_emitter[5].destroy();
  this.destroy();
}