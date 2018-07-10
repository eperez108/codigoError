const Utils = require('./utils')
const d3 = require('d3')
const d3Tip = require('d3-tip')
const _ = require('lodash')
const HypothesisClient = require('hypothesis-api-client')

this.hypothesisClientManager.hypothesisClient = new HypothesisClient('6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA')
let datos = []
let promises = []
let nombreGrupos = obtenerNombresGrupos()
for (let i = 0; i < gruposId.length; i++) {
  promises.push(new Promise((resolve, reject) => {
    this.resultados(gruposId[i], (err, resultadosExamen) => {
      if (err) {
        reject(err)
      } else {
        resolve(resultadosExamen)
      }
    })
  }))
}
// Ejecutamos los promises y refrescamos el gráfico
Promise.all(promises).then((resolves) => {
  // Filter all the group results which are not exams
  let exams = _.filter(resolves, (resolve) => { return resolve.listaParAlumnoResultado.length > 0 })

  for (let i = 0; i < exams.length; i++) {
    let resultadosExamen = exams[i].listaParAlumnoResultado
    let nombreGrupo = _.filter(nombreGrupos, { 'id': gruposId[i]})

    // A grupamos a los alumnos por su nota media
    let mediasExamen = _(resultadosExamen).countBy('resultado')
      .map((count, nota) => ({
        'examen': _.head(nombreGrupo).nombre,
        'notaMedia': parseFloat(nota),
        'numAlumnos': count
      })).value()
    datos = _.concat(datos, mediasExamen)
  }
}).catch((rejects) => {
  // TODO Handle error

})

class ScatterPlotContinuousAssessment {
  constructor (group) {
    this.grupos = group
    this.datos = []
    this.gruposNombreID = []
  }

  init () {

  }

  // Funcion que obtiene la ID y los nombres de los grupos
  obtenerNombresGrupos () {
    this.retrieveGroups((err, groups) => {
      if (err) {

      } else {
        this.gruposNombreID = _.map(groups, (grupo) => ({
          'id': grupo.id,
          'nombre': grupo.name
        }))
      }
    })
  }

  retrieveGroups (callback) {
    this.hypothesisClientManager.hypothesisClient.getListOfGroups((err, groups) => {
      if (err) {
        // TODO Handle this error
      } else {
        if (_.isFunction(callback)) {
          callback(null, groups)
        }
      }
    })
  }

  resultados (grupo, callback) {
    // TODO Remove in production
    // Grupo real en hypothes.is con examen
    window.markAndGoViz.hypothesisClientManager.hypothesisClient.searchAnnotations({
      group: grupo,
      limit: 1 // TODO Check if it should be ordered 'asc' or 'desc'
    }, (err, resultAnnotations) => {
      if (err) {
        // Handle the error
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        let formerAnnotation = resultAnnotations[0]
        // Check if the group is an exam group
        if (_.isObject(formerAnnotation) && formerAnnotation.tags.length > 0 && formerAnnotation.tags[0].includes('exam:')) {
          window.markAndGoViz.hypothesisClientManager.hypothesisClient.searchAnnotations({
            group: grupo,
            limit: 5000
          }, (err, anotacionesGrupo) => {
            if (err) {
              // Handle the error
              if (_.isFunction(callback)) {
                callback(err)
              }
            } else {
              let anotFiltradas = _.filter(anotacionesGrupo, (anotacion) => (Utils.esPreguntaNotaTags(anotacion.tags)))

              let preguntasAlumnosRep = _.map(anotFiltradas, (anotacion) => ({
                'uri': anotacion.uri,
                'pregunta': anotacion.tags[0].slice(18),
                'nota': parseInt(anotacion.tags[1].slice(10))
              }))
              let preguntasAlumnos = _.uniqBy(preguntasAlumnosRep, (alumno) => (alumno.uri.concat(alumno.pregunta))) // Se eliminan los repetidos

              // Se obtienen los resultados de cada alumno
              let listaParAlumnoResultado = _(preguntasAlumnos).groupBy('uri')
                .map((preguntas, alumno) => ({
                  'uri': alumno,
                  'resultado': (Utils.normalizar(anotacionesGrupo, _.sumBy(preguntas, 'nota')) >= 5) ? 'Aprobado' : 'Suspenso'
                })).value()
              if (_.isFunction(callback)) {
                callback(null, {group: grupo, listaParAlumnoResultado: listaParAlumnoResultado})
              }
            }
          })
        } else {
          callback(null, {group: grupo, listaParAlumnoResultado: []})
        }
      }
    })
  }

  // Funcion que dibuja el diagrama
  dibujarScatterPlot (datos) {
    // Margenes
    let margins = {
      'left': 40,
      'right': 35,
      'top': 55,
      'bottom': 30
    }

    // Dimensiones
    let width = 550
    let height = 500

    let x = d3.scale.ordinal() // Escala del eje x
      .rangeRoundPoints([0, width - margins.left - margins.right], 1)
      .domain(datos.map((d) => d.examen))

    let y = d3.scale.linear() // Escala del eje Y
      .domain(d3.extent(datos, (d) => d.notaMedia))
      .range([height - margins.top - margins.bottom, 0]).nice()

    let r = d3.scale.linear() // Escala del radio
      .domain([1, d3.max(datos, (d) => d.numAlumnos)])
      .range([5, 25])

    // Ejes
    let xAxis = d3.svg.axis().scale(x).orient('bottom').tickPadding(2)
    let yAxis = d3.svg.axis().scale(y).orient('left').tickPadding(2)

    d3.select('#svg').remove() // Eliminar el SVG si lo hubiera (Se realiza para quitar el grafico que habia)

    let svg = d3.select('.search-results__total') // Crear e insertar el SGV
      .append('svg')
      .attr('id', 'svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')

    svg.append('text')
      .attr('x', ((width - margins.left - margins.right) / 2))
      .attr('y', 0 - (margins.top / 1.5))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('text-decoration', 'underline')
      .text('Resultados examenes evaluacion continua')

    var tooltip = d3Tip(d3) // Creacion del tooltip
      .attr('class', 'd3tip')
      .offset([-10, 0])
      .html((d) =>
        'Nota ' + d.notaMedia + ': <br><strong>' + d.numAlumnos + ' Alumnos</strong>'
      )

    svg.call(tooltip)

    // Eje X
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + y.range()[0] + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      .attr('x', width - margins.left - margins.right)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .attr('textLength', '70')
      .text('Examenes')

    // Eje Y
    svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Nota')

    // Añadir los puntos
    svg.selectAll('dot')
      .data(datos)
      .enter().append('circle')
      .attr('r', (d) => r(d.numAlumnos))
      .attr('cx', (d) => { return x(d.examen) })
      .attr('cy', (d) => { return y(d.notaMedia) })
      .style('fill', (d) => { // Segun la nota media los puntos tendran un color u otro
        if (d.notaMedia < 3.0) { return '#ef5a3c' } else if ((d.notaMedia >= 3.0) && (d.notaMedia < 5.0)) {
          return '#ee8c2b'
        } else if ((d.notaMedia >= 5.0) && (d.notaMedia < 7.0)) {
          return '#f1e738'
        } else if ((d.notaMedia >= 7.0) && (d.notaMedia < 9.0)) {
          return '#7bee22'
        } else { return '#24ee34' }
      })
      .on('mouseover', tooltip.show) // Al pasar por encima de una barra aparece el tooltip
      .on('mouseout', tooltip.hide)
  }
}

window.scatterPlotContinuousAssessment = new ScatterPlotContinuousAssessment()
window.scatterPlotContinuousAssessment.init()
