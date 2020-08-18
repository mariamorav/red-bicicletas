const mongoose = require("mongoose");
const Bicicleta = require("../../models/bicicleta");
const request = require("request");
const server = require("../../bin/www");

var base_url = "http://localhost:5000/api/bicicletas";

describe("BICICLETA API", () => {
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

  describe("GET BICICLETAS /", () => {
    it("Status 200", (done) => {
      request.get(base_url, function (error, response, body) {
        var result = JSON.parse(body);
        expect(response.statusCode).toBe(200);
        expect(result.bicicletas.length).toBe(0);
        done();
      });
    });
  });

  describe("POST BICICLETAS /create", () => {
    it("Status 200", (done) => {
      var headers = { "content-type": "application/json" };
      var aBici =
        '{"code": 10, "color": "rojo", "modelo": "urbana", "lat":-34, "lng": -56}';
      request.post(
        {
          headers: headers,
          url: base_url + "/create",
          body: aBici,
        },
        function (error, response, body) {
          expect(response.statusCode).toBe(200);
          var bici = JSON.parse(body).bicicleta;
          console.log(bici);
          expect(bici.color).toBe("rojo");
          expect(bici.ubicacion[0]).toEqual(-34);
          expect(bici.ubicacion[1]).toEqual(-56);
          done();
        }
      );
    });
  });

  describe("DELETE BICICLETAS /delete", () => {
    it("Status 204", (done) => {
      var dBici = new Bicicleta({ code: 10, color: "rojo", modelo: "urbana"});
      Bicicleta.add(dBici, function (err, newBici) {
        if (err) console.log(err);
        Bicicleta.allBicis(function (err, bicicletas) {
          if (err) console.log(err);
          expect(bicicletas.length).toBe(1);
          var headers = { "content-type": "application/json" };
          var delBici = '{"code": 10}';
          request.delete(
            {
              headers: headers,
              url: base_url + "/delete",
              body: delBici,
            },
            function (error, response, body) {
              expect(response.statusCode).toBe(204);
              Bicicleta.allBicis(function (err, rbici) {
                if (err) console.log(err);
                expect(rbici.length).toBe(0);
                done();
              });
            }
          );
        });
      });
    });
  });

  describe('UPDATE BICICLETAS /update/:code', () => {
    it('status 200', (done) => {
      var aBici = new Bicicleta ({code: 10, color: "morado", modelo: "montaña"});
      Bicicleta.add(aBici, function(err, newBici){
        if (err) console.log (err);
        Bicicleta.allBicis(function(err, bicicletas){
          if (err) console.log (err);
          expect(bicicletas.length).toBe(1);
          var headers = {"content-type" : "application/json"};
          var aBici = '{"code": 10, "color": "morado", "modelo": "montaña"}';
          request.post({
            headers: headers,
            url: base_url+'/update/10',
            body: aBici
          }, function(error, response, body){
            expect(response.statusCode).toBe(200);
            Bicicleta.findByCode(10, function(err, targetBici){
              if(err) console.log(err);
              expect(targetBici.color).toBe("morado");
              done();
            });
          });
        });
      });
    });
  });



});

/* describe('Bicicleta API', () => {
    describe('GET BICICLETAS /', () => {
        it('status 200', () => {
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1, 'negro', 'urbana', [-34.601234, -58.386242]);
            Bicicleta.add(a);

            request.get('http://localhost:5000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('STATUS 200', (done) => {
            var headers = {'content-type': 'application/json'};
            var aBici = '{ "id": 10, "color": "rojo", "modelo": "urbana", "lat":-34, "lng": -56}';
            request.post({
                headers: headers,
                url:    'http://localhost:5000/api/bicicletas/create',
                body:   aBici
            }, function (error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(10).color).toBe("rojo");
                done();
            });
        });
    });
 
    describe('POST BICICLETAS /update', () => {
        it('STATUS 200', (done) => {
            var a = new Bicicleta(10, 'negro', 'urbana', [-34.601234, -58.386242]);
            Bicicleta.add(a);

            var headers = {'content-type': 'application/json'};
            var uBici = '{ "id": 10, "color": "azul", "modelo": "urbana", "lat":-34.601234, "lng": -58.386242}';
            request.post({
                headers: headers,
                url:    'http://localhost:5000/api/bicicletas/update',
                body:   uBici
            }, function (error, response, body){
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(10).color).toBe("azul");
                done();
            });
        });
    });

    describe('DELETE BICICLETAS /delete', () => {
        it('STATUS 204', (done) => {
            var headers = {'content-type': 'application/json'};
            var dBici = '{"id": 10}';
            request.delete({
                headers: headers,
                url:    'http://localhost:5000/api/bicicletas/delete',
                body:   dBici
            }, function (error, response, body){
                expect(response.statusCode).toBe(204);
                done();
            });
        });
    });

}); */
