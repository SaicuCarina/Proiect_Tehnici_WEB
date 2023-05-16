const express = require("express");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const sass = require("sass");
const { Client } = require("pg");
const { Console } = require("console");
const AccesBD= require("./module_proprii/accesbd.js");

AccesBD.getInstanta().select(
    {tabel:"prajituri",
    campuri:["nume", "pret", "calorii"],
    conditiiAnd:["pret>7"]},
    function (err, rez){
        console.log(err);
        console.log(rez);
    }
)

var client= new Client({database:"bd_tw",
        user:"carina",
        password:"123456",
        host:"localhost",
        port:5432});
client.connect();

// client.query("select * from lab8_12", function(err, rez){
//     console.log("Eroare BD",err);
 
//     console.log("Rezultat BD",rez.rows);
// });

// client.query("select * from produse_test", function(err, rez){
//     console.log("Eroare BD",err);
 
//     console.log("Rezultat BD",rez.rows);
// });



obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
    optiuniMeniu:[]
};

client.query("select * from unnest(enum_range(null::tipuri_produse))", function(err, rezCategorie){ ///functia unnest() - il face sa fie vector de siruri
    if(err){
        console.log(err);
    }
    else{
        obGlobal.optiuniMeniu=rezCategorie.rows;
    }
})

app = express();
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use("/resurse", express.static(path.join(__dirname, "resurse")));

app.use("/*", function(req, res, next){

    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    next();
})

app.set("view engine", "ejs");

console.log("Folder proiect:", __dirname);
console.log("Cale fisier:", __filename);
console.log("Director de lucru:", process.cwd());

vectorFoldere = ["temp", "temp1", "backup"];

for (let folder of vectorFoldere){
    // let caleFolder = __dirname + "/" + folder;
    let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
    }
}



app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, function (req, res) {
    afiseazaEroare(res, 403);
});

app.get("/favicon.ico", function (req, res) {
    // res.sendFile(__dirname + "/resurse/favicon/favicon.ico");
    res.sendFile(path.join(__dirname, "/resurse/favicon/favicon.ico"));
});

// 01ABCD".match(/^[0-9A-Fa-f]+$/)
app.get("/ceva", function (req, res) {
    res.send("altceva");
});

app.get(["/index", "/", "/home"], function (req, res) {
    console.log(req.ip);
    res.render("pagini/index.ejs", { ip: req.ip ,imagini: obGlobal.obImagini.imagini });

});

app.get("/istoric", function (req, res) {
    res.render("pagini/istoric.ejs");
});

app.get("/galerie", function (req, res) {
    res.render("pagini/galerie.ejs", {imagini: obGlobal.obImagini.imagini});
});

app.get("/despre", function (req, res) {
    res.render("pagini/despre");
});
// app.get("/despre", function (req, res) {
//     res.render("pagini/despre");
// });

// app.get(/[a-zA-Z0-9]\.(ejs)+$/i, function (req, res) {

app.get("/produse",function(req, res){


    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura


    client.query("select * from unnest(enum_range(null::categ_prajitura))", function(err, rezCategorie){ ///functia unnest() - il face sa fie vector de siruri
        if(err)
        {
            console.log(err);
            afiseazaEroare(res, 2);
        }
        else{
            let conditieWhere="";
        if(req.query.tip)
            conditieWhere=` where tip_produs='${req.query.tip}'`

        client.query("select * from prajituri " +conditieWhere , function( err, rez){
            console.log(300)
            if(err){
                console.log(err);
                afiseazaEroare(res, 2);
            }
            else
                res.render("pagini/produse", {produse:rez.rows, optiuni:rezCategorie.rows}); ///renderul trimite mesajul de la cerere
        });
        }
    })
});


app.get("/produs/:id",function(req, res){
    console.log(req.params);
   
    client.query(`select * from prajituri where id='${req.params.id}'`, function( err, rezultat){
        if(err){
            console.log(err);
            afiseazaEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});

client.query("select * from unnest(enum_range(null::categ_prajitura))",function(err, rez){
    console.log(err);
    console.log(rez);
})


app.get("/*.ejs", function (req, res) {
    afiseazaEroare(res, 400);
});

app.get("/*", function (req, res) {
    try {
        res.render("pagini" + req.url, function (err, rezRandare) {
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    // afiseazaEroare(res, { _identificator: 404, _titlu: "Pagina nu a fost gasita", _text: "Pagina nu a fost gasita", _imagine: "/resurse/images/erori/lupa.jpg" });
                    afiseazaEroare(res, 404);
                }
            }
            else {
                afiseazaEroare(res);
            }
        });
    }
    catch (err) {
        if (err.message.startsWith("Cannot find module")) {
            afiseazaEroare(res, 404);
        }
        else {
            afiseazaEroare(res);
        }

    }

});

function initErori() {

    // var continut = fs.readFileSync(__dirname + "/resurse/json/erori.json").toString("utf-8");
    var continut = fs.readFileSync(path.join(__dirname, "/resurse/json/erori.json")).toString("utf-8");
    obGlobal.obErori = JSON.parse(continut);

    let vErori = obGlobal.obErori.info_erori;
    // for(let i = 0; i < obGlobal.obErori.info_erori.length; i++) {
    //     console.log(vErori[i].imagine);

    for (let eroare of vErori) {
        eroare.imagine = "/" + obGlobal.obErori.cale_baza + "/" + eroare.imagine;
        console.log(eroare.imagine);
    }
}

function initImagini() {

    var continut = fs.readFileSync(path.join(__dirname, "/resurse/json/galerie.json")).toString("utf-8");
    obGlobal.obImagini = JSON.parse(continut);

    let vImagini = obGlobal.obImagini.imagini;

    let caleAbs = path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleAbsMediu = path.join(caleAbs, "mediu");
    let caleAbsMic = path.join(caleAbs, "mic");
    
    if(!fs.existsSync(caleAbsMediu)) {
        fs.mkdirSync(caleAbsMediu);
    }

    if(!fs.existsSync(caleAbsMic)) {
        fs.mkdirSync(caleAbsMic);
    }

    for (let imag of vImagini) {
        [nume_fisier, extensie] = imag.fisier.split(".");

        imag.fisier_mediu = "/" + path.join(obGlobal.obImagini.cale_galerie, "mediu", nume_fisier + "_mediu" + ".webp");
        imag.fisier_mic = "/" + path.join(obGlobal.obImagini.cale_galerie, "mic", nume_fisier + "_mic" + ".webp");

        let caleAbsFisMediu = path.join(__dirname, imag.fisier_mediu);
        let caleAbsFisMic = path.join(__dirname, imag.fisier_mic);

        sharp(path.join(caleAbs, imag.fisier)).resize(1000, 1000).toFile(caleAbsFisMediu);
        sharp(path.join(caleAbs, imag.fisier)).resize(300, 300).toFile(caleAbsFisMic);

        imag.fisier = "/" + path.join(obGlobal.obImagini.cale_galerie, imag.fisier);

    }
}

// daca  programatorul seteaza titlul, se ia titlul din argument
// daca nu e setat, se ia cel din json
// daca nu avem titlul nici in JSOn se ia titlul de valoarea default
// idem pentru celelalte

// function afiseazaEroare(res, {_identificator, _titlu, _text, _imagine} = {}) {
function afiseazaEroare(res, _identificator, _titlu = "titlu default", _text = "text default", _imagine) {
    let vErori = obGlobal.obErori.info_erori;
    let eroare = vErori.find(function (element) {
        return element.identificator === _identificator;
    });

    if (eroare) {
        let titlu = _titlu = "titlu default" ? (eroare.titlu || _titlu) : _titlu;
        let text = _text = "text default" ? (eroare.text || _text) : _text;
        let imagine = _imagine = "imagine default" ? (eroare.imagine || _imagine) : _imagine;
        if (eroare.status) {
            res.status(eroare.identificator).render("pagini/eroare.ejs", { titlu: titlu, text: text, imagine: imagine });

        }
        else {
            res.render("pagini/eroare.ejs", { titlu: titlu, text: text, imagine: imagine });
        }
    }
    else {
        let errDef = obGlobal.obErori.eroare_default;
        res.render("pagini/eroare.ejs", { titlu: errDef.titlu, text: errDef.text, imagine: obGlobal.obErori.cale_baza + "/" + errDef.imagine });
    }
}

function compileazaScss(caleScss, caleCss) {

    console.log("cale:",caleCss);
    if(!caleCss){
    // let vectorCale = caleScss.split("\\");
    // let numeFisierExt = vectorCale[vectorCale.length - 1];
    let numeFisierExt=path.basename(caleScss);
    //let numeFisCss=path.basename(caleCss);
    let numeFis = numeFisierExt.split(".")[0];
    caleCss = numeFis + ".css";
    }
    if(!path.isAbsolute(caleScss)) {
        caleScss = path.join(obGlobal.folderScss, caleScss);
    }

    if(!path.isAbsolute(caleCss)) {
        caleCss = path.join(obGlobal.folderCss, caleCss);
    }

    // let vectorCale = caleCss.split("\\");
    // let numeFisCss = vectorCale[vectorCale.length - 1];

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if(!fs.existsSync(caleBackup))
        fs.mkdirSync(caleBackup, {recursive:true})

    let numeFisCss=path.basename(caleCss);
    console.log(numeFisCss);
    if(fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, numeFisCss));
    }

    rez = sass.compile(caleScss, {"sourceMap": true});
    fs.writeFileSync(caleCss, rez.css);
    console.log("Compilare SCSS", rez);
}

initErori();
initImagini();
compileazaScss("a.scss");

vFisiere = fs.readdirSync(obGlobal.folderScss);
console.log("fisiere:");
console.log(vFisiere);

for(let numeFis of vFisiere){
    if(path.extname(numeFis) === ".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function (event, filename) {
    console.log(event, filename);
    if(event === "change" || event === "rename") {
        let caleCompleta = path.join(obGlobal.folderScss, filename);
        if(fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
});
app.listen(8080);

console.log("Serverul a pornit!");