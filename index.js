const express = require("express");
const fs = require('fs');
const path=require('path');

ob_global={
    ob_erori:null,
    ob_imagini:null
}

app= express();
console.log("Folder proiect", __dirname);
console,log("Cale fisier", __filename);
console.log("Director de lucrare", process.cwd());

vectorFoldere=["temp", "temp1"]
for (let folder of vectorFoldere){
    // let caleFolder=__dirname+"/"+folder;
    let caleFolder=path.join(__dirname, folder);
    if(!fs.existsSync(caleFolder))
        fs.mkdirSync(caleFolder);
}

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));  

app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, function(req,res){
    afisare_erori(res, 403);

})

app.get("/favicon.ico", function(req, res){
    res.sendFile(__dirname+"/resurse/ico/favicon.ico"); //aici nu stiu daca e bine
})

app.get("/ceva", function(req, res){
    res.send("altceva");
})

app.get(["/index","/", "/home"], function(req, res){
    res.render("pagini/index", {ip: req.ip, a: 10, b: 20});
})

//app.get(/ [a-zA-Z0-9]\.ejs$/ )

app.get("/*.ejs", function(req, res){
    afisare_erori(res, 400);
})

app.get("/*", function(req, res){
    try{
    res.render("pagini"+req.url, function(err, rezRandare){
        if(err){
            if(err.message.startsWith("Failed to lookup view"))
                afisare_erori(res, _identificator=404, "ceva");
                // afisareEroare(res, _identificator: 404, _titlu: "ceva"{});
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
    }catch(err){
        if(err.message.startsWith("Cannot find module")){
            afisare_erori(res, 404);
        }
    }
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

//function afisare_erori(res, _identificator, _titlu=, _text, _imagine = {}) //trimite ca obiect ( destructing )
//name parameters mai sus, si mai jos parametrii default
function afisare_erori(res, _identificator, _titlu="titlu default", _text, _imagine){
    let v_erori = ob_global.ob_erori.info_erori;
    let eroare = v_erori.find(function(elem){return elem.identificator == _identificator;})
    if(eroare){
        let titlu1 = _titlu == "titlu default" ? (eroare.titlu || titlu) : titlu;
        //daca programaorul selecteaza titlul, se ia titlul din argument,
        //daca nu e setat, se ia cel din json,
        //daca nu avem titlu nici in json, se ia titlul din valoarea default
        let text1 = _text || eroare.text;
        let imagine1 = _imagine || eroare.imagine;
        if(eroare.status)
            res.status(eroare.identificator).render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
        else
            res.render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
    }
    else{
        let eroare_dif=ob_global.ob_erori.eroare_dif;
        res.render("pagini/eroare", {titlu:eroare_dif.titlu, text:eroare_dif.text, imagine:ob_global.ob_erori1.cale_baza = "/" + err.imagine});
    }
}
// afisare_erori();

app.listen(8080);
console.log("Serverul a pornit");