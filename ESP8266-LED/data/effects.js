const webSocket = new WebSocket('ws://' + window.location.hostname + ':81/');	

const shower = document.getElementById('shower');
const showedBlock = document.getElementById('showedBlock');

(screen.width > 600) ? handlerPC() : handlerMobile();

// forbidding exit from the menu
showedBlock.onclick = () => shower.classList.toggle('show');

function handlerPC() {
	sendEffect();
	posRangeValue();
	
}

function handlerMobile() {
	
 	const posShower = (document.documentElement.clientHeight - shower.clientWidth) - shower.clientHeight;
 
	shower.onclick = function() {
	
	  let isOpen = this.classList.toggle('show');

	  if (isOpen) {

		scrollTo('top');

	  	this.style.position = 'relative';
	  	showedBlock.style.display = 'block';
		
		submenu.style.height = document.documentElement.clientHeight - 100 + 'px';

		posRangeValue();

  		arrow.style.transform = 'rotate(90deg)';
  		arrow.style.bottom = '-20px';

	  }
	  else {
	    
	    scrollTo('bottom');
	   	
	   	shower.style.top = posShower + 'px';
	   	console.log(posShower);
	   	
		setTimeout(() => {
			showedBlock.style.display = 'none';
		}, 300);

		arrow.style.transform = 'rotate(270deg)';
		arrow.style.bottom = '0px';

	  }
	}

	function scrollTo(scroll) {

		let scrolledBottom;
		let scrolledTop;
		let timerBottom;
		let timerTop;

		scrolledTop = window.pageYOffset; // current scroll position
		scrolledBottom = window.pageYOffset;

		scroll === 'top' ? scrollToTop() : scrollToBottom();
	
		function scrollToTop() {
			if (scrolledTop < document.body.scrollHeight) {
				window.scrollTo(0, scrolledTop);
				scrolledTop = scrolledTop + 50;
				timerTop = setTimeout(scrollToTop, 20);
	
			}
			else {
				clearTimeout(timerTop);
				window.scrollTo(0, document.body.scrollHeight);
	
			}
		}
	
		function scrollToBottom() {
			if (scrolledBottom > 0) {
				window.scrollTo(0, scrolledBottom);
				scrolledBottom = scrolledBottom - 50;
				timerBottom = setTimeout(scrollToBottom, 20);
	
			}
			else {
				clearTimeout(timerBottom);
				window.scrollTo(0,0);
	
			}
		}
	}

	arrow.style.left = (shower.clientWidth / 2) - 50 + 'px';

	sendEffect();

}

function sendEffect() {
	const effectElems = document.querySelectorAll('#submenu span');

	for (let item of effectElems) {

		item.onclick = function() {

			const effectNum = 'E_' + this.getAttribute('name');
			let background = '#6a9300';
			
			Array.from(effectElems, item => item.style.background = '')

			if (+(this.getAttribute('name')) > 17) background = '#cd5300';

			this.style.background = background;
			currentEffect.innerText = this.innerText;

		    console.log(effectNum);
		    webSocket.send(effectNum);

		}
	}
}

function posRangeValue() {
	const range = document.getElementById('range');
	range.oninput = function() {
		const brightness = 'B_' + this.value;

	    console.log(brightness);
	    webSocket.send(brightness);
	}	
}