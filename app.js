$(document).ready(function(){

    var Button={
            green:{
                name:"green",
                value: 0
            },
            blue:{
                name:"blue",
                value: 0
            },
            yellow:{
                name:"yellow",
                value:0
            },
            red:{
                name:"red",
                value:0
            }
            
    }
    var yourScore=0
    var targetScore=0
    var winCount=0
    var lossesCount=0

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
    
    function reset (){
        yourScore=0;
        targetScore=randomNumber(11,111)
        Button.green=randomNumber(1,12)
        Button.blue=randomNumber(1,12)
        Button.yellow=randomNumber(1,12)
        Button.red=randomNumber(1,12)
        console.log(targetScore,Button)

        $("#targetScore").html(targetScore)
        $("#yourScore").html(yourScore)
    }

    function winLose(){
        if (targetScore<yourScore){
            lossesCount++
            console.log(lossesCount+" loss")
            $("#lossScore").html(lossesCount)
            reset()
        }
        else if (yourScore===targetScore){
            winCount++
            console.log(winCount+" win")
            $("#winScore").html(winCount)
            reset()
        }
    }
     
    function buttonNumbers(click){
       console.log(click)
        yourScore += click ;

       $("#yourScore").html(yourScore)
       winLose()
    }
    reset()
    $("#blue").click(function(){
        buttonNumbers(Button.blue)
    })
    $("#red").click(function(){
            buttonNumbers(Button.red)
    })
    $("#green").click(function(){
        buttonNumbers(Button.green)   
    })
    $("#yellow").click(function(){
        buttonNumbers(Button.yellow)  
    })

})