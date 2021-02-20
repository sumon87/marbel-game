var MLbitmapText = function(x,y,text,width,desired_height,font,size) {  
  Phaser.Group.call(this, game);

  this.x = x;
  this.y = y;
  
  this.max_width = width;
  this.max_height = desired_height;
  this.bitmapTexts = [];
  this.text_array = text.split(' ');
  this.word_index = 0;

  while (this.text_array.length > 0) {
    var bitmapTxt = game.make.bitmapText(0,this.bitmapTexts.length*(size*1.1),font,'',size);
    this.add(bitmapTxt);
    this.bitmapTexts[this.bitmapTexts.length] = bitmapTxt;
    var words_to_cut = this.makeLine(bitmapTxt);
    this.text_array = this.text_array.splice(words_to_cut);

  }


  var y_offset = (this.bitmapTexts.length*(size*1.1))*-0.5;


  this.bitmapTexts.forEach(function(child) {
    child.y += y_offset;
    child.anchor.setTo(0.5,0);
  });

  this.height = Math.min(this.height,this.max_height);

  //this.cacheAsBitmap = true;




};

MLbitmapText.prototype = Object.create(Phaser.Group.prototype);

MLbitmapText.prototype.makeLine = function(bitmapTxt) {
  var upTo = 0;
  while (bitmapTxt.width < this.max_width) {

    if (upTo == this.text_array.length) {
      return upTo;
    }

    upTo++;
    bitmapTxt.setText(this.getTextUpTo(upTo));
    bitmapTxt.updateText();
    if (upTo == 1 && bitmapTxt.width > this.max_width) {
      bitmapTxt.width = this.max_width;
      return 1;
    }

  }
  upTo--;
  bitmapTxt.setText(this.getTextUpTo(upTo));
  return upTo;

}

MLbitmapText.prototype.getTextUpTo = function(upTo) {
  var result = JSON.parse(JSON.stringify(this.text_array));
  result.splice(upTo);
  return result.join(' ');
}


MLbitmapText.prototype.popUpAnimation = function() {

  

  var len = this.bitmapTexts.length;
  var char_numb = 0;


  //Policz litery
  this.bitmapTexts.forEach(function(line) {
    char_numb += line.children.length;
  })

  //
  var delay_array = [];
  for (var i = 0; i < char_numb; i++) {
    delay_array[i] = i;
  }

  delay_array = Phaser.ArrayUtils.shuffle(delay_array);
  delay_index = 0;


  this.bitmapTexts.forEach(function(line) {
    
    var len = line.children.length;
    for (var i = 0; i < len; i++) {
      letter =  line.getChildAt(i)

      if (letter.anchor.x == 0) {
        letter.x = letter.x + (letter.width*0.5);
        letter.y = letter.y + letter.height;
        letter.anchor.setTo(0.5,1);
      }
      var target_scale = letter.scale.x;
      letter.scale.setTo(0,0);
      game.add.tween(line.getChildAt(i).scale).to({x:target_scale*1.5,y:target_scale*1.5},200,Phaser.Easing.Quadratic.In,false,delay_array[delay_index]*20).to({x:target_scale,y:target_scale},200,Phaser.Easing.Sinusoidal.In).start();
      delay_index++;

    }

  })
}