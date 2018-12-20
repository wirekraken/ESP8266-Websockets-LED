if(screen.width < 600) handlerMobile();
if(screen.width > 600) handlerPC();

var inputRange = document.getElementsByTagName('input')[0];

var Socket = new WebSocket('ws://' + window.location.hostname + ':81/');	

try{
	document.createEvent('touchevent'); //проверка на сенсор

	inputRange.addEventListener('touchstart', clickdown);
	inputRange.addEventListener('touchend', clickup);
}
catch(e){ 
	inputRange.addEventListener('mousedown', clickdown);
	inputRange.addEventListener('mouseup', clickup);
}

function clickdown(){rangeValue.style.opacity = '1';}
function clickup(){rangeValue.style.opacity = '0';}

//запрещаем выход из меню
showedBlock.onclick = function(){shower.classList.toggle('show')};

function handlerMobile(){
	var span = document.getElementsByTagName('span');

	for(var x = 0; x < span.length; x++){
		span[x].onclick = function(){

			for(var g = 0; g < span.length; g++){
				span[g].style.background = '';
				
			}

			this.style.background = '#6a9300';
			
			if(this.getAttribute('name') > 17){
				this.style.background = '#cd5300';

			}

			var send = 'F_' + this.getAttribute('name');
		    console.log(send);
		    Socket.send(send);

		}
	}

//находим позицию шапки
 var posShower = (document.documentElement.clientHeight - shower.clientWidth) - shower.clientHeight;
 
	shower.onclick = function(){
	  var is_true = this.classList.toggle('show');

	  if(is_true){
	  	this.style.position = 'relative';
	  	showedBlock.style.display = 'block';

	    scrolledTop = window.pageYOffset; //начальная позиция, текущее положение сколла
		scrollToTop();
		
		submenu.style.height = document.documentElement.clientHeight - 100 + 'px';

		posRangeValue();

  		arrow.style.transform = 'rotate(90deg)';
  		arrow.style.bottom = '-20px';

	  }
	  else{
	    scrolledBottom = window.pageYOffset;
	    scrollToBottom();
	   	
	   	shower.style.top = posShower + 'px';
	   	console.log(posShower);
	   	
		setTimeout(function(){
			showedBlock.style.display = 'none';
		}, 300);

		arrow.style.transform = 'rotate(270deg)';
		arrow.style.bottom = '0px';

	  }
	}

	var scrolledBottom;
	var scrolledTop;
	var timerBottom;
	var timerTop;

	function scrollToTop(){
		if(scrolledTop < document.body.scrollHeight){
			window.scrollTo(0, scrolledTop);
			scrolledTop = scrolledTop + 50;
			timerTop = setTimeout(scrollToTop, 20);

		}
		else{
			clearTimeout(timerTop);
			window.scrollTo(0, document.body.scrollHeight);

		}
	}

	function scrollToBottom(){
		if(scrolledBottom > 0){
			window.scrollTo(0, scrolledBottom);
			scrolledBottom = scrolledBottom - 50;
			timerBottom = setTimeout(scrollToBottom, 20);

		}
		else{
			clearTimeout(timerBottom);
			window.scrollTo(0,0);

		}
	}

	arrow.style.left = (shower.clientWidth / 2) - 50 + 'px';

}

function handlerPC(){
	var span = document.getElementsByTagName('span');

	for(var x = 0; x < span.length; x++){
		span[x].onclick = function(){

			for(var g = 0; g < span.length; g++){
				span[g].style.background = '';

			}
			this.style.background = '#6a9300';

			if(this.getAttribute('name') > 17){
				this.style.background = '#cd5300';

			}

			currentEffect.innerText = this.innerText;

			var send = 'F_' + this.getAttribute('name');
		    console.log(send);
		    Socket.send(send);

		}
	}
	posRangeValue();
	
}

function posRangeValue(){
	//ширира дорожки - ширина элемента
	var widthBlock = (range.clientWidth - rangeValue.clientWidth) / 100;

	rangeValue.style.transform = 'translateX(' + (range.value / 2.55) * widthBlock + 'px)';
	rangeValue.innerText = range.value;

	range.oninput = function(){
		rangeValue.innerText = parseInt(this.value / 2.55);
		rangeValue.style.transform = 'translateX(' + ((this.value / 2.55) * widthBlock) + 'px)';

		var send = 'B_' + this.value;
	    console.log(send);
	    Socket.send(send);

	}	
}