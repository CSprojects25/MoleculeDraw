class Atom {
    constructor(undefined, y, name, bonds, bondTypes, maxBonds, currBonds) { 
        this.x; // position
        this.y; // position
        this.name = ''; 
        this.bonds = new Array(); // array of bonds than an atom currently has
        this.currBonds;
        this.bondTypes; // type of bonds an atom can have
        this.maxBonds; // max number of bonds an atom can have
    }

    copy(atom) {
        if (atom instanceof Atom) {
            this.x = atom.x;
            this.y = atom.y;
            this.name = atom.name;
            this.bonds = atom.bonds; 
            this.currBonds = atom.currBonds;
            this.bondTypes = atom.bondTypes;
            this.maxBonds = atom.maxBonds;
        }
    }
}

class carbon extends Atom  {
    constructor() {
        super(undefined, undefined, '', null, '123', 4, null);
    }
}

class nitrogen extends Atom {
    constructor() {
        super(undefined, undefined, 'N', null, '123', 3, null);
    }
}

class oxygen extends Atom {
    constructor() {
        super(undefined, undefined, 'O', null, '12', 2, null);
    }
}

class hydrogen extends Atom {
    constructor() {
        super(undefined, undefined, 'H', null, '1', 1, null);
    }
}