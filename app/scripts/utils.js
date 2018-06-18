class Utils {
    static filtradoTags (tags) {
        return (tags.length === 2) && tags[0].includes("isCriteriaOf") && tags[1].includes("mark");
    }

    static normalizar (anotacionesGrupo, nota) {
        //Se obtienen las primeras anotaciones del grupo que fueron generados automaticamente
        var criteriosDeRubrica = _.filter(anotacionesGrupo, (value, key) => {return Utils.esNotaPreguntaTags(value.tags);})

        //Se agrupan por pregunta y se obtiene el valor maximo de cada una
        var puntuacionMaximaEjercicios = _(criteriosDeRubrica ).groupBy((d)=>d.tags[1]).map((puntuaciones, pregunta) => ({
            'pregunta': pregunta,
            'puntuacionMayor':  parseInt(_.maxBy(puntuaciones, function(o) { return parseInt(o.tags[0].slice(10)) }).tags[0].slice(10))
        })).value();

        //Suma las puntuaciones maximas
        var valorExamen=_.sumBy(puntuacionMaximaEjercicios, 'puntuacionMayor');

        return (nota*10)/valorExamen;
    }

    static esPreguntaNotaTags(tags) {
        return (tags.length===2) && tags[0].includes("isCriteriaOf") && tags[1].includes("mark");
    }

    /**
     * Devuelve TRUE si el array de tags tiene longitud 2 y la primera es la nota y la segunda la la pregunta. Estos corresponden a los criterios de rubrica que se crean al principio
     * @param tags lista de tags
     * @returns {boolean|*}
     */
    static esNotaPreguntaTags(tags) {
        return (tags.length===2) && tags[0].includes("mark") && tags[1].includes("isCriteriaOf");
    }

    //Funcion que obtiene las anotaciones (como maximo 200) ignorando las primeras n anotaciones (offset) del grupo pasado como parametro
    static obtenerAnotacionesAjaxGrupo(grupo,offset){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var anotacionesResto= JSON.parse(this.responseText);
                anotacionesGrupo=anotacionesGrupo.concat(anotacionesResto.rows);
            }
        };
        xhttp.open("GET", "https://hypothes.is/api/search?group="+grupo+"&offset="+offset+"&limit=200&order=asc", false);
        xhttp.setRequestHeader("Authorization", "Bearer 6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA");
        xhttp.send();
    }

}

module.exports = Utils