const _ = require('lodash')

const SankeyDiagram = require('./sankeyDiagramNew')
const scatterPlot = require('./ScatterPlot')

var loc = document.location.href;
var urlSplit = loc.split('/');
urlSplit.pop();
var group = urlSplit.pop();

let sankeyDiagram = new SankeyDiagram(group)
sankeyDiagram.init()

var divGrafico = document.createElement('div');
divGrafico.id = 'divGrafico';

var botonSankey = document.createElement('input');
botonSankey.type = 'button';
botonSankey.id = 'botonSankey';
botonSankey.value = 'Gráfico Alluvial';
botonSankey.title = "Puntuaciones por ejercicio";
botonSankey.onclick = function() {sankeyDiagram.obtenerAnotacionesSankey(anotaciones)};

var botonScatter = document.createElement('input');
botonScatter.type = 'button';
botonScatter.id = 'botonScatter';
botonScatter.value = 'Gráfico de dispersión';
botonScatter.title = "Notas por examen";
botonScatter.onclick = function() {obtenerAnotacionesScatter()};

document.getElementsByClassName('search-results')[0].insertBefore(divGrafico, document.getElementsByClassName('search-results__list')[0]);


divGrafico.appendChild(botonSankey);
divGrafico.appendChild(botonScatter);




var anotacionesGrupo;
var anotaciones;
//Mediante Ajax obtenemos como maximo las primeras 200 anotaciones (200 es el limite que podemos obtener en una llamada)
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        anotaciones= JSON.parse(this.responseText);
    }
};
xhttp.open("GET", "https://hypothes.is/api/search?group="+group+"&limit=200&order=asc", false);
xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
xhttp.send();

var numAnotacionesTotal= anotaciones.total; //Anotaciones totales
var numAnotacionesAcumuladas= anotaciones.rows.length; //Anotaciones obtenidas en la primera llamada
var anotaciones=anotaciones.rows; //Nos quedamos solo con las anotaciones (Quitamos el total)
while (numAnotacionesTotal!=numAnotacionesAcumuladas){
    var offset=numAnotacionesAcumuladas; //Numero de anotaciones a ignorar
    obtenerAnotacionesAjax(offset);
}

//Funcion que obtiene las anotaciones (como maximo 200) ignorando las primeras n anotaciones (offset) del grupo actual
function obtenerAnotacionesAjax(offset){
    var xhttp = new XMLHttpRequest();
    let annotations = []
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var anotacionesResto= JSON.parse(this.responseText);
            annotations=anotacionesResto.rows;
        }
    };
    xhttp.open("GET", "https://hypothes.is/api/search?group="+group+"&offset="+offset+"&limit=200&order=asc", false);
    xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
    xhttp.send();
    return annotations
}

