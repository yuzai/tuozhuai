;(function(){
  function getStyle(elem,property){
	return getComputedStyle ? getComputedStyle(elem)[property]: elem.currentStyle[property];
  }
  var trans = (function getTransform(){
	var divcss = document.createElement('div').style;
	var trans = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'];
	for(var i=0,len = trans.length;i<len;i++){
		if(trans[i] in divcss){
			return trans[i];
		}
	}
	return '';
  })();

  function getTargetPos(elem){
	var pos = {}
	  if(trans){
	  	var style = getStyle(elem,trans);
	  	if(style !== 'none'){
	  		var reg = /-?[0-9\.]+/g;
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
	  if(trans){
	  	elem.style[trans] = 'translate('+ pos.x +'px, '+ pos.y +'px)';
	  }else{
	  	elem.style.position = 'relative';
	  	elem.style.left = pos.x + 'px';
	      elem.style.top = pos.y + 'px';
	  }
	  return elem;
  }

  function Drag(selector){
  	this.elem = typeof selector === 'Object'?selector:document.getElementById(selector);
  	this.dist = {};
  	this.init();
  }
  Drag.prototype = {
  	constructor:Drag,
  	init:function(){
  		this.setDrag();
  	},
  	setDrag:function(){
  		var self = this;
  		this.elem.addEventListener('mousedown',start,false);
  		this.elem.addEventListener('touchstart',start,false);
  		function start(event){
        console.log(event.type);
  			var startTargetPos = getTargetPos(self.elem);
  			var mousePos = {
  				x:event.pageX?event.pageX:event.touches[0].pageX,
  				y:event.pageY?event.pageY:event.touches[0].pageY,
  			};
  			self.dist = {
  				x:mousePos.x-startTargetPos.x,
  				y:mousePos.y-startTargetPos.y,
  			}
  			document.addEventListener('mousemove',move,false);
  			document.addEventListener('mouseup',end,false);

        document.addEventListener('touchmove',move,{passive: false});
        document.addEventListener('touchend',end,false);
  		}
  		function move(event){
        console.log(event.type);
        event.preventDefault();
  			var mouseX = event.pageX?event.pageX:event.touches[0].pageX;
        var mouseY = event.pageY?event.pageY:event.touches[0].pageY;
		    var Pos = {
		      x:mouseX-self.dist.x,
		      y:mouseY-self.dist.y
		    }
		    setPos(self.elem,Pos);
  		}
  		function end(){
         console.log(event.type);
            document.removeEventListener('mousemove',move);
            document.removeEventListener('mouseup',end);

            document.removeEventListener('touchmove',move);
            document.removeEventListener('touchend',end);
  		}
  	}
  }
  window.Drag = Drag;
})();
new Drag('div1');
new Drag('div2');