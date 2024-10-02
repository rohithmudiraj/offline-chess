const board=document.querySelector('.board');
const player=document.querySelectorAll('.player');
const btn=document.querySelector('.btn');



//collecting coords for board length
// board.addEventListener('click',function(e){
// e.preventDefault();
// console.log(this);
//  console.log(e.x+" "+e.y);
//  //80 80
// })


//stores values
let map = new Map();
map.set(0,'rook');map.set(1,'knight');map.set(2,'bishop');map.set(3,'queen');map.set(4,'king');
map.set(5,'bishop');map.set(6,'knight');map.set(7,'rook');

//array to store pieces IMG
let cp=[];
let white=true;
let selectedPiece=null;
let selected=false;
let selectedX=null;
let selectedY=null;
let enemyfound=false;
let moves=[[],[],[],[],[],[],[],[]];

//adding transparent rectangles on Board (step1)
let xb=355;
let yb=0;//origin
let diffa=80;
for(let i=0;i<8;i++){
  for(let j=0;j<8;j++){
    let h = document.createElement("BTN");
    h.className="inv_btn";
    h.setAttribute("data-x",i);
    h.setAttribute("data-y",j);
    h.setAttribute("data-canReach",false);
    h.style.left=`${+xb+(diffa*j)}px`;
    h.style.top=`${+yb+(diffa*i)}px`;
    document.body.appendChild(h);
  }
}
const inv=document.querySelectorAll('.inv_btn');//all invisible buttons

//placing pieces(step 2)
const placePieces= function(){
let x=362;
let y=6;
for(let row=0;row<8;row++){
  let temp=[];
for(let column=0;column<8;column++){
let h = document.createElement("IMG");
let color=(row>2?"w":"b");
h.classList.add(color);
h.value=color;
if(row==1|| row==6){
h.name="pawn";
h.setAttribute("src", `${color+"_"+"pawn.png"}`);
}
else if(row==0|| row==7){
h.name=map.get(column);
h.setAttribute("src", `${color+"_"+map.get(column)+".png"}`);
}
else{
temp.push(null);
  continue;
}
h.style.pointerEvents="none";
h.classList.add("piece");
h.style.left=`${+x+(column*81)}px`;
h.style.top=`${+y+(row*81)}px`;
document.body.appendChild(h);
temp.push(h);
}
cp.push(temp);
}
}

const getPawn=function(img,color){
  if(img==null) return true;
  if(img.value==color){
    return false;
  }
  else{
    enemyfound=true;
    return true;
  }
}

//create dots when pawn is pressed(step 3) listen for moves
for(let i=0;i<inv.length;i++){
inv[i].addEventListener('click',function(){//mouseover
let x=this.dataset.x;
let y=this.dataset.y;
if(cp[x][y]==null){
if(!selected){
  return;
}
else{
let diditmove=  movePieces(selectedX,selectedY,x,y);
  selectedX=null;
  selectedY=null;
  selected=false;
  selectedPiece=null;
  if(diditmove){
    switchPlayer();
  }
}
}
else{
  if(selectedPiece==cp[x][y]){
    clearDots();
      selected=false;
      selectedPiece=null;
      selectedX=null;
      selectedY=null;
      return;
    }
    else if(!selected){
      if(white && cp[x][y].value=='b' || !white && cp[x][y].value=='w')return;
      createDots(x,y);
      selected=true;
      selectedPiece=cp[x][y];
      selectedX=x;
      selectedY=y;
    }
    else{
      if(cp[x][y].value==selectedPiece.value){
        clearDots();
        createDots(x,y);
        selected=true;
        selectedPiece=cp[x][y];
        selectedX=x;
        selectedY=y;
        return;
      }
      let diditmove=  movePieces(selectedX,selectedY,x,y);
        selectedX=null;
        selectedY=null;
        selected=false;
        selectedPiece=null;
        if(diditmove){
          switchPlayer();
        }
        clearDots();
    }

}
})
}

//switchplayer
const switchPlayer = function(){
  white=!white;

  for(let i=0;i<player.length;i++){
    player[i].classList.toggle("player--active");
  }
   checkForCheck();
}

const clearDots=function(){
  const allDots=document.querySelectorAll('.dot');

  for(let i=0;i<allDots.length;i++){
    let dotx=allDots[i].dataset.x;
    let doty=allDots[i].dataset.y;
    moves[dotx][doty]=false;
    allDots[i].remove();
  }
}

const makeDot=function(y,x,check=false){
  if(check){
    if((white && cp[y][x]!=null && cp[y][x].name=="king" && cp[y][x].value=="w") || (!white && cp[y][x]!=null && cp[y][x].name=="king" && cp[y][x].value=="b")){
      // console.log("checking");
      // console.log(white);
      // console.log(x+" "+y);
      // console.log(cp[x][y]);
      alert("check");
    }
    return;
  }
  // console.log(y+" "+x+" "+side);
  moves[y][x]=true;
  let i=380;
  let j=25;

  const dot=document.createElement("span");
  dot.className="dot";
  dot.setAttribute("data-x",y);
  dot.setAttribute("data-y",x);
  dot.style.pointerEvents="none";
  dot.style.left=`${+i+((x)*81)}px`;
  dot.style.top=`${+j+((y)*81)}px`;
   // console.log(dot);
  document.body.appendChild(dot);
return false;
}

//different traversals

//diagonals

const diag=function(x,y,color,checkingCheck=false){
  let tempx=x;
  let tempy=y;
  enemyfound=false;
  while(--x>=0 && ++y<8 && !enemyfound && getPawn(cp[x][y],color) ){
    makeDot(x,y,checkingCheck);
  }
  x=tempx;
  y=tempy;
  enemyfound=false;
  while(++x<8 && ++y<8 && !enemyfound && getPawn(cp[x][y],color)){
    makeDot(x,y,checkingCheck);
  }
  x=tempx;
  y=tempy;
    enemyfound=false;
  while(++x<8 && --y>=0 && !enemyfound && getPawn(cp[x][y],color) ){
    makeDot(x,y,checkingCheck);
  }
  x=tempx;
  y=tempy;
    enemyfound=false;
  while(--x>=0 && --y>=0 && !enemyfound && getPawn(cp[x][y],color) ){
    makeDot(x,y,checkingCheck);
  }
enemyfound=false;
}

const sides=function(x,y,color,checkingCheck=false){
  let tempx=x;
  let tempy=y;
  while(--x>=0 && !enemyfound && getPawn(cp[x][y],color)  ){
    makeDot(x,y,checkingCheck);
  }

  x=tempx;
  y=tempy;
    enemyfound=false;
  while(++x<8 && !enemyfound && getPawn(cp[x][y],color)  ){
    makeDot(x,y,checkingCheck);
  }
  x=tempx;
  y=tempy;
    enemyfound=false;
  while(++y<8 && !enemyfound && getPawn(cp[x][y],color) ){
    makeDot(x,y,checkingCheck);
  }
  x=tempx;
  y=tempy;
    enemyfound=false;
  while(--y>=0 && !enemyfound  && getPawn(cp[x][y],color)  ){
    makeDot(x,y,checkingCheck);
  }
    enemyfound=false;
}

const L=function(x,y,color,checkingCheck=false){
  x=+x;
  y=+y;
if(x-2>=0 && y-1>=0 && !enemyfound && getPawn(cp[x-2][y-1],color) ){
makeDot(x-2,y-1,checkingCheck);
}
  enemyfound=false;
if(x-1>=0 && y-2>=0 && !enemyfound && getPawn(cp[x-1][y-2],color) ){
makeDot(x-1,y-2,checkingCheck);
}
  enemyfound=false;
if(x-2>=0 && y+1<8 && !enemyfound && getPawn(cp[x-2][y+1],color) ){
makeDot(x-2,y+1,checkingCheck);
}
  enemyfound=false;
if(x-1>=0 && y+2<8 && !enemyfound && getPawn(cp[x-1][y+2],color)  ){
makeDot(x-1,y+2,checkingCheck);
}
  enemyfound=false;
if(x+1<8 && y-2>=0 && !enemyfound && getPawn(cp[x+1][y-2],color) ){
makeDot(x+1,y-2,checkingCheck);
}
  enemyfound=false;
if(x+2<8 && y-1>=0 && !enemyfound && getPawn(cp[x+2][y-1],color) ){
makeDot(x+2,y-1,checkingCheck);
}
  enemyfound=false;
if(x+1<8 && y+2<8 && !enemyfound && getPawn(cp[x+1][y+2],color) ){
makeDot(x+1,y+2,checkingCheck);
}
enemyfound=false;
if(x+2<8 && y+1<8 && !enemyfound && getPawn(cp[x+2][y+1],color)  ){
makeDot(x+2,y+1,checkingCheck);
}
enemyfound=false;
}



const createDots=function(x,y,checkingCheck=false){
  y=Number(y);
  x=Number(x);
  const color=cp[x][y].value;
  const pie=cp[x][y].name;
  console.log(pie);
  if(pie==="king"){
    //sides
    if(y-1>=0 && !enemyfound && getPawn(cp[x][y-1],color) ){
      makeDot(x,y-1,checkingCheck);
    }
    enemyfound=false;
    if((y+1)<8 && !enemyfound && getPawn(cp[x][y+1],color) ){
      makeDot(x,y+1,checkingCheck);
    }
    enemyfound=false;
    if(x-1>=0 && !enemyfound && getPawn(cp[x-1][y],color) ){
      makeDot(x-1,y,checkingCheck);
    }
    enemyfound=false;
    if(x+1<8 && !enemyfound && getPawn(cp[x+1][y],color)){
      makeDot(x+1,y,checkingCheck);
    }
    enemyfound=false;
    //corners
    if(x-1>=0 && y-1>=0 && !enemyfound && getPawn(cp[x-1][y-1],color) ){
      makeDot(x-1,y-1,checkingCheck);
    }
    enemyfound=false;
    if(x+1<8 && y+1<8 && !enemyfound && getPawn(cp[x+1][y+1],color) ){
      makeDot(x+1,y+1,checkingCheck);
    }
    enemyfound=false;
    if(x-1>=0 && y+1<8 && !enemyfound && getPawn(cp[x-1][y+1],color)){
      makeDot(x-1,y+1,checkingCheck);
    }
    enemyfound=false;
    if(x+1<8 && y-1>=0 && !enemyfound && getPawn(cp[x+1][y-1],color) ){
      makeDot(x+1,y-1,checkingCheck);
    }
    enemyfound=false;
  }
  else if(pie=="bishop"){
    diag(x,y,color,checkingCheck);
  }
  else if(pie=="rook"){
    sides(x,y,color,checkingCheck);
  }
  else if(pie=="queen"){
    diag(x,y,color,checkingCheck);
    sides(x,y,color,checkingCheck);
  }
  else if(pie=="knight"){
    L(x,y,color,checkingCheck);
  }
  else if(pie=="pawn"){
    if(color=="b"){
      if(x+1<8 && cp[x+1][y]==null){
        makeDot(x+1,y,checkingCheck);
        if(x==1 && x+2<8 && cp[x+2][y]==null  ){
          makeDot(x+2,y,checkingCheck);
        }
      }
      enemyfound=false;
      if(x+1<8 && y-1>=0 && getPawn(cp[x+1][y-1],color) && cp[x+1][y-1]!=null){

        makeDot(x+1,y-1,checkingCheck);
      }
      if(x+1<8 && y+1<8 && getPawn(cp[x+1][y+1],color) && cp[x+1][y+1]!=null){
        makeDot(x+1,y+1,checkingCheck);
      }
    }
    else{
      console.log("entered pawn trav");
      if(x-1>=0 && cp[x-1][y]==null){
        makeDot(x-1,y,checkingCheck);
        if(x==6 && x-2>=0 && cp[x-2][y]==null  ){
          makeDot(x-2,y,checkingCheck);
        }
      }
      enemyfound=false;

      if(x-1>=0 && y-1>=0 && getPawn(cp[x-1][y-1],color) && cp[x-1][y-1]!=null){
        makeDot(x-1,y-1,checkingCheck);
      }
      if(x-1>=0 && y+1<8 && getPawn(cp[x-1][y+1],color) && cp[x-1][y+1]!=null){
        makeDot(x-1,y+1,checkingCheck);
      }
    }
  }
  else{
console.log(piece+"wtf are u an imposter?");
  }
};

placePieces();
 const movePieces=function(fromX,fromY,toX,toY){
   if(fromX==toX && fromY==toY){
     return;
   }
   // console.log(fromX+" "+fromY+" "+toX+" "+toY+" "+img);
   // console.log(moves);
   if(moves[toX][toY]){
     //moving pawn based on coordinatesssssssssssss
     // console.log(img);
     let currImg=cp[fromX][fromY];
     let color=currImg.value;
     currImg.style.left=`${+currImg.offsetLeft+81*(toY-fromY)}px`;
     currImg.style.top=`${+currImg.offsetTop-81*(fromX-toX)}px`;
     // console.log(img);
     if(cp[toX][toY]!=null){
       let opImg=cp[toX][toY];
       let name=opImg.name;
       let opsrc=cp[toX][toY].src;
       if(name=="king"){
         cp[toX][toY].remove();
         alert(`Player ${color=='w'?1:2} Won`);
         window.location.reload();
         return;
       }
       cp[toX][toY].remove();
     };
     cp[toX][toY]=cp[fromX][fromY];
     cp[fromX][fromY]=null;
     clearDots();
     return true;
   }
   else{
     return false;
   }
 };


 const checkForCheck=function(){
   if(white){
     for(let i=0;i<8;i++){
       for(let j=0;j<8;j++){
         if(cp[i][j]==null){
           continue;
         }
         if(cp[i][j].value=="w"){
           continue;
         }
         createDots(i,j,true);
       }
     }
   }
   else{
     for(let i=0;i<8;i++){
       for(let j=0;j<8;j++){
         if(cp[i][j]==null){
           continue;
         }
         if(cp[i][j].value=="b"){
           continue;
         }
        createDots(i,j,true);
       }
     }

   }

 }
