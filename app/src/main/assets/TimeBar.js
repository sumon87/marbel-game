var TimeBar = function(y) {  

  Phaser.Group.call(this, game);

  this.bar = game.make.image(0,0,'ssheet','timebar_bar');

  this.timeline = game.make.tileSprite(22,17,380,34,'ssheet','timebar_time');


  this.button = game.make.image(48,38,'ssheet','timebar_button');
  this.button.anchor.setTo(0.5,0.5);


  this.clock = game.make.image(49,33,'ssheet','timebar_clock')
  this.clock.anchor.setTo(0.5,0.5);

  this.addMultiple([this.bar,this.timeline,this.button,this.clock]);

  this.timeLeft = 320;

  this.timePerUpdate = 0.05;
  this.active = false;

  this.timeIsUp = new Phaser.Signal();


}

TimeBar.prototype = Object.create(Phaser.Group.prototype);  
TimeBar.prototype.constructor = TimeBar;

TimeBar.prototype.update = function() {
    if (!this.active) return;

    
    
    if (this.timeLeft - (this.timeline.width-60) > 0) {
        this.timeline.width += Math.min(0.05,this.timeLeft-(this.timeline.width-60));
    }else {
        this.timeline.width = 60 + this.timeLeft;
    }

    this.timeLeft -= this.timePerUpdate;
    this.timePerUpdate += 0.00001;


    if (this.timeLeft <= 0) {
        this.timeIsUp.dispatch();
        this.active = false;
        this.cacheAsBitmap = true;
    }
}

TimeBar.prototype.addTime = function(length_of_pattern) {
    this.timeLeft = Math.min(320,this.timeLeft+length_of_pattern);
}