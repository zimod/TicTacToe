var MODULE = (function(my){//using the Augmentation module pattern here, since we have more than one files
                           //http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html for more info
  const playGame = ()=>{
    //initilization
    let player1 = new my.Player("",$("#player1"),"url(img/o.svg)","box-filled-1","screen-win-one");
    let player2 = new my.Player("AI",$("#player2"),"url(img/x.svg)","box-filled-2","screen-win-two");
    let GameBoard = new my.Board();
    //welcome function show and hide related screens
    const welcome = ()=>{//show the welcome screen
       $("#finish").hide();
         $("#board").hide();
         $("#start_btn").click(function(){
             if($("#user_name").val() !== ""){//user entered a name
               $("#start").hide();
               $("#board").show();
               $("#input_name").text($("#user_name").val());
               player1.name = $("#user_name").val(); //record the player input into player1.name
             }else{//user did not enter a name
               $("#who_is_this").text("Please enter a name first");
               $("#who_is_this").css("color","red");
             }
         });
      };
    welcome();

    GameBoard.addPlayer(player1);
    GameBoard.addPlayer(player2);
    GameBoard.Initialization();
    player1.playTurn();
    GameBoard.BoxHover();
    GameBoard.BoxClick();

    const newGame = ()=>{
      $("#btn-newGame").click(function(){
        $("#finish").hide();
        $("#board").show();

        GameBoard.ResetBoard();
        player1.ResetPlayer();
        player2.ResetPlayer();
        $("#finish").attr("class","screen screen-win");//reset win screen class name

        player1.playTurn();
        GameBoard.BoxHover();
        GameBoard.BoxClick();
      });
    };
    newGame();
  };

  const main = ()=>{
      playGame();
    };

  main();

  return my;
}(MODULE||{}));
