window.onload = () => {
    const cantidad = document.getElementById("cantidad");
    const octeto1 = document.getElementById("octeto1");
    const octeto2 = document.getElementById("octeto2");
    const octeto3 = document.getElementById("octeto3");
    const octeto4 = document.getElementById("octeto4");
    const tabla = document.getElementById("tabla");
    const th = document.getElementById("subredes");
    
}

const limpiar = () => {
    document.getElementById("cantidad").value = "";
    document.getElementById("octeto1").value = "";
    document.getElementById("octeto2").value = "";
    document.getElementById("octeto3").value = "";
    document.getElementById("octeto4").value = "";
    document.getElementById("resultado").innerHTML = "";
}

const binario = (num) =>{
    let binario = num.toString(2);
    //console.log("Binario: " + binario);
    //console.log("Tipo: " + typeof(binario));
    //console.log("Conversion: " + binario.padStart(8,'0'));
    return binario.padStart(8,'0');
}

const findN = (subredes) => {
    parseInt(subredes);
    n = 0;
    while(Math.pow(2, n) < subredes){
        n++;
    }
    console.log("El salto entre las subredes 2n :" + n);
    return n;
}
const decimal = (mascaraD)  => {
    mascaraD = parseInt(mascaraN, 2);
    return mascaraD;
}
const findSalto = (mascaraN) =>{
    let s = 256 - parseInt(mascaraN, 2);
    console.log("Salto es: " + s + " con una mascara nueva " + mascaraN);
    return s; 
}
const getMascara = (tipored) =>{
    const mascara = {
        octetom1 : 255,
        octetom2 : (tipored === "A") ? 0 : 255,
        octetom3 : (tipored === "C") ? 255 : 0,
        octetom4: 0
    }
    return mascara;
}

const getRed = (tipored) =>{
    const octetosR = {
        octetor1 : parseInt(octeto1.value),
        octetor2 : parseInt(octeto2.value),
        octetor3 : parseInt(octeto3.value),
        octetor4 : parseInt(octeto4.value),
        mascara : getMascara(tipored)
    }
    return octetosR;
}

const robarBits = (red, n) =>{
    var f=0;
    //console.log(mascaraBin2, n);
    let mascaraT = binario(red.mascara.octetom1).toString() +"."+ binario(red.mascara.octetom2).toString() +"."+ binario(red.mascara.octetom3).toString() +"."+ binario(red.mascara.octetom4).toString();
    while(f<n){
        mascaraT=mascaraT.replace("0","1");
        f++;
    }
    red.mascara.octetom1 = mascaraT.substring(0,8);
    red.mascara.octetom2 = mascaraT.substring(9,17);
    red.mascara.octetom3 = mascaraT.substring(18,26);
    red.mascara.octetom4 = mascaraT.substring(27,35);
    console.log("nuevo octeo sin bits:" + red.mascara.octetom1, red.mascara.octetom2, red.mascara.octetom3, red.mascara.octetom4);
    return red;
}

const calcularHosts = (red) => {
    let hosts;
    let mascaraT = binario(red.mascara.octetom1).toString() +"."+ binario(red.mascara.octetom2).toString() +"."+ binario(red.mascara.octetom3).toString() +"."+ binario(red.mascara.octetom4).toString();
    console.log("La mascara binaria es= " + mascaraT);
    let m=0;
    for(let i=0; i<mascaraT.length; i++){
        if(mascaraT.charAt(i) == "0") m++ 
    }
    console.log("El numero m=" + m);
    hosts = Math.pow(2, m) -2;
    console.log("El numero de hosts es= " + hosts);
    return hosts;
}

const calcRedes = (salto, tipo, oct) =>{
    oct = parseInt(oct, 2)
    console.log(oct, salto)
    let redes = [];
    let cont = 0;
    do{
        redes[cont] = oct;
        oct += salto;
        //console.log(redes[cont]);
        cont++;
    }while(oct < 255);
    return redes;
}
const subnetear = () =>{
    let tipored;
    let red;
    if(octeto1.value >=0 && octeto1.value <= 127){
        tipored = "A";
        red = getRed(tipored);
        console.log("Mascara de la red tipo A:" + red.mascara.octetom1,red.mascara.octetom2,red.mascara.octetom3, red.mascara.octetom4);
        let salto = findN(parseInt(cantidad.value));
        let nuevaR = robarBits(red, salto);
        let octS;
        let octA;
        if(salto >=9 && salto<=16){
            octS = nuevaR.mascara.octetom3;
            octA = red.octetor3;
        }else if(salto>=17){
            octS = nuevaR.mascara.octetom4;
            octA = red.octetor4;
        }else{
            octS = nuevaR.mascara.octetom2;
            octA = red.octetor2;
        }
        let s = findSalto(octS);
        let subredes = calcRedes(s,tipored,octA);
        let hosts = calcularHosts(red);
        var htm;
        if(salto >=9 && salto<=16){
            htm = subredes.map((t)=>{
                return "<tr>" + "<td>" + red.octetor1+'.'+red.octetor2+'.'+t+'.'+red.octetor4+"</td>" + "<td> Hosts:" + hosts +"</td>" + "<tr>"
            });
        }else if(salto>=17){
            htm = subredes.map((t)=>{
                return "<tr>" + "<td>" + red.octetor1+'.'+red.octetor2+'.'+red.octetor3+'.'+t+"</td>" + "<td> Hosts:" + hosts +"</td>" + "<tr>"
            });
        }else{
            htm = subredes.map((t)=>{
               return "<tr>" + "<td>" + red.octetor1+'.' + t +'.'+red.octetor3+'.'+red.octetor4+"</td>" + "<td> Hosts:" + hosts +"</td>" + "<tr>"
            });
        }
        console.log(htm);
        tabla.innerHTML = htm.join("");
    }else if(octeto1.value >=127 && octeto1.value <= 191){
        tipored = "B"
        red = getRed(tipored);
        console.log(red.mascara.octetom1,red.mascara.octetom2,red.mascara.octetom3, red.mascara.octetom4);
        let salto = findN(parseInt(cantidad.value));
        let nuevaR = robarBits(red, salto);
        let octS;
        let octA;
        if(salto >=9 && salto<=16){
            octS = nuevaR.mascara.octetom4;
            octA = red.octetor4;
        }else if(salto>=17){
            alert("Eso nose puede")
        }else{
            octS = nuevaR.mascara.octetom3;
            octA = red.octetor3;
        }
        let s = findSalto(octS);
        let subredes = calcRedes(s,tipored,octA);
        let hosts = calcularHosts(red);
        var htm;
        if(salto >=9 && salto<=16){
            htm = subredes.map((t)=>{
                return "<tr>" + "<td>" + red.octetor1+'.'+red.octetor2+'.'+red.octetor3+'.'+t+"</td>" + "<td> Hosts:" + hosts +"</td>" + "<tr>"
            });
        }else if(salto>=17){
            //htm = subredes.map((t)=>{
            //    return "<tr>" + "<td>" + red.octetor1+'.'+red.octetor2+'.'+red.octetor3+'.'+t+"</td>" + "<td>" + hosts +"</td>" + "<tr>"
            //});
        }else{
            htm = subredes.map((t)=>{
               return "<tr>" + "<td>" + red.octetor1+'.' + red.octetor2 +'.'+t+'.'+red.octetor4+"</td>" + "<td> Hosts:" + hosts +"</td>" + "<tr>"
            });
        }
        console.log(htm);
        tabla.innerHTML = htm.join("");
    }else if(octeto1.value >=192 && octeto1.value <= 223){
        tipored = "C"
        red = getRed(tipored);
        console.log(red.mascara.octetom1,red.mascara.octetom2,red.mascara.octetom3, red.mascara.octetom4);
        let salto = findN(parseInt(cantidad.value));
        let nuevaR = robarBits(red, salto);
        let octS;
        let octA;
        if(salto >=9 && salto<=16){
            alert("Eso nose puede")
        }else if(salto>=17){
            alert("Eso nose puede")
        }else{
            octS = nuevaR.mascara.octetom4;
            octA = red.octetor4;
        }
        let s = findSalto(octS);
        let subredes = calcRedes(s,tipored,octA);
        let hosts = calcularHosts(red);
        var htm;
        if(salto >=9 && salto<=16){
            //htm = subredes.map((t)=>{
            //    return "<tr>" + "<td>" + red.octetor1+'.'+red.octetor2+'.'+red.octetor3+'.'+t+"</td>" + "<td> Hosts:" + hosts +"</td>" + "<tr>"
            //});
        }else if(salto>=17){
            //htm = subredes.map((t)=>{
            //    return "<tr>" + "<td>" + red.octetor1+'.'+red.octetor2+'.'+red.octetor3+'.'+t+"</td>" + "<td>" + hosts +"</td>" + "<tr>"
            //});
        }else{
            htm = subredes.map((t)=>{
               return "<tr>" + "<td>" + red.octetor1+'.' + red.octetor2 +'.'+red.octetor3+'.'+t+"</td>" + "<td> Hosts:" + hosts +"</td>" + "<tr>"
            });
        }
        console.log(htm);
        tabla.innerHTML = htm.join("");
    }else{
        alert("No manejamos ese tipo de redes")
    }
}
