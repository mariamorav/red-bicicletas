var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');

beforeEach(()=>{console.log('testeando...');});

describe('Bicicleta API', () => {
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

});