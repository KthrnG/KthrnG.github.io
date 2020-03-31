let spielerListe;
let leinwand;
let index;
let radius;
let status;

class Punkt {
    farbe;
    x;
    y;

    constructor(x, y, farbe) {
        this.x = x;
        this.y = y;
        this.farbe = farbe;
    }

    draw() {
        noStroke();
        fill(this.farbe);
        circle(this.x, this.y, radius);
        // auch schön:
//        rect(this.x, this.y, radius, radius);
    }

    neuerPunktMitMaximalemAbstand(max) {
        let x = this.x + random(-max, max);
        let y = this.y + random(-max, max);
        return new Punkt(x, y, this.farbe);
    }
}

class Leinwand {
    width;
    height;
    punkte;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.punkte = [];
        fill(255, 250, 240);
        rect(0, 0, width, height);
    }

    istLeer() {
        return this.punkte.length === 0;
    }

    punktHinzufuegen(p) {
        this.punkte.push(p);
        p.draw();
    }

    zufaelligerPunkt() {
        let index = parseInt(random(this.punkte.length));
        return this.punkte[index];
    }

    istErlaubt(punkt, min) {
        // Auf der Leinwand?
        if (punkt.x < 0) return false;
        if (punkt.y < 0) return false;
        if (punkt.x > width) return false;
        if (punkt.y > height) return false;
        // Nicht zu nah an einem anderen Punkt?
        for (const p of this.punkte) {
            if (dist(p.x, p.y, punkt.x, punkt.y) < min) return false;
        }
        return true;
    }
}

class Spieler {
    farbe;
    rekursionstiefe;

    constructor(farbe) {
        this.farbe = farbe;
    }

    zufaelligenPunktZeichnen(leinwand) {
        if (this.rekursionstiefe++ > 1000) {
            status = -1;
        }
        let zufaelligerPunkt = leinwand.zufaelligerPunkt();
        let punkt = zufaelligerPunkt.neuerPunktMitMaximalemAbstand(leinwand.width, leinwand.height);
        if (leinwand.istErlaubt(punkt, radius)) {
            leinwand.punktHinzufuegen(new Punkt(punkt.x, punkt.y, this.farbe));
        } else {
            this.zufaelligenPunktZeichnen(leinwand);
        }
    }

    punktZeichnen(leinwand) {
        this.rekursionstiefe = 0;
        if (leinwand.istLeer()) {
            this.punktIrgendwoAufDerLeinwandZeichnen(leinwand);
            return;
        }

        this.zufaelligenPunktZeichnen(leinwand);
    }

    punktIrgendwoAufDerLeinwandZeichnen(leinwand) {
        let p = new Punkt(leinwand.width, leinwand.height, this.farbe);
        leinwand.punktHinzufuegen(p);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255, 250, 240);

    spielerListe = [];
    spielerListe.push(new Spieler(color(255, 0, 0))); // rot
    spielerListe.push(new Spieler(color(255, 255, 0))); // gelb
    spielerListe.push(new Spieler(color(0, 0, 255))); // blau
    spielerListe.push(new Spieler(color(0))); // schwarz

    leinwand = new Leinwand(width, height);

    index = 0;
    status = 0;
    radius = 10;
}

function draw() {
    if (status === -1) {
        leinwand = new Leinwand(width, height);
        status = 0;
    }
    spielerListe[index].punktZeichnen(leinwand);
    index++;
    index %= 4;
}
