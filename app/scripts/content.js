const _ = require('lodash')
const HypothesisClient = require('hypothesis-api-client')
const SankeyDiagram = require('./sankeyDiagramNew')
const scatterPlot = require('./ScatterPlot')

// Create hypothes.is client
const HypothesisClientManager = require('../hypothesis/HypothesisClientManager')
window.abwa.hypothesisClientManager = new HypothesisClientManager()
window.abwa.hypothesisClientManager.init((err) => {

})
window.hypothesisClient = new HypothesisClient('6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA')


var loc = document.location.href;
var urlSplit = loc.split('/');
urlSplit.pop();
var group = urlSplit.pop();

var anotaciones = []

window.sankeyDiagram = new SankeyDiagram(group)
window.sankeyDiagram.init(() => {
    // Obtener anotaciones para el diagrama sankey
    window.hypothesisClient.searchAnnotations({
        group: group,
        order: 'asc',
        limit: 5000
    }, (err, annotations) => {
        if (err) {

        } else {
            // Save annotations
            anotaciones = annotations
            augmentHypothesisInterface()
        }
    })
})

function augmentHypothesisInterface () {
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
}
