const Utils = require('./utils')
const d3 = require('d3')
const d3Tip = require('d3-tip')
const _ = require('lodash')

class ScatterPlot {
  constructor (group) {
    this.group = group
    this.anotaciones = []
  }

  createScatterPlot (anotaciones) {
    this.anotaciones = anotaciones
    let anotFiltradas = _.filter(anotaciones, (anotacion) => (Utils.filtradoTags(anotacion.tags)))

    let preguntasAlumnosRep = _.map(anotFiltradas, (anotacion) => ({
      'uri': anotacion.uri,
      'pregunta': anotacion.tags[0].slice(18),
      'nota': parseInt(anotacion.tags[1].slice(10))
    }))

    let preguntasAlumnos = _.uniqBy(preguntasAlumnosRep, (alumno) => (alumno.uri.concat(alumno.pregunta)))

    let agrupadosEjercicioNota = _.groupBy(preguntasAlumnos, (d) => d.pregunta + d.nota)

    let datos = _.map(agrupadosEjercicioNota, (objs, key) => ({
      'pregunta': _.first(objs).pregunta,
      'nota': _.first(objs).nota,
      'numAlumnos': objs.length }))

    this.dibujarScatterPlot(datos)
  }

  dibujarScatterPlot (datos) {

    // Margenes
    let margins = {
      'left': 40,
      'right': 35,
      'top': 35,
      'bottom': 30
    }

    // Dimensiones
    let width = 850
    let height = 500

    let x = d3.scale.ordinal() // Escala del eje x
      .rangeRoundPoints([0, width - margins.left - margins.right], 1)
      .domain(datos.map((d) => d.pregunta))

    let y = d3.scale.linear() // Escala del eje Y
      .domain(d3.extent(datos, (d) => d.nota))
      .range([height - margins.top - margins.bottom, 0]).nice()

    let r = d3.scale.linear() // Escala del radio
      .domain([1, d3.max(datos, (d) => d.numAlumnos)])
      .range([5, 25])

    // Ejes
    let xAxis = d3.svg.axis().scale(x).orient('bottom').tickPadding(2)
    let yAxis = d3.svg.axis().scale(y).orient('left').tickPadding(2)

    d3.select('#dv').remove()
    d3.select('#dvdesplegables').remove() // Eliminar el SVG si lo hubiera (Se realiza para quitar el grafico que habia)
    d3.select('#svg').remove()
    d3.select('#svgbotonesEliminar').remove()

    let svg = d3.select('#divGrafico') // Crear e insertar el SGV
      .append('svg')
      .attr('id', 'svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')

    let tooltip = d3Tip(d3) // Creacion del tooltip
      .attr('class', 'd3tip')
      .offset([-10, 0])
      .html((d) => 'Nota ' + d.nota + ': <br><strong>' + d.numAlumnos + ' Alumnos</strong>') // Mensaje del tooltip

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
      .attr('cx', (d) => x(d.pregunta))
      .attr('cy', (d) => y(d.nota))
      .style('fill', 'lightsalmon')
      .on('mouseover', tooltip.show) // Al pasar por encima de una barra aparece el tooltip
      .on('mouseout', tooltip.hide)
  }
}

module.exports = ScatterPlot
