class Delay {
    delay; //[s]
    angle; //[rad]
    roughSlider; //p5.Element, HTML slider
    preciseSlider; //p5.Element, HTML slider
    angleSlider; //p5.Element, HTML slider
    topLeftAngle; //p5.Vector, positie van linker bovenhoek van de angle dialogue
    topLeftDelay; //p5.Vector, positie van linker bovenhoek van de delay dialogue
    data = [];
    
    constructor(){
        this.delay = 2;
        this.angle = this.calcAngle(this.delay);
        this.topLeftDelay = createVector(50, 750);
        this.topLeftAngle = createVector(50, 670);

        this.roughSlider = createSlider(0, 100, 0, 1);
        this.roughSlider.size(200);
        this.roughSlider.position(this.topLeftDelay.x + 15, this.topLeftDelay.y + 40);
        this.preciseSlider = createSlider(-10, 10, 0, 0.05);
        this.preciseSlider.size(200);
        this.preciseSlider.position(this.topLeftDelay.x + 15, this.topLeftDelay.y + 90);

        this.data = [
            {dt: 10, a: Math.PI/30},
            {dt: 20, a: Math.PI/15},
            {dt: 30, a: Math.PI/10},
            {dt: 40, a: Math.PI/8},
            {dt: 50, a: Math.PI/6},
            {dt: 60, a: Math.PI/5},
            {dt: 70, a: Math.PI/4},
            {dt: 80, a: 3 * Math.PI/10},
            {dt: 85, a: Math.PI/3}
        ];

        this.angleSlider = createSlider(1, this.data.length, 7, 1);
        this.angleSlider.position(this.topLeftAngle.x + 15, this.topLeftAngle.y + 40);
        this.angleSlider.size(150);
    
    }

    calcAngle(delay /*[s]*/){
        //geeft de hoek in rad die bij een gegeven delay hoort,
        //d.m.v. interpoleren van bekende waarden. 
        //door afrondingsfouten e.d. is dit nodig.
        //benadering door lineaire interpolatie is voor dit model goed genoeg

        //gebruik gemaakt van de library d3.js:
        const data = this.data;
        const interpolate = d3.scaleLinear()
        .domain(data.map(d => d.dt))
        .range(data.map(d => d.a));

        return interpolate(delay * 1000);
    }

    drawSliderDialogues(){
        textAlign(LEFT, BOTTOM);
        push();
        translate(this.topLeftDelay);

        fill(255);
        strokeWeight(4);
        stroke("lightblue");
        rect(0, 0, 280, 180, 10, 10, 10, 10);

        strokeWeight(1);
        stroke(0);
        fill(0);
        textSize(17);
        text(`Ruwe Delay: ${(this.roughSlider.value()).toString(10)} ms`, 15, 27);
        text(`Precieze Delay: ${(this.preciseSlider.value()).toString(10)} ms`, 15, 77)
        text(`Totale Delay: ${this.roughSlider.value() + this.preciseSlider.value()} ms`, 15, 127);
        text(`∠θ = ${Math.round(1000 * this.calcAngle(this.delay)/Math.PI)/1000}π rad = ${Math.round(100 * this.calcAngle(this.delay) * 180 / Math.PI)/100}°`, 15, 157);

        pop();


        push();
        translate(this.topLeftAngle);

        fill(255);
        strokeWeight(4);
        stroke("lightblue");
        rect(0,0,280, 60, 10,10,10,10);

        strokeWeight(1);
        stroke(0);
        fill(0);
        textSize(17);
        text(`∠golven = ${Math.round(1000 * this.parseAngleSlider() / 180)/1000}π rad = ${Math.round(100 * this.parseAngleSlider())/100}°`, 15, 27);

        pop();
    }

    update(){
        //berekent de nieuwe delay aan de hand van de slider-waardes
        this.delay = this.roughSlider.value()/1000 + this.preciseSlider.value()/1000;
    }

    parseAngleSlider(){
        //de waardes uit 'this.data' zijn in te stellen als hoek.
        //de slider is een getal van 1 t/m 10, dat de index aangeeft van het getal.
        var values = this.data.map(x => x.a * 180 / Math.PI); 
        return values[this.angleSlider.value() - 1];
    }
}