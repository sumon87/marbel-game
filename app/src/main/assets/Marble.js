var Marble = function() {  

  Phaser.Sprite.call(this, game, 0, 0, null);

  
  this.anchor.setTo(0.5,0.5);

  this.tweenIndex = 0;
  this.tweening = false;
  this.tweenOldScale = 0;

  this.kill();
  
  
  //this.rotation = Math.random()*1.5


  
};



Marble.prototype = Object.create(Phaser.Sprite.prototype);  
Marble.prototype.constructor = Marble;



Marble.prototype.init = function(x, y, number, width) {

	this.revive();


	this.x = x;
	this.y = y;
	this.number = number;
  	this.powerup = 0;
  	this.tilesize = width;
  	this.loadImg();
  	this.tweenIndex = 0;
  	this.tweening = false;
  	this.tweenOldScale = 0;

}

Marble.prototype.tweenData = JSON.parse("[0.9924038765061041,0.9698463103929542,0.9330127018922194,0.883022221559489,0.8213938048432696,0.75,0.6710100716628343,0.586824088833465,0.5,0.41317591116653496,0.3289899283371658,0.2500000000000002,0.17860619515673049,0.11697777844051116,0.06698729810778092,0.030153689607045897,0.007596123493895934,0,0,0.007596123493895934,0.030153689607045897,0.06698729810778092,0.11697777844051116,0.17860619515673049,0.2500000000000002,0.3289899283371658,0.41317591116653496,0.5,0.586824088833465,0.6710100716628343,0.75,0.8213938048432696,0.883022221559489,0.9330127018922194,0.9698463103929542,0.9924038765061041,1]");

Marble.prototype.explode = function() {

	

	var point = this.toGlobal(new Phaser.Point(0,0))
  if (this.powerup == 0) {
  
  	game.partSystem.explodeMarble(point,this.number);
  
  }else {
  	game.sfx.explosion.play();
  	game.partSystem.emitHlBall(point.x,point.y);
  	game.partSystem.emitGlow(point);
  	game.partSystem.emitGlow(point);
  }
  
  this.kill();
}

Marble.prototype.update = function() {
	if (this.tweening) {

		if (this.tweenIndex >= 0) {

			if (this.tweenIndex == 16) {
				this.loadImg();
			}

			this.scale.x = this.tweenOldScale*this.tweenData[this.tweenIndex];
			this.scale.y = this.scale.x;
		}

		this.tweenIndex++

		if (this.tweenIndex == 37) {
			this.scale.x = this.tweenOldScale;
			this.scale.y = this.tweenOldScale;
			this.tweening = false;
		}

	}
}


Marble.prototype.updateAfterShuffle = function(delay) {
	this.width = this.tilesize;
	this.height = this.tilesize;
	this.tweenIndex = delay*-1;
	this.tweenOldScale = this.scale.x;
	this.tweening = true;

	/*
	var width = this.width;
	game.add.tween(this.scale).to({x: 0, y:0},500,Phaser.Easing.Sinusoidal.InOut,true,delay,0,true)
	.onComplete.add(function() {
		this.width = width;
		this.height = width;
	},this);
	game.time.events.add(500,function(){
		this.loadImg();
	},this)
	*/
}

Marble.prototype.changeToPowerUp = function() {
	game.sfx.powerup_spawn.play();
	this.number = 99;
	this.powerup = game.rnd.between(1,3);
	this.loadImg();
	var point = this.toGlobal(new Phaser.Point(0,0))
	game.partSystem.emitHlBall(point.x,point.y);
	game.partSystem.emitGlow(point);
}

Marble.prototype.loadImg = function() {

	if (!this.alive) return;

	if (this.tilesize <= 40) {
		this.textureSize = 40;
	}else if (this.tilesize <= 50) {
		this.textureSize = 50;
	}else if (this.tilesize <= 60) {
		this.textureSize = 60;
	}else if (this.tilesize <= 70) {
		this.textureSize = 70;
	}else {
		this.textureSize = 80;
	}


	if (this.powerup == 0) {
		this.loadTexture('ssheet',this.number.toString()+'x'+this.textureSize.toString());
	}else {
		this.loadTexture('ssheet','p'+this.powerup.toString()+'x'+this.textureSize.toString());
	}


	this.width = this.tilesize;
	this.height = this.tilesize;

}

Marble.prototype.resize = function(new_size) {
	this.tilesize = new_size;
	this.loadImg();
}