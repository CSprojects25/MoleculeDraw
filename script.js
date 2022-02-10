const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('keypress', function(e) {
    ctx.closePath();
    if (e.key == 'e') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        atomArr.length = 0;
        click = false;
    }
})

window.addEventListener('resize', function(e) {
    // create a temporary canvas obj to cache the pixel data //
    var temp_cnvs = document.createElement('canvas');
    var temp_cntx = temp_cnvs.getContext('2d');
// set it to the new width & height and draw the current canvas data into it // 
    temp_cnvs.width = window.innerWidth; 
    temp_cnvs.height = window.innerHeight;
    temp_cntx.fillStyle = 'white';  // the original canvas's background color
    temp_cntx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    temp_cntx.drawImage(canvas, 0, 0);
// resize & clear the original canvas and copy back in the cached pixel data //
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    ctx.drawImage(temp_cnvs, 0, 0);
})

// FIX: put moice in the event listener
mouse1 = {
    x: undefined,
    y: undefined,
}

mouse2 = {
    x: undefined,
    y: undefined,
}

var atomArr = new Array();
var atomRadius = 5; // radius of atom circle
var click = false; // first or second click

canvas.addEventListener('click', function(e) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (click == false) {
        mouse1.x = e.x;
        mouse1.y = e.y;
        checkMouse(mouse1);
        saveAtomsPosition(mouse1);
        click = !click;
    }
    else {
        mouse2.x = e.x;
        mouse2.y = e.y;
        checkMouse(mouse2);
        saveAtomsPosition(mouse2);
        ctx.moveTo(mouse1.x, mouse1.y);
        ctx.lineTo(mouse2.x, mouse2.y);
        ctx.stroke();
        drawAtom(mouse1);
        drawAtom(mouse2);
        click = !click;
    }
    ctx.closePath();
})

canvas.addEventListener('mouseover', function(e) {

})

// Logic if the click does or does not intersect with an atom
function checkMouse(mouse) {
    var index = isNewPos(mouse);
    if ((index == -1) && (click == false)) { // first click does not intersect
        drawAtom(mouse);
    }
    else if ((index == -1) && (click == true)) { // second click does not intersect
        findMouse2XY();
    }
    else { // first or second click intersect with atom
        mouse.x = atomArr[index].x; // set mouse to XY of atom intersection
        mouse.y = atomArr[index].y;
    }
}

// checks whether the click intersected with an atom
function isNewPos(mouse) {
    var index = -1;
    for (var i = 0; i < atomArr.length; i++) {
        if (findDist(atomArr[i], mouse) <= atomRadius) {
            console.log(findDist(atomArr[i], mouse), i);
            return i;
        }
    }
    return index;
}

// distance between two points
function findDist(m1, m2) {
    return (Math.sqrt(Math.pow(m1.x - m2.x, 2) + Math.pow(m1.y - m2.y, 2)));
}

// calculate the unit length (bond length) mouse2 position
function findMouse2XY() {
    var len = 45; // length of bond line
    var x = mouse2.x - mouse1.x;
    var y = mouse2.y - mouse1.y;

    var m = y / x; // slope
            
    if (mouse1.x > mouse2.x) {
        mouse2.x = - Math.sqrt(len * len / (1 + m * m)) + mouse1.x;
        mouse2.y = m * (mouse2.x - mouse1.x) + mouse1.y;
    }
    else if (mouse1.x == mouse2.x) { // same x so slope is undefined (divide by zero)
        if (mouse2.y > mouse1.y) {
            mouse2.y = mouse1.y + len;
        }
        else {
            mouse2.y = mouse1.y - len; 
        }
    }
    else {
        mouse2.x = Math.sqrt(len * len / (1 + m * m)) + mouse1.x;
        mouse2.y = m * (mouse2.x - mouse1.x) + mouse1.y;
    }
}

// save atom positions
function saveAtomsPosition(mouse) {
    let temp = new Object();
    temp.x = mouse.x;
    temp.y = mouse.y;
    atomArr.push(temp);
}

// draws the atom 
function drawAtom(mouse, color) {
    ctx.fillStyle = 'RGBA(0, 0, 0, 1)';
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, atomRadius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}