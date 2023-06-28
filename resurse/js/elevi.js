window.addEventListener("load",function(){

    function verificareTimp() {
        var ultimaSortare = document.cookie.replace(/(?:(?:^|.*;\s*)ultimaSortare\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        var acum = new Date().getTime();
  
        if (ultimaSortare !== "" && acum - parseInt(ultimaSortare) < 7000) {
          alert("Nu au trecut încă 7 secunde!");
          return false;
        }
  
        // Setarea cookie-ului pentru ultima sortare
        document.cookie = "ultimaSortare=" + acum;
  
        return true;
      }

    function actualizareStatistici() {
        var numarFiltrari = localStorage.getItem("numarFiltrari") || 0;
        var numarSortari = localStorage.getItem("numarSortari") || 0;
      
        var paragrafStatistici = document.getElementById("statistici");
        paragrafStatistici.innerText = "Număr filtrări: " + numarFiltrari + ", Număr sortări: " + numarSortari;
      }

    document.getElementById("filtrare").onclick = function(){

        var numarFiltrari = localStorage.getItem("numarFiltrari") || 0;
        numarFiltrari++;
        localStorage.setItem("numarFiltrari", numarFiltrari);

        actualizareStatistici();

        var val_nume=document.getElementById("inp-cauta").value.toLowerCase(); //ce vreau sa caut

        var elevi=document.getElementsByClassName("elevi");
        for(let elev of elevi){
            elev.style.display="none";

            let nume=elev.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let prenume=elev.getElementsByClassName("val-prenume")[0].innerHTML.toLowerCase();

            let cond1=(nume.includes(val_nume));
            let cond2=(prenume.includes(val_nume));

            if(cond1 || cond2){
                elev.style.display="block";
            }
        }
    }

    function sortare(semn){

        if (!verificareTimp()) {
            return;
          }

        var numarSortari = localStorage.getItem("numarSortari") || 0;
        numarSortari++;
        localStorage.setItem("numarSortari", numarSortari);

        actualizareStatistici();

        var elevi=document.getElementsByClassName("elevi");
        var v_elevi=Array.from(elevi);

        v_elevi.sort(function(a,b){
            var medie_a=parseFloat(a.getElementsByClassName("medie")[0].innerHTML);
            var medie_b=parseFloat(b.getElementsByClassName("medie")[0].innerHTML);
            console.log(medie_a);

            if(medie_a==medie_b)
            {
                var nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;

                return semn*nume_a.localeCompare(nume_b);
            }

            return semn*(medie_a-medie_b);
        })

        for(let elev of v_elevi){
            elev.parentElement.appendChild(elev);
        }

        setTimeout(function() {
        
            document.cookie = "ultimaSortare=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            location.reload();
          }, 7000);
    }

    document.getElementById("sort").onclick=function(){
        let val_categ=document.getElementById("inp-categorie").value;
        if(val_categ=="Ascendent")
            sortare(1);
        else
            sortare(-1);
    }

    document.getElementById("resetare").onclick=function(){
        localStorage.removeItem("numarFiltrari");
        localStorage.removeItem("numarSortari");
        actualizareStatistici();
      }

    window.onkeydown= function(e){
        if(e.key == "+")
            {
                var elementeMedie = document.getElementsByClassName("medie");

                for (var i = 0; i < elementeMedie.length; i++) {
                    elementeMedie[i].innerText = 10;
                }
        }
    }

    // Adăugați evenimentul de ascultare pentru formular
    document.getElementById("emailForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Previne comportamentul implicit de trimitere a formularului
  
        // Obțineți adresa de e-mail din inputul text
        var email = document.getElementById("emailInput").value;
  
        // Obțineți numărul mailului din variabila de sesiune sau setați-o la 1 dacă nu există
        var numarMail = sessionStorage.getItem("numarMail");
        if (!numarMail) {
            numarMail = 1;
        }
  
        // Obțineți ora curentă în format hh:mm:ss
        var data = new Date();
        var ora = data.getHours().toString().padStart(2, "0");
        var minute = data.getMinutes().toString().padStart(2, "0");
        var secunde = data.getSeconds().toString().padStart(2, "0");
        var oraTrimis = ora + ":" + minute + ":" + secunde;
  
        // Trimiteți emailul folosind metoda preferată (de exemplu, prin intermediul unui serviciu de e-mail sau API)
        // Aici, vom afișa doar un mesaj în consolă și vom actualiza numărul mailului în variabila de sesiune
        console.log("Trimiteți emailul către " + email + " cu numărul " + numarMail + " și ora " + oraTrimis);
        sessionStorage.setItem("numarMail", parseInt(numarMail) + 1);
  
        // Actualizați textul mailului în verde
        document.getElementById("emailInput").style.color = "green";
  
        // Resetați formularul pentru a permite introducerea unui nou email
        document.getElementById("emailForm").reset();
  });

});