var $btn1 = document.querySelector('#btn1');
var $btn2 = document.querySelector('#btn2');
var $div1 = document.querySelector('.div1');
var $div2 = document.querySelector('.div2');
var left = 0;
var transform = 0;
$btn1.onclick = function(){
	left += 5;
	$div1.style.left = left+'px'; 
}
$btn2.onclick = function(){
	transform += 5;
	$div2.style.transform = "translateX("+transform+"px)"; 
	// console.log(getTargetPos($div2));
}
function getTransform(){
	var divcss = document.createElement('div').style;
	var trans = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'];
	for(var i=0,len = trans.length;i<len;i++){
		if(trans[i] in divcss){
			return trans[i];
		}
	}
	return '';
}
function getStyle(elem,property){
	return getComputedStyle ? getComputedStyle(elem,false)[property]: elem.currentStyle[property];
}
function getTargetPos(elem){
	var pos = {}
  var trans = getTransform();
  if(trans){
  	var style = getStyle(elem,trans);
  	if(style !== 'none'){
  		var reg = /\d+/g;
  		pos.x = Number(style.match(reg)[4]);
  		pos.y = Number(style.match(reg)[5]);

  	}else{
  		elem.style[trans] = 'translate(0,0)';
  		pos.x = 0;
  		pos.y = 0;
  	}
  }else{
  	var position = getStyle(elem,'position');
  	if(position==='static'){
  		elem.style.position = 'relative';
  		pos.x = 0;
  		pos.y = 0;
  	}else{
  		pos.x = Number(getStyle(elem,'left'));
  		pos.y = Number(getStyle(elem,'top'));
  	}
  }
  return pos;
}
function setPos(elem,pos){
  var trans = getTransform();
  if(trans){
  	elem.style[trans] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
  }else{
  	elem.style.position = 'relative';
  	elem.style.left = pos.x + 'px';
      elem.style.top = pos.y + 'px';
  }
  return elem;
}
function addEvent(elem){
  elem.addEventListener('mousedown',function(event){
    var startX = event.pageX;
    var startY = event.pageY;
    var postarget = getTargetPos(elem);
    function mousemove(event){
      var mouseX = event.pageX;
      var mouseY = event.pageY;
      var dist = {
        x:mouseX-startX+postarget.x,
        y:mouseY-startY+postarget.y
      }
      setPos(elem,dist);
      // var pos = getMousePos(event);
    }
    function mouseup(){
      window.removeEventListener('mousemove',mousemove)
      window.removeEventListener('mouseup',mouseup);
    }
    window.addEventListener('mousemove',mousemove)
    window.addEventListener('mouseup',mouseup);
  })
}
addEvent($div2);