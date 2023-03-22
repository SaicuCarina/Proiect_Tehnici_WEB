const express = require("express");
const fs = require('fs');

ob_global={
    ob_erori:null,
    ob_imagini:null
}

app= express();
console.log("Folder proiect", __dirname);

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));

app.get("/ceva", function(req, res){
    res.send("altceva");
})

app.get(["/index","/", "/home"], function(req, res){
    res.render("pagini/index", {ip: req.ip, a: 10, b: 20});
})

app.get("/*", function(req, res){
    res.render("pagini"+req.url, function(err, rezRandare){
        if(err){
            if(err.message.startsWith("Failed to lookup view"))
                afisare_erori(res, 404);
            else
                afisare_erori(res);
            console.log(err);           
            res.send("Eroare");
        }
        else{
            console.log(rezRandare);
            res.send(rezRandare);
        }
    });
})

function initializeaza_erori(){
    var continut = fs.readFileSync(__dirname+"/resurse/json/erori.json".toString("utf-8"));
    console.log(continut);
    ob_global.ob_erori=JSON.parse(continut);
    let v_erori=ob_global.ob_erori.info_erori
    // for(let i=0; i<v_erori.length; i++)
    //     console.log(v_erori[i].ob_imagini)
    for(let eroare of v_erori){
        eroare.ob_imagini = "/" +ob_global.ob_erori.cale_baza+"/" +eroare.ob_imagini;
    }
}
initializeaza_erori();

function afisare_erori(res, _identificator, _titlu, _text, _imagine){
    let v_erori = ob_global.ob_erori.info_erori;
    let eroare = v_erori.find(function(elem){return elem.identificator == _identificator;})
    if(eroare){
        let titlu1 = _titlu || eroare.titlu;
        let text1 = _text || eroare.text;
        let imagine1 = _imagine || eroare.imagine;
        if(eroare.status)
            res.status(eroare.identificator).render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
        else
            res.render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
    }
    else{
        let eroare_dif=ob_global.ob_erori.eroare_dif;
        res.render("pagini/eroare", {titlu:eroare_dif.titlu, text:eroare_dif.text, imagine:eroare_dif.imagine});
    }
}
// afisare_erori();

app.listen(8080);
console.log("Serverul a pornit");