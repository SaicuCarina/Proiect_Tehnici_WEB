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

const express = require("express");
// require e ca un import din C (express e o biblioteca, dar e un fel de obiect)
const fs = require("fs"); // fs e biblioteca de file system
const path = require("path");

obGlobal = {
    obErori: null,
    obImagini: null
}; // obiect global


app = express();

console.log("Folder proiect: ", __dirname);
console.log("Cale fisier: ", __filename);
console.log("Director de lucru: ", process.cwd());

app.set("view engine", "ejs"); // motor de template 
// app.set trebuie pus inainte de get-uri 

app.use("/Resurse", express.static(__dirname + "/Resurse"));
// express.static e o functie care returneaza un obiect
// asa "livrez" resursele pentru site 

app.use(/^\/Resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, function (req, res) {
    afiseazaEroare(res, 403);
})

app.get("/favicon.ico", function (req, res) {
    res.sendFile(__dirname + "/Resurse/Imagini/favicon.ico");
});

// ejs e pentru a include cod html in alte fisiere html


app.get(["/index", "/", "/home"], function (req, res) {
    res.render("pagini/index", { ip: req.ip, a: 10, b: 20 });
}); //render - compileaza ejs-ul si il trimite catre client
// render stie ca e folosit pentru template, si se uita in views (folderul default)
app.get("/despre", function (req, res) {
    res.render("pagini/despre");
});
// app.get("/despre", function (req, res) {
//     res.render("pagini/despre");
// });

//app.get(/[a-zA-Z0-9]\.ejs$/) //regex pentru a verifica daca fisierele .ejs
app.get("/*.ejs", function (req, res) {//wildcard pentru a verifica daca fisierele .ejs

    afiseazaEroare(res, 400);
});

vectorFoldere = ["temp", "temp1"]

for (let folder of vectorFoldere) {
    // let cale_folder = __dirname + "/" + folder;
    let cale_folder = path.join(__dirname, folder);
    // console.log(cale_folder);
    if (!fs.existsSync(cale_folder))
        fs.mkdirSync(cale_folder);
} // creeaza folderele daca nu exista deja 

app.get("/*", function (req, res) {
    try {
        console.log(req.url);
        res.render("pagini" + req.url, function (err, rezRandare) {
            if (err) {
                if (err.message.startsWith("Failed to lookup view"))
                    // afiseazaEroare(res, { _identificator: 404, _titlu: "ceva" }); //trimit ca obiect
                    afiseazaEroare(res, 404); // trimit ca parametrii
                else
                    afiseazaEroare(res);
            }
            else {
                console.log(rezRandare);
                res.send(rezRandare);
            }
        });
    } catch (err) {
        if (err.message.startsWith("Cannot find module"))
            afiseazaEroare(res, 404);
    }
}); // path general pentru fiecare pagina si in caz de not found, send error


function initErori() {
    var continut = fs.readFileSync(__dirname + "/Resurse/json/erori.json").toString("utf-8"); // asteptam raspuns ( se pun intr-o coada de taskuri)
    //pentru functie asyncrona nu se asteapta raspuns 
    // console.log(continut);
    obGlobal.obErori = JSON.parse(continut);
    let vErori = obGlobal.obErori.info_erori;
    // for (let i = 0; i < vErori.length; i++) {
    //     console.log(vErori[i].imagine);
    // } o opriune de a parcurge vectorul, dar nu e cea mai buna


    
    for (let eroare of vErori) { //echivalent cu iteratorul din C++
        eroare.imagine = "/" + obGlobal.obErori.cale_baza + "/" + eroare.imagine;
        // eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
    }
}

initErori();

//function afiseazaEroare(res, _identificator, _titlu =, _text, _imagine = {}) //trimitere ca obiect ( destructuring ) 
//name parameters mai sus, si mai jos parametrii default 
function afiseazaEroare(res, _identificator, _titlu = "titlu default", _text, _imagine) {
    let vErori = obGlobal.obErori.info_erori;
    let eroare = vErori.find(function (element) {
        return element.identificator === _identificator;
    });
    if (eroare) {
        let titlu = _titlu == "titlu default" ? (eroare.titlu || _titlu) : _titlu;
        // daca programatorul seteaza titlul, se ia titlul din argument,
        //daca nu e setat, se ia cel din json, 
        // daca nu avem titlu nici in json, se ia titlul din valoarea default 
        let text = _text || eroare.text;
        let imagine = _imagine || eroare.imagine;
        if (eroare.status) {
            res.status(eroare.identificator).render("pagini/eroare", { titlu: titlu, text: text, imagine: imagine });
        } else {
            res.render("pagini/eroare", { titlu: titlu, text: text, imagine: obGlobal.obErori.cale_baza = "/" + errDef.imagine });

        }
    }
    else {
        let errDef = obGlobal.obErori.eroare_default;
        res.render("pagini/eroare", { titlu: errDef.titlu, text: errDef.text, imagine: errDef.imagine });
    }
}

app.listen(8080); // portul pe care asculta serverul

console.log("Serverul a pornit !");

//video si web-vtt de citit 