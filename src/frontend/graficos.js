const { get } = require("ajax");
const { request } = require("express");
/* função que quando executada gerará os gráficos*/
function generateGraphics(){
    saturacao_DadosCLT()
    let requestGraph = new XMLHttpRequest();
    /* informações que serão coletadas do banco de dados para gerar o gráfico*/

    requestGraph.onload = function(){
        let dados = JSON.parse(this.response)
        let tamanhoDados = dados.length
        let arrayHoras = []
        let arrayNomes = []
        for(let i = 0; i < tamanhoDados; i++){
            arrayHoras.push(dados[i].somaHoras)
            arrayNomes.push(dados[i].nome)
        }
        graficos(arrayNomes, arrayHoras);
    }

    /*rota que o gráfico será exibidp*/

    url = "/alocacao/grafico2"
    requestGraph.open("GET", url, true)
    requestGraph.send()

} 

/*atribui legenda e cores para o grafico*/
function graficos(nomeProj, horasProj){
    new Chart(document.getElementById("bar-chart"), {
        type: 'bar',
        data: {
            labels: nomeProj,
            datasets: [
                {
                    label: "Horas",
                    backgroundColor: ["#2d3870", "rgb(82, 111, 255)", "#8d8d8d", "#ef0404", "#39cfd75f","#2d3870", "rgb(82, 111, 255)", "#8d8d8d", "#ef0404", "#39cfd75f","#2d3870", "rgb(82, 111, 255)", "#8d8d8d", "#ef0404", "#39cfd75f","#2d3870", "rgb(82, 111, 255)", "#8d8d8d", "#ef0404", "#39cfd75f","#2d3870", "rgb(82, 111, 255)", "#8d8d8d", "#ef0404", "#39cfd75f","#2d3870", "rgb(82, 111, 255)", "#8d8d8d", "#ef0404", "#39cfd75f"],
                    data: horasProj
                }
            ]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Número de horas/ projeto'
            }
        }
    });
}

/*Inputa os dados necessários para que a funsão 'saturacao_DadosN_CLT()' possa fazer sua funsão*/
function saturacao_DadosCLT(){
    let requestGraph = new XMLHttpRequest();
    /* informações que serão coletadas do banco de dados para gerar o gráfico*/

    requestGraph.onload = function(){
        let dados = JSON.parse(this.response)
        let tamanhoDados = dados.length
        let total_HorasCLT = 0
        for(let i = 0; i < tamanhoDados; i++){
            total_HorasCLT += dados[i].horas
            
        }
        saturacao_DadosN_CLT(total_HorasCLT);
    }
   

    /*rota que o gráfico será exibidp*/

    url = "/projetos/alocacaoMesCLT"
    requestGraph.open("GET", url, true)
    requestGraph.send()
}

/*Inputa os dados necessários para que a funsão 'saturacao_dinamica()' possa fazer sua funsão*/
function saturacao_DadosN_CLT(a){
    let requestGraph = new XMLHttpRequest();
    /* informações que serão coletadas do banco de dados para gerar o gráfico*/

    requestGraph.onload = function(){
        let dados = JSON.parse(this.response)
        let tamanhoDados = dados.length
        let CLT = a
        let N_CLT = 0
        for(let i = 0; i < tamanhoDados; i++){
            N_CLT += dados[i].horas
            
        }
        saturacao_dinamica(N_CLT,CLT);
    }
   

    /*rota que o gráfico será exibidp*/

    url = "/projetos/alocacaoMesNaoCLT"
    requestGraph.open("GET", url, true)
    requestGraph.send()
}

/*Inputa os dados necessários para que a funsão 'saturacao_dinamica_grafico()' possa fazer sua funsão*/
function saturacao_dinamica(N_CLT,CLT){
    let requestGraph = new XMLHttpRequest();
    /* informações que serão coletadas do banco de dados para gerar o gráfico*/

    requestGraph.onload = function(){
        let dados = JSON.parse(this.response)
        saturacao_dinamica_grafico(dados,N_CLT,CLT);
    }
   

    /*rota que o gráfico será exibidp*/

    url = "/projetos/alocacaoMes"
    requestGraph.open("GET", url, true)
    requestGraph.send()
}

/*Responsável pela dinamicidade do site*/
function saturacao_dinamica_grafico(a,b,CLT){
    let tamanhoDados = a.length
    let recurso_junto = b+CLT
    let horasProjeto = 0
    for(let i = 0; i < tamanhoDados; i++){
        horasProjeto += a[i].horasMes
        
    }
    let demanda = horasProjeto - recurso_junto
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            
            labels: ["Jan", "Fev", "Mar", "Abr","mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            datasets: [{
                label: "Limitações com recursos internos",
                borderColor: "#2d3870",
                borderWidth: 2,
                data: [CLT, CLT, CLT, CLT, CLT, CLT, CLT, CLT, CLT, CLT, CLT, CLT],
                fill: false
            }, {
                label: "Limitações com recursos internos e externos",
                borderColor: "#8d8d8d",
                borderWidth: 2,
                data: [recurso_junto, recurso_junto, recurso_junto, recurso_junto, recurso_junto, recurso_junto, recurso_junto, recurso_junto, recurso_junto, recurso_junto, recurso_junto, recurso_junto],
                fill: false
            }, {
                label: "Necessidade dos recursos",
                borderColor: "#ef0404",
                data: [demanda, demanda, demanda, demanda, demanda, demanda, demanda, demanda, demanda, demanda, demanda, demanda],
                fill: false
            }, {
                label: "Demanda dos projetos",
                borderColor: "rgb(82, 111, 255)",
                data: [a[4].horasMes, a[3].horasMes, a[8].horasMes, a[0].horasMes, a[7].horasMes, a[6].horasMes, a[5].horasMes, a[1].horasMes, a[11].horasMes, a[10].horasMes, a[9].horasMes, a[2].horasMes],
                fill: true,
                backgroundColor: "rgb(82, 111, 255,0.4)",
                lineTension: 0
            },
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Demanda total dos projetos'
            },
            legend: { display: true }
        }
    });
}

/* calendário */
var meses = { // OBJ usado para converter os valores do banco, possibilitando as contas.    
    janeiro: 0,
    fevereiro: 1,
    março: 2,
    abril: 3,
    maio: 4,
    junho: 5,
    julho: 6,
    agosto: 7,
    setembro: 8,
    outubro: 9,
    novembro: 10,
    dezembro: 11
}

function generateLines(){ // Essa Função é chamada no momento do carregamento da tag body na aba visão geral, relacionando a duração com o tamanho do grafico
    let requestLines = new XMLHttpRequest();
    requestLines.onload = function(){
        let dados = JSON.parse(this.responseText) // Essa linha representa a devolutiva da consulta ao banco de dados amarzenada em um array com varios dicionários.
        let tamanhoDados = dados.length 
        let anos = [] // Guarda os anos dos projetos. Ela é passada como argumento na funsao criarCalendario()
        for(let i = 0; i < tamanhoDados; i++){
            anos.push(dados[i].anoFim)
            criarProjeto(dados[i].nome, dados[i].anoInicio, dados[i].anoFim, eval("meses."+dados[i].mesInicio), eval("meses."+dados[i].mesFim),i)
        }
        var novaArr = anos.filter(function(este, i) {
            return anos.indexOf(este) === i;
        });
        for (let i = 1; i < novaArr.length; i++) {
            criarCalendario(novaArr[i],i)
            
        }
    }
    /*rota que será exibida*/

    url = "/projetos/timeline"
    requestLines.open("GET", url, true);
    requestLines.send();
}

/*define como será a exibição do projeto se ele durar mais que um ano*/
function criarProjeto(nomedb, anoIniciodb, anoFimdb, mesIniciodb, mesFinaldb,i){
    var n = i +1
    var largura = window.screen.height
    var larguraAjuste = largura - (largura*0.15)
    var nP = nomedb; // np = Nome do projeto
    var anoInicio = parseInt(anoIniciodb);
    var anoFim = parseInt(anoFimdb);
    var anoRes = (anoFim - anoInicio);
    var mesInicio = parseInt(mesIniciodb)
    var mesFinal = parseInt(mesFinaldb)
    var tamanho = ((mesFinal - mesInicio)+1)
    var percentual = 1/larguraAjuste
    console.log("Projeto: "+nP+ " - "+n)
    console.log("AnoResto: "+anoRes)
    if( anoRes == 0 ){
        tamanho = ((percentual+7)*tamanho)
        }
    else{
        console.log("ELSE AQUI ESTOU")
        tamanho = (anoRes*((percentual+7)*11) + ((percentual+7)*tamanho))
        }
    mesInicio+=1
    console.log("Antes: "+mesInicio)
    mesInicio = ((percentual+7)*(mesInicio-1))
    console.log("Depois: "+mesInicio)
    document.getElementById("c-todos").innerHTML += "<li><div>"+nP+"</div></li>";
    console.log("Tamanho:"+tamanho)
    if(tamanho>80){
        if(btnAtivado == false){
            gerarBtn()
            btnAtivado = true
        }
        tamanho = tamanho + (percentual+19) * anoRes 
        $("#c-todos > li:nth-child("+n+")").css("width",(tamanho)+"%");
        $("#c-todos > li:nth-child("+n+")").css("margin-left",parseInt(mesInicio)+"%")
    }else{ $("#c-todos > li:nth-child("+n+")").css("width",(tamanho)+"%");
    $("#c-todos > li:nth-child("+n+")").css("margin-left",parseInt(mesInicio)+"%")}
}

function gerarBtn(){
    document.getElementById("Controle").innerHTML = "<button class=\"btn-controle\" onclick=\"keyB()\"><span class=\"material-symbols-outlined\">arrow_back_ios</span></button><button class=\"btn-controle\" onclick=\"keyA()\"><span class=\"material-symbols-outlined\">arrow_forward_ios</span></button>"
}

function criarCalendario(fim,anos){
    var largura = window.screen.height
    var larguraAjuste = largura - (largura*0.15)
    var percentual = 1/larguraAjuste
    let y = (50/(anos+1*(percentual+100)))
    window.document.getElementById("add").innerHTML += "<div class=\"step-c\">"+"|----"+String(fim)+"---->"+"</div><ul class=\"month\"><li><h3> jan </h3></li><li><h3> fev </h3></li><li><h3> mar </h3></li><li><h3> abr </h3></li><li><h3> mai </h3></li><li><h3> jun </h3></li><li><h3> jul </h3></li><li><h3> ago </h3></li><li><h3> set </h3></li><li><h3> out </h3></li><li><h3> nov </h3></li><li><h3> dez </h3></li></ul>"
    $(".month").css("min-width",(y)+"%"+"!important")
}