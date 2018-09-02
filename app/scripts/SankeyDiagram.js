const Utils = require('./utils')
const d3 = require('d3')
require('./d3-sankey')
const d3Tip = require('d3-tip')
const _ = require('lodash')

/**
 * Manages the functionality related with the sankey diagram
 */
class SankeyDiagram {
  /**
     * Constructor class for SankeyDiagram
     * @param {Object} group The hypothes.is group object, including id, name, etc. See response of https://h.readthedocs.io/en/latest/api-reference/#operation/listGroups
     */
  constructor (group) {
    this.linksRestExams = [] // Links that relate the exams of the subject
    this.nodesRestExams = [] // Nodes of the exams of the subject
    this.studentsFinalResult = [] // Final results of the students in the current exam
    this.examQuestions = [] // Current exam questions
    this.restOfExams = [] // Subject rest of the exams
    this.studentsResults = [] // Results of the students in each exam
    this.groupsNameID = [] // Names and ID of the exams groups
    this.group = group // Current group
    this.notas3Examen = require('./Notas3Examen')
    this.notas4Examen = require('./Notas4Examen')
    this.annotations = [] // Group annotations
    this.graphCopy = null // Graph of the diagram
  }

  /**
     * Initializes the manager for the sankey diagram, gathering all the required information to permit create the chart itself
     * @param {initSankeyDiagramCallback=} callback
     */
  init (callback) {
    // Get list of groups
    window.markAndGoViz.hypothesisClientManager.hypothesisClient.getListOfGroups({}, (err, listOfGroups) => {
      if (err) {
        if (_.isFunction(callback)) {
          callback(new Error('Error while retrieving list of groups'))
        }
      } else {
        this.groupsNameID = _.map(listOfGroups, (group) => ({
          'id': group.id,
          'name': group.name
        }))
        if (_.isFunction(callback)) {
          callback(null)
        }
      }
    })
  }
  /**
     * This callback is displayed as part of the Requester class.
     * @callback initSankeyDiagramCallback
     * @param {Error} error The error happened when called the init function of sankey diagram
     */

  /**
     * Creates the chart and inserts it in the hypothes.is website
     * @param annotations
     */
  createSankeyDiagram (annotations) {
    this.annotations = annotations
    // Filter annotations to get only those with 2 tags -> "isCriteriaOf" and "mark"
    let filteredAnnotations = this.filterAnnotations(annotations)

    // The tags of the previously filtered annotations are obtained
    let tags = this.getTags(filteredAnnotations)

    // Get a list of the exam questions
    this.examQuestions = this.getExamQuestions(tags)

    // Get the nodes
    let nodes = this.getNodes(tags, this.group)

    // Get the links
    let links = this.getLinks(this.examQuestions, filteredAnnotations, annotations)
    // The graph is created with the nodes and the links (without the rest of the exams)
    let graphWithoutRestOfExams = {nodes: nodes, links: links}
    // A Copy is made to avoid any problem
    let questionsCopy = _.clone(this.examQuestions)
    this.restOfExams = []
    let examsCopy = _.clone(this.restOfExams)
    this.drawSankeyDiagram(graphWithoutRestOfExams, questionsCopy, examsCopy, annotations)
    // Get the rest of the links to draw the new diagram
    this.getRestOfExamsLinks(graphWithoutRestOfExams)
  }

  getNodes (tags) {
    // The list of nodes is created. Each node will have a name that will be the mark that will be displayed in the graph and
    // an ID to distinguish it from the other nodes (It is formed with the concatenation of the question and the value)
    let nodesRep = _.map(tags, (tags) => ({
      'id': tags[0].slice(18).concat(tags[1].slice(10)),
      'name': tags[1].split(':').pop()
    }))

    // Since there might be repeated annotations, repeated nodes can be formed and therefore it is necessary to eliminate them
    let nodes = _.uniqBy(nodesRep, (node) => (node.id))

    // In addition to the previously created nodes, the nodes 'pass' and 'fail' are also added
    return _.concat(nodes, [{'id': this.group.concat('Pass'), 'name': 'Pass'}, {'id': this.group.concat('Fail'), 'name': 'Fail'}
    ])
  }

  /**
   * Gets the sankey diagram links
   * @param preguntas
   * @param anotFiltradas
   * @returns {Array}
   */
  getLinks (questions, annotations) {
    // From the annotations, a list of objects containing the student's uri, a question and the mark obtained is created.
    // Repeated objects may exist since for a question can be more than one annotation
    let studentsQuestionsRep = _.map(annotations, (annotation) => ({
      'uri': annotation.uri,
      'question': annotation.tags[0].slice(18),
      'mark': parseInt(annotation.tags[1].slice(10))
    }))

    // Filter the previously obtained list to eliminate the repeated objects
    let studentsQuestions = _.uniqBy(studentsQuestionsRep, (student) => (student.uri.concat(student.question)))

    // A list is created and added to each student if he/she has approved or not.
    this.studentsFinalResult = _(studentsQuestionsRep).groupBy('uri')
      .map((exercises, student) => ({
        'uri': student,
        'finalResult': (Utils.normalise(this.annotations, _.sumBy(exercises, 'mark')) >= 5) ? 'Pass' : 'Fail' // It is necessary to kno the color of the link
      })).value()

    // The questions of each student of 'questionsAlumnos' are taken and it is indicated if in the end they pass or not
    _.map(studentsQuestions, (obj) => {
      return _.assign(obj, _.find(this.studentsFinalResult, {
        uri: obj.uri
      }))
    })

    // They are grouped by questions. Each question will have a list of the grades of each student in that exercise.
    let questionsMarks = _.groupBy(studentsQuestions, 'question')
    let links = []
    // Go through each question of the exam to know the relationships between one question and the next
    for (let i = 0; i < questions.length - 1; i++) {
      // Students' marks of a question are taken
      let originExercise = _.get(questionsMarks, questions[i])
      // Students' marks of the next question are taken
      let targetExercise = _.get(questionsMarks, questions[i + 1])
      // The different marks of the first exercise are taken
      let marks = _(originExercise).map('mark').uniq().value()
      let mark

      // For each different mark of the first exercise, we check which marks was obtained in the following one
      for (let j = 0; j < marks.length; j++) {
        mark = marks[j]
        // Take the students who have taken that mark in the first exercise
        let studentsOriginExerciseMark = _(originExercise).filter({'mark': mark}).map((annotation) => ({'uri': annotation.uri})).value()
        // Get the students (and their grades) of the second exercise that have taken that mark in the first exercise
        let studentsTargetExerciseMark = _(targetExercise).intersectionBy(studentsOriginExerciseMark, 'uri').value()

        // We filter and keep the students who have passed, we count how many students there are for each mark and we create a link being
        // the origin the mark of the first exercise (the question concatenated with the mark), the target the mark in the following exercise,
        // the value how many students have taken the mark of the second year having taken the mark of the first exercise. It is also stored
        // that they pass the exam to know the color to draw the link
        let linksPass = _(studentsTargetExerciseMark).filter({'finalResult': 'Pass'}).countBy('mark')
          .map((count, markTarget) => ({
            'source': questions[i].concat(mark),
            'target': questions[i + 1].concat(markTarget),
            'value': count,
            'finalResult': 'Pass'
          })).value()

        // Same as the previous one but this time with the failed students
        let linksFail = _(studentsTargetExerciseMark).filter({'finalResult': 'Fail'}).countBy('mark')
          .map((count, markTarget) => ({
            'source': questions[i].concat(mark),
            'target': questions[i + 1].concat(markTarget),
            'value': count,
            'finalResult': 'Fail'
          })).value()

        // They are added to the list of links
        links = _.concat(links, linksPass)
        links = _.concat(links, linksFail)
      }
    }

    let lastQuestion = _.last(questions)
    let lastQuestionAnnots = _.get(questionsMarks, lastQuestion)
    let marks = _(lastQuestionAnnots).map('mark').uniq().value()
    // For each mark in the last exercise, gets how many pass or fail the exam
    for (let i = 0; i < marks.length; i++) {
      let mark = marks[i]
      let lastQuestionMark = _.filter(lastQuestionAnnots, {'mark': mark})

      let passes = _(lastQuestionMark).filter({ 'finalResult': 'Pass' }).countBy('mark')
        .map((count) => ({
          'source': lastQuestion.concat(mark),
          'target': this.group.concat('Pass'),
          'value': count,
          'finalResult': 'Pass'
        })).value()

      let fails = _(lastQuestionMark).filter({ 'finalResult': 'Fail' }).countBy('mark')
        .map((count, mark) => ({
          'source': lastQuestion.concat(mark),
          'target': this.group.concat('Fail'),
          'value': count,
          'finalResult': 'Fail'
        })).value()

      links = _.concat(links, passes)
      links = _.concat(links, fails)
    }
    return links
  }

  // Function that adds to the graph the links and the nodes of the rests of the exams
  getRestOfExamsLinks (graph) {
    let links = []
    let nodes = []
    let currentGroup = this.group
    let graphCopy = _.clone(graph)
    window.markAndGoViz.hypothesisClientManager.hypothesisClient.getListOfGroups({}, (err, groups) => {
      if (err) {
        // TODO Handle error
      } else {
        let groupsId = _.map(groups, 'id')
        // Remove the current group from the groups list
        _.pull(groupsId, currentGroup)
        this.studentsResults.push({exam: currentGroup, results: _.clone(this.studentsFinalResult)})
        // Create a promise for each group, since calls to the hypothes.is server are always asynchronous
        let promises = []
        for (let i = 0; i < groupsId.length; i++) {
          promises.push(new Promise((resolve, reject) => {
            this.results(groupsId[i], (err, examResults) => {
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
          // For first iteration the former exam is the exam of the current group in hypothes.is group page
          let originExam = {group: this.group, pairStudentResultList: _.clone(this.studentsFinalResult)}
          // For each group we must create a column in the alluvial, for that, we need to create links and nodes
          for (let i = 0; i < exams.length; i++) {
            let targetExam = exams[i]

            // Add to each student in the originExamResults list the result of the exam obtained in targetExamResults.
            // To differentiate the name of the attributes, the result of the origin exam is called "finalResult" and the destination one is "finalResultTarget"
            let studentsQuestionsWithResults = _.map(originExam.pairStudentResultList, (student) => {
              return _.assign(student, _.find(targetExam.pairStudentResultList, {
                uri: student.uri
              }))
            })
            // It obtains the passed origin exams and counts the different results in the target exam.
            // It may happen that a student don't take the target exam and in that case in the countBy an undefined attribute is generated that must be omitted.
            let linksPass = _(studentsQuestionsWithResults).filter({'finalResult': 'Pass'}).countBy('result').omit('undefined')
              .map((count, mark) => ({
                'source': originExam.group.concat('Pass'),
                'target': targetExam.group.concat(mark),
                'value': count,
                'finalResult': mark
              })).value()

            let linksFail = _(studentsQuestionsWithResults).filter({'finalResult': 'Fail'}).countBy('result')
              .omit('undefined').map((count, mark) => ({
                'source': originExam.group.concat('Fail'),
                'target': targetExam.group.concat(mark),
                'value': count,
                'finalResult': mark
              })).value()
            // Append links
            links = _.concat(links, linksPass)
            links = _.concat(links, linksFail)
            // TODO Check if it should be && or || -> all students has passed the exam, all students has failed the exam
            if (linksPass.length > 0 || linksFail.length > 0) {
              // Create nodes
              nodes = _.concat(nodes, [{
                'id': targetExam.group.concat('Pass'),
                'name': 'Pass'
              }, {'id': targetExam.group.concat('Fail'), 'name': 'Fail'}])
              this.restOfExams.push(targetExam)
              this.studentsResults.push({exam: targetExam.group, results: _.clone(targetExam.pairStudentResultList)})
              // Switch origin and target groups for next iteration
              originExam = targetExam
              originExam.pairStudentResultList = _.map(originExam.pairStudentResultList, result => ({
                'uri': result.uri,
                'finalResult': result.result
              }))
            }
          }
          graphCopy.nodes = _.concat(graphCopy.nodes, nodes)
          graphCopy.links = _.concat(graphCopy.links, links)
          // Nodes of the rest of the exams are saved
          this.linksRestExams = links
          let questionsCopy = _.clone(this.examQuestions)
          this.drawSankeyDiagram(graphCopy, questionsCopy, _.clone(this.restOfExams))
        }).catch((rejects) => {
          // TODO Handle error
          alert('Unable to retrieve other exams marks')
        })
      }
    })
  }

  // Fuction that updates the exam links
  updateExamsLinks (exams) {
    let links = []
    let originGroup = this.group
    let originExamResults = _.find(this.studentsResults, {'exam': originGroup})
    originExamResults = originExamResults.results
    for (let i = 0; i < exams.length; i++) {
      let targetExamResults = _.find(this.studentsResults, {'exam': exams[i]})
      targetExamResults = targetExamResults.results

      // Add to each student in the originExamResults list the result of the exam obtained in targetExamResults.
      // To differentiate the name of the attributes, the result of the origin exam is called "finalResult" and the destination one is "finalResultTarget"
      let studentsQuestionsWithResults = _.map(originExamResults, student => _.assign(student, _.find(targetExamResults, {
        uri: student.uri
      })))

      // It obtains the passed origin exams and counts the different results in the target exam.
      // It may happen that a student don't take the target exam and in that case in the countBy an undefined attribute is generated that must be omitted.
      let linksPass = _(studentsQuestionsWithResults).filter({'finalResult': 'Pass'}).countBy('result').omit('undefined')
        .map((count, mark) => ({
          'source': originGroup.concat('Pass'),
          'target': exams[i].concat(mark),
          'value': count,
          'finalResult': mark
        })).value()

      let linksFail = _(studentsQuestionsWithResults).filter({'finalResult': 'Fail'}).countBy('result')
        .omit('undefined').map((count, mark) => ({
          'source': originGroup.concat('Fail'),
          'target': exams[i].concat(mark),
          'value': count,
          'finalResult': mark
        })).value()

      links = _.concat(links, linksPass)
      links = _.concat(links, linksFail)
      // The target group becomes the origin group and the results of the target exam become the origin ones
      // (the name of the attribute 'result' is changed to 'final result').
      originExamResults = _.map(targetExamResults, results => ({
        'uri': results.uri,
        'finalResult': results.result
      }))
      originGroup = exams[i]
    }
    return links
  }

  // Function that gets the results of the students of a given exam
  results (group, callback) {
    // TODO Remove in production
    // Grupos con examenes ficticios
    if (group === '78AJ6wx7') {
      if (_.isFunction(callback)) {
        callback(null, {group: group, pairStudentResultList: this.notas3Examen})
      }
    } else if (group === 'YjymyPqK') {
      if (_.isFunction(callback)) {
        callback(null, {group: group, pairStudentResultList: this.notas4Examen})
      }
    } else {
      // Grupo real en hypothes.is con examen
      window.markAndGoViz.hypothesisClientManager.hypothesisClient.searchAnnotations({
        group: group,
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
              group: group,
              limit: 5000
            }, (err, groupAnnotations) => {
              if (err) {
                // Handle the error
                if (_.isFunction(callback)) {
                  callback(err)
                }
              } else {
                // Filter annotations to get only those with 2 tags -> "isCriteriaOf" and "mark"
                let filteredAnnotations = _.filter(groupAnnotations, (annotation) => (Utils.isQuestionMarkTags(annotation.tags)))
                // From the annotations, a list of objects containing the student's uri, a question and the mark obtained is created.
                // Repeated objects may exist since for a question can be more than one annotation
                let studentsQuestionsRep = _.map(filteredAnnotations, (annotation) => ({
                  'uri': annotation.uri,
                  'question': annotation.tags[0].slice(18),
                  'mark': parseInt(annotation.tags[1].slice(10))
                }))
                // Filter the previously obtained list to eliminate the repeated objects
                let studentsQuestions = _.uniqBy(studentsQuestionsRep, (student) => (student.uri.concat(student.question)))
                // The results of each student are obtained
                let pairStudentResultList = _(studentsQuestions).groupBy('uri')
                  .map((questions, student) => ({
                    'uri': student,
                    'result': (Utils.normalise(groupAnnotations, _.sumBy(questions, 'mark')) >= 5) ? 'Pass' : 'Fail'
                  })).value()
                if (_.isFunction(callback)) {
                  callback(null, {group: group, pairStudentResultList: pairStudentResultList})
                }
              }
            })
          } else {
            callback(null, {group: group, pairStudentResultList: []})
          }
        }
      })
    }
  }

  // Function that filters annotations to get only those with 2 tags -> "isCriteriaOf" and "mark"
  filterAnnotations (annotations) {
    return _.filter(annotations, (annotation) => (Utils.filterTags(annotation.tags)))
  }

  // Function that gets the tags from the annotations
  getTags (annotations) {
    return _.map(annotations, 'tags')
  }

  // Function that gets the exam questions from the annotations tags
  getExamQuestions (tags) {
    return _(tags).map(d =>
      d[0].slice(18)
    ).uniq().value()
  }

  // Function to draw the sankey diagram
  drawSankeyDiagram (graph, questions, exams, annotations = []) {
    let graphCopy = _.clone(graph)
    let units = 'Alumnos' // Unity of the links width

    // Recalculate the width depend on the number of columns
    let plusWidth = 70
    if ((questions.length + exams.length) > 6) {
      plusWidth = 130
    }

    // Margins, height y width
    let margin = {top: 6, right: 70, bottom: 5, left: 20}

    let width = 700 + (questions.length + exams.length) * plusWidth - margin.left - margin.right

    let height = 560 - margin.top - margin.bottom

    // Delete decimals
    let formatNumber = d3.format(',.0f')

    // Given a number it gives a format
    let format = d => formatNumber(d) + ' ' + units

    // Gives a color scale
    let color = d3.scale.category20()
    this.graphCopy = _.clone(graph)
    d3.select('#dv').remove()
    d3.select('#dvsankey').remove()
    d3.select('#dvdesplegables').remove()
    d3.select('#svgbotonesEliminar').remove()
    d3.select('#divGraficos').remove()
    d3.select('#divGrafico').append('div').attr('id', 'dv')

    let dvsankey = d3.select('#divGrafico').append('div').attr('id', 'dvsankey')
    let dvdesplegables = dvsankey.append('div').attr('id', 'dvdesplegables').style('width', (width + margin.left + margin.right) + 'px')
    let svgbotonesEliminar = dvsankey.append('svg').attr('id', 'svgbotonesEliminar').attr('width', width + margin.left + margin.right)
      .attr('height', '18px')

    // SGV element is added and its measures are set
    d3.select('#svg').remove()
    d3.select('.d3tip').remove()
    let svg = d3.select('#dvsankey')
      .append('svg')
      .attr('id', 'svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')') // Posicion donde se va a situar

    // The properties of the Sankey graph are established (width of nodes, distance between nodes and dimensions of the diagram)
    let sankey = d3.sankey()
      .nodeWidth(12)
      .nodePadding(25)
      .size([width, height])

    // Sankey function that makes the links between the nodes curve in the right places.
    let path = sankey.link()

    // The previously obtained data is loaded for visualization
    // This code is due to the use of the id of the nodes (a string instead of an integer) in the source and target of the links -> https://stackoverflow.com/questions/14629853/json-representation-for -d3-force-directed-networks
    let nodeMap = {}
    graphCopy.nodes.forEach(x => { nodeMap[x.id] = x })
    graphCopy.links = graphCopy.links.map(x => ({
      source: nodeMap[x.source],
      target: nodeMap[x.target],
      value: x.value,
      finalResult: x.finalResult
    }))

    sankey.nodes(graphCopy.nodes)
      .links(graphCopy.links)
      .layout(12)

    // The positions of the columns of nodes are obtained
    let position = _.sortBy(_.uniq(_.map(graphCopy.nodes, 'x')))
    let distance = position[1] - position[0]

    // Creacion del tooltip
    let tooltip = d3Tip(d3)
      .attr('class', 'd3tip')
      .offset([-10, 0])
      .html(d => 'Remove question')

    // Creates a cross-shaped image that will be used to delete a question
    let imgUrl = 'https://png.icons8.com/metro/1600/delete-sign.png'
    svg.append('defs')
      .append('pattern')
      .attr('id', 'venus')
      .attr('width', 30)
      .attr('height', 20)
      .append('image')
      .attr('xlink:href', imgUrl)
      .attr('width', 30)
      .attr('height', 20)

    svg.call(tooltip)

    // A drop-down list is added in each column of nodes to exchange the position of the questions
    dvdesplegables
      .selectAll('select.desplegablePreguntas')
      .data(questions)
      .enter()
      .append('select')
      .attr('class', 'desplegablePreguntas')
      .attr('id', (d, i) => { return 'desplegable' + i })
      .style('width', (d, i) => { return (distance < 180) ? ((distance * 0.7) + 'px') : '180px' })
      .style('margin-right', (d, i) => { return (distance < 180) ? ((distance * 0.3) + 'px') : (distance - 180) + 'px' })
      .on('change', (d, i) => {
        // Exchanges the questions positions
        let byDefault = questions[i]
        let pos1 = questions.indexOf(byDefault)
        let selectValue = d3.select('#desplegable' + pos1).property('value')
        let pos2 = questions.indexOf(selectValue)
        questions[pos1] = selectValue
        questions[pos2] = byDefault
        let filteredAnnotations = _.filter(this.annotations, (annotation) => {
          return Utils.filterTags(annotation.tags)
        })
        // Updates the links
        let links = this.getLinks(questions, filteredAnnotations)
        // Creates the new graph
        let newGraph = {nodes: _.clone(this.graphCopy.nodes), links: _.concat(links, _.clone(this.linksRestExams))}
        // Draw the new diagram
        this.drawSankeyDiagram(newGraph, questions, exams, this.annotations)
      })
      .selectAll('option')
      .data(questions)
      .enter()
      .append('option')
      .attr('value', (d) => { return d })
      .text((d) => { return d })

    // The value of each of the drop-down lists is established
    for (let i = 0; i < questions.length; i++) {
      d3.select('#desplegable' + i)
        .property('value', questions[i])
        .append('title')
        .text(questions[i])
    }

    let gru = _.map(exams, 'group')
    let groupsName = _.filter(this.groupsNameID, (group) => (gru.includes(group.id)))
    // A drop-down list is added in each column of exam nodes to exchange exams
    dvdesplegables
      .selectAll('select.desplegableExamenes')
      .data(exams)
      .enter()
      .append('select')
      .attr('class', 'desplegableExamenes')
      .attr('id', (d, i) => { return 'desplegableExamen' + i })
      .style('width', (d, i) => (distance < 180) ? ((distance * 0.7) + 'px') : '180px')
      .style('margin-left', (d, i) => { if (distance < 180) { if (i === 0) { return distance * 0.7 + 'px' } else { return ((distance * 0.3) + 'px') } } else { if (i === 0) { return (distance * 1.25 - 180) + 'px' } else { return (distance - 180) + 'px' } } })
      .on('change', (d, i) => {
        // Exchanges the exams positions
        let exam = exams[i].group
        let pos1 = gru.indexOf(exam)
        let selectValue = d3.select('#desplegableExamen' + pos1).property('value')
        let pos2 = gru.indexOf(selectValue)
        gru[pos1] = selectValue
        gru[pos2] = exam
        let examsNewOrder = _.concat(_.clone(this.group), _.clone(gru))
        let temp = exams[pos1]
        exams[pos1] = exams[pos2]
        exams[pos2] = temp
        // Updates the links
        let linksQuestions = _.filter(graph.links, (link) => (!_.includes(examsNewOrder, link.source.slice(0, 8))))
        let linksExams = this.updateExamsLinks(gru)
        // Creates the new graph
        let newGraph = {nodes: _.clone(graph.nodes), links: _.concat(linksQuestions, linksExams)}
        this.linksRestExams = _.clone(linksExams)
        // Draw the new diagram
        this.drawSankeyDiagram(newGraph, questions, exams, annotations)
      })
      .selectAll('option')
      .data(groupsName)
      .enter()
      .append('option')
      .attr('value', d => d.id)
      .text(d => d.name)

    // The value of each of the drop-down lists is established
    for (let i = 0; i < exams.length; i++) {
      d3.select('#desplegableExamen' + i)
        .property('value', exams[i].group)
        .append('title')
        .text(exams[i].group)
    }

    // Add a button with the previous image to remove a column of nodes of questions
    svgbotonesEliminar.selectAll('rect.buttonPregunta')
      .data(questions)
      .enter()
      .append('rect')
      .attr('class', 'button')
      .attr('fill', 'url(#venus)')
      .attr('x', (d, i) => position[i] + 10)
      .attr('width', 30)
      .attr('height', 20)
      .attr('rx', 10)
      .attr('ry', 10)
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide)
      .on('click', (d, i) => {
        if (questions.length > 1) {
          // The question is removed from the list of questions
          _.remove(questions, (n) => {
            return n === d
          })
          // Remove the nodes of the question selected
          let nodes = _.filter(graphCopy.nodes, (nodo) => (!nodo.id.includes(d)))
          // Update the links
          let filteredAnnotations = _.filter(this.annotations, (annotation) => (Utils.isQuestionMarkTags(annotation.tags)))
          let links = this.getLinks(questions, filteredAnnotations, this.annotations)
          // The new graph is created
          let newGraph = {nodes: nodes, links: _.concat(links, _.clone(this.linksRestExams))}
          // Draw the new diagram
          this.drawSankeyDiagram(newGraph, questions, exams, this.annotations)
        } else {
          alert('There must be at least one question.')
        }
      })

    let group = this.group
    // Add a button with the previous image to remove a column of nodes of exams
    svgbotonesEliminar.selectAll('rect.buttonExamen')
      .data(exams)
      .enter()
      .append('rect')
      .attr('class', 'button')
      .attr('fill', 'url(#venus)')
      .attr('x', (d, i) => position[questions.length + i + 1] + 10)
      .attr('width', 30)
      .attr('height', 20)
      .attr('rx', 10)
      .attr('ry', 10)
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide)
      .on('click', (d, i) => {
        // The exam is removed from the list of questions
        let allExamsID = _.map(exams, 'group')
        _.remove(exams, function (n) {
          return n === d
        })
        let examensID = _.map(exams, 'group')
        // Remove the nodes of the exam selected
        let nodes = _.filter(graph.nodes, (nodo) => (!nodo.id.includes(d.group)))
        let groups = _.concat(_.clone(group), _.clone(allExamsID))
        // Update the links
        let linksQuestions = _.filter(graph.links, (link) => (!_.includes(groups, link.source.slice(0, 8))))
        let linksExams = this.updateExamsLinks(examensID)
        this.linksRestExams = _.clone(linksExams)
        this.nodesRestExams = _.clone(nodes)
        // The new graph is created
        let newGraph = {nodes: nodes, links: _.concat(linksQuestions, linksExams)}
        // Draw the new diagram
        this.drawSankeyDiagram(newGraph, questions, exams, this.annotations)
      })

    // The links are added in the diagram
    let link = svg.append('g').selectAll('.link')
      .data(graphCopy.links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', path)
      .style('stroke', d => d.finalResult === 'Pass' ? 'green' : 'red')
      .style('stroke-width', d => Math.max(1, d.dy))
      .sort((a, b) => b.dy - a.dy)

    // Add a text message that appears when the mouse passes over the links (indicates the origin, destination and value)
    link.append('title')
      .text(d => d.source.name + ' → ' +
        d.target.name + '\n' +
        d.finalResult + ': ' + format(d.value))

    // Add the nodes (not rectangles or text)
    let node = svg.append('g').selectAll('.node')
      .data(graphCopy.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
      .call(d3.behavior.drag()
        .origin(d => d)
        .on('dragstart', () => this.parentNode.appendChild(this))
        .on('drag', dragmove))

    // Add the rectangles to the nodes
    node.append('rect')
      .attr('height', (d) => d.dy)
      .attr('width', sankey.nodeWidth())
      .style('fill', (d) => {
        d.color = color(d.name.replace(/ .*/, ''))
        return d.color
      })
      .style('stroke', d => d3.rgb(d.color).darker(2))
      .append('title')
      .text(d => d.name + '\n' + format(d.value))

    // Add title to the nodes
    node.append('text')
      .attr('x', -6)
      .attr('y', (d) => d.dy / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .attr('transform', null)
      .text((d) => d.name)
      .filter((d) => d.x < width / 2)
      .attr('x', 6 + sankey.nodeWidth())
      .attr('text-anchor', 'start')

    // Function to move the nodes
    function dragmove (d) {
      d3.select(this).attr('transform',
        'translate(' + (
          d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
        ) + ',' + (
          d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
        ) + ')')
      sankey.relayout()
      link.attr('d', path)
    }
  }
}

module.exports = SankeyDiagram
