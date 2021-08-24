let ipEle = document.querySelector('.text-main--ip');
let locEle = document.querySelector('.text-main--location');
let TZEle = document.querySelector('.text-main--timezone');
let ISPEle = document.querySelector('.text-main--isp');
let btn     = document.querySelector('.icon-input');
let inpTxt  = document.querySelector('.ip-input');
var map, marker;
navigator.geolocation.getCurrentPosition((position)=>{
    let lon = position.coords.longitude;
    let lat = position.coords.latitude;
    map = L.map('mapid').setView([lon, lat], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    marker = L.marker([lon, lat]).addTo(map);
});
fetchAPI();
btn.addEventListener('click', (e)=>{
    e.preventDefault();
    fetchAPI(ip=inpTxt.value, map=map);
});
function fetchAPI(ip=undefined, map){
    let k = "2c05206a48024e248f2e49012fa14baa";
    if(ip == undefined){
        url = `https://api.ipgeolocation.io/ipgeo?apiKey=${k}`;
    }else{
        url = `https://api.ipgeolocation.io/ipgeo?apiKey=${k}&ip=${ip}`;
    }
    fetch(url)
        .then( res => res.json())
        .then(response => {
            console.log(response);
            ipEle.innerHTML     = response.ip;
            locEle.textContent    = `${response.country_name}, ${response.city}`;
            ISPEle.innerHTML    = response.isp;
            let tz = response.time_zone.offset;
            TZEle.innerHTML = (tz > 0) ? TZEle.innerHTML = `+${response.time_zone.offset}:00`:TZEle.innerHTML = `${response.time_zone.offset}:00`;
            if(ip!==undefined){
                map.panTo([response.latitude, response.longitude]);
                marker.setLatLng([response.latitude, response.longitude]);
            };
        })
        .catch((data, status) => {
            console.log('Request failed');
            console.log(data, status);
        });
}