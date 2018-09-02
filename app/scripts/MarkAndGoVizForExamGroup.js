const _ = require('lodash')
const HypothesisClient = require('hypothesis-api-client')
const SankeyDiagram = require('./SankeyDiagram')
const ScatterPlot = require('./ScatterPlotExam')

/**
 * The manager for the visualization of MarkAndGo charts attached to the hypothes.is/groups/*groupid*
 */
class MarkAndGoVizForExamGroup {
  /**
     * The constructor for mark and go viz for exam group
     */
  constructor () {
    this.hypothesisClientManager = {}
    this.sankeyDiagram = null
    this.scatterDiagram = null
    this.sankeyButton = null
    this.scatterButton = null
    this.chartContainer = null
    this.annotations = []
  }

  /**
     * Function to initialize the mark and go visualization interface
     */
  init () {
    // TODO Substitute this snippet with the following one which should be removed
    // Initialize hypothesis client manager
    /* const HypothesisClientManager = require('../hypothesis/HypothesisClientManager')
    this.hypothesisClientManager = new HypothesisClientManager()
    this.hypothesisClientManager.init((err) => {

    }) */
    // TODO Remove this
    this.hypothesisClientManager.hypothesisClient = new HypothesisClient('6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA')

    // Retrieve current group
    this.currentHypothesisGroupId = this.retrieveHypothesisGroupId()

    // TODO Check if the current group is an exam group

    // Retrieve group annotations
    this.retrieveGroupAnnotations((err, groupAnnotations) => {
      if (err) {

      } else {
        // Save annotations
        this.annotations = groupAnnotations

        // Initialize sankey charts
        this.sankeyDiagram = new SankeyDiagram(this.currentHypothesisGroupId)
        this.sankeyDiagram.init()

        // Initialize scatter plot
        this.scatterDiagram = new ScatterPlot(this.currentHypothesisGroupId)

        // Create interface buttons
        this.createInterfaceButtons()
      }
    })
  }

  /**
     * Creates the buttons to choose between sankey diagram and scatter plot
     */
  createInterfaceButtons () {
    this.chartContainer = document.createElement('div')
    this.chartContainer.id = 'divGrafico'

    // Create sankey button
    this.sankeyButton = document.createElement('input')
    this.sankeyButton.type = 'button'
    this.sankeyButton.id = 'botonSankey'
    this.sankeyButton.value = chrome.i18n.getMessage('alluvialDiagramButton')
    this.sankeyButton.title = chrome.i18n.getMessage('alluvialDiagramButtonTitle')
    this.sankeyButton.addEventListener('click', () => {
      this.sankeyDiagram.createSankeyDiagram(this.annotations)
    })

    // Create scatter button
    this.scatterButton = document.createElement('input')
    this.scatterButton.type = 'button'
    this.scatterButton.id = 'botonScatter'
    this.scatterButton.value = chrome.i18n.getMessage('scatterPlotButton')
    this.scatterButton.title = chrome.i18n.getMessage('scatterPlotButtonTitle')
    this.scatterButton.addEventListener('click', () => {
      this.scatterDiagram.createScatterPlot(this.annotations)
    })

    document.getElementsByClassName('search-results')[0].insertBefore(this.chartContainer, document.getElementsByClassName('search-results__list')[0])

    this.chartContainer.appendChild(this.sankeyButton)
    this.chartContainer.appendChild(this.scatterButton)
  }

  /**
     * Function to retrieve current webpage hypothes.is' group ID
     */
  retrieveHypothesisGroupId () {
    let loc = document.location.href
    let urlSplit = loc.split('/')
    urlSplit.pop()
    return urlSplit.pop()
  }

  /**
     * Retrieves annotations for the current hypothes.is group
     * @param {RetrieveGroupAnnotationCallback} callback - The callback that handles the response.
     */
  retrieveGroupAnnotations (callback) {
    this.hypothesisClientManager.hypothesisClient.searchAnnotations({
      group: this.currentHypothesisGroupId,
      order: 'asc',
      limit: 5000
    }, (err, annotations) => {
      if (err) {
        // TODO Handle this error
      } else {
        if (_.isFunction(callback)) {
          callback(null, annotations)
        }
      }
    })
  }
  /**
     * This callback is displayed as part of the Requester class.
     * @callback RetrieveGroupAnnotationCallback
     * @param {Error} error The error happened when called retrieve group annotations
     * @param {Array} annotations The annotations pertaining to the current group
     */

  /**
     * Removes all the instances, events, etc. from the content script for current class
     */
  destroy () {

  }
}

window.markAndGoViz = new MarkAndGoVizForExamGroup()
window.markAndGoViz.init()
