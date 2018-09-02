const Utils = require('./utils')
const d3 = require('d3')
const d3Tip = require('d3-tip')
const _ = require('lodash')

class ScatterPlotExam {
  constructor (group) {
    this.group = group
  }

  createScatterPlot (annotations) {
    // Filter annotations to get only those with 2 tags -> "isCriteriaOf" and "mark"
    let filteredAnnotations = this.filterAnnotations(annotations)
    // From the annotations, a list of objects containing the student's uri, a question and the mark obtained is created.
    // Repeated objects may exist since for a question can be more than one annotation
    let studentsQuestionsRep = this.obtainStudentsQuestions(filteredAnnotations)
    // Filter the previously obtained list to eliminate the repeated objects
    let studentsQuestions = this.deleteRepeatedQuestions(studentsQuestionsRep)
    // Group the students by exercise and mark
    let groupedQuestionMark = this.groupQuestionMark(studentsQuestions)
    // Group the students by their average mark
    let data = this.obtainNumStudentsByQuestionMark(groupedQuestionMark)

    this.drawScatterPlot(data)
  }

  // Function that filters annotations to get only those with 2 tags -> "isCriteriaOf" and "mark"
  filterAnnotations (annotations) {
    return _.filter(annotations, (annotation) => (Utils.filterTags(annotation.tags)))
  }

  // Function that gets the questions of each students with the marks
  obtainStudentsQuestions (annotations) {
    return _.map(annotations, (annotation) => ({
      'uri': annotation.uri,
      'question': annotation.tags[0].slice(18),
      'mark': parseInt(annotation.tags[1].slice(10))
    }))
  }

  // Function to delete the repeated questions
  deleteRepeatedQuestions (studentsQuestionsRep) {
    return _.uniqBy(studentsQuestionsRep, (student) => (student.uri.concat(student.question)))
  }

  // Function that groups the students by exercise and note
  groupQuestionMark (studentsQuestions) {
    return _.groupBy(studentsQuestions, (d) => d.question + d.mark)
  }

  // Function that groups the students by their average mark
  obtainNumStudentsByQuestionMark (groupedQuestionMark) {
    return _.map(groupedQuestionMark, (objs, key) => ({
      'question': _.first(objs).question,
      'mark': _.first(objs).mark,
      'numStudents': objs.length }))
  }

  // Function to draw the scatter plot
  drawScatterPlot (data) {
    // Margins
    let margins = {
      'left': 40,
      'right': 35,
      'top': 35,
      'bottom': 30
    }

    // Dimensions
    let width = 850
    let height = 500

    let x = d3.scale.ordinal() // X axis scale
      .rangeRoundPoints([0, width - margins.left - margins.right], 1)
      .domain(data.map((d) => d.question))

    let y = d3.scale.linear() // Y axis scale
      .domain(d3.extent(data, (d) => d.mark))
      .range([height - margins.top - margins.bottom, 0]).nice()

    let r = d3.scale.linear() // Radio scale
      .domain([1, d3.max(data, (d) => d.numStudents)])
      .range([5, 25])

    // Axis
    let xAxis = d3.svg.axis().scale(x).orient('bottom').tickPadding(2)
    let yAxis = d3.svg.axis().scale(y).orient('left').tickPadding(2)

    d3.select('#dv').remove()
    d3.select('#dvdesplegables').remove() // Delete the SVG if there is one (It is done to remove the graphic that was there).
    d3.select('#svg').remove()
    d3.select('#svgbotonesEliminar').remove()

    let svg = d3.select('#divGrafico') // Create and insert the SGV
      .append('svg')
      .attr('id', 'svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')

    let tooltip = d3Tip(d3) // Create the tooltip
      .attr('class', 'd3tip')
      .offset([-10, 0])
      .html((d) => 'Mark ' + d.mark + ': <br><strong>' + d.numStudents + ' Students</strong>') // Tooltip message

    svg.call(tooltip)

    // X axis
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + y.range()[0] + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      .attr('x', width - margins.left - margins.right)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Questions')

    // Y axis
    svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Mark')

    // Add the dots
    svg.selectAll('dot')
      .data(data)
      .enter().append('circle')
      .attr('r', (d) => r(d.numStudents))
      .attr('cx', (d) => x(d.question))
      .attr('cy', (d) => y(d.mark))
      .style('fill', 'lightsalmon')
      .on('mouseover', tooltip.show) // When passing over a dot the tooltip appears
      .on('mouseout', tooltip.hide)
  }
}

module.exports = ScatterPlotExam
