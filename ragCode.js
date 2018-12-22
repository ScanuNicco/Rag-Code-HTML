function dragElement(elmnt) {
	var objID = elmnt.getAttribute("objectid");
	var obj = elements[parseFloat(objID)];
	if (document.getElementById(elmnt.id + "header")) {
		/* if present, the header is where you move the DIV from:*/
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
		/* otherwise, move the DIV from anywhere inside the DIV:*/
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		var objID = elmnt.getAttribute("objectid");
		var obj = elements[parseFloat(objID)];
		e = e || window.event;
		e.preventDefault();
		elmnt.style.zIndex = "1000";
		// get the mouse cursor position at startup:
		obj.pos3 = e.clientX;
		obj.pos4 = e.clientY;

		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	var intersecting = false;
	var which = null;

	function elementDrag(e) {
		var objID = elmnt.getAttribute("objectid");
		var obj = elements[parseFloat(objID)];
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		obj.pos1 = obj.pos3 - e.clientX;
		obj.pos2 = obj.pos4 - e.clientY;
		obj.pos3 = e.clientX;
		obj.pos4 = e.clientY;
		for (i = 0; i < elements.length; i++) {
			if (i != objID) {
				if (obj.pos3 < elements[i].pos3 + ((elements[i].numChildren + 1) * 100) && obj.pos3 > elements[i].pos3 - ((elements[i].numChildren + 1) * 100)) {
					if (obj.pos4 < elements[i].pos4 + ((elements[i].numChildren + 1) * 50) && obj.pos4 > elements[i].pos4 - ((elements[i].numChildren + 1) * 50)) {
						document.getElementById(elmnt.id + "header").style.cursor = "copy";
						intersecting = true;
						which = i;
					} else {
						document.getElementById(elmnt.id + "header").style.cursor = "move";
						intersecting = false;
					}
				} else {
					document.getElementById(elmnt.id + "header").style.cursor = "move";
					intersecting = false;
				}
			}
		}
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - obj.pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - obj.pos1) + "px";
	}

	function closeDragElement() {
				var objID = elmnt.getAttribute("objectid");
		var obj = elements[parseFloat(objID)];
		if (intersecting) {
			console.log("dropped on another element");
			setParent(elmnt, document.getElementById(elements[which].type + which + "children"))
			obj.pos1 = 0;
			obj.pos2 = 0;
			obj.pos3 = 0;
			obj.pos4 = 0;
			elements[which].numChildren++;
			elements[which].numChildren += obj.numChildren;
			elmnt.style.top = (elements[which].numChildren * 55) + "px";
			elmnt.style.left = (50) + "px";
			document.getElementById(elements[which].type + which).style.width = (elements[which].numChildren * 200) + "px"; 
			document.getElementById(elements[which].type + which + "children").style.height = (elements[which].numChildren * 200) + "px"; 
			
			//document.getElementById(elements[which].type + which).style.width + elmnt.style.width;
		} else {
			console.log("dropped on body element");
			setParent(elmnt, document.getElementsByTagName("body")[0]);
		}
		/* stop moving when mouse button is released:*/
		document.onmouseup = elmnt.style.zIndex = "5";
		document.onmousemove = null;
	}
}

var numOfElements = 0;
var elements = [];
class Element {
	constructor(elementType) {
		this.type = elementType;
		this.properties = [];
		this.pos1 = 0;
		this.pos2 = 0;
		this.pos3 = 0;
		this.pos4 = 0;
		this.numChildren = 0;
		var container = document.getElementById("elementsContainer");
		container.innerHTML = container.innerHTML + "<div class='elementDisplay' id='" + elementType + numOfElements + "' objectid='" + numOfElements + "'><div id='" + elementType + numOfElements + "header' class='elementHeader'>" + elementType + " Element</div><div id='" + elementType + numOfElements + "children' class='elementChildren'><br></div></div>";
		dragElement(document.getElementById(elementType + numOfElements));
		numOfElements++;
	}
}

function newElement(elementType) {
	var newE = new Element(elementType);
	elements.push(newE);
	for (i = 0; i < elements.length; i++) {
		dragElement(document.getElementById(elements[i].type + i));
	}
}

function setParent(el, newParent) {
	newParent.appendChild(el);
}
