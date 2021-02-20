var TextButton = function(x, y, text, size,font,callback,callback_context) {  

  Phaser.Button.call(this, game,x,y,null);

  this.onInputUp.add(this.bounce,this);


  
  this.text = game.make.bitmapText(0,0,font,text.toUpperCase(),size)
  this.text.anchor.setTo(0.5,0);
  this.addChild(this.text);

  this.original_letter_y = this.text.getChildAt(0).y;


  this.hl_text = game.make.bitmapText(0,0,'font_hl',text.toUpperCase(), size);
  this.hl_text.anchor.setTo(0.5,0);
  this.hl_text.alpha = 0;
  this.addChild(this.hl_text);

  this.freezeGroup = false;

  if (callback && callback_context) {
  this.onInputUp.add(
  	
    

  	function() {
      
      if (this.freezeGroup) {
        this.groupToFreeze.freezeInput();
      }
  		
  		game.time.events.add(500,function() {

  		callback.call(callback_context);

  		});

  	}, this


    );
   }

  this.orgY = this.text.getChildAt(0).y;
};



TextButton.prototype = Object.create(Phaser.Button.prototype);  
TextButton.prototype.constructor = TextButton;

TextButton.prototype.bounce = function() {

  game.sfx.button.play();

	var delay = 0;
	var duration_of_tween = Math.max(200,1200/this.text.text.length);
	
	this.hl_text.alpha = 0;
	game.add.tween(this.hl_text).to({alpha: 1}, 300, Phaser.Easing.Sinusoidal.InOut,true,0,0,true);

	for (var i = 0; i < this.text.text.length; i++) {

		this.hl_text.getChildAt(i).y = this.original_letter_y;
		this.text.getChildAt(i).y = this.original_letter_y;

		game.add.tween(this.text.getChildAt(i)).to({y: this.text.getChildAt(i).y - (this.text.fontSize*0.2)},duration_of_tween,Phaser.Easing.Sinusoidal.Out,true,delay,0,true);
		delay += duration_of_tween*0.4;

	}	
}

TextButton.prototype.turn_on = function() {
	this.inputEnabled = true;
}

TextButton.prototype.setGroupToFreeze = function(group) {
  this.freezeGroup = true;
  this.groupToFreeze = group;
}

TextButton.prototype.turn_off = function() {
	this.inputEnabled = false;
}

TextButton.prototype.postUpdate = function() {
	for (var i = 0; i < this.text.text.length; i++) {
		this.hl_text.getChildAt(i).y = this.text.getChildAt(i).y;
	}
}