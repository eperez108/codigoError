const _ = require('lodash')

class Utils {
  // Function that returns TRUE if the tags of an annotation have 2 tags -> "isCriteriaOf" and "mark"
  static filterTags (tags) {
    return (tags.length === 2) && tags[0].includes('isCriteriaOf') && tags[1].includes('mark')
  }

  // Returns TRUE if the tags array has 2 elements and the first one is the mark and the second one the question. These correspond to the rubric that is created at the beginning
  static filterTags2 (tags) {
    return (tags.length === 2) && tags[0].includes('mark') && tags[1].includes('isCriteriaOf')
  }

  static normalise (anotacionesGrupo, nota) {
    // The first annotations of the group that were generated automatically are obtained
    let criteriosDeRubrica = _.filter(anotacionesGrupo, (value, key) => { return Utils.isMarkQuestionTags(value.tags) })

    // They are grouped by question and the maximum value of each one is obtained
    let puntuacionMaximaEjercicios = _(criteriosDeRubrica).groupBy((d) => d.tags[1]).map((marks, question) => ({
      'pregunta': question,
      'puntuacionMayor': parseInt(_.maxBy(marks, function (o) { return parseInt(o.tags[0].slice(10)) }).tags[0].slice(10))
    })).value()

    // Add the highest scores
    let valorExamen = _.sumBy(puntuacionMaximaEjercicios, 'puntuacionMayor')

    return (nota * 10) / valorExamen
  }

  static isQuestionMarkTags (tags) {
    return (tags.length === 2) && tags[0].includes(Utils.tags.isCriteriaOf) && tags[1].includes(Utils.tags.mark)
  }

  /**
     * Returns TRUE if the tag array has 2 elements and the first one is the mark and the second the question.
     * These correspond to the rubric that are created at the beginning
     * @param tags lista de tags
     * @returns {boolean|*}
     */
  static isMarkQuestionTags (tags) {
    return (tags.length === 2) && tags[0].includes(Utils.tags.mark) && tags[1].includes(Utils.tags.isCriteriaOf)
  }
}

Utils.tags = {
  'mark': 'exam:mark:',
  'isCriteriaOf': 'exam:isCriteriaOf:'
}

module.exports = Utils
