//setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde //seter pentru cookie-uri
    d=new Date(); //un obiect de tip data care primeste data curenta
    d.setTime(d.getTime()+timpExpirare) //nr de minisecunde care a trecut de la o data de referinta, dupa se seteaza noua data
    document.cookie=`${nume}=${val}; expires=${d.toUTCString()}`; //string concatenat cu valorile de care avem nevoie
}

function getCookie(nume){
    vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"] //cu split separam mai multe variabile unele de altele
    for(let param of vectorParametri){ //operam prin vector
        if (param.trim().startsWith(nume+"=")) //trim - elimina spatiile din stanga si din dreapta => verificam daca este numele cookie-ului
            return param.split("=")[1] //se obtine valoarea, [1], pt ca indexarea e de la 0 si vrem al doilea element
    }
    return null;
}

function deleteCookie(nume){
    console.log(`${nume}; expires=${(new Date()).toUTCString()}`) //setam data de expirare ACUM
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
}


window.addEventListener("load", function(){
    if (getCookie("acceptat_banner")){ //verificam daca utilizatorul a acceptat cookie-urile
        document.getElementById("banner").style.display="none"; // dispare paragraful
    }

    this.document.getElementById("ok_cookies").onclick=function(){
        setCookie("acceptat_banner",true,60000); //seteaza cookie-ul cu acceptarea bannerului pt 6 secunde
        document.getElementById("banner").style.display="none" //dupa care dispare
    }
})
