var LevelLayer = function() {  

  Phaser.Group.call(this, game);

  this.state = game.state.getCurrentState();

  this.closeButton = new RoundButton(390,30,'button48x48','label_close_small',function() {

    game.sfx.whoosh.play('',0,0.2);

  	this.disappearAppear(this.layer_1,this.layer_0);
  	this.unlockInput(this.puzzleCategory);
  },this.state);
  this.closeButton.label.y = -3;
  this.closeButton.freezeAfterBounce = 1500;

  this.buttonGroup = game.make.group();


  var spading_x = 80;
  var spading_y = 75+(game.height-525);
  var start_x = (420-(spading_x*4))*0.5;


  this.page = 0;

  for (var i = 0; i < 20; i++) {
  	
  	var lvl_number = (this.page*20)+i;
  	var xx = start_x + ((i%5)*spading_x);
  	var yy = ((Math.floor(i/5))*spading_y);
  	var button = new LevelButton(xx,yy,lvl_number);
    button.row = Math.floor(i/5);
  	this.buttonGroup.add(button);
  
  }

  this.buttonGroup.y = 170+((game.height-525)*0.15);

  this.prevPage = new RoundButton(55,0,'lvllayer_button','lvllayer_back',function() {
  	if (this.page == 0) return;

    this.nextPage.onInputUp.active = false;
    this.prevPage.onInputUp.active = false;
    game.time.events.add(450 , function() {
      this.nextPage.onInputUp.active = true;
      this.prevPage.onInputUp.active = true;
    },this);

  	this.page--;
  	this.refreshLevels();
  },this);

  this.prevPage.update = function() {
  	if (this.parent.parent.page > 0) {
  		this.alpha = Math.min(1,this.alpha+0.01);
  		this.onInputUp.active = true;
  	} else {
  		this.alpha = Math.max(0.5,this.alpha-0.01);
  		this.onInputUp.active = false;
  	}
  }

  this.prevPage.label.x = -3;
  this.prevPage.label.y = -3;
  this.prevPage.sfx = game.sfx.click;

  this.nextPage = new RoundButton(365,0,'lvllayer_button','lvllayer_next',function() {
  	if (this.page == 4) return;
    this.nextPage.onInputUp.active = false;
    this.prevPage.onInputUp.active = false;
    game.time.events.add(450 , function() {
      this.nextPage.onInputUp.active = true;
      this.prevPage.onInputUp.active = true;
    },this)
  	this.page++;
  	this.refreshLevels();
  },this);

  this.nextPage.label.x = 3;
  this.nextPage.label.y = -3;
  this.nextPage.sfx = game.sfx.click;

  this.nextPage.update = function() {
  	if (this.parent.parent.page < 4) {
  		this.alpha = Math.min(1,this.alpha+0.01);
  		this.onInputUp.active = true;
  	} else {
  		this.alpha = Math.max(0.5,this.alpha-0.01);
  		this.onInputUp.active = false;
  	}
  }






  this.page_nr_group = game.make.group();
  this.page_nr_group.y = 480;

  spading_x = 50;
  start_x = (420-(spading_x*4))*0.5;

  for (var i = 0; i < 5; i++) {
    var img = game.make.button(start_x+(spading_x*i),0,null,function() {
      if (this.parent.parent.page == this.page) return;
      game.sfx.click.play();
      this.parent.parent.page = this.page;
      this.parent.parent.refreshLevels();
    });
    img.loadTexture('ssheet','lvllayer_p'+(i+1).toString());
    img.anchor.setTo(0.5,0.5);
    img.page = i;

    img.update = function() {
      if (this.parent.parent.page == this.page) {
        this.scale.x = Math.min(1,this.scale.x+0.03);
      } else {
        this.scale.x = Math.max(0.5,this.scale.x-0.03);
      }
        this.scale.y = this.scale.x;
    }
    this.page_nr_group.add(img);
  }

  this.page_nr_group.add(this.nextPage);
  this.page_nr_group.add(this.prevPage);
  

  this.category_txt = game.add.bitmapText(210,20,'font_shadow','',50);
  this.category_txt.anchor.setTo(0.5,0);
  this.progress_txt = game.add.bitmapText(210,75,'font_shadow','0/100',30);
  this.progress_txt.anchor.setTo(0.5,0);
  this.addMultiple([this.closeButton,this.buttonGroup,this.page_nr_group,this.category_txt,this.progress_txt]);
 
};



LevelLayer.prototype = Object.create(Phaser.Group.prototype);  
LevelLayer.prototype.constructor = LevelLayer;


LevelLayer.prototype.refreshLevels = function() {
	for (var i = 0; i < 20; i++) {
  	var lvl_number = (this.page*20)+i;
  	var button = this.buttonGroup.getChildAt(i);
  	button.changeLevel(lvl_number)
  }
}


LevelLayer.prototype.init = function() {
  var progress = SaveState.data.puzzle[game.puzzle_category].reduce(function(previousValue, currentValue) {
    return previousValue + currentValue;
  });
  
  switch (game.puzzle_category) {
    case 0:
      this.category_txt.setText('VERY EASY');
      this.category_txt.tint = 0x8DC63F;
      break;
    case 1:
      this.category_txt.setText('EASY');
      this.category_txt.tint = 0xF2CE00;
      break;
    case 2:
      this.category_txt.setText('MEDIUM');
      this.category_txt.tint = 0xF7941E;
      break;
    case 3:
      this.category_txt.setText('HARD');
      this.category_txt.tint =  0xEF4136;
      break;
  }

  this.category_txt.updateText();
  this.progress_txt.setText(progress.toString()+'/100');
  this.progress_txt.updateText();

  this.page = Math.min(Math.floor((SaveState.data.puzzles_unlocked[game.puzzle_category]-1)/20),4);


  for (var page_nr_img = 0; page_nr_img < 5; page_nr_img++) {
    var pg_nr_img = this.page_nr_group.getChildAt(page_nr_img);
    if (pg_nr_img.page != this.page) {
      pg_nr_img.scale.setTo(0.5,0.5);
    }
  }
  

  for (var i = 0; i < 20; i++) {
    var lvl_number = (this.page*20)+i;
    var button = this.buttonGroup.getChildAt(i);
    button.changeLevelWithoutAnimation(lvl_number);
  }

}


LevelLayer.prototype.resize = function() {
  this.buttonGroup.y = 170+((game.height-525)*0.15);

  var spading_y = 75+((game.height-525)*0.1);

  for (var i = 0; i < 20; i++) {

    var yy = ((Math.floor(i/5))*spading_y);
    this.buttonGroup.getChildAt(i).y = yy;

  }

  this.page_nr_group.y = this.buttonGroup.y + (spading_y*4);

}