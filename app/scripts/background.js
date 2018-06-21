browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

console.log(`'Allo 'Allo! Event Page`)

const HypothesisManager = require('./background/HypothesisManager')

// Initialize hypothesis manager
let hypothesisManager = new HypothesisManager()
hypothesisManager.init()