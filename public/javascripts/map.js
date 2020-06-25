var map = L.map('main_map').setView([7.898543, -72.495908], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([7.898543, -72.495908]).addTo(map);
L.marker([7.898892, -71.499328]).addTo(map);
L.marker([8.898543, -71.499328]).addTo(map);

$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach(function(bici){
            L.marker(bici.ubicacion, {title: bici.id}).addTo(map);
        });
    }
});