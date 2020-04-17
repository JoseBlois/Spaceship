/*jslint bitwise:true, es5: true */
(function(window,undefined){
    'use strict';
var canvas,ctx = null;
var lastPress = null;
var pressing = [];
var KEY_LEFT =37,KEY_UP = 38,KEY_RIGHT = 39,KEY_DOWN =40,KEY_ENTER = 13,KEY_SPACE = 32;
var track=0;
var score = 0;
var buffer = null,
bufferCtx = null;
var bufferScale = 1,
bufferOffsetX = 0,
bufferOffsetY = 0;
// var y = 70,x = 30;
var pause = true;
var gameover = true;
var player = new Rectangle(90,290,10,10,0,3);
var shot=[];
var enemies=[];
var powerups=[];
var multishot=1;
var messages=[];
var my =null;
var spriteSheet = new Image();
var stars=[];
     //enemies.push(new Rectangle(90,50,10,10));
    // enemies.push(new Rectangle(30,50,15,15))
function reset(){
    player.x = 90;
    player.y=290;
    player.health=3;
    score=0;
    multishot=1;
    my=null;
    messages.length =0;
    powerups.length=0;
    shot.length=0;        
    enemies.length=0;
    enemies.push(new Rectangle(random(buffer.width/10)*10,-10,10,10,0,2));
    gameover=false;
}
function paint(ctx){
    //CLEAN CANVAS
    ctx.font='10px sans-serif'
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,buffer.width,buffer.height);
    //Draw stars 
    ctx.fillStyle='#fff';
        for(let s=0;s<stars.length;s++){ 
        ctx.fillRect(stars[s].x,stars[s].y,1,1);}
    //Draw rectangle
    ctx.fillStyle='#fff';
    if(player.timer%2===0){
    player.drawImage(ctx,spriteSheet,0,0,10,10);
    }
    // else{
    //     ctx.strokeStyle='#FFF';
    //     ctx.strokeRect(player.x,player.y,player.width,player.height)
    // }
    ctx.fillStyle='#f00';
    for(let i = 0;i<shot.length;i++){
        shot[i].drawImage(ctx,spriteSheet,70,0,5,5)
    }
    for (let l = 0; l < enemies.length;l++){
         if(enemies[l].timer%2===0){
        enemies[l].drawImage(ctx,spriteSheet,30,0,10,10) 
        }else{
        enemies[l].drawImage(ctx,spriteSheet,40,0,10,10);
        }
    }
    for(let p = 0; p< powerups.length;p++){
        if(powerups[p].type ===1){
            powerups[p].drawImage(ctx,spriteSheet,50,0,10,10);
        }
        else{
            powerups[p].drawImage(ctx,spriteSheet,60,0,10,10);
        }
    }
    for(let d = 0; d<messages.length;d++){
        ctx.textAlign='center';
        ctx.fillStyle='#f0f'
        ctx.fillText(messages[d].string,messages[d].x,messages[d].y);
    }
    ctx.fillStyle='#FFF'
    ctx.textAlign='left';
    ctx.fillText('Lastpress: ' + lastPress,2,10);
    ctx.fillText('Score: '+score,150,10)
    ctx.fillText('Lifes: '+player.health,150,20)
    ctx.fillText('Shots: '+shot.length,2,20)
    if(pause){
        ctx.textAlign='center';
        if (gameover){
            ctx.fillText('GAME OVER',buffer.width/2,buffer.height/2);
            ctx.fillText('PRESS ENTER TO RESET',buffer.width/2,buffer.height/2+16)
        }else{
        ctx.fillText('PAUSE',buffer.width/2,buffer.height/2);
        ctx.fillText('PRESS ENTER TO CONTINUE',buffer.width/2,buffer.height/2+16)
        }
    }
}
document.addEventListener('keydown',function(evt){
    lastPress = evt.keyCode;
    pressing[evt.keyCode] = true;
},false);
document.addEventListener('keyup',function(evt){
    //lastPress = evt.keyCode;
    pressing[evt.keyCode] = false;
},false);
function act (){
    if(!pause){
            if(gameover){
                reset();
            }
        if(pressing[KEY_LEFT] && player.x>0){
        player.x = player.x-player.width;
        }
        if(pressing[KEY_UP] && player.y-player.height>=250) {
        player.y = player.y-5;
        }
        if(pressing[KEY_RIGHT] && player.x+player.width<buffer.width ){
        player.x = player.x+player.width;
        }
        if(pressing[KEY_DOWN] && player.y+player.height<buffer.height){
        player.y = player.y+5;
        }
        if( pressing[KEY_SPACE] && track > 30 )
        {   if(multishot ===1){
            shot.push(new Rectangle(player.x+2,player.y,4,4,0));
            //lastPress=null;
            track = 0;
            }else if(multishot ===2){
            shot.push(new Rectangle(player.x-1,player.y,4,4,0));
            shot.push(new Rectangle(player.x+8,player.y,4,4,0));
            //lastPress=null;
            track = 0;
            }else if(multishot ===3){
                shot.push(new Rectangle(player.x-3,player.y,4,4,0));
                shot.push(new Rectangle(player.x+3,player.y,4,4,0));
                shot.push(new Rectangle(player.x+9,player.y,4,4,0));
                //lastPress=null;
                track = 0;
            }
        }else{
            track+=5;
        }
        for(let k = messages.length-1;k>=0;k--){
            if (my===null){
                my = messages[k].y
            }else{
            messages[k].y -=2;
            if((my-messages[k].y)>20){
                messages.splice(k,1);
                my=null;
                }
            }
        }
        for(let i = 0;i<shot.length;i++){
            shot[i].y-=6;
            if(shot[i].y < 0){
                // console.table(shot);
                shot.splice(i--,1);
                // console.table(shot); 
            }
        }
        for(let l = 0;l<enemies.length;l++){
            enemies[l].y += 4;
            if(enemies[l].move>=5){
                enemies[l].x+=2;
                enemies[l].move-=5;
                if(enemies[l].move === 0){
                    enemies[l].move=-30;
                }
            }else{ if(enemies[l].move<=5){
                enemies[l].x-=2;
                enemies[l].move+=5;
                if(enemies[l].move === 0){
                    enemies[l].move=30;
                }
            } 
            }
            
            if(enemies[l].timer >0){
                enemies[l].timer--;
            }
            if (enemies[l].y > buffer.height-enemies[l].height ){
                enemies[l].x = random(buffer.width/10)*10;
                enemies[l].y = 0;
            }
            if(enemies[l].intersecs(player)){
                player.timer=20;
                player.health--;
                multishot=1;
                enemies[l].y=0;
                enemies[l].x = random(buffer.width/10)*10;
              
            }
            for(let v = 0; v<shot.length;v++){
                if(enemies[l].intersecs(shot[v])){
                    shot.splice(v,1);
                    enemies[l].health--;
                    if(enemies[l].health===0){
                        var r = random(20);
                        if(r<5){
                            if(r===0){
                                powerups.push(new Rectangle(enemies[l].x,enemies[l].y,5,5,1))
                            }else{
                            powerups.push(new Rectangle(enemies[l].x,enemies[l].y,5,5,0))
                        }
                    }
                    score++;
                    enemies[l].x=random(buffer.width/10)*10;
                    enemies[l].y=-10;
                    enemies[l].health=2;
                    if(enemies.length < 15 ){
                        enemies.push(new Rectangle(random(buffer.width/10)*10,0,10,10,0,2));
                        }
                    }else{
                        enemies[l].timer=10;
                        enemies[l].y-=50;
                    }
                }
            }
        }
         for (let o = powerups.length-1;o>=0;o--){
             powerups[o].y+=2;
             if(powerups[o].y > buffer.height){
                powerups.splice(o,1);
                continue
            }
             if(powerups[o].intersecs(player)){
                 if(powerups[o].type===0){
                     messages.push(new Message('+5!',powerups[o].x,powerups[o].y));
                     score+=5;
                    }
                if(powerups[o].type===1 ){
                    if(multishot<3){
                    multishot++;
                    messages.push(new Message('MULTI!',powerups[o].x,powerups[o].y));
                    }else{
                        score+=5;
                        messages.push(new Message('+5!',powerups[o].x,powerups[o].y));
                    }
                }
                powerups.splice(o,1);

             }
         }
        if(player.timer > 0){
            player.timer--;
        }
        if(player.health <0){
            gameover = true;
            pause = true;} 
    }
    if(lastPress===KEY_ENTER){
            pause = (!pause);
            lastPress = null;
        }
    
}
function repaint(){
    window.requestAnimationFrame(repaint);
    paint(bufferCtx);

        ctx.fillStyle = '#555';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(buffer, bufferOffsetX, bufferOffsetY, buffer.width * bufferScale, buffer.height * bufferScale);
}
function run(){
    setTimeout(run,40);
    act();
}
function Rectangle(x,y,width,height,type,health){
    this.x = (x ===null)?0:x;
    this.y = (y ===null)?0:y;
    this.width = (width===null)?0:width;
    this.height = (height === null)? width : height;
    this.type = (type ===null)?1:type;
    this.health =(health===null)?1:health;
    this.timer = 0;
    this.move = 30;
}
Rectangle.prototype.draw = function(ctx){ 
    ctx.fillRect(this.x,this.y,this.width,this.height);
}
Rectangle.prototype.intersecs = function(rect){
    if(rect === undefined){
        window.console.warn('Missing parameters on function intersecs');
    }else{
        return (this.y<rect.y+rect.height && this.y +this.height>rect.y&&
                this.x+this.width>rect.x && this.x<rect.x+rect.width)
    }
}
Rectangle.prototype.drawImage = function(ctx,img,sx,sy,sw,sh){
    if(img.width){
        ctx.drawImage(img,sx,sy,sw,sh,this.x,this.y,this.width,this.height);
    }
    else{ctx.fillRect(this.x,this.y,this.width,this.height);}
}
function Message(string,x,y){
    this.string = (string ===null)?'?':string;
    this.x = (x ===null)?0:x;
    this.y = (y === null)?0:y;
}
function Star(x,y){
    this.x=(x==null)?0:x;
    this.y=(y==null)?0:y;
}
function resize(){
    canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
       
        var w = window.innerWidth / buffer.width;
        var h = window.innerHeight / buffer.height;
        bufferScale = Math.min(h, w);
       
        bufferOffsetX = (canvas.width - (buffer.width * bufferScale)) /2 ;
        bufferOffsetY = (canvas.height - (buffer.height * bufferScale));
        
}
function random(max){
    return ~~(Math.random()*max);
}
var init = function (){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d')
    canvas.width=200;
    canvas.height=300;

    //create dobble buffer
    buffer = document.createElement('canvas');
    bufferCtx = buffer.getContext('2d');
    buffer.width = 200;
    buffer.height = 300;
    for(let i = 0 ; i<100;i++){
        stars.push(new Star(random(canvas.width),random(canvas.height)));
    }
    //Assigning the spritesheet
    spriteSheet.src='assets/sprites.png'
    console.log('inicio')
    resize()
    run();
    repaint();
};
window.addEventListener('resize', resize,false);
window.addEventListener('load',init,false);
window.requestAnimationFrame=(function(){
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||function(callback){window.setTimeout(callback,17);};})();
}(window))