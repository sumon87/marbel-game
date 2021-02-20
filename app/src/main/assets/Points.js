var Points = function(x,y) {  

  Phaser.BitmapText.call(this, game, x, y, 'font_shadow', '0', 45);
  this.anchor.setTo(0.5,0.5);

  this.bar = game.make.image(0,0,'ssheet','timebar_bar');

  this.points = 0;
  this.pointsTxt = 0;
  this.timerIndex = 0;


}

Points.prototype = Object.create(Phaser.BitmapText.prototype);  
Points.prototype.constructor = Points;


Points.prototype.addPoints = function(length_of_pattern) {
  this.points += length_of_pattern;
}

Points.prototype.update = function() {
  if (this.points == this.pointsTxt) return;

  this.pointsTxt++;
  this.setText(this.pointsTxt.toString());

}