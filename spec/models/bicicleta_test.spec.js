var mongoose = require("mongoose");
var Bicicleta = require("../../models/bicicleta");

describe("Testing Bicicletas", function () {
  beforeEach(function (done) {
    var mongoDB = "mongodb://localhost:27017/testdb";
    mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error"));
    db.once("open", function () {
      console.log("We are connected to test database!");
      done();
    });
  });

  afterEach(function (done) {
    Bicicleta.deleteMany({}, function (err, success) {
      if (err) console.log(err); 
      done();
    });
  });

  //Test method create instance

  describe("Bicicleta.createInstance", () => {
    it("Crea una instancia de Bicicleta", () => {
      var bici = Bicicleta.createInstance(1, "verde", "urbana", [-56.8, -72.3]);

      expect(bici.code).toBe(1);
      expect(bici.color).toBe("verde");
      expect(bici.modelo).toBe("urbana");
      expect(bici.ubicacion[0]).toEqual(-56.8);
      expect(bici.ubicacion[1]).toEqual(-72.3);
    });
  });

  //Test method allBicis
  describe("Bicicleta.allBicis", () => {
    it("Comienza vacía.", (done) => {
      Bicicleta.allBicis(function (err, bicis) {
        expect(bicis.length).toBe(0);
        done();
      });
    });
  });

  //Test method add
    describe('Bicicleta.add', () => {
        it('Agrega una bici', (done) => {
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            Bicicleta.add(aBici, function(err, newBici){
                if (err) console.log (err);
                Bicicleta.allBicis(function(err, bicis){
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);

                    done();
                });
            });
        });
    });

    //test method findByCode
    describe('Bicicleta.findByCode', () => {
        it('Debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(err, newBici){
                    if (err) console.log(err);

                    var aBici2 = new Bicicleta({code: 2, color: "rojo", modelo: "urbana"});
                    Bicicleta.add(aBici2, function(err, newBici){
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, function(error, targetBici){
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);

                            done();
                        });
                    });
                });
            });
        });
    });
});

/* beforeEach(()=>{Bicicleta.allBicis = [];});

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
}); */
