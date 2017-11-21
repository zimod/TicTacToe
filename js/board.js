var MODULE = (function(my){
  my.Board = function(){
     this.Boxes = $('.box');//store the 9 boxes
     this.Players = [];//array to store 2 players
     this.CurrentPlayerIndex = 0;//initial value
     this.CurrentBoxIndex = 0;//initial value
    }

  my.Board.prototype.addPlayer = function(player){//add player in the Players array
      this.Players.push(player);
    }

  my.Board.prototype.PlayerPlay = function(){
     let currentPlayer = this.Players[this.CurrentPlayerIndex];
     currentPlayer.playTurn();
  }

  my.Board.prototype.PlayerWait = function(){
     let currentPlayer = this.Players[this.CurrentPlayerIndex];
     currentPlayer.waitTurn();
  }

  my.Board.prototype.Initialization = function(){//set all box occupation to empty at the start of the game
      for(let i = 0; i<this.Boxes.length; i+=1){
         this.Boxes[i].className += " empty";
      }
  }

  my.Board.prototype.BoxHover = function(){//when the current player hover over the box
      let currentPlayer = this.Players[this.CurrentPlayerIndex];
        this.Boxes.hover(function(){
          if($(this).hasClass("empty")){   //hover to a valid empty box
            $(this).css("background-image", currentPlayer.img);
          }
        },function(){
          $(this).css("background-image", "");
        });
  }

  //this is the important logic function here, since click handler are decided by most of the key logic
  my.Board.prototype.BoxClick = function(){//when the current player clicks on one of the 9 boxes
     let self = this; //very important to understand , see https://stackoverflow.com/questions/337878/var-self-this
                      //basically this changes to different things with scopes, but we store it into a varaiable self here so we can use the same self later
     self.Boxes.click(function(){
       if($(this).hasClass("empty") && self.CurrentPlayerIndex === 0){ //clicked on a valid empty box and also it is in the human players turn so that click during the Ai's turn does nothing
         let currentPlayer = self.Players[self.CurrentPlayerIndex];
         my.OccupyEmptyBox(self,$(this),currentPlayer);
         my.verification(self,currentPlayer,"AI");//here to choose fighting with another player or AI
       }
     });
  }

  //helper function to handle the logic when player occupy an empty box
  my.OccupyEmptyBox = function(self,this_box,currentPlayer){
    this_box.addClass(currentPlayer.classname);//add the classname to the box so it is colored
    this_box.removeClass("empty");//since it is occupied, the box is no longer empty
    currentPlayer.occupied.push(this_box.attr('id'));//push the box id into the occupid array
    console.log(currentPlayer.name + " "+ currentPlayer.occupied);
  }

  //the win condition verifier function
  my.verification = function(thisObj,currentPlayer,PlayerOrAINext){
    if(thisObj.WinOrDraw() === false){// if the game needs to be continued and no one has won or draw
      if(PlayerOrAINext === "player"){//next to play is the player
       thisObj.NextPlayer();
       thisObj.BoxHover();
     }else if(PlayerOrAINext === "AI"){//next to play is the AI
       thisObj.NextRandomAI();
     }
   }else if(thisObj.WinOrDraw() === true){//game is decided either p1 win, p2 win,
      //show the result
      console.log(currentPlayer);
      $("#finish").addClass(currentPlayer.win_screen);
      $("#finish .message").text(currentPlayer.name +" is the "+"Winner!");
      $("#finish").show();
      $("#board").hide();
    }else if (thisObj.WinOrDraw() === "tie"){//game is a tie
      //show the result
      $("#finish").addClass("screen-win-tie");
      $("#finish .message").text("It is a Tie!");
      $("#finish").show();
      $("#board").hide();
    }
  }

  //this AI will choose a random valid box everytime, it will not max the win chance
  my.Board.prototype.NextRandomAI = function(){
    let self = this;
    self.PlayerWait();//let the current player waitTurn
    self.CurrentPlayerIndex += 1;//move the current player index to next none
    if(self.CurrentPlayerIndex === self.Players.length ){//means out of the Player array scope, back to index 0
      self.CurrentPlayerIndex = 0;//back to first player
    }

    self.PlayerPlay();
    console.log("AI gonna play better watch out!");

    //Getting a random integer between two values [min,max)
    const getRandomInt = (min, max)=> {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    };

    setTimeout(function(){//since this is an AI, we will program the behavior here
      let empty_boxes = $(".empty");
      console.log(empty_boxes);//this will show all the current empty box, and our AI will choose a random one to click
      let randomIndex = getRandomInt(0,empty_boxes.length);//generate a random index for empty boxes within index [0,length)
      let randomBox = empty_boxes[randomIndex];//get the random box
      //very similar to the BoxClick logic, propably can simplify

      let currentPlayer = self.Players[self.CurrentPlayerIndex];//current player is the AI
      my.OccupyEmptyBox(self,$(randomBox),currentPlayer);
      my.verification(self,currentPlayer,"player");

    },3000);
  }

  my.Board.prototype.NextPlayer = function(){
     this.PlayerWait();//let the current player waitTurn
     this.CurrentPlayerIndex += 1;//move the current player index to next none
     if(this.CurrentPlayerIndex === this.Players.length ){//means out of the Player array scope, back to index 0
       this.CurrentPlayerIndex = 0;//back to first player
     }
     this.PlayerPlay();//let the new player play the turn
  }

  my.Board.prototype.WinOrDraw = function(){
     const containsAll =(needles, haystack)=>{ //helper function to find out if haystack array contains needles array
       for(var i = 0 , len = needles.length; i < len; i++){
       if($.inArray(needles[i], haystack) == -1) return false;
      }
      return true;
   };
       let win = false;//this bool will tell us if the game is won
       let tie = "";
       let currentPlayer = this.Players[this.CurrentPlayerIndex];//current player
       let newArray = currentPlayer.occupied.map(function(item){//this newArray will return the occupied position by current player in integers
            return parseInt(item[1]);
         }).sort(function(a, b){return a - b});//sort the int array by value
         console.log(newArray);

       if(newArray.length >= 3){//must be more than 3 occupied boxes to stand a chance to win
         if(containsAll([0,1,2],newArray)||containsAll([3,4,5],newArray)||containsAll([6,7,8],newArray)){//one win conditions where 3 in a row horizontally
           win = true;
         }else if(containsAll([0,3,6],newArray)||containsAll([1,4,7],newArray)||containsAll([2,5,8],newArray)){//one win conditions where 3 in a row vertically
           win = true;
         }else if(containsAll([0,4,8],newArray)||containsAll([2,4,6],newArray)){//one win conditions where 3 in a row diagnally
           win = true;
         }else if(newArray.length === 5){//did not pass any win condition and has length of 5, means a draw
           console.log("tie");
           tie = "tie";
           return tie;
         }
       }
       return win;
  }

  my.Board.prototype.ResetBoard = function(){
    for(let i = 0; i< this.Boxes.length; i+=1){
      this.Boxes[i].className = "box empty";
    }
    this.CurrentPlayerIndex = 0;
  }


 return my;
}(MODULE||{}));
