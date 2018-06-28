class Utils {
  static filtradoTags (tags) {
    return (tags.length === 2) && tags[0].includes('isCriteriaOf') && tags[1].includes('mark')
  }

  static normalizar (anotacionesGrupo, nota) {
    // Se obtienen las primeras anotaciones del grupo que fueron generados automaticamente
    let criteriosDeRubrica = _.filter(anotacionesGrupo, (value, key) => { return Utils.esNotaPreguntaTags(value.tags) })

    // Se agrupan por pregunta y se obtiene el valor maximo de cada una
    let puntuacionMaximaEjercicios = _(criteriosDeRubrica).groupBy((d) => d.tags[1]).map((puntuaciones, pregunta) => ({
      'pregunta': pregunta,
      'puntuacionMayor': parseInt(_.maxBy(puntuaciones, function (o) { return parseInt(o.tags[0].slice(10)) }).tags[0].slice(10))
    })).value()

    // Suma las puntuaciones maximas
    let valorExamen = _.sumBy(puntuacionMaximaEjercicios, 'puntuacionMayor')

    return (nota * 10) / valorExamen
  }

  static esPreguntaNotaTags (tags) {
    return (tags.length === 2) && tags[0].includes(Utils.tags.isCriteriaOf) && tags[1].includes(Utils.tags.mark)
  }

  /**
     * Devuelve TRUE si el array de tags tiene longitud 2 y la primera es la nota y la segunda la la pregunta. Estos corresponden a los criterios de rubrica que se crean al principio
     * @param tags lista de tags
     * @returns {boolean|*}
     */
  static esNotaPreguntaTags (tags) {
    return (tags.length === 2) && tags[0].includes(Utils.tags.mark) && tags[1].includes(Utils.tags.isCriteriaOf)
  }
}

Utils.tags = {
  'mark': 'exam:mark:',
  'isCriteriaOf': 'exam:isCriteriaOf:'
}

module.exports = Utils
