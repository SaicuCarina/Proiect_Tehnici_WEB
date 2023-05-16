a = 11;

function f() {
    alert(1);
}

window.onload = function () {
    document.getElementById("abc").innerHTML = "Hello World!";

    let v = document.getElementsByClassName("pgf");
    console.log(v.length);

    document.getElementsByTagName("button")[0].onclick = function () {
        document.getElementById("abc").style.backgroundColor = "red";
        alert(2);
    }//[0] pentru ca am doar un singur buton 

    document.getElementById("adauga").onclick = function(){
        var p=document.createElement("p");
        p.innerHTML="ceva";
        // document.body.appendChild(p);
        document.body.insertBefore(p,this);
        // document.body.appendChild(document.getElementById("de_mutat"));

    }

    document.getElementById("sterge").onclick = function(){
        let paragrafe = document.getElementsByTagName("p");
        if (paragrafe.length){
            let ultimul = paragrafe[paragrafe.length-1];
            ultimul.remove();
        }

        //document.querySelectorAll("p.c1+p");

    }
}