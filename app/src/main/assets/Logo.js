var Logo = function(y) {  

  Phaser.Group.call(this, game);

  this.y = y || 0;
  this.x = game.width*0.5;

  this.palmtree_0 = game.make.image(-175,100,'ssheet','logo_palmtree');
  this.palmtree_0.anchor.setTo(0.36,1);

  this.palmtree_1 = game.make.image(38,87,'ssheet','logo_palmtree');
  this.palmtree_1.anchor.setTo(0.36,1);
  this.palmtree_1.scale.x = -1;
  	
  this.palmtree_2 = game.make.image(175,101,'ssheet','logo_palmtree');
  this.palmtree_2.anchor.setTo(0.36,1);
  this.palmtree_2.scale.x = -1; 		

  this.bg_group = game.make.group();
  this.top_group = game.make.group();
  this.ball_group = game.make.group();

  this.m = this.makeLetter(-133,0,'m');
  this.a = this.makeLetter(-69,0,'a');
  this.r = this.makeLetter(-9,0,'r');
  this.b = this.makeLetter(46,0,'b');
  this.l = this.makeLetter(97,0,'l');
  this.e = this.makeLetter(143,0,'e');

  this.ball_s = this.makeBall(-128,45,'s');
  this.ball_h = this.makeBall(128,45,'h');
  this.ball_m = this.makeBall(-65,45,'m');
  this.ball_s2 = this.makeBall(65,45,'s');
  this.ball_a = this.makeBall(-0,45,'a');

  

  this.addMultiple([this.palmtree_0, this.palmtree_1,this.palmtree_2,this.bg_group,this.top_group,this.ball_group]);

}

Logo.prototype = Object.create(Phaser.Group.prototype);  
Logo.prototype.constructor = Logo;

Logo.prototype.startAnimation = function(delay) {

	this.top_group.forEach(function(child) {
		child.scale.setTo(0,0);
	});

	this.ball_group.forEach(function(child) {
		child.scale.setTo(0,0);
	});
	

	
  	this.palmtree_0.scale.setTo(0,0);
	game.add.tween(this.palmtree_0.scale).to({x:1,y:1},1000,Phaser.Easing.Elastic.Out,true,delay+200);
	game.time.events.add(delay+200,function() {
		game.sfx.whoosh.play();
	})
	
	this.palmtree_1.scale.setTo(0,0);
	game.add.tween(this.palmtree_1.scale).to({x:-1,y:1},800,Phaser.Easing.Elastic.Out,true,delay+350);
	this.palmtree_2.scale.setTo(0,0);
	game.add.tween(this.palmtree_2.scale).to({x:-1,y:1},1200,Phaser.Easing.Elastic.Out,true,delay+150);
	
	this.animateMarble(delay+350);
	this.animateBalls(delay+1300);

	game.time.events.add(delay+3000,this.cache,this);

};


Logo.prototype.animateMarble = function(add_delay) {
	
	

	var delay = [250,50,200,100,300,150];
	var duration = [600,400,500,350,450,500];

	for (var i = 0; i < 6; i++) {

		var letter = this.top_group.getChildAt(i);
		game.add.tween(letter.scale).to({x:1.3,y:1.3},duration[i],Phaser.Easing.Quadratic.In,false,add_delay+delay[i]).to({x:1,y:1},400,Phaser.Easing.Sinusoidal.In).start();

	}

}

Logo.prototype.animateBalls = function(add_delay) {

	var delay = [50,100,150,200,250];
	var duration = [300,300,300,300,300];

	for (var i = 0; i < 4; i++) {

		var letter = this.ball_group.getChildAt(i);
		game.add.tween(letter.scale).to({x:1.4,y:1.4},duration[i],Phaser.Easing.Exponential.Out,false,add_delay+delay[i]).to({x:1,y:1},200,Phaser.Easing.Sinusoidal.In).start();
		game.time.events.add(add_delay+delay[i],function() {
			game.sfx.pop.play()
		});
	}

	game.add.tween(this.ball_group.getChildAt(4).scale).to({x:1.7,y:1.7},300,Phaser.Easing.Exponential.Out,false,add_delay+300).to({x:1,y:1},200,Phaser.Easing.Sinusoidal.In).start();


}

Logo.prototype.makeLetter = function(x,y,letter) {

	
	var letter_bg =  game.make.image(x,y,'ssheet','logo_'+letter+'_bg');
	letter_bg.anchor.setTo(0.5,1);
	this.bg_group.add(letter_bg);
	
	var letter_obj = game.make.image(x,y,'ssheet','logo_'+letter);
	letter_obj.anchor.setTo(0.5,1);
	this.top_group.add(letter_obj);

	letter_bg.fill = letter_obj;

	letter_bg.update = function() {
		this.scale.x = this.fill.scale.x;
		this.scale.y = this.fill.scale.y;
	}

	return letter_obj;

}

Logo.prototype.makeBall = function(x,y,letter) {

	var letter_bg =  game.make.image(x,y,'ssheet','logo_ball_bg');
	letter_bg.anchor.setTo(0.5,0.5);
	this.bg_group.add(letter_bg);
	
	var letter_obj = game.make.image(x,y,'ssheet','logo_ball_'+letter);
	letter_obj.anchor.setTo(0.5,0.5);
	this.ball_group.add(letter_obj);

	letter_bg.fill = letter_obj;

	letter_bg.update = function() {
		this.scale.x = this.fill.scale.x;
		this.scale.y = this.fill.scale.y;
	}

	return letter_obj;

}

Logo.prototype.cache = function() {
	this.cacheAsBitmap = true;
	this._cachedSprite.anchor.setTo(0,0);
	this.x -= 251
	this.y -= 103
}