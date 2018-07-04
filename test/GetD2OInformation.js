const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const maplist = require('./mapList.json')

function httpGetMapD2o(mapid) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=1.30.7", !0);
    xhttp.setRequestHeader("Content-type", "application/json");
    // xhttp.setRequestHeader("Accept-Encoding", "gzip, deflate");
    xhttp.setRequestHeader("Accept-Language", "en-US");
    // xhttp.setRequestHeader("Connection", "keep-alive");
    // xhttp.setRequestHeader("Content-Length", "41");
    // xhttp.setRequestHeader("Host", "proxyconnection.touch.dofus.com");
    xhttp.setRequestHeader("User-Agent", "Mozilla/5.0 (Linux; Android 6.0.1; Z988 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Mobile Crosswalk/20.50.533.27 Mobile Safari/537.36");
    xhttp.send(JSON.stringify({
        "class": "MapPositions",
        "ids": [mapid]
    }));
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            fs.writeFile(`./d2o/${mapid}.json`, xhttp.responseText, (err) => {
                if (err) throw err;
                console.log(mapid);
            })
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            console.log('Bad Request 400');
        }
    }
}

function httpGetMapD2p(mapid) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://ankama.akamaized.net/games/dofus-tablette/assets/2.19.0/maps/" + mapid + ".json", true);
    xhttp.send(null)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            fs.writeFile(`./maps/${mapid}.json`, xhttp.responseText, (err) => {
                if (err) throw err;
                console.log(mapid);
            })
        }
    }
}

for (let index = 0; index < maplist.map.length; index++) {
    // let o = httpGetMapD2o(maplist.map[index]);
    httpGetMapD2o(maplist.map[index]);
    // let oJson = JSON.parse(o);
    // let p = httpGetMapD2p(maplist.map[index]);
    // let pJson = JSON.parse(p);
    // let quant = 0;
    // for (let i = 1; i < 561; i++) {
    //     if (pJson.midgroundLayer !== undefined) {
    //         if (pJson.midgroundLayer[i] !== undefined) {
    //             pJson.midgroundLayer[i].forEach(element => {
    //                 if (element.look !== undefined & element.anim === undefined) {
    //                     if (element.look == 650) {
    //                         quant += 1;
    //                     }
    //                 }
    //             });
    //         }
    //     }
    // }
    // console.log(`{"x" : ${oJson[maplist.map[index]].posX}, "y" : ${oJson[maplist.map[index]].posY}, "id" : ${oJson[maplist.map[index]].id}, "q" : ${quant}`)
}