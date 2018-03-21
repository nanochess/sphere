//
// Draw a wireframe globe
//
// by Oscar Toledo G.
//
// Creation date: Mar/21/2018.
//

const DEG2RAD = 3.14159 / 180.0;
const RADIUS = 44;

var yaw = -10.0 * DEG2RAD;
var pitch = 0.0 * DEG2RAD;
var roll = 90.0 * DEG2RAD;

var sx, sy, sz;

document.writeln("<canvas id='p' width='48' height='48'></canvas>");

var canvas = document.getElementById("p");
var ctx = canvas.getContext("2d");

// Project point
function project() {
	sz = sz + 200;
	sx = (sx * 20) / sz * 5 + 24;
	sy = (sy * 20) / sz * 5 + 24;
}

// Adapted from https://stackoverflow.com/questions/34050929/3d-point-rotation-algorithm/34060479
function rotate() {
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);

    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);

    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);

    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;

    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;

    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;

    var px = sx;
    var py = sy;
    var pz = sz;

    sx = Axx*px + Axy*py + Axz*pz;
    sy = Ayx*px + Ayy*py + Ayz*pz;
    sz = Azx*px + Azy*py + Azz*pz;
}

function moveTo(x, y)
{
	x = x * 180.0 * DEG2RAD;
	y = y * 180.0 * DEG2RAD;
	sx = RADIUS * Math.cos(y) * Math.cos(x);
	sy = RADIUS * Math.cos(y) * Math.sin(x);
	sz = RADIUS * Math.sin(y);
	rotate();
	project();
	ctx.moveTo(sx, sy); 
}
 
function lineTo(x, y)
{
	x = x * 180.0 * DEG2RAD;
	y = y * 180.0 * DEG2RAD;
	sx = RADIUS * Math.cos(y) * Math.cos(x);
	sy = RADIUS * Math.cos(y) * Math.sin(x);
	sz = RADIUS * Math.sin(y);
	rotate();
	project();
	ctx.lineTo(sx, sy); 
}
 
function sphere() {
pitch = pitch - 4.5 * DEG2RAD;

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, 256, 256);

ctx.strokeStyle = "#00ff00";
ctx.strokeWidth = 5;

for (c = -1; c <= 1; c += 0.125) {
	ctx.beginPath();
	moveTo(-1, c);
	for (d = -1; d <= 1; d += 0.025) {
		lineTo(d, c);
	}
	ctx.stroke();
}

for (d = -1; d <= 1; d += 0.125) {
	ctx.beginPath();
	moveTo(d, -1);
	for (c = -1; c <= 1; c += 0.025) {
		lineTo(d, c);
	}
	ctx.stroke();
}
}

var encoder = new GIFEncoder();
encoder.setRepeat(0);
encoder.setDelay(100);
encoder.start();

for (frames = 0; frames < 5; frames++) {
	sphere();
	encoder.addFrame(ctx);
}

encoder.finish();
document.location = 'data:image/gif;base64,'+encode64(encoder.stream().getData());
