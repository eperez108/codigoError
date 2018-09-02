const Utils = require('./utils')
const d3 = require('d3')
const d3Tip = require('d3-tip')
const _ = require('lodash')
const HypothesisClient = require('hypothesis-api-client')

class ScatterPlotContinuousAssessment {
  constructor () {
    this.data = []
    this.groupsNameID = []
    this.hypothesisClientManager = {}
  }

  init () {
    this.hypothesisClientManager.hypothesisClient = new HypothesisClient('6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA')
    this.obtainGroupsNamesID((err, groups) => {
      if (err) {
        // TODO handle this error
      } else {
        this.groupsNameID = groups
        let promises = []
        for (let i = 0; i < this.groupsNameID.length; i++) {
          promises.push(new Promise((resolve, reject) => {
            this.results(this.groupsNameID[i], (err, examResults) => {
              if (err) {
                reject(err)
              } else {
                resolve(examResults)
              }
            })
          }))
        }
        Promise.all(promises).then((resolves) => {
          // Filter all the group results which are not exams
          let exams = _.filter(resolves, (resolve) => { return resolve.pairStudentResultList.length > 0 })
          for (let i = 0; i < exams.length; i++) {
            let examResults = exams[i].pairStudentResultList
            let groupName = _.filter(this.groupsNameID, {'id': this.groupsNameID[i].id})
            // Group the students by their average mark
            let mediasExamen = this.groupByMark(examResults, groupName)
            this.data = _.concat(this.data, mediasExamen)
          }
          this.drawScatterPlot(this.data)
        }).catch((rejects) => {
          // TODO Handle error

        })
      }
    })
  }

  // Function that obtains the ID and the names of the groups
  obtainGroupsNamesID (callback) {
    this.retrieveGroups((err, groups) => {
      if (err) {
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        if (_.isFunction(callback)) {
          groups = _.map(groups, (group) => ({
            'id': group.id,
            'name': group.name
          }))
          callback(null, groups)
        }
      }
    })
  }

  // Function to retrieve current user groups
  retrieveGroups (callback) {
    this.hypothesisClientManager.hypothesisClient.getListOfGroups({}, (err, groups) => {
      if (err) {
        // TODO Handle this error
      } else {
        if (_.isFunction(callback)) {
          callback(null, groups)
        }
      }
    })
  }

  // Function that obtain the results of the students in a given exam
  results (group, callback) {
    this.hypothesisClientManager.hypothesisClient.searchAnnotations({
      group: group.id,
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
          this.hypothesisClientManager.hypothesisClient.searchAnnotations({
            group: group.id,
            limit: 5000
          }, (err, groupAnnotations) => {
            if (err) {
              // Handle the error
              if (_.isFunction(callback)) {
                callback(err)
              }
            } else {
              let filteredAnnotations = _.filter(groupAnnotations, (annotation) => (Utils.isQuestionMarkTags(annotation.tags)))
              let studentsQuestionsRep = _.map(filteredAnnotations, (annotation) => ({
                'uri': annotation.uri,
                'question': annotation.tags[0].slice(18),
                'mark': parseInt(annotation.tags[1].slice(10))
              }))
              let studentsQuestions = _.uniqBy(studentsQuestionsRep, (student) => (student.uri.concat(student.question))) // Se eliminan los repetidos
              // The results of each student are obtained
              let pairStudentResultList = _(studentsQuestions).groupBy('uri')
                .map((questions, student) => ({
                  'uri': student,
                  'result': Utils.normalise(groupAnnotations, _.sumBy(questions, 'mark')).toFixed(2)
                })).value()
              if (_.isFunction(callback)) {
                callback(null, {group: group.id, pairStudentResultList: pairStudentResultList})
              }
            }
          })
        } else {
          callback(null, {group: group, pairStudentResultList: []})
        }
      }
    })
  }

  // Function that groups the students by their average mark
  groupByMark (examResults, groupName) {
    return _(examResults).countBy('result')
      .map((count, mark) => ({
        'exam': _.head(groupName).name,
        'averageMark': parseFloat(mark),
        'numStudents': count
      })).value()
  }

  // Function to draw the scatter plot
  drawScatterPlot (data) {
    // Margins
    let margins = {
      'left': 40,
      'right': 35,
      'top': 55,
      'bottom': 30
    }

    // Dimensions
    let width = 550
    let height = 500

    let x = d3.scale.ordinal() // X axis scale
      .rangeRoundPoints([0, width - margins.left - margins.right], 1)
      .domain(data.map((d) => d.exam))

    let y = d3.scale.linear() // Y axis scale
      .domain(d3.extent(data, (d) => d.averageMark))
      .range([height - margins.top - margins.bottom, 0]).nice()

    let r = d3.scale.linear() // Radio scale
      .domain([1, d3.max(data, (d) => d.numStudents)])
      .range([5, 25])

    // Axis
    let xAxis = d3.svg.axis().scale(x).orient('bottom').tickPadding(2)
    let yAxis = d3.svg.axis().scale(y).orient('left').tickPadding(2)

    d3.select('#svg').remove() // Delete the SVG if there is one (It is done to remove the graphic that was there).

    let svg = d3.select('.search-results__total') // Create and insert the SGV
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
      .text('Results of the continuous assessment exams')

    var tooltip = d3Tip(d3) // Create the tooltip
      .attr('class', 'd3tip')
      .offset([-10, 0])
      .html((d) =>
        'Mark ' + d.averageMark + ': <br><strong>' + d.numStudents + ' Students</strong>'
      )

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
      .attr('textLength', '50')
      .text('Exams')

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
      .attr('cx', (d) => { return x(d.exam) })
      .attr('cy', (d) => { return y(d.averageMark) })
      .style('fill', (d) => { // Each dot will have different color depending on the average mark
        if (d.averageMark < 3.0) { return '#ef5a3c' } else if ((d.averageMark >= 3.0) && (d.averageMark < 5.0)) {
          return '#ee8c2b'
        } else if ((d.averageMark >= 5.0) && (d.averageMark < 7.0)) {
          return '#f1e738'
        } else if ((d.averageMark >= 7.0) && (d.averageMark < 9.0)) {
          return '#7bee22'
        } else { return '#24ee34' }
      })
      .on('mouseover', tooltip.show) // When passing over a dot the tooltip appears
      .on('mouseout', tooltip.hide)
  }
}

window.scatterPlotContinuousAssessment = new ScatterPlotContinuousAssessment()
window.scatterPlotContinuousAssessment.init()
