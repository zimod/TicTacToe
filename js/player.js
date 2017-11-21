var MODULE = (function(my){

  my.Player = function (name,token,img,classname,win_screen) {
    this.name = name;
    this.token = token;
    this.myturn = false;
    this.img = img;
    this.classname = classname;
    this.win_screen = win_screen;
    this.occupied = []; // this array will track which position the player occupied on the board
  };

  my.Player.prototype.playTurn = function() {
     this.myturn = true;
     this.token.addClass("active");
  };

  my.Player.prototype.waitTurn = function() {
     this.myturn = false;
     this.token.removeClass("active");
  };

  my.Player.prototype.ResetPlayer = function(){
    this.occupied = [];
    this.myturn = false;
    this.token.removeClass("active");
  }


  return my;
}(MODULE||{}));
