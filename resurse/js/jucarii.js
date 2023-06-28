window.addEventListener("load",function(){


        function sorteaza() {
            let opt = document.getElementById('sortOrder').value;

            let ord;

            if (opt == 'asc')
                ord = 1;
            else if (opt == 'desc')
                ord = -1;
            else
            {
                alert('Optiune invalida!');
                return;
            }

            let jucarii = Array.from(document.getElementsByClassName('article'));
            jucarii.sort(function (a, b) {
                let culoriA = a.getElementsByTagName('ul')[0].children.length;
                let culoriB = b.getElementsByTagName('ul')[0].children.length;

                if (culoriA == culoriB)
                {
                    let pretA = parseInt(a.getElementsByTagName('label')[0].innerHTML);
                    let pretB = parseInt(b.getElementsByTagName('label')[0].innerHTML);

                    return ord * (pretA - pretB);
                }

                return ord * (culoriA - culoriB);
            }); 

            for (let jucarie of jucarii) {
                jucarie.parentElement.appendChild(jucarie);
            }
    }

    document.getElementById("sort").onclick=function(){
    }

});