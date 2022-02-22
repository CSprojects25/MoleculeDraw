const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 200;
let canvasOffsetX = 20; // same as css left 
let canvasOffsetY = 20; // same as css top 

let atom1 = new carbon(); // first click atom
let atom2 = new carbon(); // second click atom
let isDrawing = true; // is the user drawing or editing
let atomSelected = 'C'; // current atom being drawn. Carbon, nitrogen, oxygen, ect
let bondSelected = 1; // single, double, triple, (1, 2, 3)
let atomRadius = 8; // radius around atom where clicking snaps
let click = false; // flag for first or second click
let atoms = new Array();  // when not hovering, draw atoms array

window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('click', drawing);
document.getElementById('clearBtn').addEventListener('click', clearCanvas);
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('eraseBtn').addEventListener('click', erase);
document.getElementById('carbonBtn').addEventListener('click', carbonBtn);
document.getElementById('nitrogenBtn').addEventListener('click', nitrogenBtn);
document.getElementById('oxygenBtn').addEventListener('click', oxygenBtn);
document.getElementById('singleBtn').addEventListener('click', singleBtn);
document.getElementById('doubleBtn').addEventListener('click', doubleBtn);
document.getElementById('tripleBtn').addEventListener('click', tripleBtn);

function tripleBtn() {
    isDrawing = false;
    bondSelected = 3;
}

function doubleBtn() {
    isDrawing = false;
    bondSelected = 2;
}

function singleBtn() {
    isDrawing = false;
    bondSelected = 1;
}

function oxygenBtn() {
    isDrawing = false;
    atomSelected = 'O';
}

function nitrogenBtn() {
    isDrawing = false;
    atomSelected = 'N';
}

function carbonBtn() {
    isDrawing = false;
    atomSelected = 'C';
}

// IMPLEMENT
function undo(){}

// IMPLEMENT
function erase(e) {}

function clearCanvas(e) {
    if (confirm("Are you sure?") === false) { return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    atoms.length = 0;
    click = false;
    isDrawing = true;
    atomSelected = 'C';
    bondSelected = 1;
}

function resizeCanvas() {
    // create a temporary canvas obj to cache the pixel data 
    let temp_cnvs = document.createElement('canvas');
    let temp_cntx = temp_cnvs.getContext('2d');
    // set it to the new width & height and draw the current canvas data into it 
    temp_cnvs.width = canvas.width; 
    temp_cnvs.height = canvas.height;
    temp_cntx.fillStyle = 'white';  // the original canvas's background color
    temp_cntx.fillRect(0, 0, canvas.width, canvas.height);
    temp_cntx.drawImage(canvas, 0, 0);
    // copy back in the cached pixel data 
    ctx.drawImage(temp_cnvs, 0, 0);
}

// draw molecule from data stored in the atoms array
function drawFromArr(arr) { 
    // IMPLEMENT: draw atoms array

}

// change atom to selected atom type
function changeAtom(atom) {
    // IMPLEMENT: change the clicked on atoms object to atom (parameter)
    if (drawing) { return; }
    let index = isNewPos(atom);
    if (index === -1) { return; }

    // redraw array
    drawFromArr();
}

// change bond to selected bond type
function changeBond(bondType) {
    // IMPLEMENT:  change the clicked on bond to the bond parameter

    // redraw array
    drawFromArr();
}

//
function drawing(e) {
    if (!isDrawing) { return; }
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (click == false) {
        atom1.x = e.x - canvasOffsetX;
        atom1.y = e.y - canvasOffsetY;
        checkAtom(atom1);
        click = !click;
    }
    else {
        atom2.x = e.x - canvasOffsetX;
        atom2.y = e.y - canvasOffsetY;
        checkAtom(atom2);
        ctx.moveTo(atom1.x, atom1.y);
        ctx.lineTo(atom2.x, atom2.y);
        ctx.stroke();
        drawAtom(atom1);
        drawAtom(atom2);
        click = !click;
    }
    ctx.closePath();
}

// Logic if the click does or does not intersect with an atom
function checkAtom(atom) {
    let index = isNewPos(atom);
    if ((index == -1) && (click == false)) { // first click does not intersect
        drawAtom(atom);
        saveAtomsPosition(atom); // since the position is unique, save the atom
    }
    else if ((index == -1) && (click == true)) { // second click does not intersect
        findAtom2XY();
        saveAtomsPosition(atom);; // since the position is unique, save the atom
    }
    else { // first or second click intersect with atom
        atom = atom.copy(atoms[index]); // copy atom 
    }
}

// checks whether the click intersected with an atom
// returns -1 if there is no intersection
// returns the index of the intersection
function isNewPos(atom) {
    let index = -1;
    for (let i = 0; i < atoms.length; i++) {
        if (findDist(atoms[i], atom) <= atomRadius) {
            return i;
        }
    }
    return index;
}

function findDist(a1, a2) {
    return (Math.sqrt(Math.pow(a1.x - a2.x, 2) + Math.pow(a1.y - a2.y, 2)));
}

// calculate the unit length (bond length) mouse2 position
function findAtom2XY() {
    let len = 30; // length of bond line
    let x = atom2.x - atom1.x;
    let y = atom2.y - atom1.y;

    let m = y / x; // slope
            
    if (atom1.x > atom2.x) {
        atom2.x = - Math.sqrt(len * len / (1 + m * m)) + atom1.x;
        atom2.y = m * (atom2.x - atom1.x) + atom1.y;
    }
    else if (atom1.x == atom2.x) { // same x so slope is undefined (divide by zero)
        if (atom2.y > atom1.y) {
            atom2.y = atom1.y + len;
        }
        else {
            atom2.y = atom1.y - len; 
        }
    }
    else {
        atom2.x = Math.sqrt(len * len / (1 + m * m)) + atom1.x;
        atom2.y = m * (atom2.x - atom1.x) + atom1.y;
    }
}

function saveAtomsPosition(atom) {
    let temp = new carbon();
    temp.copy(atom);
    atoms.push(temp);
    console.log(atoms);
}

function drawAtom(atom) {
    ctx.font = '12px helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'middle';
    ctx.beginPath();
    ctx.fillText(atom.name, atom.x, atom.y + 6);
    ctx.closePath();
    ctx.fill();
}
