var Bicicleta = require('../../models/bicicleta');

beforeEach(()=>{Bicicleta.allBicis = [];});

describe('Bicicleta.allBicis', () => {
    it('Comienza vacía', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

//test del metodo add
describe('Bicicleta.add', () => {
    it('Agregamos una', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var a = new Bicicleta (1, 'rojo', 'urbana', [-34.002344, -58.4543234]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

//test del metodo findById
describe('Bicicleta.findById', () => {
    it('Debe devolver la bici con id 1', ()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
        var aBici = new Bicicleta (1, "verde", "Urbana");
        var aBici2 = new Bicicleta (2, "roja", "Montaña");
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);

        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);
    });
});

//test del metodo removeById
describe('Bicicleta.removeById', () => {
    it('Debe eliminar el elemento con Id 1', ()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
        var rBici = new Bicicleta (1, "verde", "urbana");
        var rBici2 = new Bicicleta (2, "rojo", "urbana");
        Bicicleta.add(rBici);
        Bicicleta.add(rBici2);
        
        Bicicleta.removeById(rBici.id);
        expect(Bicicleta.allBicis.length).toBe(1);
    });
});