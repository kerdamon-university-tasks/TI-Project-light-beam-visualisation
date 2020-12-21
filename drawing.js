function drawAxes(){
    let drawingArea = document.getElementById('drawing-area');
    let w = drawingArea.getAttribute('width');
    let h = drawingArea.getAttribute('height');
    console.log(`svg dimensions: w = ${w}, h = ${h}`);
    document.getElementById('drawing-area').innerHTML += `<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="black"/>`;
    document.getElementById('drawing-area').innerHTML += `<line x1="${w/2}" y1="${h/2 - h/5}" x2="${w/2}" y2="${h/2 + h/5}" stroke="black" stroke-dasharray="4" />`;
}

function drawLaser() {
    drawInitialLaser();
    calculateIntensity();
    drawReflectedLaser();
    drawRefractedLaser();
    drawEmitter();
}

function drawEmitter() {
    removeElement('laser-head');
    document.getElementById('drawing-area').innerHTML += `<circle cx=${dimensions.center.x + dimensions.emitter.x} cy=${dimensions.center.y + dimensions.emitter.y} r=5 stroke="blue" fill="blue" id="laser-head" />`;
}

function drawInitialLaser() {
    removeElement('laser-line');
    document.getElementById('drawing-area').innerHTML += `<line x1="${dimensions.center.x + dimensions.emitter.x}" y1="${dimensions.center.y + dimensions.emitter.y}" x2="${dimensions.center.x}" y2="${dimensions.center.y}" stroke="red" id="laser-line" stroke-width="3" />`;
}

function calculateIntensity() {
    let cosUpper = Math.cos(params.angle);
    let cosLower = Math.sqrt(1 - Math.pow((params.RefractionIndexUpper / params.RefractionIndexLower * Math.sin(params.angle)), 2));

    let nUpperTimesCosUpper = params.RefractionIndexUpper * cosUpper;
    let nLowerTimesCosLower = params.RefractionIndexLower * cosLower;
    let Rs = Math.pow((nUpperTimesCosUpper - nLowerTimesCosLower) / (nUpperTimesCosUpper + nLowerTimesCosLower), 2);

    let nUpperTimesCosLower = params.RefractionIndexUpper * cosLower;
    let nLowerTimesCosUpper = params.RefractionIndexLower * cosUpper;
    let Rp = Math.pow((nUpperTimesCosLower - nLowerTimesCosUpper) / (nUpperTimesCosLower + nLowerTimesCosUpper), 2);

    intensity.R = 0.5 * (Rs + Rp);
    intensity.T = 1 - intensity.R;
}

function drawReflectedLaser() {
    let x = dimensions.r * Math.sin(params.angle);
    let y = - dimensions.r * Math.cos(params.angle);
    
    removeElement('laser-line-reflected');
    document.getElementById('drawing-area').innerHTML += `<line x1="${dimensions.center.x}" y1="${dimensions.center.y}" x2="${dimensions.center.x + x}" y2="${dimensions.center.y + y}" stroke-opacity="${intensity.R}" stroke="red" id="laser-line-reflected" stroke-width="3" />`;
}

function drawRefractedLaser() {
    let sinRefr = params.RefractionIndexUpper * Math.sin(params.angle) / params.RefractionIndexLower;   // z prawa Snella
    let cosRefr = Math.sqrt(1 - Math.pow(sinRefr, 2));                                                  // z jedynki trygonometrycznej

    let x = dimensions.r * sinRefr;
    let y = dimensions.r * cosRefr;
    
    removeElement('laser-line-refracted');
    if( y > 0)
        document.getElementById('drawing-area').innerHTML += `<line x1="${dimensions.center.x}" y1="${dimensions.center.y}" x2="${dimensions.center.x + x}" y2="${dimensions.center.y + y}" stroke-opacity="${intensity.T}" stroke="red" id="laser-line-refracted" stroke-width="3" />`;
}