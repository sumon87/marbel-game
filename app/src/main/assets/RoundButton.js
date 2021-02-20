var RoundButton = function(x, y, button, label, callback, callback_context) {  

  Phaser.Button.call(this, game, x, y, null);

  this.anchor.setTo(0.5,0.5);

  
  this.loadTexture('ssheet',button);
  this.label = game.make.image(0,0,'ssheet',label);

  this.label.anchor.setTo(0.5,0.5);
  this.addChild(this.label);

  this.sfx = game.sfx.button;
  //this.rotation = Math.random()*1.5

  this.fluidLayout = false;

  this.freezeAfterBounce = 400;

  this.onInputUp.add(this.bounce,this);

  if (callback && callback_context) {
  this.onInputUp.add(
  	
  	function() {
  
  		
  		game.time.events.add(200,function() {

  		callback.call(callback_context);

  		});

  	});
   }
  	
}



RoundButton.prototype = Object.create(Phaser.Button.prototype);  
RoundButton.prototype.constructor = RoundButton;


RoundButton.prototype.bounce = function() {
	this.onInputUp.active = false;
	game.time.events.add(this.freezeAfterBounce,function() {
		this.onInputUp.active = true;
	},this)
  this.sfx.play();
	game.add.tween(this.scale).to({x:1.1,y:1.1},200,Phaser.Easing.Sinusoidal.InOut,true,0,0,true);
	game.add.tween(this.label.scale).to({x:0.8,y:0.8},200,Phaser.Easing.Sinusoidal.InOut,true,0,0,true);
}

RoundButton.prototype.resize = function() {
  this.y =  this.layoutFactor * game.height;
}

RoundButton.prototype.turnOnLayout = function() {
  this.layoutFactor = (this.y/525);
  this.resize();
}