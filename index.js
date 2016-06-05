 var lightingCanvas,gridCanvas,tileCanvas,toolUICanvas,wiringPower,canvasContainerStack;
 var textureContents,blockSelector;
 var terrainBlendingTextures=["2vdblendcircle2bh.jpg","2vdblendcircle3bh.jpg","2vdblendcirclebh.jpg","2vdblendcorner2bh.png","2vdblendcornerbh.jpg","2vdblendedge4bh.jpg","2vdblendedge5bh.jpg","2vdblendedge6bh.jpg","2vdblendedge7bh.jpg","2vdblendedgebh.jpg","2vdblendedgecornerbh.jpg","2vdblendedgetwocornersbh.jpg","2vdblendfourcornersbh.jpg","2vdblendlshape2bh.png","2vdblendlshapebh.jpg","2vdblendlshapecornerbh.png","2vdblendthreecornersbh.png","2vdblendtwocornersbh.jpg","2vdblendtwoedgesbh.png","2vdblendtwooppositecornersbh.png","2vdblendushapebh.png","blendcircle2bh.png","blendedge6bh.png","customThree.png","customFour.png","customThreeRightFilled.png","customThreeLeftFilled.png","customHalfFullDiagional.png","customFourHalfFullWithPath.png","customFourQuarterEmpty.png"];
 var finder=terrainBlendingTextures.join(",").split(",");//termporary variable to help find its id
 
 var terrainBlendingTexturesProgress=0;
 var imageQuality=8;
 var mapSize=[31,31];
 var imgTexturesArray=[];
 

tiles=new Uint8Array(mapSize[0]*mapSize[1]*4);
//tile[0-3]=first tile,tile[4-7]=second tile;
//tile[0]=first tile's underground attribute
//tile[1]=first tile's tree attribute
//tile[2]=first tile's building
//tile[3]=first tile's reservation
function addID2XY(id,x,y,attributeID){
	//if the tile exists, don't replace it
	var index=x+(mapSize[0]*y);
	tiles[(index*4)+attributeID]=id;
}
function getIDByXY(x,y){
	var index=x+(mapSize[0]*y);
	return [tiles[(index*4)+0],tiles[(index*4)+1],tiles[(index*4)+2],tiles[(index*4)+3]];
}
var forestChancesIndex=new Array(mapSize[0]*mapSize[1]);
var uncommonstoneChancesIndex=new Array(mapSize[0]*mapSize[1]);
function isThisTileUsedGraphically(x,y,data){ //not optimized, just a dirty function.
	var parsedWidth=(lightingCanvas.offsetWidth/lightingCanvas.width);		
	var parsedHeight=(lightingCanvas.offsetHeight/lightingCanvas.height);
	var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
	var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	var tileCTX=tileCanvas.getContext("2d");
	var data=tileCTX.getImageData(x*cellSizeX,y*cellSizeY,(cellSizeX),(cellSizeY) ).data;
	for(var i=data.length-1;i>-1 && (data[i-=4]!=0);)return true; //
			
	return false;
}
//				uncommonStoneSurfaceMaterial(5,12,"white","silver",1);//graphite (battery)
//			uncommonStoneSurfaceMaterial(10,3,"#768","#999",-1)//Cassiterite (low-end power transfer line)
//			uncommonStoneSurfaceMaterial(20,30,"#444","#111",-1)//Ferrous (heavy-duty steel making with iron)
//			uncommonStoneSurfaceMaterial(24,23,"#EF4","#CB4",1)//Gold
stones=[[5,12,"white","silver",1],[10,3,"#768","#999",-1],[20,30,"#444","#111",-1],[24,23,"#EF4","#CB4",1]];
function genereatePlanetaryTile(){
//generates all base tile within a planetary tile
//generate in the following order: 
	//Land coloring (onstartup)
	//Terrain generation (water, cliff, asteroid crashed-land) (onstartup)
	//Underground (onstartup) (needs to be changed to use tiles )
	
//use tiles database to for below:
	//Forest (plentiful on green terrain, medium on yellow, low on red (not asteroid);
	for(var i=forestChancesIndex.length;--i>-1;){
	
		
		var x=(i%mapSize[0]);
		var y=parseInt(i/mapSize[1]);
		if(forestChancesIndex[i]>Math.random()+.2){
			//drawDebugNumberAsIndex(4,i, (isThisTileUsedGraphically(x,y)) );//*(Math.random()*15|0) );
			(isThisTileUsedGraphically(x,y))?window:drawTree(4+parseInt(forestChancesIndex[i]*13),x ,y);
			addID2XY(1,x,y,0)
		}
		if(uncommonstoneChancesIndex[i]>Math.random()+.855){
			var stone=Math.random()*stones.length|0;
			//uncommonStoneSurfaceMaterial(stones[stone][0],stones[stone][1],);
			(isThisTileUsedGraphically(x,y))?window:uncommonStoneSurfaceMaterial(x,y,stones[stone][2],stones[stone][3],stones[stone][4]);
			addID2XY(1,x,y,1)
		}
	}
	//Building

}
function appendUnit(width,height,idCode,ctx){

}
function tileBuildingFloor(x,y){
	hiddenCanvas.width=32;
	hiddenCanvas.height=32;
	hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);
	var tileCTX=tileCanvas.getContext("2d");
	var gradient = hiddenCTX.createLinearGradient(0, -16,32,32);
	gradient.addColorStop(0,"rgba(255,255,155,0.1)");
	gradient.addColorStop(0.5,"rgba(255,255,255,0.3)");
	gradient.addColorStop(1,"rgba(255,255,0,0.1)");
	hiddenCTX.fillStyle=gradient;
	hiddenCTX.fillRect(0,0,32,32);
	
}
function uncommonStoneSurfaceMaterial(x,y,fillStyle,strokeStyle,size){
hiddenCanvas.width=32;
	hiddenCanvas.height=32;
	hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);
hiddenCTX.beginPath();
hiddenCTX.fillStyle="#"+((1<<24)*Math.random()|0).toString(16);

for(var i=1+(Math.random()*12);i-->0;){
	
	var posX=16+(parseInt(Math.random()*12)*(~~(Math.random()+0.5)?-1:1));
	var posY=16+(parseInt(Math.random()*12)*(~~(Math.random()+0.5)?-1:1));
	hiddenCTX.beginPath();
	hiddenCTX.arc(posX,posY,(~~(Math.random()+0.5)?3+(size|0):2+(size|0)),Math.random()*1.12*Math.PI,Math.random()*2*Math.PI);
	hiddenCTX.fillStyle=fillStyle||"white";
	hiddenCTX.fill();
	if(~~(Math.random()+0.5)){
		hiddenCTX.globalCompositeOperation="source-atop"
		hiddenCTX.strokeStyle=strokeStyle||"silver";
		hiddenCTX.stroke();
		hiddenCTX.globalCompositeOperation="source-over"
	}
}





appendToTile(hiddenCanvas,x,y);
}


function drawDebugNumber(size,x,y,text){
	hiddenCanvas.width=32;
	hiddenCanvas.height=32;
	hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);	 
	hiddenCTX.translate(5, 15);
		
	
	hiddenCTX.font="12px"
	hiddenCTX.fillText(text,0,0);
	hiddenCTX.fill();
	 appendToTile(hiddenCanvas,x,y);
	 
	  //tileCanvas.getContext("2d").drawImage(hiddenCanvas,0,0);
	  

}
function drawDebugNumberAsIndex(size,i,text){
	hiddenCanvas.width=32;
	hiddenCanvas.height=32;
	hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);	 
	hiddenCTX.translate(5, 15);
		
	
	
	hiddenCTX.font="12px"
	hiddenCTX.fillText(text,0,0);
	hiddenCTX.fill();
	var x=(i%mapSize[0]);
	var y=parseInt(i/mapSize[1]);
	 appendToTile(hiddenCanvas,x,y);
	 
	  //tileCanvas.getContext("2d").drawImage(hiddenCanvas,0,0);
	  

}
function dugHole(xx,yy){
hiddenCanvas.width=32;
	hiddenCanvas.height=32;
	hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);
hiddenCTX.beginPath();
var grd=hiddenCTX.createRadialGradient(16,16,0,16,16,48);
	grd.addColorStop(0,"black");
	grd.addColorStop(0.2,"silver");
hiddenCTX.fillStyle=grd
var dugRandomInc=parseInt(Math.random()*11)+1;
for (i=dugRandomInc; i< 8+dugRandomInc; i+=1) {
		  angle =-1 * i;
		  x=(1+angle)*Math.cos(angle);
		  y=(1+angle)*Math.sin(angle);
		  hiddenCTX.lineTo(x+16, y+16);
		 
		 
		}
hiddenCTX.fill();
hiddenCTX.stroke();

for (i=dugRandomInc; i< 22+dugRandomInc; i+=1) {
		  angle = 1 * i;
			hiddenCTX.moveTo(16,16);
		  x=(1+angle)*Math.cos(angle);
		  y=(1+angle)*Math.sin(angle);
		  hiddenCTX.lineTo(x+16, y+16);
		 
		 
		}
var grd=hiddenCTX.createRadialGradient(16,16,0,16,16,48);
	grd.addColorStop(0,"#333");
	grd.addColorStop(0.4,"rgba(255,255,255,0.3)");
hiddenCTX.globalCompositeOperation="source-atop"
hiddenCTX.strokeStyle=grd;
hiddenCTX.stroke();
appendToTile(hiddenCanvas,xx,yy);
}
function pileDebris(xx,yy){
hiddenCanvas.width=32;
	hiddenCanvas.height=32;
var elem = gridCanvas;
var height=32;
var width=32;
var tiles=[];
	var min = Number.MAX_VALUE;
	var max = Number.MIN_VALUE;
for(var i = 0; i<= height; i++){
	tiles[i] = [];
	for(var j = 0; j <= width; j++) {
		tiles[i][j] = perlin2d(i,j);
		min = Math.min(min, tiles[i][j]);
		max = Math.max(max, tiles[i][j]);
	}
}
		var randColor=parseInt(Math.random*255);
          var context = hiddenCTX;
              var imageData = context.createImageData(width, height);
              for (y = 0; y <= height; y++) {
                  for (x = 0; x <= width; x++) {
                      var pixelIndex = (y * 4 * width) + x * 4;
                     imageData.data[pixelIndex + 2]=  Math.round((tiles[x][y] - min)  );
					 imageData.data[pixelIndex + 1] = imageData.data[pixelIndex + 2]+randColor;
					 imageData.data[pixelIndex ]  =imageData.data[pixelIndex+1]+randColor;
					 imageData.data[pixelIndex + 3]=255;
                  }
            }
              context.putImageData(imageData, 0, 0);
	hiddenCTX.globalCompositeOperation="destination-in"
	hiddenCTX.beginPath();
	hiddenCTX.arc(16,16,4,-3,1*Math.PI);
	hiddenCTX.stroke();
		hiddenCTX.globalCompositeOperation="destination-atop"
	hiddenCTX.beginPath();
	var randAngle=Math.random()*10;
	hiddenCTX.moveTo(15,15);
	for (i=0; i<  32*Math.random()+16; i+=3) {
		  angle = randAngle * i;
		  x=(1+angle)*Math.cos(angle);
		  y=(1+angle)*Math.sin(angle);
		  hiddenCTX.lineTo(x+16, y+16);
		 
		 
		}
		  hiddenCTX.shadowOffsetX =1.5;
      hiddenCTX.shadowOffsetY =1.5;
	    hiddenCTX.shadowColor="rgba(255,255,255,1)";
	 hiddenCTX.lineWidth=1*Math.random()+1;
 hiddenCTX.stroke();
  hiddenCTX.globalCompositeOperation="destination-in";
 hiddenCTX.beginPath();
	var grd=hiddenCTX.createRadialGradient(16,16,0,16,16,48);
	grd.addColorStop(0,"blue");
	grd.addColorStop(0.25,"transparent");
	grd.addColorStop(0.75,"transparent");
	grd.addColorStop(1,"blue");
	hiddenCTX.fillStyle=grd;
	hiddenCTX.fillRect(0,0,32,32);
	appendToTile(hiddenCanvas,xx,yy);
	
}
function drawTree(size,x,y){
	hiddenCanvas.width=size>5?size*2:5;
	hiddenCanvas.height=size>5?size*2:5;
	hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);	 
	hiddenCTX.strokeStyle="#555"
	hiddenCTX.beginPath();
	hiddenCTX.translate(0.5, 0.5);
		
	
	
	var posX=hiddenCanvas.width/2;
	var posY=hiddenCanvas.height/2;
	hiddenCTX.arc(posX,posY,--size/2,0,2*Math.PI);
	var color=0.2724;
	hiddenCTX.fillStyle="#"+((1<<24)*color|0).toString(16);
	hiddenCTX.fill();

	color*=1.05;
	
	hiddenCTX.beginPath();
	hiddenCTX.globalCompositeOperation="source-atop";
	hiddenCTX.strokeStyle="#"+((1<<24)*.193|0).toString(16);
	while(size>0){
		hiddenCTX.beginPath();
		if(Math.random()>0.5)
			size--;
		
		hiddenCTX.arc(posX,posY,size/2,0,2*Math.PI);
		if(Math.random()>0.5)
			posY-=1;
		else
			posY+=1;
		if(Math.random()>0.5)
			posX-=1;
		else
			posX+=1;
		hiddenCTX.stroke();
		color*=1.21;
		--size;
	}
	
	 appendToTile(hiddenCanvas,x,y);
	 
	  //tileCanvas.getContext("2d").drawImage(hiddenCanvas,0,0);
	  

}
function drawBrokenShelterUnit(x,y){
	tileBuildingFloor()
	  
	  hiddenCTX.beginPath();
	   hiddenCTX.strokeStyle="black"
	     hiddenCTX.shadowOffsetX =1.5;
      hiddenCTX.shadowOffsetY =1.5;
	  hiddenCTX.translate(0.5, -0.5)
	  hiddenCTX.moveTo(6,13);
	  hiddenCTX.lineTo(3,10);
	  hiddenCTX.lineTo(10,3);
	  hiddenCTX.lineTo(13,6);
	  
	   hiddenCTX.moveTo(26,13);
	  hiddenCTX.lineTo(29,10);
	  hiddenCTX.lineTo(22,3);
	  hiddenCTX.lineTo(19,6);
	  
	  hiddenCTX.moveTo(32-6,32-13);
	  hiddenCTX.lineTo(32-3,32-10);
	  hiddenCTX.lineTo(32-10,32-3);
	  hiddenCTX.lineTo(32-13,32-6);
	  
	   hiddenCTX.moveTo(32-26,32-13);
	  hiddenCTX.lineTo(32-29,32-10);
	  hiddenCTX.lineTo(32-22,32-3);
	  hiddenCTX.lineTo(32-19,32-6);
	  hiddenCTX.shadowBlur=23;
	  hiddenCTX.shadowColor="rgba(0,0,0,1)";
	  
	   hiddenCTX.stroke();
	     hiddenCTX.fillStyle="silver"
	   hiddenCTX.fill();
	 
	    hiddenCTX.shadowBlur=0;
	  //small outer outline
	  hiddenCTX.beginPath();
	  hiddenCTX.strokeStyle="silver"
	  
	   hiddenCTX.moveTo(6,6);
	  hiddenCTX.lineTo(5,6);
	  hiddenCTX.lineTo(6,5);
	  hiddenCTX.lineTo(7,6);
	  
	  hiddenCTX.moveTo(25,6);
	  hiddenCTX.lineTo(26,5);
	  hiddenCTX.lineTo(27,6);
	  hiddenCTX.lineTo(26,7);
	  //hiddenCTX.lineTo(16,28);
	  //hiddenCTX.lineTo(28,16);
	   hiddenCTX.stroke();
	   
	   //black outline
	    hiddenCTX.beginPath();
	  hiddenCTX.strokeStyle="black"
	  hiddenCTX.moveTo(16,4);
	  hiddenCTX.lineTo(4,16);
	  hiddenCTX.lineTo(16,28);
	  hiddenCTX.lineTo(28,16);
	  hiddenCTX.lineTo(16,4);
	  
	  hiddenCTX.moveTo(16,4);
	  hiddenCTX.lineTo(4,16);
	  hiddenCTX.lineTo(16,28);
	  hiddenCTX.lineTo(28,16);
	  hiddenCTX.lineTo(16,4);
	  hiddenCTX.stroke();
	  hiddenCTX.fillStyle="grey";

	  hiddenCTX.fill();
	  hiddenCTX.beginPath();
	//inner outline
	hiddenCTX.strokeStyle="blue"
	hiddenCTX.arc(16,16,4,0,1*Math.PI);
	hiddenCTX.stroke();
	 hiddenCTX.beginPath();
	hiddenCTX.arc(16,16,2,-5,1*Math.PI);
	hiddenCTX.stroke();
		  
	 appendToTile(hiddenCanvas,x,y);
	 addLightingArea(x+.5,y+.5,55,43);
	 addLightingArea(x+.5,y+.5,5,2);
	 
	  //tileCanvas.getContext("2d").drawImage(hiddenCanvas,0,0);
	  

}
function drawWorkShop(){
	tileBuildingFloor()
	 
	   hiddenCTX.strokeStyle="#555"
	     hiddenCTX.shadowOffsetX =1.5;
      hiddenCTX.shadowOffsetY =1.5;
	  hiddenCTX.translate(0.5, -0.5)
	  	   hiddenCTX.beginPath();
	  hiddenCTX.fillStyle="silver";
	  hiddenCTX.moveTo(14,2);
	  hiddenCTX.lineTo(2,14);
	  hiddenCTX.lineTo(14,30);
	  hiddenCTX.lineTo(30,14);
	  hiddenCTX.lineTo(14,2);
	  hiddenCTX.fill();
	   hiddenCTX.stroke();
	  hiddenCTX.translate(1.5, 1.5);
	     hiddenCTX.fillStyle="#333"
	 
	    hiddenCTX.shadowBlur=1;
	  //small outer outline
	hiddenCTX.beginPath();
	  hiddenCTX.strokeStyle="black"
	  hiddenCTX.moveTo(16,4);
	  hiddenCTX.lineTo(4,16);
	  hiddenCTX.lineTo(16,28);
	  hiddenCTX.lineTo(28,16);
	  hiddenCTX.lineTo(16,4);
	  hiddenCTX.fill();
	  
	  hiddenCTX.translate(-1.5, -1.5);
	  hiddenCTX.moveTo(16,4);
	  hiddenCTX.lineTo(4,16);
	  hiddenCTX.lineTo(16,28);
	  hiddenCTX.lineTo(28,16);
	  hiddenCTX.lineTo(16,4);
	  hiddenCTX.fill();

	   hiddenCTX.fillStyle="silver";
	  hiddenCTX.beginPath();
		hiddenCTX.moveTo(16,4);
	   hiddenCTX.lineTo(12,8);
	   hiddenCTX.lineTo(20,8);
	   hiddenCTX.lineTo(16,4);
	     hiddenCTX.fill();
		 
	 hiddenCTX.beginPath();
		hiddenCTX.moveTo(4,16);
	   hiddenCTX.lineTo(8,20);
	   hiddenCTX.lineTo(8,12);
	   hiddenCTX.lineTo(4,16);
	 hiddenCTX.fill();
	 
	 hiddenCTX.beginPath();
		hiddenCTX.moveTo(16,28);
	   hiddenCTX.lineTo(12,24);
	   hiddenCTX.lineTo(20,24);
	   hiddenCTX.lineTo(16,28);
	 hiddenCTX.fill();
	 
	  hiddenCTX.beginPath();
		hiddenCTX.moveTo(28,16);
	   hiddenCTX.lineTo(24,20);
	   hiddenCTX.lineTo(24,12);
	   hiddenCTX.lineTo(28,16);
	 hiddenCTX.fill();
	 
	  hiddenCTX.beginPath();
	  hiddenCTX.strokeStyle="black"
	  hiddenCTX.moveTo(16,4);
	  hiddenCTX.lineTo(4,16);
	  hiddenCTX.lineTo(16,28);
	  hiddenCTX.lineTo(28,16);
	  hiddenCTX.lineTo(16,4);
	  hiddenCTX.stroke();
//
	hiddenCTX.beginPath();
	 hiddenCTX.strokeStyle="rgb(255,155,22)"
		hiddenCTX.moveTo(22,10);
	   hiddenCTX.lineTo(18,14);
	   
	   hiddenCTX.moveTo(10,22);
	   hiddenCTX.lineTo(14,18);
	   
	   hiddenCTX.moveTo(22,22);
	   hiddenCTX.lineTo(18,18);
	   
	   hiddenCTX.moveTo(10,10);
	   hiddenCTX.lineTo(14,14);
	  hiddenCTX.stroke();
	    hiddenCTX.beginPath();
	//inner outline
	hiddenCTX.strokeStyle="rgb(175,105,22)"
	 hiddenCTX.beginPath();
	hiddenCTX.arc(16,16,1,-5,1*Math.PI);
	hiddenCTX.stroke();
	hiddenCTX.stroke();
		  
	 appendToTile(hiddenCanvas,17,17);
	 addLightingArea(17.5,17.5,55,43);
	 addLightingArea(17.5,17.5,3,2);
	 
	  //tileCanvas.getContext("2d").drawImage(hiddenCanvas,0,0);
	  

}

function placeWire(pointA,pointB){
	var pix=16;
	var parsedWidth=(lightingCanvas.offsetWidth/lightingCanvas.width);		
	var parsedHeight=(lightingCanvas.offsetHeight/lightingCanvas.height);
	var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
	var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	hiddenCanvas.width=lightingCanvas.width*pix;
	hiddenCanvas.height=lightingCanvas.height*pix;
	  hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);
	  hiddenCTX.beginPath();
	   hiddenCTX.strokeStyle="teal";
	  hiddenCTX.translate(0.5+(cellSizeX/4), -0.5+(cellSizeY/4));
	 // hiddenCTX.moveTo(lightingCanvas.width/(2/pix),lightingCanvas.height/(2/pix));
	  hiddenCTX.moveTo(pix*pointA[0],pix*pointA[1]);
	   hiddenCTX.lineTo(pix*pointB[1],pix*pointB[1]);
	  hiddenCTX.stroke();
	  
	
	tileCanvas.getContext("2d").drawImage(hiddenCanvas,0,0,tileCanvas.width,tileCanvas.height);
}

 function onloadStartup(){
	document.body.appendChild(chatWindowContainer);	
	canvasContainerStack=document.createElement("div");
	canvasContainerStack.className="canvasBoardStacker";
	canvasContainerStack.style.border="1px solid gold";
	canvasContainerStack.id="test";
	canvasContainerStack.style.transform="scale("+_globalZoomSize+","+_globalZoomSize+")";
	canvasContainerStack.style.webkitTransform="scale("+_globalZoomSize+","+_globalZoomSize+")";	;
	toolSelector=document.createElement("div");
	toolSelector.className="toolSelector";
	toolSelectorInfoButton=document.createElement("button");
	toolSelectorInfoButton.textContent="?";
	toolSelector.appendChild(toolSelectorInfoButton);
	document.body.appendChild(toolSelector);
	document.body.appendChild(uiDigBlock);
	
	
	


	//appendFeaturesToBlockLibrary(blockSelector);
	hiddenCanvas=document.createElement("canvas");
	
	hiddenCTX=hiddenCanvas.getContext("2d");
	hiddenCanvas.width=2;
	hiddenCanvas.height=2;
	  hiddenCTX.fillStyle="#852"
	 hiddenCTX.fillRect(0,0,2,2);
	 hiddenCTX.fillStyle="#943";
	 hiddenCTX.fillRect(0,0,1,1);
	 hiddenCTX.fillRect(1,1,2,2);

	lightingCanvas=document.createElement("canvas");
	lightingCanvas.className="canvasBoard"
	lightingCanvas.width=mapSize[0]
	lightingCanvas.height=mapSize[1]
	lightingCanvas.style.border="0";
	lightingCanvas.style.backgroundColor="";
	document.body.appendChild(lightingCanvas);
	
	tileCanvas=document.createElement("canvas");
	tileCanvas.width=(lightingCanvas.offsetWidth*lightingCanvas.width)/imageQuality;
	tileCanvas.height=(lightingCanvas.offsetHeight*lightingCanvas.height)/imageQuality;
	tileCanvas.className="canvasBoard";
	tileCanvas.getContext("2d").addTile=addTile;
	//tileCanvas.style.backgroundSize="100% 100%";
	//tileCanvas.addTile=tileCanvas.getContext("2d").addTile;
	
	wiringPower=document.createElement("canvas");
	wiringPower.className="canvasBoard"
	wiringPower.width=(lightingCanvas.offsetWidth*lightingCanvas.width)/imageQuality;
	wiringPower.height=(lightingCanvas.offsetHeight*lightingCanvas.height)/imageQuality;
	
	toolUICanvas=document.createElement("canvas");
	toolUICanvas.className="canvasBoard"
	toolUICanvas.width=lightingCanvas.width;
	toolUICanvas.height=lightingCanvas.height;
	
	gridCanvas=document.createElement("canvas");
	
	gridCanvas.className="canvasBoard"
	gridCanvas.width=lightingCanvas.width;
	gridCanvas.height=lightingCanvas.height;
	gridCanvas.style.border="1px solid black";
	gridCanvas.style.backgroundColor="yellow";
	gridctx=gridCanvas.getContext("2d");
	var pat=gridctx.createPattern(hiddenCanvas,"repeat");


	var ctx=lightingCanvas.getContext("2d");
	ctx.addLightingArea=addLightingArea;
	ctx.setupLightingArea=setupLightingArea;
	ctx.setupLightingArea();
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false; 
	 
	//ctx.arc(12, 12, 9, 1, 2 * Math.PI, false);
	canvasContainerStack.appendChild(gridCanvas);
	canvasContainerStack.appendChild(tileCanvas);

	canvasContainerStack.appendChild(wiringPower);
	canvasContainerStack.appendChild(toolUICanvas);	
	canvasContainerStack.appendChild(lightingCanvas);
	document.body.appendChild(canvasContainerStack);
	
	
	
	
	canvasContainerStack.style.marginTop=40+"px";
	canvasContainerStack.style.marginLeft=(window.innerWidth/3)+"px";
	
	
	var parsedWidth=(lightingCanvas.offsetWidth/lightingCanvas.width);		
	var parsedHeight=(lightingCanvas.offsetHeight/lightingCanvas.height);
	//gridCanvas.style.backgroundImage="url("+hiddenCanvas.toDataURL()+")";
	//gridCanvas.style.backgroundSize=(parsedWidth*2)+"px "+(parsedHeight*2)+"px";
	var persistence = .25;
//terrain generation
	var tiles = [];
	var min = Number.MAX_VALUE;
	var max = Number.MIN_VALUE;
			for(var i = 0; i<= height; i++){
				tiles[i] = [];
				for(var j = 0; j <= width; j++) {
					tiles[i][j] = perlin2d(i,j);
					min = Math.min(min, tiles[i][j]);
					max = Math.max(max, tiles[i][j]);
				}
			}


	var elem = gridCanvas;
	var mapArea = parsedWidth * parsedHeight;
	var r = 0;
	var g = 0;
	var b = 0;
	var tileSize = 100;

/* Draw to canvas */
	if (elem && elem.getContext) {
          var context = elem.getContext('2d');
          if (context) {
              var imageData = context.createImageData(width, height);
              for (y = 0; y <= height; y++) {
                  for (x = 0; x <= width; x++) {
                      var pixelIndex = (y * 4 * width) + x * 4;
						//drawDebugNumber(4,x,y,((tiles[x][y] - min)));
					forestChancesIndex[pixelIndex/4]=((tiles[x][y] - min));
					uncommonstoneChancesIndex[pixelIndex/4]=1-((tiles[x][y] - min));
                     imageData.data[pixelIndex + 3]= imageData.data[pixelIndex + 1]  = Math.round((tiles[x][y] - min) * 185 / (max - min));
					 imageData.data[pixelIndex ]=imageData.data[pixelIndex + 2]=40;
                  }
            }
              context.putImageData(imageData, 0, 0);
            
        }
    }
	window.onclick=function(eve){		
		this.onclick=function(){}
		var parsedWidth=((lightingCanvas.offsetWidth*_globalZoomSize)/lightingCanvas.width);
		
		var parsedHeight=((lightingCanvas.offsetHeight*_globalZoomSize)/lightingCanvas.height);
		var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*_globalZoomSize))/2);
		var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
		var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*_globalZoomSize))/2);
		var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
		var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
		var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
		var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
		var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
		var tileX=Math.ceil(gridX/(parsedWidth));
		var tileY=Math.ceil(gridY/(parsedHeight));
		//lightingCanvas.getContext("2d").addLightingArea(tileX,tileY,122,3);
		
		var data=getIDByXY(tileX,tileY);
		document.title=data;

		setTimeout(function(){window.onclick=window._originMouseevent;},65);//keeps the cpu usage low (10 being smoothest, 80 being slushy)
	}
	window._originMouseevent=window.onclick
document.body.onclick=function(eve){
	if(lightingCanvas.onclickTool && !lightingCanvas.downed)
		lightingCanvas.onclickTool(eve);
}
	 document.body.onmousedown=function(eve){
		if(eve.target==lightingCanvas){
			lightingCanvas.downed=true;
			lightingCanvas.buttonPressed=eve.button;
			eve.preventDefault();
			if(eve.button==0)
				lightingCanvas.onmousedownTool(eve);
			else if(eve.button==2){
				lightingCanvas.rightonmousedownTool(eve);
			}
		}
		else{
		}
		lightingCanvas.previousX=eve.clientX;
		lightingCanvas.previousY=eve.clientY;
	}
	document.body.onmouseup=function(eve){
		if(lightingCanvas.downed){
			
			lightingCanvas.downed=false;
			lightingCanvas.buttonPressed=-1;
			if(eve.button==0)
				lightingCanvas.onmouseupTool(eve);
			else if(eve.button==2){
				lightingCanvas.rightonmouseupTool(eve);
			}
		}

		}
		document.body.onmousemove=function(eve){
			if(lightingCanvas.downed==true){
				
				eve.preventDefault();
				eve.stopPropagation();
				if(lightingCanvas.buttonPressed==0)
					lightingCanvas.onmousedownMoveTool(eve);
				else if(lightingCanvas.buttonPressed==2){
					lightingCanvas.rightonmousedownMoveTool(eve);
				}
								
								
								
							
							}
		}
		window.addEventListener("wheel",function(eve){
			
			if(eve.target.className!="canvasBoard")return;
			
				if(eve.deltaY>0)_globalZoomSize*=0.90;else _globalZoomSize/=0.90;
				if(_globalZoomSize<=0)_globalZoomSize=0.02;
				canvasContainerStack.style.transform="scale("+_globalZoomSize+","+_globalZoomSize+")";
				canvasContainerStack.style.webkitTransform="scale("+_globalZoomSize+","+_globalZoomSize+")";	;
				
		},false);
		
			var xmlhttp=new XMLHttpRequest();
		xmlhttp.loadingFunction=function(event){
		};
		xmlhttp.addEventListener("progress",xmlhttp.loadingFunction,false);	
		xmlhttp.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							terrain.loadXML(this.responseXML);
						}
					}
		//xmlhttp.open("GET","terraintypes.xml",true);
		//xmlhttp.send();
	 
	lightingCanvas.rightonmousedownTool=moveMapTool.down;
	lightingCanvas.rightonmousedownMoveTool=moveMapTool.downMove;
	lightingCanvas.rightonmouseupTool=moveMapTool.up;
	lightingCanvas.onclickTool=selectTile.click;
	
	document.body.addEventListener("mousedown",function(eve){
		lightingCanvas.rightonmousedownTool
	},false);
	document.body.addEventListener("mousemove",function(eve){
		lightingCanvas.rightonmousedownMoveTool
	},false);
	document.body.addEventListener("mouseup",function(eve){
		lightingCanvas.rightonmouseupTool
	},false);
	lightingCanvas.onmousedownTool=getMousePositionTool.down;
	lightingCanvas.onmousedownMoveTool=getMousePositionTool.downMove;
	lightingCanvas.onmouseupTool=getMousePositionTool.up;
	lightingCanvas.oncontextmenu= function(eve) { eve.stopPropagation();  eve.preventDefault(); return false; };
	if(false&&location.hash.length>0)
		loadMap(location.hash.substring(1,location.hash.length));
	drawWater(10,22,3);
	drawMeteorCrater(4,4,2,3);
	drawCliff(28,12,5);//serves as a stone/rock material
	drawCliff(28,12,2);//serves as a stone/rock material
	genereatePlanetaryTile();
	drawBrokenShelterUnit(15,15);
		addID2XY(1,15,15,2);
	//drawTree(8);
	
	

	//drawWorkShop();
	
	//placeWire([15,15],[17,17]);
	pileDebris(14,15);
		addID2XY(2,14,15,2);
	dugHole(13,15);
		addID2XY(3,13,15,2);

 } 
 

 function rectTool(eve){  }
   rectTool.pointA=[];
   rectTool.pointB=[];
 rectTool.downMove=function(eve){
	var ctxTool=toolUICanvas.getContext("2d");
	 ctxTool.clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
	 this.ctx=ctxTool;
	 document.body.appendChild(expressionInputTool.textArea);
	 
	
	  var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	/*
	
	console.log("zoom"+[eve.clientX,zoomXOffseter]);
	
	console.log("zoom"+[clientXZoomAdjuster,zoomXOffseter]);
	*/
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	//console.log("test "+[clientXZoomAdjuster,(lightingCanvas.offsetLeft),(zoomXOffseter)]);
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	//console.log([gridX,gridY])
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	//console.log([tileX,tileY])
	//addTile.bind(tileCanvas.getContext("2d"))(dz,tileX,tileY,dz.color);
	 this.pointB=[tileX,tileY];
	 
	 ctxTool.beginPath();
	 ctxTool.rect(this.pointA[0],this.pointA[1],tileX-this.pointA[0],tileY-this.pointA[1]);
	 
	 var hiddenCTX=hiddenCanvas.getContext("2d");
	 var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
		var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	 hiddenCanvas.width=2;
	 hiddenCanvas.height=2;
	  hiddenCTX.fillStyle="#555"
	 hiddenCTX.fillRect(0,0,2,2);
	 hiddenCTX.fillStyle="#333";
	 hiddenCTX.fillRect(0,0,1,1);
	 hiddenCTX.fillRect(1,1,2,2);
	
	 var pat=ctxTool.createPattern(hiddenCanvas,"repeat");
	 ctxTool.fillStyle=pat;
	  ctxTool.strokeStyle="silver"
	 ctxTool.globalAlpha=0.5;
	 ctxTool.fill();
	 ctxTool.stroke();
	  ctxTool.globalAlpha=1;
	/*
	 ctxTool.font=(mapSize[1]/6)+"px Arial"
	 var strValueTop=tileY.toString();
	 ctxTool.fillText(strValueTop,((toolUICanvas.width/2)-(strValueTop.length*4)),mapSize[1]/8);
	 ctxTool.strokeText(strValueTop,((toolUICanvas.width/2)-(strValueTop.length*4)),mapSize[1]/8);
	 var strValueBottom=(mapSize[1]-tileY-1).toString();
	 ctxTool.fillText(strValueBottom,((toolUICanvas.width/2)-(strValueBottom.length*4)),toolUICanvas.height);
	  ctxTool.strokeText(strValueBottom,((toolUICanvas.width/2)-(strValueBottom.length*4)),toolUICanvas.height);
	 
	 var strValueLeft=tileX.toString();
	 ctxTool.fillText(strValueLeft,0,((toolUICanvas.height/2)));
	 ctxTool.strokeText(strValueLeft,0,((toolUICanvas.height/2)));
	 
	 var strValueRight=(mapSize[0]-tileX-1).toString();
	 ctxTool.fillText(strValueRight,(toolUICanvas.width)-(strValueRight.length*(mapSize[1]/11)),((toolUICanvas.height/2)));
	 ctxTool.strokeText(strValueRight,(toolUICanvas.width)-(strValueRight.length*(mapSize[1]/11)),((toolUICanvas.height/2)));
	 */
 }
  rectTool.down=function(eve){
	this.selectedPlacement=[selectedClass,selectedTextureID];
	 toolUICanvas.style.zIndex=4;
	 var ctxTool=toolUICanvas.getContext("2d");
	 ctxTool.clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
	 this.ctx=ctxTool;
	 document.body.appendChild(expressionInputTool.textArea);
	 
	
	  var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	/*
	
	console.log("zoom"+[eve.clientX,zoomXOffseter]);
	
	console.log("zoom"+[clientXZoomAdjuster,zoomXOffseter]);
	*/
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	//console.log("test "+[clientXZoomAdjuster,(lightingCanvas.offsetLeft),(zoomXOffseter)]);
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	//console.log([gridX,gridY])
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	//console.log([tileX,tileY])
	//addTile.bind(tileCanvas.getContext("2d"))(dz,tileX,tileY,dz.color);
	 this.pointA=[tileX,tileY];
  }
   rectTool.up=function(){
	 toolUICanvas.style.zIndex="";
	 var ctxTool=toolUICanvas.getContext("2d");
	  ctxTool.clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
	  ctxTool.beginPath();
	  ctxTool.fillStyle="white";
	 ctxTool.rect(this.pointA[0],this.pointA[1],this.pointB[0]-this.pointA[0],this.pointB[1]-this.pointA[1]);
	 ctxTool.fill();
	 var dataFilled=ctxTool.getImageData(0,0,ctxTool.canvas.width,ctxTool.canvas.height);
	 var dataurl=ctxTool.canvas.toDataURL();
	 //tileWorker.postMessage(["tileFiller",[dataFilled.data,this.selectedPlacement]]);
	//sendDrawEvents(["tileFiller",[dataurl,this.selectedPlacement,userInterfaceBarTop.layersObject.selectedLayer]]);
	  ctxTool.clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
   };
   
   
   
    function selectTile(){ }
  selectTile.click=function(){
	//use index, not cord
  }
  selectTile.selectedTile=-1;
  
 function moveMapTool(){ }
  moveMapTool.down=function(){
  
  }
  moveMapTool.up=function(){
  
  }
 moveMapTool.downMove=function(eve){
	canvasContainerStack.style.marginTop=parseInt(canvasContainerStack.style.marginTop)+(eve.clientY-lightingCanvas.previousY)+"px";
	canvasContainerStack.style.marginLeft=parseInt(canvasContainerStack.style.marginLeft)+(eve.clientX-lightingCanvas.previousX)+"px";
	lightingCanvas.previousX=(eve.clientX);
	lightingCanvas.previousY=(eve.clientY);
 }
function moveLayerWindowTool(){}
  moveLayerWindowTool.down=function(){
  
  }
  moveLayerWindowTool.up=function(){
  
  }
 moveLayerWindowTool.downMove=function(eve){
	lightingCanvas.style.marginTop=parseInt(canvasContainerStack.style.marginTop)+(eve.clientY-lightingCanvas.previousY)+"px";
	lightingCanvas.style.marginLeft==parseInt(canvasContainerStack.style.marginLeft)+(eve.clientX-lightingCanvas.previousX)+"px";
	lightingCanvas.previousX=(eve.clientX);
	lightingCanvas.previousY=(eve.clientY);
 }
 function getMousePositionTool(eve){  }

  getMousePositionTool.setCallback=function(func,obj){this.callback=func;this.obj=obj};
   getMousePositionTool.callback=function(){};
 getMousePositionTool.downMove=function(eve){
	var ctxTool=toolUICanvas.getContext("2d");
	 ctxTool.clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
	 this.ctx=ctxTool;
	 
	 
	  var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	/*
	
	console.log("zoom"+[eve.clientX,zoomXOffseter]);
	
	console.log("zoom"+[clientXZoomAdjuster,zoomXOffseter]);
	*/
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	//console.log("test "+[clientXZoomAdjuster,(lightingCanvas.offsetLeft),(zoomXOffseter)]);
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	//console.log([gridX,gridY])
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	//console.log([tileX,tileY])
	//addTile.bind(tileCanvas.getContext("2d"))(dz,tileX,tileY,dz.color);
	 this.pointA=[tileX,tileY];
	 
	 ctxTool.beginPath();
	 ctxTool.rect(tileX,0,0.5,mapSize[1]);// v line

	 ctxTool.rect(0,tileY,mapSize[0],0.5);// h line
	 
	 var hiddenCTX=hiddenCanvas.getContext("2d");
	 var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
		var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	 hiddenCanvas.width=2;
	 hiddenCanvas.height=2;
	  hiddenCTX.fillStyle="#555"
	 hiddenCTX.fillRect(0,0,2,2);
	 hiddenCTX.fillStyle="#333";
	 hiddenCTX.fillRect(0,0,1,1);
	 hiddenCTX.fillRect(1,1,2,2);

	 var pat=ctxTool.createPattern(hiddenCanvas,"repeat");
	 ctxTool.fillStyle=pat;
	 ctxTool.fill();
	 ctxTool.fillStyle="black";
	 ctxTool.font=(mapSize[1]/6)+"px Arial"
	 var strValueTop=tileY.toString();
	 ctxTool.fillText(strValueTop,((toolUICanvas.width/2)-(strValueTop.length*4)),mapSize[1]/8);
	 var strValueBottom=(mapSize[1]-tileY-1).toString();
	 ctxTool.fillText(strValueBottom,((toolUICanvas.width/2)-(strValueBottom.length*4)),toolUICanvas.height);
	 
	 var strValueLeft=tileX.toString();
	 ctxTool.fillText(strValueLeft,0,((toolUICanvas.height/2)));
	 
	 var strValueRight=(mapSize[0]-tileX-1).toString();
	 ctxTool.fillText(strValueRight,(toolUICanvas.width)-(strValueRight.length*(mapSize[1]/11)),((toolUICanvas.height/2)));
	getMousePositionTool.callback( this.pointA[0],this.pointA[1],getMousePositionTool.obj);
 }
  getMousePositionTool.down=function(eve){
  }
   getMousePositionTool.up=function(){
	var ctxTool=toolUICanvas.getContext("2d");
	ctxTool.clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
	if(!(this.pointA||this.pointB))return;
	getMousePositionTool.callback( this.pointA[0],this.pointA[1],getMousePositionTool.obj);
	if(getMousePositionTool.obj && getMousePositionTool.obj.ondone)getMousePositionTool.obj.ondone();
	getMousePositionTool.callback=function(){};
	
	this.obj=null;
   };
   
   
 function expressionInputTool(eve){  }
 expressionInputTool.textArea=document.createElement("textarea");
 expressionInputTool.textArea.setAttribute("style","position:fixed;border:5px solid black;");
 expressionInputTool.downMove=function(eve){
	var ctxTool=toolUICanvas.getContext("2d");
	 ctxTool.clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
	 this.ctx=ctxTool;
	 document.body.appendChild(expressionInputTool.textArea);
	 
	 
	  var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	/*
	
	console.log("zoom"+[eve.clientX,zoomXOffseter]);
	
	console.log("zoom"+[clientXZoomAdjuster,zoomXOffseter]);
	*/
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	//console.log("test "+[clientXZoomAdjuster,(lightingCanvas.offsetLeft),(zoomXOffseter)]);
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	//console.log([gridX,gridY])
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	//console.log([tileX,tileY])
	//addTile.bind(tileCanvas.getContext("2d"))(dz,tileX,tileY,dz.color);
	 this.pointA=[tileX,tileY];
	 
	 ctxTool.beginPath();
	 ctxTool.rect(tileX,0,0.5,mapSize[1]);// v line

	 ctxTool.rect(0,tileY,mapSize[0],0.5);// h line
	 
	 var hiddenCTX=hiddenCanvas.getContext("2d");
	 var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
		var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	 hiddenCanvas.width=2;
	 hiddenCanvas.height=2;
	  hiddenCTX.fillStyle="#555"
	 hiddenCTX.fillRect(0,0,2,2);
	 hiddenCTX.fillStyle="#333";
	 hiddenCTX.fillRect(0,0,1,1);
	 hiddenCTX.fillRect(1,1,2,2);

	 var pat=ctxTool.createPattern(hiddenCanvas,"repeat");
	 ctxTool.fillStyle=pat;
	 ctxTool.fill();
	 ctxTool.fillStyle="black";
	 ctxTool.font=(mapSize[1]/6)+"px Arial"
	 var strValueTop=tileY.toString();
	 ctxTool.fillText(strValueTop,((toolUICanvas.width/2)-(strValueTop.length*4)),mapSize[1]/8);
	 var strValueBottom=(mapSize[1]-tileY-1).toString();
	 ctxTool.fillText(strValueBottom,((toolUICanvas.width/2)-(strValueBottom.length*4)),toolUICanvas.height);
	 
	 var strValueLeft=tileX.toString();
	 ctxTool.fillText(strValueLeft,0,((toolUICanvas.height/2)));
	 
	 var strValueRight=(mapSize[0]-tileX-1).toString();
	 ctxTool.fillText(strValueRight,(toolUICanvas.width)-(strValueRight.length*(mapSize[1]/11)),((toolUICanvas.height/2)));
 }
  expressionInputTool.down=function(eve){
	  
  expressionInputTool.textArea.style.top=eve.clientY+"px";

   expressionInputTool.textArea.style.left=eve.clientX+"px";
  }
   expressionInputTool.up=function(){};
 function lineTool(eve){  }
 lineTool.pointA=[];
 lineTool.pointB=[];
 lineTool.ctx;
 lineTool.selectedPlacement;
 lineTool.down=function(eve){
	 this.selectedPlacement=[selectedClass,selectedTextureID]	;
	 
	 var ctxTool=toolUICanvas.getContext("2d");
	 ctxTool.clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
	 this.ctx=ctxTool;
	 ctxTool.fillStyle="white";
	 
	 
	 var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	/*
	
	console.log("zoom"+[eve.clientX,zoomXOffseter]);
	
	console.log("zoom"+[clientXZoomAdjuster,zoomXOffseter]);
	*/
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	//console.log("test "+[clientXZoomAdjuster,(lightingCanvas.offsetLeft),(zoomXOffseter)]);
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	//console.log([gridX,gridY])
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	//console.log([tileX,tileY])
	//addTile.bind(tileCanvas.getContext("2d"))(dz,tileX,tileY,dz.color);
	ctxTool.fillRect(tileX,tileY,1,1);
	 this.pointA=[tileX,tileY];
 }
 lineTool.downMove=function(eve){
	
	var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	/*
	
	console.log("zoom"+[eve.clientX,zoomXOffseter]);
	
	console.log("zoom"+[clientXZoomAdjuster,zoomXOffseter]);
	*/
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	//console.log("test "+[clientXZoomAdjuster,(lightingCanvas.offsetLeft),(zoomXOffseter)]);
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	//console.log([gridX,gridY])
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	
	this.ctx.clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
	this.ctx.fillRectLineTo(tileX,tileY,1,1,this.pointA[0],this.pointA[1],false);

 }
 
 lineTool.up=function(eve){
	var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	//console.log("test "+[clientXZoomAdjuster,(lightingCanvas.offsetLeft),(zoomXOffseter)]);
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	//console.log([gridX,gridY])
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	this.pointB=[tileX,tileY];
	tileWorker.postMessage(["lineToTile",[this.pointA,this.pointB,this.selectedPlacement]]);
	this.pointA=[];
	this.pointB=[];
	toolUICanvas.getContext("2d").clearRect(0,0,toolUICanvas.width,toolUICanvas.height);
	
	
 
 }
 
 function penTool(eve){  }
 penTool.pointA=[];
 penTool.pointB=[];
 penTool.ctx;
 penTool.selectedPlacement;
 penTool.down=function(eve){
	this.selectedPlacement=[selectedClass,selectedTextureID]	;
	var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	/*
	
	console.log("zoom"+[eve.clientX,zoomXOffseter]);
	
	console.log("zoom"+[clientXZoomAdjuster,zoomXOffseter]);
	*/
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	//console.log("test "+[clientXZoomAdjuster,(lightingCanvas.offsetLeft),(zoomXOffseter)]);
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	//console.log([gridX,gridY])
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	 this.pointA=[tileX,tileY];
	 
 }
 penTool.downMove=function(eve){
	var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	//console.log("test "+[clientXZoomAdjuster,(lightingCanvas.offsetLeft),(zoomXOffseter)]);
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	//console.log([gridX,gridY])
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	this.pointB=[tileX,tileY];
	if(this.pointB.join()==this.pointA.join())return;
	 penTool.ctx.clearRect(0,0, penTool.ctx.canvas.width, penTool.ctx.canvas.height);
		 penTool.ctx.moveTo(this.pointA[0]-0.5,this.pointA[1]-0.5);
	 penTool.ctx.lineTo(this.pointB[0]-0.5,this.pointB[1]-0.5);
	 penTool.ctx.addSetPoints(this.pointA,this.pointB);
     penTool.ctx.stroke();
	//tileWorker.postMessage(["lineToTile",[this.pointA,this.pointB,this.selectedPlacement]]);
	this.pointA=this.pointB;


 }
 
 penTool.up=function(eve){
	var zoom=get_globalZoomSize();
	var parsedWidth=((lightingCanvas.offsetWidth*zoom)/this.width);
	var parsedHeight=((lightingCanvas.offsetHeight*zoom)/this.height);
	var zoomXOffseter=parseInt( (lightingCanvas.offsetWidth-(lightingCanvas.offsetWidth*zoom))/2);
	var clientXZoomAdjuster=(eve.clientX-lightingCanvas.parentNode.offsetLeft)-zoomXOffseter;
	var zoomYOffseter=parseInt( (lightingCanvas.offsetHeight-(lightingCanvas.offsetHeight*zoom))/2);
	var clientYZoomAdjuster=(eve.clientY-lightingCanvas.parentNode.offsetTop)-zoomYOffseter
	var offsetterXWithMouseX=(clientXZoomAdjuster-(lightingCanvas.offsetLeft));
	var offsetterYWithMouseY=(clientYZoomAdjuster-(lightingCanvas.offsetTop));
	var gridX=offsetterXWithMouseX-(offsetterXWithMouseX%(parsedWidth) );
	var gridY=offsetterYWithMouseY-(offsetterYWithMouseY%(parsedHeight) );
	var tileX=parseInt(gridX/(parsedWidth));
	var tileY=parseInt(gridY/(parsedHeight));
	lightingCanvas.onmousedownTool=getMousePositionTool.down;
	lightingCanvas.onmousedownMoveTool=getMousePositionTool.downMove;
	lightingCanvas.onmouseupTool=getMousePositionTool.up;
	//tileWorker.postMessage(["addTile",[tileX,tileY,this.selectedPlacement]]);
 
 }


 _globalZoomSize=9;
 function get_globalZoomSize(){
	return _globalZoomSize;
 }
window.onload=onloadStartup;

function addTile(blockID,x,y,color){
	var parsedWidth=(lightingCanvas.offsetWidth/lightingCanvas.width);		
	var parsedHeight=(lightingCanvas.offsetHeight/lightingCanvas.height);
	var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
	var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	//this.fillStyle=color;
	//this.fillRect(Math.ceil(x*cellSizeX)+(x*0.5),(y*cellSizeY)+(y*0.5),cellSizeX,cellSizeY);
	console.log([x,y])
	this.drawImage(blockID,Math.ceil(x*cellSizeX),(y*cellSizeY),cellSizeX,cellSizeY);
}





function appendToTile(blockID,x,y,color){
	var parsedWidth=(lightingCanvas.offsetWidth/lightingCanvas.width);		
	var parsedHeight=(lightingCanvas.offsetHeight/lightingCanvas.height);
	var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
	var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	var tileCTX=tileCanvas.getContext("2d");
	tileCTX.drawImage(blockID,Math.ceil(x*cellSizeX),(y*cellSizeY),cellSizeX,cellSizeY);
}

function createToggleOffOnButton(onText,offText){
	var but=document.createElement("button");
	but.className="OnOffButton";
	but.textContent=onText;
	but.onText=onText;
	but.offText=offText;
	but.isOn=true;
	but.onclick=function(){
		this.isOn=!this.isOn;
		this.setAttribute("data-on",this.isOn?"on":"");
		this.textContent=this.isOn?this.onText:this.offText;
	}
	but.setAttribute("data-on","on");
	return but;
}
function setupLightingArea(){
	lightingCanvas.getContext("2d").fillStyle="black";
	lightingCanvas.getContext("2d").fillRect(0, 0,lightingCanvas.width,lightingCanvas.height);
	lightingCanvas.getContext("2d").globalCompositeOperation="destination-out"
}
function addLightingArea(blockX,blockY,radius,brightness){
	var lightingCanvasCTX=lightingCanvas.getContext("2d");
	lightingCanvasCTX.beginPath();
	lightingCanvasCTX.arc(blockX, blockY, radius/2, 0, 2 * Math.PI, false);	
	var radial = lightingCanvasCTX.createRadialGradient(blockX, blockY, brightness,blockX, blockY,radius);
      radial.addColorStop(0, 'rgba(0,0,0,0.34)');
      radial.addColorStop(0.2, 'transparent');

      lightingCanvasCTX.fillStyle = radial;
	lightingCanvasCTX.fill();
	
	

	
}
uiDigBlock=document.createElement("div");
uiDigBlock.className="digUIBlock";
uiDigBlock.imageMineView=document.createElement("img");
uiDigBlock.textLog=document.createElement("textarea");
uiDigBlock.dig=document.createElement("button");
uiDigBlock.dig.textContent="Dig";
uiDigBlock.close=document.createElement("button");
uiDigBlock.close.textContent="Close";
uiDigBlock.appendChild(uiDigBlock.textLog);
uiDigBlock.appendChild(uiDigBlock.close);
uiDigBlock.appendChild(uiDigBlock.dig);
function digSiteUI(){
//each dig site tile = new ui


}
function drawCliff(x,y,r){
	hiddenCanvas.width=tileCanvas.width;
	hiddenCanvas.height=tileCanvas.height;
	hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);
	hiddenCTX.beginPath();
	
	
	var parsedWidth=(lightingCanvas.offsetWidth/lightingCanvas.width);		
	var parsedHeight=(lightingCanvas.offsetHeight/lightingCanvas.height);
	var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
	var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	hiddenCTX.translate(0.5+(cellSizeX/2),0.5+(cellSizeY/2));
	/*
	var dugRandomInc=parseInt(Math.random()*11)+1;
	for (i=dugRandomInc; i< 8+dugRandomInc; i+=1) {
		  angle =-1 * i;
		  x=(1+angle)*Math.cos(angle);
		  y=(1+angle)*Math.sin(angle);
		  hiddenCTX.lineTo(x+16, y+16);
		 
		 
		}
	*/
	
		var steps=8;
		var cosR=3+(2*(~~(Math.random()+0.5))*-2);
		var sinR=cosR+(2*(~~(Math.random()+0.5))*-2);
		r*=-1+~~(Math.random()+0.5)?-1:1;
		var dc=-1+~~(Math.random()+0.5)?2:1;
		var ds=-1+~~(Math.random()+0.5)?2:1;
		for(var iR=steps-1;iR>=1;iR--){
			
			var xPos = parseInt(x + r * Math.cos(cosR * Math.PI/dc * iR / steps));
			var yPos = parseInt(y + r * Math.sin(sinR* Math.PI/ds * iR / steps));
			hiddenCTX.lineTo(xPos*cellSizeX,yPos*cellSizeX);
			
			
	}
	hiddenCTX.lineCap = 'round';
	hiddenCTX.closePath();
	hiddenCTX.strokeStyle="rgba(0,75,155,0.7)";
	hiddenCTX.shadowOffsetX =2;
	hiddenCTX.shadowBlur=1;
    hiddenCTX.shadowOffsetY =2;
	hiddenCTX.globalCompositeOperation = "lighter";
	hiddenCTX.shadowColor="rgba(0,0,0,0.5)";
	hiddenCTX.fillStyle="rgba(255,225,155,0.9)";
	hiddenCTX.fill();
	
	hiddenCTX.globalCompositeOperation = "source-atop";
	var pat=gridctx.createPattern(hiddenCanvas,"repeat");
	hiddenCTX.fillStyle=pat;
	hiddenCTX.fill();
	
	hiddenCTX.scale(0.5,0.5);
	hiddenCTX.translate(-3,-3);
	hiddenCTX.fill();
	hiddenCTX.translate(-3,6);
	hiddenCTX.fill();
	hiddenCTX.translate(6,-3);
	hiddenCTX.fill();
	
	
	
	var tileCTX=tileCanvas.getContext("2d");
	tileCTX.drawImage(hiddenCanvas,0,0);
}
function drawMeteorCrater(x,y,r,outer){
	hiddenCanvas.width=tileCanvas.width;
	hiddenCanvas.height=tileCanvas.height;
	hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);
	hiddenCTX.beginPath();
	
	var parsedWidth=(lightingCanvas.offsetWidth/lightingCanvas.width);		
	var parsedHeight=(lightingCanvas.offsetHeight/lightingCanvas.height);
	var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
	var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	
	var steps=6+r;
	for(var iR=steps-1;iR>=1;iR--){
		
		var xPos = parseInt(x + r * Math.cos(2 * Math.PI * iR / steps))+(~~(Math.random()+0.4)*2);
		var yPos = parseInt(y + r * Math.sin(2 * Math.PI * iR / steps))+(~~(Math.random()+0.4)*2);
		hiddenCTX.lineTo(xPos*cellSizeX,yPos*cellSizeY);
		
		
	}
	var gradient = hiddenCTX.createRadialGradient(x*cellSizeX-(cellSizeX/2),y*cellSizeY-(cellSizeY/2),0,x*cellSizeX-(cellSizeX/2),y*cellSizeY-(cellSizeY/2),r*64);
	gradient.addColorStop(0.1,"rgba(95,32,0,1)");
	gradient.addColorStop(1,"rgba(135,70,0,0.8)");
	hiddenCTX.fillStyle=gradient;
	hiddenCTX.fill();
	var m=3;
	var c=1;
	hiddenCTX.closePath();
	for(var iborderish=0;iborderish<=(outer||2);iborderish++){
		hiddenCTX.strokeStyle="rgba(0,25,0,"+(0.5/iborderish)+")";
		hiddenCTX.scale(m,m);//3,9,27,81
		hiddenCTX.stroke();
		c*=m;
	}
	hiddenCTX.scale(1/c,1/c);
	hiddenCTX.scale(21,21);
	hiddenCTX.strokeStyle="rgba(255,255,55,0.5)";
	hiddenCTX.stroke();
	hiddenCTX.scale(1/21,1/21);
	
	
	
	
	
	
	var tileCTX=tileCanvas.getContext("2d");
	tileCTX.drawImage(hiddenCanvas,0,0);
	
}
function drawWater(x,y,r){
	hiddenCanvas.width=tileCanvas.width;
	hiddenCanvas.height=tileCanvas.height;
	hiddenCTX.clearRect(0,0,hiddenCanvas.width,hiddenCanvas.height);
	hiddenCTX.beginPath();
	
	
	var parsedWidth=(lightingCanvas.offsetWidth/lightingCanvas.width);		
	var parsedHeight=(lightingCanvas.offsetHeight/lightingCanvas.height);
	var cellSizeX=((parsedWidth*lightingCanvas.width)/imageQuality);
	var cellSizeY=((parsedHeight*lightingCanvas.height)/imageQuality);
	hiddenCTX.translate(0.5+(cellSizeX/2),0.5+(cellSizeY/2));
	/*
	var dugRandomInc=parseInt(Math.random()*11)+1;
	for (i=dugRandomInc; i< 8+dugRandomInc; i+=1) {
		  angle =-1 * i;
		  x=(1+angle)*Math.cos(angle);
		  y=(1+angle)*Math.sin(angle);
		  hiddenCTX.lineTo(x+16, y+16);
		 
		 
		}
	*/
	

	var steps=6+r;
	for(var iR=steps-1;iR>=1;iR--){
		
		var xPos = parseInt(x + r * Math.cos(2 * Math.PI * iR / steps))+(~~(Math.random()+0.3)*1);
		var yPos = parseInt(y + r * Math.sin(2 * Math.PI * iR / steps))+(~~(Math.random()+0.3)*1);
		hiddenCTX.lineTo(xPos*cellSizeX,yPos*cellSizeY);
		
		
	}
	
	hiddenCTX.closePath();
	hiddenCTX.strokeStyle="rgba(0,75,155,0.7)";
	hiddenCTX.stroke();
	var gradient = hiddenCTX.createRadialGradient(x*cellSizeX-(cellSizeX/2),y*cellSizeY-(cellSizeY/2),0,x*cellSizeX-(cellSizeX/2),y*cellSizeY-(cellSizeY/2),364);
	gradient.addColorStop(0.1,"rgba(0,0,155,0.9)");
	gradient.addColorStop(1,"rgba(0,0,255,1)");
	hiddenCTX.fillStyle=gradient;
	hiddenCTX.fill();
	
		hiddenCTX.strokeStyle="rgba(125,125,255,0.9)";
	hiddenCTX.globalCompositeOperation = "source-atop";
	hiddenCTX.lineWidth=5;
	hiddenCTX.lineCap = 'round';
	hiddenCTX.stroke();
	
	hiddenCTX.strokeStyle="rgba(155,155,150,0.4)";
	hiddenCTX.globalCompositeOperation = "destination-over";
	hiddenCTX.lineWidth=cellSizeX/4;
	hiddenCTX.stroke();
	

	var tileCTX=tileCanvas.getContext("2d");
	tileCTX.drawImage(hiddenCanvas,0,0);
}


var persistence = .25;
var octaves = 6;
var baseScale = .05
var width = 32, height = 32;

/* NOISE FUNCTION
Generates a number between 1 and -1
*/
var values = [];
for(var i = 0; i < height; i++) {
    values[i] = [];
    for(var j = 0; j < width; j++) {
        values[i][j] = Math.random() * 2 - 1;
    }
}
function noise(x, y) {
    x = parseInt(Math.min(width - 1, Math.max(0, x)));
    y = parseInt(Math.min(height - 1, Math.max(0, y)));
    return values[x][y];
}

/* SMOOTH NOISE
Averages the spaces around a given point to smooth the noise
*/
function smoothing(x, y) {
    var corners = ( noise(x-1, y-1)+noise(x+1, y-1)+noise(x-1, y+1)+noise(x+1, y+1) ) / 16;
    var sides   = ( noise(x-1, y)  +noise(x+1, y)  +noise(x, y-1)  +noise(x, y+1) ) /  8;
    var center  =  noise(x, y) / 4;
    var total = corners + sides + center;
    return total;
}

/* INTERPOLATE
*/
function interpolate(a, b, x) {
    var ft = x * 3.1415927;
    var f = (1 - Math.cos(ft)) * .5;
    return  a*(1-f) + b*f;
}

/* INTERPOLATE NOISE
*/
function interpolatenoise(x, y) {
      integer_X    = Math.floor(x);
      fractional_X = x - integer_X;

      integer_Y    = Math.floor(y);
      fractional_Y = y - integer_Y;

      v1 = smoothing(integer_X,     integer_Y);
      v2 = smoothing(integer_X + 1, integer_Y);
      v3 = smoothing(integer_X,     integer_Y + 1);
      v4 = smoothing(integer_X + 1, integer_Y + 1);

      i1 = interpolate(v1 , v2 , fractional_X);
      i2 = interpolate(v3 , v4 , fractional_X);

      return interpolate(i1 , i2 , fractional_Y);
}

/* NOISE—Tie it all together
*/
function perlin2d(x,y){
    var total = 0;

    var p = persistence;
    var n = octaves - 1;

    for(var i = 0; i <= n; i++) {
        var frequency = Math.pow(2, i);
        var amplitude = Math.pow(p, i);

        total = total + interpolatenoise(x * baseScale * frequency, y * baseScale * frequency) * amplitude;
    }
    return total;
}




chatWindowContainer=document.createElement("div");
chatWindowContainer.className="chatWindowContainer";
chatWindowContainer.chatLog=document.createElement("div");
chatWindowContainer.chatLog.className="chatLog";
chatWindowContainer.appendChild(chatWindowContainer.chatLog);
chatWindowContainer.chatLog.addTextAsSystem=function(text,inlineText){
	var newTextBox=document.createElement("systemMessage");
	newTextBox.commandInput=text;
	newTextBox.onclick=function(){
		this.parentNode.chatBar.value=this.commandInput;
	}
	newTextBox.onmouseover=function(eve){
		bubbleContainer.moveTo(eve.clientY-5,eve.clientX+5);
		bubbleContainer.show();
		bubbleContainer.setText(this.commandInput);
	}
	newTextBox.onmouseout=function(){
		bubbleContainer.hide();
	}
	newTextBox.textContent=inlineText||"command not found";
	this.insertBefore(newTextBox,this.firstChild);
	this.parentNode.className+=" chatWindowContainerShown";
	setTimeout(function(){this.className=this.className.replace(" chatWindowContainerShown","");}.bind(this.parentNode),1500);
}
chatWindowContainer.chatLog.addTextAsPlayerRequest=function(text,fromPlayer,buttons){
	var newTextBox=document.createElement("playerMessageRequest");
	var playerName=document.createElement("span");
	playerName.textContent=fromPlayer;
	newTextBox.appendChild(playerName);							
	newTextBox.appendChild(document.createTextNode(": "+text.substring(0,255)));
	
	var defaultAction=null;
	newTextBox.buttons=buttons;
	for(buttonText in buttons){
		if(!defaultAction)defaultAction=buttons[buttonText];
		var button=document.createElement("button");
		button.textContent=buttonText;
		button.onclick=buttons[buttonText]
		newTextBox.appendChild(button);
	}
	newTextBox.defaultAction=defaultAction;
	this.insertBefore(newTextBox,this.firstChild);
	this.parentNode.className+=" chatWindowContainerShown";
	setTimeout(function(){this.className=this.className.replace(" chatWindowContainerShown","");}.bind(this.parentNode),3500);
}
chatWindowContainer.chatLog.addTextAsPlayer=function(text,fromPlayer){
	var newTextBox=document.createElement("playerMessage");
	var playerName=document.createElement("span");
	playerName.textContent=fromPlayer;
	newTextBox.appendChild(playerName);
	newTextBox.appendChild(document.createTextNode(" "+text.substring(0,255)));
	
	this.insertBefore(newTextBox,this.firstChild);
	this.parentNode.className+=" chatWindowContainerShown";
	setTimeout(function(){this.className=this.className.replace(" chatWindowContainerShown","");}.bind(this.parentNode),1500);
}

chatWindowContainer.chatBar=document.createElement("input");
chatWindowContainer.chatBar.className="chatBar";
chatWindowContainer.chatBar.chatLog=chatWindowContainer.chatLog;
chatWindowContainer.chatLog.chatBar=chatWindowContainer.chatBar;
chatWindowContainer.appendChild(chatWindowContainer.chatBar);
userName="sys";
chatWindowContainer.chatBar.onkeydown=function(eve){
	if(eve.keyCode == 13 && this.value.length){
		var valueText=this.value;
		this.value="";
		
		if(this.chatLog.childNodes.length>15)
			this.chatLog.removeChild(this.chatLog.lastChild);
		if(valueText[0]=="/")
			this.chatLog.addTextAsSystem(valueText);
		else{
			this.chatLog.addTextAsPlayer(valueText,userName);
		}
		
	}
}







