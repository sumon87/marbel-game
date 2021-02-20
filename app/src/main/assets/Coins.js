var Coins = function(x,y) {  

  Phaser.Group.call(this,game);
  this.x = x;
  this.y = y;

  this.coinsBitmapTxt = game.make.bitmapText(-34,0,'font_shadow',SaveState.data.coins.toString(),30);
  this.coinsBitmapTxt.anchor.setTo(1,0);
  this.coinsBitmapTxt.anchor.y = 0.5;
  this.coinsBitmapTxt.y = 17;

  this.coinIco = game.make.image(0,6,'ssheet','coin_ico');
  this.coinIco.anchor.setTo(1,0);

  this.coins = SaveState.data.coins;
  this.coinsTxt = this.coins;
  this.timerIndex = 0;


  this.changeTxt = game.make.bitmapText(-34,0,'font_shadow','',30);
  this.changeTxt.anchor.setTo(1,0);
  this.changeTxt.alpha = 0;

  this.addMultiple([this.coinsBitmapTxt,this.coinIco,this.changeTxt]);

  this.animate = false;

}

Coins.prototype = Object.create(Phaser.Group.prototype);  
Coins.prototype.constructor = Coins;


Coins.prototype.addMoney = function(amount) {

  if (amount == 0) return;

  this.coins += amount;
  SaveState.data.coins = this.coins;
  SaveState.save();

  this.changeTxt.setText('+'+amount.toString());
  this.changeTxt.tint = 0x8DC63F;
  this.changeTxt.y = 40;
  this.changeTxt.alpha = 0;
  game.add.tween(this.changeTxt).to({alpha: 1},400,Phaser.Easing.Sinusoidal.InOut,true,0,0,true);
  game.add.tween(this.changeTxt).to({y: 0},800,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function(){this.animate = true},this);
  game.add.tween(this.coinsBitmapTxt.scale).to({x: 1.3, y: 1.3},100,Phaser.Easing.Quadratic.In,true,800,0,true);

}

Coins.prototype.removeMoney = function(amount) {

  if (amount == 0) return;

  this.coins -= amount;
  SaveState.data.coins = this.coins;
  SaveState.save();


  this.changeTxt.setText('-'+amount.toString());
  this.changeTxt.tint = 0xEF4136;
  this.changeTxt.y = 0;
  this.changeTxt.alpha = 0;
  this.animate = true;
  game.add.tween(this.coinsBitmapTxt.scale).to({x: 1.3, y: 1.3},100,Phaser.Easing.Quadratic.In,true,0,0,true);
  game.add.tween(this.changeTxt).to({alpha: 1},400,Phaser.Easing.Sinusoidal.InOut,true,0,0,true);
  game.add.tween(this.changeTxt).to({y: 40},800,Phaser.Easing.Sinusoidal.InOut,true);


}

Coins.prototype.update = function() {
  if (!this.animate) return;

  if (this.coins == this.coinsTxt) {
    this.animate = false;
    return;
  }

  this.coinsTxt += game.math.sign(this.coins-this.coinsTxt);
  this.coinsBitmapTxt.setText(this.coinsTxt.toString());

}

Coins.prototype.center = function() {
  this.coinIco.x = (this.width*0.5)+5;
  this.coinsBitmapTxt.x = this.coinIco.x-34;
  this.changeTxt.x = this.coinsBitmapTxt.x;
}