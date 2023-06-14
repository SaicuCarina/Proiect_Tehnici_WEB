const express = require("express"); //am inclus un modul
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const sass = require("sass");
const { Client } = require("pg");
const { Console } = require("console");
const AccesBD= require("./module_proprii/accesbd.js");

const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");



// const QRCode= require('qrcode');
// const puppeteer=require('puppeteer');
// const mongodb=require('mongodb');
// const helmet=require('helmet');
// const xmljs=require('xml-js');

// const request=require("request");





AccesBD.getInstanta().select(
    {tabel:"carti",
    campuri:["nume", "pret", "pagini"],
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
    optiuniMeniu:[], 
    protocol:"http://",
    numeDomeniu:"localhost:8080",
    // clientMongo:mongodb.MongoClient,
    // bdMongo:nul
};

client.query("select * from unnest(enum_range(null::tipuri_expediere))", function(err, rezCategorie){ ///functia unnest() - il face sa fie vector de siruri
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
app.use("/poze_uplodate", express.static(path.join(__dirname, "poze_uplodate")));

app.set("view engine", "ejs");

console.log("Folder proiect:", __dirname);
console.log("Cale fisier:", __filename);
console.log("Director de lucru:", process.cwd());

// var url = "mongodb://localhost:27017";//pentru versiuni mai vechi de Node
// var url = "mongodb://0.0.0.0:27017";
 
// obGlobal.clientMongo.connect(url, function(err, bd) {
//     if (err) console.log(err);
//     else{
//         obGlobal.bdMongo = bd.db("proiect_web");
//     }
// });

vectorFoldere = ["temp", "temp1", "backup", "poze_uplodate"];



app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
  }));

for (let folder of vectorFoldere){
    // let caleFolder = __dirname + "/" + folder;
    let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
    }
}



app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, function (req, res) { // cele 2 / din parti det unde este expresia regulata, \/ => caracterul /, * => oricate
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


    client.query("select * from unnest(enum_range(null::categ_carti))", function(err, rezCategorie){ ///functia unnest() - il face sa fie vector de siruri
        if(err)
        {
            console.log(err);
            afiseazaEroare(res, 2);
        }
        else{
            let conditieWhere="";
        if(req.query.tip)
            conditieWhere=` where tip_produs='${req.query.tip}'`

        client.query("select * from carti " +conditieWhere , function( err, rez){
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

///////////////////////// Utilizatori

app.post("/inregistrare",function(req, res){
    var username;
    var poza;
    console.log("ceva");
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        console.log("Inregistrare:",campuriText);

        console.log(campuriFisier);
        var eroare="";

        var utilizNou=new Utilizator();
        try{
            utilizNou.setareNume=campuriText.nume;
            utilizNou.setareUsername=campuriText.username;
            utilizNou.email=campuriText.email
            utilizNou.prenume=campuriText.prenume
            
            utilizNou.parola=campuriText.parola;
            utilizNou.culoare_chat=campuriText.culoare_chat;
            utilizNou.poza= poza;
            Utilizator.getUtilizDupaUsername(campuriText.username, {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    utilizNou.salvareUtilizator();
                }
                else{
                    eroare+="Mai exista username-ul";
                }

                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                    
                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
            })
            

        }
        catch(e){ 
            console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }
    



    });
    formular.on("field", function(nume,val){  // 1 
	
        console.log(`--- ${nume}=${val}`);
		
        if(nume=="username")
            username=val;
    }) 
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
		
        console.log(nume,fisier);
		//TO DO in folderul poze_uploadate facem folder cu numele utilizatorului
        let folderUser=path.join(__dirname, "poze_uplodate",username);
        //folderUser=__dirname+"/poze_uploadate/"+username
        console.log(folderUser);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser);
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename
        //fisier.filepath=folderUser+"/"+fisier.originalFilename

    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    }); 
});

app.post("/login",function(req, res){
    var username;
    console.log("ceva");
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){
        Utilizator.getUtilizDupaUsername (campuriText.username,{
            req:req,
            res:res,
            parola:campuriText.parola
        }, function(u, obparam ){
            let parolaCriptata=Utilizator.criptareParola(obparam.parola);
            if(u.parola==parolaCriptata && u.confirmat_mail ){
                u.poza=u.poza?path.join("poze_uploadate",u.username, u.poza):"";
                obparam.req.session.utilizator=u;
                
                obparam.req.session.mesajLogin="Bravo! Te-ai logat!";
                obparam.res.redirect("/index");
                //obparam.res.render("/login");
            }
            else{
                console.log("Eroare logare")
                obparam.req.session.mesajLogin="Date logare incorecte sau nu a fost confirmat mailul!";
                obparam.res.redirect("/index");
            }
        })
    });
});


app.post("/profil", function(req, res){
    console.log("profil");
    if (!req.session.utilizator){
        afisareEroare(res,403,)
        res.render("pagini/eroare_generala",{text:"Nu sunteti logat."});
        return;
    }
    var formular= new formidable.IncomingForm();
 
    formular.parse(req,function(err, campuriText, campuriFile){
       
        var parolaCriptata=Utilizator.criptareParola(campuriText.parola);
        // AccesBD.getInstanta().update(
        //     {tabel:"utilizatori",
        //     campuri:["nume","prenume","email","culoare_chat"],
        //     valori:[`${campuriText.nume}`,`${campuriText.prenume}`,`${campuriText.email}`,`${campuriText.culoare_chat}`],
        //     conditiiAnd:[`parola='${parolaCriptata}'`]
        // },  
        AccesBD.getInstanta().updateParametrizat(
            {tabel:"utilizatori",
            campuri:["nume","prenume","email","culoare_chat"],
            valori:[`${campuriText.nume}`,`${campuriText.prenume}`,`${campuriText.email}`,`${campuriText.culoare_chat}`],
            conditiiAnd:[`parola='${parolaCriptata}'`, `username='${campuriText.username}'`]
        },          
        function(err, rez){
            if(err){
                console.log(err);
                afisareEroare(res,2);
                return;
            }
            console.log(rez.rowCount);
            if (rez.rowCount==0){
                res.render("pagini/profil",{mesaj:"Update-ul nu s-a realizat. Verificati parola introdusa."});
                return;
            }
            else{            
                //actualizare sesiune
                console.log("ceva");
                req.session.utilizator.nume= campuriText.nume;
                req.session.utilizator.prenume= campuriText.prenume;
                req.session.utilizator.email= campuriText.email;
                req.session.utilizator.culoare_chat= campuriText.culoare_chat;
                res.locals.utilizator=req.session.utilizator;
            }
 
 
            res.render("pagini/profil",{mesaj:"Update-ul s-a realizat cu succes."});
 
        });
       
 
    });
});

// pt cos virtual

app.use(["/produse_cos","/cumpara"],express.json({limit:'2mb'}));//obligatoriu de setat pt request body de tip json

app.get(["/","/index","/home","/login"], async function(req, res){
    

    let sir=req.session.mesajLogin;
    req.session.mesajLogin=null;

    client.query("select username, nume, prenume from utilizatori where id in (select distinct user_id from accesari where now()-data_accesare <= interval '5 minutes')",
        function(err, rez){
            let useriOnline=[];
            if(!err && rez.rowCount!=0)
                useriOnline=rez.rows
            console.log(useriOnline);

            /////////////// am adaugat aici:
            var evenimente=[]
            var locatie="";
            
            request('https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=109.99.96.15', //se inlocuieste cu req.ip; se testeaza doar pe Heroku
                function (error, response, body) {
                    locatie="Nu se poate detecta pentru moment."
                if(error) {
                    
                    console.error('eroare geobytes:', error)
                }
                else{
                    var obiectLocatie=JSON.parse(body);
                    console.log(obiectLocatie);
                    locatie=obiectLocatie.geobytescountry+" "+obiectLocatie.geobytesregion
                }
    
                //generare evenimente random pentru calendar 
                
                var texteEvenimente=["Eveniment important", "Festivitate", "Prajituri gratis", "Zi cu soare", "Aniversare"];
                dataCurenta=new Date();
                for(i=0;i<texteEvenimente.length;i++){
                    evenimente.push({data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), Math.ceil(Math.random()*27) ), text:texteEvenimente[i]});
                }
                console.log(evenimente)
                console.log("inainte",req.session.mesajLogin);

                //////sfarsit zona adaugata:
                res.render("pagini/index", {ip: req.ip, imagini:obGlobal.obImagini.imagini, mesajLogin:sir, succesLogin:sir, useriOnline:useriOnline, evenimente:evenimente, locatie:locatie});

        });

    //adaugat si inchidere functie:
    });
        
});

app.get("/produs/:id",function(req, res){
    console.log(req.params);
   
    client.query(`select * from carti where id='${req.params.id}'`, function( err, rezultat){
        if(err){
            console.log(err);
            afiseazaEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});








client.query("select * from unnest(enum_range(null::categ_carti))",function(err, rez){
    console.log(err);
    console.log(rez);
})


// //////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////Cos virtual
// app.post("/produse_cos",function(req, res){
//     console.log(req.body);
//     if(req.body.ids_prod.length!=0){
//         //TO DO : cerere catre AccesBD astfel incat query-ul sa fi `select nume, descriere, pret, gramaj, imagine from prajituri where id in (lista de id-uri)`
//         AccesBD.getInstanta().select({tabel:"prajituri", campuri:"nume,descriere,pret,gramaj,imagine".split(","),conditiiAnd:[`id in (${req.body.ids_prod})`]},
//         function(err, rez){
//             if(err)
//                 res.send([]);
//             else
//                 res.send(rez.rows); 
//         });
// }
//     else{
//         res.send([]);
//     }
 
// });


// cale_qr=__dirname+"/resurse/imagini/qrcode";
// if (fs.existsSync(cale_qr))
//   fs.rmSync(cale_qr, {force:true, recursive:true});
// fs.mkdirSync(cale_qr);
// client.query("select id from prajituri", function(err, rez){
//     for(let prod of rez.rows){
//         let cale_prod=obGlobal.protocol+obGlobal.numeDomeniu+"/produs/"+prod.id;
//         //console.log(cale_prod);
//         QRCode.toFile(cale_qr+"/"+prod.id+".png",cale_prod);
//     }
// });

// async function genereazaPdf(stringHTML,numeFis, callback) {
//     const chrome = await puppeteer.launch();
//     const document = await chrome.newPage();
//     console.log("inainte load")
//     await document.setContent(stringHTML, {waitUntil:"load"});
    
//     console.log("dupa load")
//     await document.pdf({path: numeFis, format: 'A4'});
//     await chrome.close();
//     if(callback)
//         callback(numeFis);
// }

// app.post("/cumpara",function(req, res){
//     console.log(req.body);
//     console.log("Utilizator:", req?.utilizator);
//     console.log("Utilizator:", req?.utilizator?.rol?.areDreptul?.(Drepturi.cumparareProduse));
//     console.log("Drept:", req?.utilizator?.areDreptul?.(Drepturi.cumparareProduse));
//     if (req?.utilizator?.areDreptul?.(Drepturi.cumparareProduse)){
//         AccesBD.getInstanta().select({
//             tabel:"prajituri",
//             campuri:["*"],
//             conditiiAnd:[`id in (${req.body.ids_prod})`]
//         }, function(err, rez){
//             if(!err  && rez.rowCount>0){
//                 console.log("produse:", rez.rows);
//                 let rezFactura= ejs.render(fs.readFileSync("./views/pagini/factura.ejs").toString("utf-8"),{
//                     protocol: obGlobal.protocol, 
//                     domeniu: obGlobal.numeDomeniu,
//                     utilizator: req.session.utilizator,
//                     produse: rez.rows
//                 });
//                 console.log(rezFactura);
//                 let numeFis=`./temp/factura${(new Date()).getTime()}.pdf`;
//                 genereazaPdf(rezFactura, numeFis, function (numeFis){
//                     mesajText=`Stimate ${req.session.utilizator.username} aveti mai jos rezFactura.`;
//                     mesajHTML=`<h2>Stimate ${req.session.utilizator.username},</h2> aveti mai jos rezFactura.`;
//                     req.utilizator.trimiteMail("Factura", mesajText,mesajHTML,[{
//                         filename:"factura.pdf",
//                         content: fs.readFileSync(numeFis)
//                     }] );
//                     res.send("Totul e bine!");
//                 });
//                 rez.rows.forEach(function (elem){ elem.cantitate=1});
//                 let jsonFactura= {
//                     data: new Date(),
//                     username: req.session.utilizator.username,
//                     produse:rez.rows
//                 }
//                 if(obGlobal.bdMongo){
//                     obGlobal.bdMongo.collection("facturi").insertOne(jsonFactura, function (err, rezmongo){
//                         if (err) console.log(err)
//                         else console.log ("Am inserat factura in mongodb");

//                         obGlobal.bdMongo.collection("facturi").find({}).toArray(
//                             function (err, rezInserare){
//                                 if (err) console.log(err)
//                                 else console.log (rezInserare);
//                         })
//                     })
//                 }
//             }
//         })
//     }
//     else{
//         res.send("Nu puteti cumpara daca nu sunteti logat sau nu aveti dreptul!");
//     }
    
// });

// app.get("/grafice", function(req,res){
//     if (! (req?.session?.utilizator && req.utilizator.areDreptul(Drepturi.vizualizareGrafice))){
//         afisEroare(res, 403);
//         return;
//     }
//     res.render("pagini/grafice");

// })

// app.get("/update_grafice",function(req,res){
//     obGlobal.bdMongo.collection("facturi").find({}).toArray(function(err, rezultat) {
//         res.send(JSON.stringify(rezultat));
//     });
// })



/******************Administrare utilizatori */
app.get("/useri", function(req, res){
   
    if(req?.utilizator?.areDreptul?.(Drepturi.vizualizareUtilizatori)){
        AccesBD.getInstanta().select({tabel:"utilizatori", campuri:["*"]}, function(err, rezQuery){
            console.log(err);
            res.render("pagini/useri", {useri: rezQuery.rows});
        });
    }
    else{
        afisareEroare(res, 403);
    }
});


app.post("/sterge_utiliz", function(req, res){
    if(req?.utilizator?.areDreptul?.(Drepturi.stergereUtilizatori)){
        var formular= new formidable.IncomingForm();
 
        formular.parse(req,function(err, campuriText, campuriFile){
           
                AccesBD.getInstanta().delete({tabel:"utilizatori", conditiiAnd:[`id=${campuriText.id_utiliz}`]}, function(err, rezQuery){
                console.log(err);
                res.redirect("/useri");
            });
        });
    }else{
        afisareEroare(res,403);
    }
})

app.get("/logout", function(req, res){
    req.session.destroy();
    res.locals.utilizator=null;
    res.render("pagini/logout");
});

function initErori() { //citeste erorile din JSON

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
    obGlobal.obImagini = JSON.parse(continut); //transformam din string in obiect, il parsam

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

        imag.fisier_mediu = "/" + path.join(obGlobal.obImagini.cale_galerie, "mediu", nume_fisier + "_mediu" + ".webp"); //cale pt imagine mediu
        imag.fisier_mic = "/" + path.join(obGlobal.obImagini.cale_galerie, "mic", nume_fisier + "_mic" + ".webp");

        let caleAbsFisMediu = path.join(__dirname, imag.fisier_mediu); //calea absoluta, ca sa putem folosi sharp
        let caleAbsFisMic = path.join(__dirname, imag.fisier_mic);

        sharp(path.join(caleAbs, imag.fisier)).resize(1000, 1000).toFile(caleAbsFisMediu);
        sharp(path.join(caleAbs, imag.fisier)).resize(300, 300).toFile(caleAbsFisMic);

        imag.fisier = "/" + path.join(obGlobal.obImagini.cale_galerie, imag.fisier); //in imag.fisier o sa am toata calea ca sa o trimit spre pagina

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
    let numeFis = numeFisierExt.split(".")[0]; //ca sa putem schimba extensia
    caleCss = numeFis + ".css";
    }
    if(!path.isAbsolute(caleScss)) { //daca nu este absoluta => este relativa la foldere css
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

    rez = sass.compile(caleScss, {"sourceMap": true}); //rezultatul din compilarea fisierului
    fs.writeFileSync(caleCss, rez.css);
    console.log("Compilare SCSS", rez);
}


app.use("/*",function(req, res, next){
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    res.locals.Drepturi=Drepturi;
    if (req.session.utilizator){
        req.utilizator=res.locals.utilizator=new Utilizator(req.session.utilizator);
    }    


    next();
})

initErori();
initImagini();
compileazaScss("a.scss");

vFisiere = fs.readdirSync(obGlobal.folderScss); //primeste o cale catre un direct si imi vectorul cu numele fis din acel director
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

app.get("/cod/:username/:token", function (req, res) {
    console.log(req.params);
    try {
        Utilizator.getUtilizDupaUsername(req.params.username, { res: res, token: req.params.token }, function (u, obparam) {
            AccesBD.getInstanta().update(
                {
                    tabel: "utilizatori",
                    campuri: { confirmat_mail: 'true' },
                    conditiiAnd: [`cod='${obparam.token}'`]
                },
                function (err, rezUpdate) {
                    if (err || rezUpdate.rowCount == 0) {
                        console.log("Cod:", err);
                        afisareEroare(res, 3);
                    }
                    else {
                        res.render("pagini/confirmare.ejs");
                    }
                })
        })
    }
    catch (e) {
        console.log(e);
        afisareEroare(res, 2);
    }
})

app.get("/*.ejs", function (req, res) { //wildcard pentru a verifica daca fisierele .ejs
    afiseazaEroare(res, 400);
});


app.get("/*", function(req, res){
    try{
    res.render("pagini"+req.url, function(err, rezRandare){
        if(err){
            // console.log(err);  
            if(err.message.startsWith("Failed to lookup view"))
                // afiseazaEroare(res,{identificator:404, titlu:"ceva"});
                afiseazaEroare(res,404,"ceva");
            else
                afiseazaEroare(res);  
        }
        else{
            // console.log(rezRandare);
            res.send(rezRandare);
        }    
    });
    }catch(err){
        if(err.message.startsWith("Cannot find module")){
            afiseazaEroare(res,404);
        }
    }
});;


app.listen(8080);

console.log("Serverul a pornit!");