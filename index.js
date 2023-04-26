// const express = require("express");
// const fs = require('fs');
// const path=require('path');

// ob_global={
//     ob_erori:null,
//     ob_imagini:null
// }

// app= express();
// console.log("Folder proiect", __dirname);
// console,log("Cale fisier", __filename);
// console.log("Director de lucrare", process.cwd());

// vectorFoldere=["temp", "temp1"]
// for (let folder of vectorFoldere){
//     // let caleFolder=__dirname+"/"+folder;
//     let caleFolder=path.join(__dirname, folder);
//     if(!fs.existsSync(caleFolder))
//         fs.mkdirSync(caleFolder);
// }

// app.set("view engine", "ejs");

// app.use("/resurse", express.static(__dirname+"/resurse"));  

// app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, function(req,res){
//     afisare_erori(res, 403);

// })

// app.get("/favicon.ico", function(req, res){
//     res.sendFile(__dirname+"/resurse/ico/favicon.ico"); //aici nu stiu daca e bine
// })

// app.get("/ceva", function(req, res){
//     res.send("altceva");
// })

// app.get(["/index","/", "/home"], function(req, res){
//     res.render("pagini/index", {ip: req.ip, a: 10, b: 20});
// })

// //app.get(/ [a-zA-Z0-9]\.ejs$/ )

// app.get("/*.ejs", function(req, res){
//     afisare_erori(res, 400);
// })

// app.get("/*", function(req, res){
//     try{
//     res.render("pagini"+req.url, function(err, rezRandare){
//         if(err){
//             if(err.message.startsWith("Failed to lookup view"))
//                 afisare_erori(res, _identificator=404, "ceva");
//                 // afisareEroare(res, _identificator: 404, _titlu: "ceva"{});
//             else
//                 afisare_erori(res);
//             console.log(err);           
//             res.send("Eroare");
//         }
//         else{
//             console.log(rezRandare);
//             res.send(rezRandare);
//         }
//     });
//     }catch(err){
//         if(err.message.startsWith("Cannot find module")){
//             afisare_erori(res, 404);
//         }
//     }
// })

// function initializeaza_erori(){
//     var continut = fs.readFileSync(__dirname+"/resurse/json/erori.json".toString("utf-8"));
//     console.log(continut);
//     ob_global.ob_erori=JSON.parse(continut);
//     let v_erori=ob_global.ob_erori.info_erori
//     // for(let i=0; i<v_erori.length; i++)
//     //     console.log(v_erori[i].ob_imagini)
//     for(let eroare of v_erori){
//         eroare.ob_imagini = "/" +ob_global.ob_erori.cale_baza+"/" +eroare.ob_imagini;
//     }
// }
// initializeaza_erori();

// //function afisare_erori(res, _identificator, _titlu=, _text, _imagine = {}) //trimite ca obiect ( destructing )
// //name parameters mai sus, si mai jos parametrii default
// function afisare_erori(res, _identificator, _titlu="titlu default", _text, _imagine){
//     let v_erori = ob_global.ob_erori.info_erori;
//     let eroare = v_erori.find(function(elem){return elem.identificator == _identificator;})
//     if(eroare){
//         let titlu1 = _titlu == "titlu default" ? (eroare.titlu || titlu) : titlu;
//         //daca programaorul selecteaza titlul, se ia titlul din argument,
//         //daca nu e setat, se ia cel din json,
//         //daca nu avem titlu nici in json, se ia titlul din valoarea default
//         let text1 = _text || eroare.text;
//         let imagine1 = _imagine || eroare.imagine;
//         if(eroare.status)
//             res.status(eroare.identificator).render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
//         else
//             res.render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
//     }
//     else{
//         let eroare_dif=ob_global.ob_erori.eroare_dif;
//         res.render("pagini/eroare", {titlu:eroare_dif.titlu, text:eroare_dif.text, imagine:ob_global.ob_erori1.cale_baza = "/" + err.imagine});
//     }
// }
// // afisare_erori();

// app.listen(8080);
// console.log("Serverul a pornit");


////////////////////////////////////////////////////////////////////////////////////////////////////////

// const express = require("express");
// // require e ca un import din C (express e o biblioteca, dar e un fel de obiect)
// const fs = require("fs"); // fs e biblioteca de file system
// const path = require("path");
// const sharp = require("sharp");
// const scss=require('scss');
// const {client}=require('pg');


// obGlobal = {
//     obErori: null,
//     obImagini: null,
//     folderScss: path.join(__dirname, "resurse/scss"),
//     folderCss: path.join(__dirname, "resurse/css"),
//     folderBackup: path.join(__dirname, "backup/css")
// }; // obiect global


// app = express();

// console.log("Folder proiect: ", __dirname);
// console.log("Cale fisier: ", __filename);
// console.log("Director de lucru: ", process.cwd());

// app.set("view engine", "ejs"); // motor de template 
// // app.set trebuie pus inainte de get-uri 

// app.use("/resurse", express.static(__dirname + "/resurse"));
// // express.static e o functie care returneaza un obiect
// // asa "livrez" resursele pentru site 

// app.use("/node_modules", express.static(__dirname + "/node_modules"));

// app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, function (req, res) {
//     afiseazaEroare(res, 403);
// })

// app.get("/favicon.ico", function (req, res) {
//     res.sendFile(__dirname + "/resurse/imagini/carte2.jpg");
// });

// // ejs e pentru a include cod html in alte fisiere html


// app.get(["/index", "/", "/home"], function (req, res) {
//     res.render("pagini/index", { ip: req.ip, a: 10, b: 20, imagini: obGlobal.obImagini.imagini});
// }); //render - compileaza ejs-ul si il trimite catre client
// // render stie ca e folosit pentru template, si se uita in views (folderul default)
// app.get("/despre", function (req, res) {
//     res.render("pagini/despre");
// });
// // app.get("/despre", function (req, res) {
// //     res.render("pagini/despre");
// // });

// //app.get(/[a-zA-Z0-9]\.ejs$/) //regex pentru a verifica daca fisierele .ejs
// app.get("/*.ejs", function (req, res) {//wildcard pentru a verifica daca fisierele .ejs

//     afiseazaEroare(res, 400);
// });

// vectorFoldere = ["temp", "temp1", "backup"]

// for (let folder of vectorFoldere) {
//     // let cale_folder = __dirname + "/" + folder;
//     let cale_folder = path.join(__dirname, folder);
//     // console.log(cale_folder);
//     if (!fs.existsSync(cale_folder))
//         fs.mkdirSync(cale_folder);
// } // creeaza folderele daca nu exista deja 

// function compileazaScss(caleScss, caleCss) {

//     if(!caleCss){
//     let vectorCale = caleScss.split("\\");
//     let numeFisierExt = vectorCale[vectorCale.length - 1];
//     let numeFis = numeFisierExt.split(".")[0];
//     caleCss = numeFis + ".css";
//     }
//     if(!path.isAbsolute(caleScss)) {
//         caleScss = path.join(obGlobal.folderScss, caleScss);
//     }

//     if(!path.isAbsolute(caleCss)) {
//         caleCss = path.join(obGlobal.folderCss, caleCss);
//     }

//     let vectorCale = caleCss.split("\\");
//     let numeFisCss = vectorCale[vectorCale.length - 1];
//     console.log(numeFisCss);
//     if(fs.existsSync(caleCss)){
//         fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, numeFisCss));
//     }

//     rez = scss.compile(caleScss, {"sourceMap": true});
//     fs.writeFileSync(caleCss, rez.css);
//     console.log("Compilare SCSS", rez);
// }
// ///compileazaScss("a.scss");

// vFisiere=fs.readdirSync(obGlobal.folderScss)
// for(let numeFis of vFisiere){
//     if(path.extname(numeFis)==".scss"){
//         compileazaScss(numeFis);
//     }
// }

// fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
//     console.log(eveniment, numeFis);
//     if(eveniment=="change" || eveniment=="rename"){
//         let caleCompleta=path.join(obGlobal.folderScss, numeFis);
//         if(fs.existsSync(caleCompleta)){
//             compileazaScss(caleCompleta);
//         }
//     }
// })

// app.get("/*", function (req, res) {
//     try {
//         console.log(req.url);
//         res.render("pagini" + req.url, function (err, rezRandare) {
//             if (err) {
//                 if (err.message.startsWith("Failed to lookup view"))
//                     // afiseazaEroare(res, { _identificator: 404, _titlu: "ceva" }); //trimit ca obiect
//                     afiseazaEroare(res, 404); // trimit ca parametrii
//                 else
//                     afiseazaEroare(res);
//             }
//             else {
//                 console.log(rezRandare);
//                 res.send(rezRandare);
//             }
//         });
//     } catch (err) {
//         if (err.message.startsWith("Cannot find module"))
//             afiseazaEroare(res, 404);
//     }
// }); // path general pentru fiecare pagina si in caz de not found, send error


// function initErori() {
//     var continut = fs.readFileSync(__dirname + "/resurse/json/erori.json").toString("utf-8"); // asteptam raspuns ( se pun intr-o coada de taskuri)
//     //pentru functie asyncrona nu se asteapta raspuns 
//     // console.log(continut);
//     obGlobal.obErori = JSON.parse(continut);
//     let vErori = obGlobal.obErori.info_erori;
//     // for (let i = 0; i < vErori.length; i++) {
//     //     console.log(vErori[i].imagine);
//     // } o opriune de a parcurge vectorul, dar nu e cea mai buna


    
//     for (let eroare of vErori) { //echivalent cu iteratorul din C++
//         eroare.imagine = "/" + obGlobal.obErori.cale_baza + "/" + eroare.imagine;
//         // eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
//     }
// }

// initErori();

// ///////////////////////////////////////////////////////////////////////////////////////////////
// function initImagini() {
//     var continut = fs.readFileSync(__dirname + "/resurse/json/galerie.json").toString("utf-8"); // asteptam raspuns ( se pun intr-o coada de taskuri)
//     //pentru functie asyncrona nu se asteapta raspuns 
//     obGlobal.obImagini = JSON.parse(continut);
//     let vImagini = obGlobal.obImagini.imagini;

//     let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
//     let caleAbsMediu=path.join(caleAbs, "mediu");
//     if(!fs.existsSync(caleAbsMediu))
//         fs.mkdirSync(caleAbsMediu);


//      for (let imag of vImagini) {
//         [numeFis, ext] = imag.fisier.split(".");
//         imag.fisier_mediu="/"+path.join(obGlobal.obImagini.cale_galerie, "mediu", numeFis+".webp");
//         let caleAbsFisMediu=path.join(__dirname, imag.fisier_mediu);
//         sharp(path.join(caleAbs, imag.fisier)).resize(400).toFile(caleAbsFisMediu);

//         // console.log(vErori[i].imagine);

//         imag.fisier="/"+path.join(obGlobal.obImagini.cale_galerie, imag.fisier);

//      } 
//     // for (let eroare of vErori) { //echivalent cu iteratorul din C++
//     //     eroare.imagine = "/" + obGlobal.obErori.cale_baza + "/" + eroare.imagine;
//     //     // eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
//     // }
// }

// initImagini();

// //function afiseazaEroare(res, _identificator, _titlu =, _text, _imagine = {}) //trimitere ca obiect ( destructuring ) 
// //name parameters mai sus, si mai jos parametrii default 
// function afiseazaEroare(res, _identificator, _titlu = "titlu default", _text, _imagine) {
//     let vErori = obGlobal.obErori.info_erori;
//     let eroare = vErori.find(function (element) {
//         return element.identificator === _identificator;
//     });
//     if (eroare) {
//         let titlu = _titlu == "titlu default" ? (eroare.titlu || _titlu) : _titlu;
//         // daca programatorul seteaza titlul, se ia titlul din argument,
//         //daca nu e setat, se ia cel din json, 
//         // daca nu avem titlu nici in json, se ia titlul din valoarea default 
//         let text = _text || eroare.text;
//         let imagine = _imagine || eroare.imagine;
//         if (eroare.status) {
//             res.status(eroare.identificator).render("pagini/eroare", { titlu: titlu, text: text, imagine: imagine });
//         } else {
//             res.render("pagini/eroare", { titlu: titlu, text: text, imagine: obGlobal.obErori.cale_baza = "/" + errDef.imagine });

//         }
//     }
//     else {
//         let errDef = obGlobal.obErori.eroare_default;
//         res.render("pagini/eroare", { titlu: errDef.titlu, text: errDef.text, imagine: errDef.imagine });
//     }
// }

// app.listen(8080); // portul pe care asculta serverul

// console.log("Serverul a pornit !");

// //video si web-vtt de citit 


//////////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const sass = require("sass");
const { Client } = require("pg");
const { Console } = require("console");

// var client= new Client({database:"douaroti",
//         user:"bogdan",
//         password:"tw2023pa55",
//         host:"localhost",
//         port:5432});
// client.connect();

// client.query("select * from produse_test", function(err, rez){
//     console.log("Eroare BD",err);
 
//     console.log("Rezultat BD",rez.rows);
// });



obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup")
};

app = express();
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use("/resurse", express.static(path.join(__dirname, "resurse")));


app.set("view engine", "ejs");

console.log("Folder proiect:", __dirname);
console.log("Cale fisier:", __filename);
console.log("Director de lucru:", process.cwd());

vectorFoldere = ["temp", "temp1", "backup"];

for (let folder of vectorFoldere) {
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

    if(!caleCss){
    let vectorCale = caleScss.split("\\");
    let numeFisierExt = vectorCale[vectorCale.length - 1];
    let numeFis = numeFisierExt.split(".")[0];
    caleCss = numeFis + ".css";
    }
    if(!path.isAbsolute(caleScss)) {
        caleScss = path.join(obGlobal.folderScss, caleScss);
    }

    if(!path.isAbsolute(caleCss)) {
        caleCss = path.join(obGlobal.folderCss, caleCss);
    }

    let vectorCale = caleCss.split("\\");
    let numeFisCss = vectorCale[vectorCale.length - 1];
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