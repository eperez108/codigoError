const _ = require('lodash')

const HypothesisClient = require('hypothesis-api-client')

const reloadIntervalInSeconds = 10 // Reload the hypothesis client every 10 seconds

/**
 * Manages the hypothesis client and the token for the current user
 */
class HypothesisClientManager {
  constructor () {
    this.hypothesisClient = null
    this.hypothesisToken = null
    this.reloadInterval = null
  }

    /**
     * Hypothes.is client manager initializer, creates the client and the events required to ask for the current user hypothes.is token
     * @param callback The callback of this method, if any error happened during initialization an error param is send as first parameter
     */
  init (callback) {
    this.reloadHypothesisClient(() => {
      // Start reloading of client
      this.reloadInterval = setInterval(() => {
        this.reloadHypothesisClient()
      }, reloadIntervalInSeconds * 1000)
      if (_.isNull(this.hypothesisToken)) {
        if (_.isFunction(callback)) {
          callback(new Error('User is not logged in'))
        }
      } else {
        if (_.isFunction(callback)) {
          callback()
        }
      }
    })
  }

    /**
     * Reloads the hypothes.is client with the current user hypothes.is token (if logged in)
     * @param callback
     */
  reloadHypothesisClient (callback) {
    chrome.runtime.sendMessage({scope: 'hypothesis', cmd: 'getToken'}, (token) => {
      if (!_.isNull(token)) {
        if (this.hypothesisToken !== token) {
          this.hypothesisToken = token
          this.hypothesisClient = new HypothesisClient(token)
        }
      } else {
        this.hypothesisToken = null
        this.hypothesisClient = new HypothesisClient()
      }
      if (_.isFunction(callback)) {
        callback()
      }
    })
  }

    /**
     * Returns if the current user is logged in hypothes.is
     * @returns {boolean}
     */
  isLoggedIn () {
    return !_.isEmpty(this.hypothesisToken)
  }

    /**
     * Destroys all the functionality created in init()
     * @param callback
     */
  destroy (callback) {
    if (this.reloadInterval) {
      clearInterval(this.reloadInterval)
    }
    if (_.isFunction(callback)) {
      callback()
    }
  }
}

module.exports = HypothesisClientManager
