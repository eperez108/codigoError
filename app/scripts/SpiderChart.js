/* eslint-disable no-irregular-whitespace */
const d3 = require('d3')
const Utils = require('./utils')
const _ = require('lodash')
const RadarChart = require('./d3-radar')
const HypothesisClient = require('hypothesis-api-client')

class SpiderChart {
  constructor (group) { // Mirar despues los parametros
    this.anotacionesGrupo = []
    this.data = []
    this.puntuacionMaximaGrupos = []
    this.grupos = []
    this.medias = []
    this.preguntasAlumno = []
    this.anotaciones = []
    this.anotFiltradas = []
    this.gruposNombreID = []
    this.LegendOptions = ['Alumno', 'Media de la clase']
    this.reloadInterval = {}
    this.loc = document.location.href
    this.temp = document.location.href
    this.hypothesisClientManager = {}
  }

  init () {
    this.hypothesisClientManager.hypothesisClient = new HypothesisClient('6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA')
    if (this.loc.includes('https://drive.google.com/drive/folders/')) { // Comprobar de que se trata de una carpeta
      // esAlumno(loc);
      this.spiderChart()
    }
    // Comprobar si se ha cambiado de url
    setInterval(() => this.comprobarURL(), 2000)
  }

  comprobarURL () {
    let locActual = document.location.href
    if (this.loc !== locActual) {
      if (locActual.includes('https://drive.google.com/drive/folders/')) {
        // this.esAlumno(loc)
        this.loc = locActual
        this.temp = setInterval(() => this.comprobarSalidaURL(locActual), 3000)
        this.spiderChart()
      }
      this.loc = locActual
    }
  }

  comprobarSalidaURL (urlCarpeta) {
    // debugger
    let locActual = document.location.href
    if (urlCarpeta !== locActual) {
      d3.select('#divGraphic').remove()
      clearInterval(this.temp)
      this.comprobarURL()
    }
  }

  spiderChart () {
    this.retrieveGroups((err, groups) => {
      if (err) {
      // Handle error
      } else {
        this.gruposNombreID = _.map(groups, (grupo) => ({
          'id': grupo.id,
          'nombre': grupo.name
        }))
      }
    })
    // Obtener anotaciones del usuario actual
    this.retrieveUserAnnotations((err, userAnnotations) => {
      if (err) {

      } else {
        this.data = []
        let usAnor = {
          'rows': [
            {
              'updated': '2018-05-10T15:29:48.097300+00:00',
              'group': 'Pk1XQv8D',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[23]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[4]',
                      'startContainer': '/html[1]/body[1]/div[23]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[4]',
                      'type': 'RangeSelector',
                      'startOffset': 88,
                      'endOffset': 160
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 131402,
                      'start': 131330
                    },
                    {
                      'exact': '\nINSERT INTO THE(select treat (value(aux) as riskyCompanyTypeSol).expeds',
                      'prefix': 'expedientListTypeSol()\n    )\n);\n',
                      'type': 'TextQuoteSelector',
                      'suffix': ' from company_tabSol aux where i'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/-WVSpFRmEeiO6btyKbiYCg',
                'html': 'https://hypothes.is/a/-WVSpFRmEeiO6btyKbiYCg',
                'incontext': 'https://hyp.is/-WVSpFRmEeiO6btyKbiYCg/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:Completar',
                'exam:mark:5'
              ],
              'text': '',
              'created': '2018-05-10T15:29:48.097300+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': '-WVSpFRmEeiO6btyKbiYCg',
              'permissions': {
                'read': [
                  'group:Pk1XQv8D'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-05-10T15:29:44.012476+00:00',
              'group': 'Pk1XQv8D',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[23]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[3]',
                      'startContainer': '/html[1]/body[1]/div[23]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[3]',
                      'type': 'RangeSelector',
                      'startOffset': 159,
                      'endOffset': 195
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 131242,
                      'start': 131206
                    },
                    {
                      'exact': '        certificationListTypeSol(),\n',
                      'prefix': "4,'CleanWater co', 'Donostia', \n",
                      'type': 'TextQuoteSelector',
                      'suffix': "        envManagerTypeSol(4, 'Jo"
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/9uXtpFRmEei_POsR1444CQ',
                'html': 'https://hypothes.is/a/9uXtpFRmEei_POsR1444CQ',
                'incontext': 'https://hyp.is/9uXtpFRmEei_POsR1444CQ/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:Introducir',
                'exam:mark:5'
              ],
              'text': '',
              'created': '2018-05-10T15:29:44.012476+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': '9uXtpFRmEei_POsR1444CQ',
              'permissions': {
                'read': [
                  'group:Pk1XQv8D'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-05-10T15:29:39.767549+00:00',
              'group': 'Pk1XQv8D',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[23]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[2]',
                      'startContainer': '/html[1]/body[1]/div[23]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[2]',
                      'type': 'RangeSelector',
                      'startOffset': 104,
                      'endOffset': 109
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 131047,
                      'start': 131042
                    },
                    {
                      'exact': 'deref',
                      'prefix': 'HERE id=123;\n\n2.\nSELECT A.name, ',
                      'type': 'TextQuoteSelector',
                      'suffix': '(A.cert).title\nFROM manager_tabS'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/9GFdolRmEeis1I-EDG2o0A',
                'html': 'https://hypothes.is/a/9GFdolRmEeis1I-EDG2o0A',
                'incontext': 'https://hyp.is/9GFdolRmEeis1I-EDG2o0A/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:Recuperar',
                'exam:mark:3'
              ],
              'text': '',
              'created': '2018-05-10T15:29:39.767549+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': '9GFdolRmEeis1I-EDG2o0A',
              'permissions': {
                'read': [
                  'group:Pk1XQv8D'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-05-10T15:29:38.306209+00:00',
              'group': 'Pk1XQv8D',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[23]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'startContainer': '/html[1]/body[1]/div[23]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'type': 'RangeSelector',
                      'startOffset': 29,
                      'endOffset': 52
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 130938,
                      'start': 130915
                    },
                    {
                      'exact': 'cert = (select ref(aux)',
                      'prefix': 'ng…1.\nUPDATE manager_tabSol\nSET ',
                      'type': 'TextQuoteSelector',
                      'suffix': ' from envcertification_tabSol au'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/84NtElRmEeiIBjPbH7plFQ',
                'html': 'https://hypothes.is/a/84NtElRmEeiIBjPbH7plFQ',
                'incontext': 'https://hyp.is/84NtElRmEeiIBjPbH7plFQ/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:Asignar',
                'exam:mark:2'
              ],
              'text': '',
              'created': '2018-05-10T15:29:38.306209+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': '84NtElRmEeiIBjPbH7plFQ',
              'permissions': {
                'read': [
                  'group:Pk1XQv8D'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-05-10T14:55:15.109340+00:00',
              'group': 'Pk1XQv8D',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[23]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[4]',
                      'startContainer': '/html[1]/body[1]/div[23]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[4]',
                      'type': 'RangeSelector',
                      'startOffset': 455,
                      'endOffset': 482
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 130290,
                      'start': 130263
                    },
                    {
                      'exact': 'comp ref RiskyCompany_type,',
                      'prefix': 'number(10),\n\tname varchar2(20)\n\t',
                      'type': 'TextQuoteSelector',
                      'suffix': '\n\tcert EnvCertification_type\t\t\n)'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/JcA5XlRiEeirvKf_S3JqTw',
                'html': 'https://hypothes.is/a/JcA5XlRiEeirvKf_S3JqTw',
                'incontext': 'https://hyp.is/JcA5XlRiEeirvKf_S3JqTw/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:1:N:cert/tech',
                'exam:mark:1'
              ],
              'text': '',
              'created': '2018-05-10T14:55:15.109340+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': 'JcA5XlRiEeirvKf_S3JqTw',
              'permissions': {
                'read': [
                  'group:Pk1XQv8D'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-05-10T14:54:59.537145+00:00',
              'group': 'Pk1XQv8D',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[23]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[3]',
                      'startContainer': '/html[1]/body[1]/div[23]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[3]',
                      'type': 'RangeSelector',
                      'startOffset': 804,
                      'endOffset': 831
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 129808,
                      'start': 129781
                    },
                    {
                      'exact': 'envmanager EnvManager_type,',
                      'prefix': 'har2(20),\n\tadvice varchar2(20)\n\t',
                      'type': 'TextQuoteSelector',
                      'suffix': '\t\n\texpeds Expedient_list_type\n);'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/HHj9LFRiEei5UjMdDebdxQ',
                'html': 'https://hypothes.is/a/HHj9LFRiEei5UjMdDebdxQ',
                'incontext': 'https://hyp.is/HHj9LFRiEei5UjMdDebdxQ/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:1:N:EnvManager',
                'exam:mark:2'
              ],
              'text': '',
              'created': '2018-05-10T14:54:59.537145+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': 'HHj9LFRiEei5UjMdDebdxQ',
              'permissions': {
                'read': [
                  'group:Pk1XQv8D'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-05-10T14:54:52.682993+00:00',
              'group': 'Pk1XQv8D',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[23]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'startContainer': '/html[1]/body[1]/div[23]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'type': 'RangeSelector',
                      'startOffset': 283,
                      'endOffset': 311
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 128963,
                      'start': 128935
                    },
                    {
                      'exact': 'ers  Certification_list_type',
                      'prefix': 'ar2(20),\n\taddress number(10),\n\tc',
                      'type': 'TextQuoteSelector',
                      'suffix': ')\n\tNOT FINAL;\n\nCREATE TYPE Certi'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/GGX4FlRiEeiB7lckyOrniQ',
                'html': 'https://hypothes.is/a/GGX4FlRiEeiB7lckyOrniQ',
                'incontext': 'https://hyp.is/GGX4FlRiEeiB7lckyOrniQ/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:M:N cers/expeds',
                'exam:mark:4'
              ],
              'text': '',
              'created': '2018-05-10T14:54:52.682993+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': 'GGX4FlRiEeiB7lckyOrniQ',
              'permissions': {
                'read': [
                  'group:Pk1XQv8D'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-05-10T14:54:45.485735+00:00',
              'group': 'Pk1XQv8D',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[23]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'startContainer': '/html[1]/body[1]/div[23]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'type': 'RangeSelector',
                      'startOffset': 314,
                      'endOffset': 325
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 128977,
                      'start': 128966
                    },
                    {
                      'exact': 'NOT FINAL;\n',
                      'prefix': 'cers  Certification_list_type)\n\t',
                      'type': 'TextQuoteSelector',
                      'suffix': '\nCREATE TYPE Certification_list_'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/FBXHvlRiEeiGLYvBsGNvhA',
                'html': 'https://hypothes.is/a/FBXHvlRiEeiGLYvBsGNvhA',
                'incontext': 'https://hyp.is/FBXHvlRiEeiGLYvBsGNvhA/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:UNDER',
                'exam:mark:3'
              ],
              'text': '',
              'created': '2018-05-10T14:54:45.485735+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': 'FBXHvlRiEeiGLYvBsGNvhA',
              'permissions': {
                'read': [
                  'group:Pk1XQv8D'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-04-11T18:06:33.942278+00:00',
              'group': 'vvA2LyEW',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[19]/div[2]/div[6]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[2]',
                      'startContainer': '/html[1]/body[1]/div[19]/div[2]/div[6]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[2]',
                      'type': 'RangeSelector',
                      'startOffset': 129,
                      'endOffset': 131
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 132852,
                      'start': 132850
                    },
                    {
                      'exact': '.p',
                      'prefix': 'port_tab rt\ngroup by rt.year, rt',
                      'type': 'TextQuoteSelector',
                      'suffix': 'rogram;\n\nxsqll.sqlxsqll.sqlOpen '
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/Ea1GUj2zEeigA2NsbJwBdA',
                'html': 'https://hypothes.is/a/Ea1GUj2zEeigA2NsbJwBdA',
                'incontext': 'https://hyp.is/Ea1GUj2zEeigA2NsbJwBdA/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:XSQL 2',
                'exam:mark:0'
              ],
              'text': '',
              'created': '2018-04-11T18:06:33.942278+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': 'Ea1GUj2zEeigA2NsbJwBdA',
              'permissions': {
                'read': [
                  'group:vvA2LyEW'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-04-11T17:46:40.359283+00:00',
              'group': 'vvA2LyEW',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[19]/div[2]/div[6]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'startContainer': '/html[1]/body[1]/div[19]/div[2]/div[6]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'type': 'RangeSelector',
                      'startOffset': 239,
                      'endOffset': 251
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 132584,
                      'start': 132572
                    },
                    {
                      'exact': 'xmlelement("',
                      'prefix': 'mlelement("technicians", \n      ',
                      'type': 'TextQuoteSelector',
                      'suffix': 'tech", (select xmlagg(t.technici'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/SkLIRj2wEeizfh9vHz6VFw',
                'html': 'https://hypothes.is/a/SkLIRj2wEeizfh9vHz6VFw',
                'incontext': 'https://hyp.is/SkLIRj2wEeizfh9vHz6VFw/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:XSQL 1',
                'exam:mark:25'
              ],
              'text': '',
              'created': '2018-04-11T17:46:40.359283+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': 'SkLIRj2wEeizfh9vHz6VFw',
              'permissions': {
                'read': [
                  'group:vvA2LyEW'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-04-11T17:11:53.573738+00:00',
              'group': 'vvA2LyEW',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[19]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[2]',
                      'startContainer': '/html[1]/body[1]/div[19]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[2]',
                      'type': 'RangeSelector',
                      'startOffset': 95,
                      'endOffset': 171
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 132239,
                      'start': 132163
                    },
                    {
                      'exact': "not(expedientalegations = 'No') and substring(expedientdate,4,2) = $mes/@id]",
                      'prefix': " in doc('reports-sim.xml')//row[",
                      'type': 'TextQuoteSelector',
                      'suffix': '\n    return\n        $p/expedient'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/bmxqsD2rEei-kT9f5WlhHQ',
                'html': 'https://hypothes.is/a/bmxqsD2rEei-kT9f5WlhHQ',
                'incontext': 'https://hyp.is/bmxqsD2rEei-kT9f5WlhHQ/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:XQuery 2',
                'exam:mark:100'
              ],
              'text': '',
              'created': '2018-04-11T17:11:53.573738+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': 'bmxqsD2rEei-kT9f5WlhHQ',
              'permissions': {
                'read': [
                  'group:vvA2LyEW'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-04-11T17:11:46.799727+00:00',
              'group': 'vvA2LyEW',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[19]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'startContainer': '/html[1]/body[1]/div[19]/div[2]/div[5]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[1]',
                      'type': 'RangeSelector',
                      'startOffset': 1106,
                      'endOffset': 1134
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 132068,
                      'start': 132040
                    },
                    {
                      'exact': 'for $mes in $calendar//month',
                      'prefix': 'nish></month>\n    </calendar>)\n\n',
                      'type': 'TextQuoteSelector',
                      'suffix': '\nreturn\nelement{ data($mes/spani'
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/amFC9j2rEeiPvZtd1ew4bQ',
                'html': 'https://hypothes.is/a/amFC9j2rEeiPvZtd1ew4bQ',
                'incontext': 'https://hyp.is/amFC9j2rEeiPvZtd1ew4bQ/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:XQuery 2',
                'exam:mark:100'
              ],
              'text': '',
              'created': '2018-04-11T17:11:46.799727+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': 'amFC9j2rEeiPvZtd1ew4bQ',
              'permissions': {
                'read': [
                  'group:vvA2LyEW'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            },
            {
              'updated': '2018-04-11T16:47:13.115832+00:00',
              'group': 'vvA2LyEW',
              'target': [
                {
                  'source': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
                  'selector': [
                    {
                      'endContainer': '/html[1]/body[1]/div[19]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[3]',
                      'startContainer': '/html[1]/body[1]/div[19]/div[2]/div[4]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/pre[1]/text()[3]',
                      'type': 'RangeSelector',
                      'startOffset': 122,
                      'endOffset': 152
                    },
                    {
                      'type': 'TextPositionSelector',
                      'end': 130786,
                      'start': 130756
                    },
                    {
                      'exact': 'row[expedientprogramyear = $p]',
                      'prefix': "r $i in doc('reports-sim.xml')//",
                      'type': 'TextQuoteSelector',
                      'suffix': '\n\t\t  return\n\t\t  <expedient code='
                    }
                  ]
                }
              ],
              'links': {
                'json': 'https://hypothes.is/api/annotations/_BQX1j2nEeiJaBNFvSciFg',
                'html': 'https://hypothes.is/a/_BQX1j2nEeiJaBNFvSciFg',
                'incontext': 'https://hyp.is/_BQX1j2nEeiJaBNFvSciFg/drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp'
              },
              'tags': [
                'exam:isCriteriaOf:XQuery 1',
                'exam:mark:50'
              ],
              'text': '',
              'created': '2018-04-11T16:47:13.115832+00:00',
              'uri': 'https://drive.google.com/drive/folders/1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp',
              'flagged': false,
              'user_info': {
                'display_name': null
              },
              'user': 'acct:Oscar@hypothes.is',
              'hidden': false,
              'document': {},
              'id': '_BQX1j2nEeiJaBNFvSciFg',
              'permissions': {
                'read': [
                  'group:vvA2LyEW'
                ],
                'admin': [
                  'acct:Oscar@hypothes.is'
                ],
                'update': [
                  'acct:Oscar@hypothes.is'
                ],
                'delete': [
                  'acct:Oscar@hypothes.is'
                ]
              }
            }
          ],
          'total': 13
        }
        // Se filtran las anotaciones para obtener solo las que tienen 2 tags -> "isCriteriaOf" y "mark"
        let anotFiltradas = this.filtrarAnotaciones(usAnor)
        // Se crea una estructura con el nombre del eje, el valor del alumno y el examen
        let preguntasAlumnosRep = this.obtenerPreguntasAlumno(anotFiltradas)
        // Se eliminan los objetos repetidos
        this.preguntasAlumno = this.eliminarPreguntasRepetidas(preguntasAlumnosRep)
        // Se obtienen los grupos del alumno
        this.grupos = this.obtenerGrupos(anotFiltradas)
        // Por cada grupo se obtiene la nota media de la clase en cada pregunta
        let promises = []
        for (let i = 0; i < this.grupos.length; i++) {
          promises.push(new Promise((resolve, reject) => {
            this.obtenerMedias(this.grupos[i], (err, mediasExamen) => {
              if (err) {
                reject(err)
              } else {
                resolve(mediasExamen)
              }
            })
          }))
        }
        // Ejecutamos los promises y refrescamos el gráfico
        Promise.all(promises).then((resolves) => {
          this.medias = _.flatten(resolves)
          // A cada nota del alumno se añade sobre cuanto era esa pregunta para poder calcular los porcentajes
          this.data.push(_.sortBy(this.medias, 'axis'))
          let preguntasAlumnoTotal = this.obtenerPorcentajes()
          this.data.unshift(_.sortBy(preguntasAlumnoTotal, 'axis'))
          // Comprobar que se ha creado el div donde se va a insertar el diagrama
          this.reloadInterval = setInterval(() => { return this.myFunction() }, 3000)
        })
      }
    })
  }

  // Comprueba que se ha creado el div donde se va a insertar el diagrama
  myFunction () {
    if (document.getElementsByClassName('a-gd-x')[0]) {
      clearInterval(this.reloadInterval)
      this.dibujarSpiderChart(this.data)
    }
  }

  // Obtiene las notas medias de cada pregunta de un examen
  obtenerMedias (grupo, callback) {
    // Obtener antaciones de un grupo
    this.retrieveGroupAnnotations(grupo, (err, groupAnnotations) => {
      if (err) {
        // Handle the error
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        // Se filtran las anotaciones para obtener solo las que tienen 2 tags -> "isCriteriaOf" y "mark"
        let anotGrupoFiltradas = _.filter(groupAnnotations, (anotacion) => (Utils.filtradoTags(anotacion.tags)))
        // De cada anotacion se guarda la uri del alumno, la pregunta y la nota
        let preguntasAlumnosGrupoRep = _.map(anotGrupoFiltradas, (anotacion) => ({
          'uri': anotacion.uri,
          'pregunta': anotacion.tags[0].slice(18),
          'nota': parseInt(anotacion.tags[1].slice(10))
        }))
        // Se eliminan los objetos repetidos
        let preguntasAlumnosGrupo = _.uniqBy(preguntasAlumnosGrupoRep, (alumno) => (alumno.uri.concat(alumno.pregunta)))
        // Se obtiene por cada pregunta la media
        let mediaPreguntas = _(preguntasAlumnosGrupo).groupBy('pregunta')
          .map((alumnos, pregunta) => ({
            'axis': pregunta,
            'value': _.sumBy(alumnos, 'nota') / alumnos.length
          })).value()
        // Se obtiene la puntuacion maxima de cada pregunta
        let puntuacionMaxima = this.puntuacionMaximaGrupo(groupAnnotations)
        this.puntuacionMaximaGrupos = _.concat(this.puntuacionMaximaGrupos, puntuacionMaxima)

        // Se asigna como atributo nuevo la puntuacion maxima a las medias de cada preguntas obtenidas previamente
        _.map(mediaPreguntas, function (pregunta) {
          return _.assign(pregunta, _.find(puntuacionMaxima, {
            pregunta: pregunta.axis
          }))
        })
        let mediaPreguntasPorcentajes = _.map(mediaPreguntas, (pregunta) => ({
          'axis': pregunta.axis,
          'value': (pregunta.value / pregunta.puntuacionMayor),
          'maximumValue': pregunta.puntuacionMayor,
          'mark': pregunta.value,
          'group': grupo
        }))
        // Estructura final: Eje (nombre de la pregunta), value (porcentaje sobre 100), maximumValue (valor maximo de la pregunta), mark (nota media de la clase) y group (grupo del examen al que pertenece la pregunta)
        if (_.isFunction(callback)) {
          callback(null, _.orderBy(mediaPreguntasPorcentajes, 'axis'))
        }
      }
    })
  }

  // Obtiene la puntuacion maxima de cada pergunta de un examen
  puntuacionMaximaGrupo (anotacionesGrupo) {
    // Se obtienen las primeras anotaciones del grupo que fueron generados automaticamente
    let criteriosDeRubrica = _.filter(anotacionesGrupo, (value, key) => { return Utils.filtradoTags2(value.tags) })

    // Se agrupan por pregunta y se obtiene el valor maximo de cada una
    let puntuacionMaximaEjercicios = _(criteriosDeRubrica).groupBy((d) => d.tags[1]).map((puntuaciones, pregunta) => ({
      'pregunta': pregunta.slice(18),
      'puntuacionMayor': parseInt(_.maxBy(puntuaciones, (o) => { return parseInt(o.tags[0].slice(10)) }).tags[0].slice(10))
    })).value()

    return puntuacionMaximaEjercicios
  }

  retrieveUserAnnotations (callback) {
    this.hypothesisClientManager.hypothesisClient.searchAnnotations({
      user: 'https%3A%2F%2Fdrive.google.com%2Fdrive%2Ffolders%2F1HsWtAT6SnEUz3ILusI2I95Hkgx5mvolp', // this.loc
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

  retrieveGroupAnnotations (group, callback) {
    this.hypothesisClientManager.hypothesisClient.searchAnnotations({
      group: group,
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

  filtrarAnotaciones (anotaciones) {
    return _.filter(anotaciones.rows, (anotacion) => (Utils.filtradoTags(anotacion.tags)))
  }

  obtenerPreguntasAlumno (anotFiltradas) {
    return _.map(anotFiltradas, (anotacion) => ({
      'axis': anotacion.tags[0].slice(18),
      'value': parseInt(anotacion.tags[1].slice(10)),
      'group': anotacion.group
    }))
  }

  eliminarPreguntasRepetidas (preguntasAlumnosRep) {
    return _.uniqBy(preguntasAlumnosRep, 'axis')
  }

  obtenerGrupos (anotFiltradas) {
    return _(anotFiltradas).map('group').uniq().value()
  }

  obtenerPorcentajes () {
    let puntuacionMaximaGruposCopia = _.clone(this.puntuacionMaximaGrupos)
    let preguntasAlumnoMaximo = _.map(this.preguntasAlumno, function (pregunta) {
      return _.assign(pregunta, _.find(puntuacionMaximaGruposCopia, {
        pregunta: pregunta.axis
      }))
    })
    // Estructura final: Eje (nombre de la pregunta), value (porcentaje sobre 100), maximumValue (valor maximo de la pregunta), mark (nota del alumno) y group (grupo del examen al que pertenece la pregunta)
    let preguntasAlumnoTotal = _.map(preguntasAlumnoMaximo, (pregunta) => ({
      'axis': pregunta.axis,
      'value': (pregunta.value / pregunta.puntuacionMayor),
      'maximumValue': pregunta.puntuacionMayor,
      'mark': pregunta.value,
      'group': pregunta.group
    }))
    return preguntasAlumnoTotal
  }

  // Funcion que dibuja el diagrama
  dibujarSpiderChart (data) {
    let w = 350

    let h = 350

    let colorscale = d3.scale.category10()

    // Titulos de las leyendas
    let mycfg = {
      w: w,
      h: h,
      maxValue: 1,
      levels: 5,
      ExtraWidthX: 300
    }

    d3.select('#chart').remove()
    d3.select('#body').remove()
    d3.select('#divSelect').remove()
    let divGraphic = d3.select('.a-s-Xc-ag-fa-Te').append('div')
      .attr('id', 'divGraphic')
      .style('width', '600px')
      .style('height', '500px')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('z-index', '20000')
      .style('right', '0')
      .style('bottom', '0')
      .style('border', '1px solid #CCCCCC')
    divGraphic.append('div').attr('id', 'divSelect')
    let divGraphicBody = divGraphic.append('div').attr('id', 'body')
    divGraphicBody.append('div').attr('id', 'chart')
    RadarChart.draw('#chart', data, mycfg)

    this.gruposNombreID = _.filter(this.gruposNombreID, (grupo) => (this.grupos.includes(grupo.id)))
    let gruposLista = _.concat(this.gruposNombreID, {'id': 'Total', 'nombre': 'Total'})

    d3.select('#divSelect')
      .append('select')
      .attr('class', 'desplegable')
      .attr('id', 'desplegable')
      .on('change', function (d, i) {
        let grupoSeleccionado = d3.select('#desplegable').node().value // Examen seleccionado

        if (grupoSeleccionado === 'Total') { // Vision general de los examenes
          this.LegendOptions = ['Alumno', 'Media de la clase']
          window.spiderChart.dibujarSpiderChart(window.spiderChart.data)
        } else { // Vision de un examen en concreto
          let notasAlumnoExamen = _.filter(window.spiderChart.data[0], {'group': grupoSeleccionado})
          let notasMediasExamen = _.filter(window.spiderChart.data[1], {'group': grupoSeleccionado})
          let dataGrupo = []
          dataGrupo.push(notasAlumnoExamen)
          dataGrupo.push(notasMediasExamen)
          // Leyenda con las notas medias del alumno y la clase
          let notaAlumno = _.sumBy(notasAlumnoExamen, 'mark')
          let notaClase = _.sumBy(notasMediasExamen, 'mark').toFixed(2)
          let valorExamen = _.sumBy(notasAlumnoExamen, 'maximumValue')
          let porcentajeAlumno = ((notaAlumno / valorExamen) * 100).toFixed(2)
          let porcentajeClase = ((notaClase / valorExamen) * 100).toFixed(2)
          debugger
          let leyendaAlumno = 'Alumno: ' + notaAlumno + '/' + valorExamen + ' (' + porcentajeAlumno + '%)'
          let leyendaGrupo = 'Media de la clase: ' + notaClase + '/' + valorExamen + ' (' + porcentajeClase + '%)'
          this.LegendOptions = [leyendaAlumno, leyendaGrupo]
          window.spiderChart.dibujarSpiderChart(dataGrupo)
          d3.select('#desplegable')
            .property('value', grupoSeleccionado)
        }
      })
      .selectAll('option')
      .data(gruposLista)
      .enter()
      .append('option')
      .attr('value', function (d) { return d.id })
      .text(function (d) { return d.nombre })
    debugger
    d3.select('#desplegable')
      .property('value', 'Total')

    // Crear leyenda

    let svg = d3.select('#body')
      .append('svg')
      .attr('id', 'svg')
      .attr('width', w + 300)
      .attr('height', h)

    // Creael titulo de la leyenda
    svg.append('text')
      .attr('class', 'title')
      .attr('transform', 'translate(90,0)')
      .attr('x', w - 70)
      .attr('y', 10)
      .attr('font-size', '12px')
      .attr('fill', '#404040')
      .text('Resultado del alummo en comparacion con la media de clase')

    let legend = svg.append('g')
      .attr('class', 'legend')
      .attr('height', 100)
      .attr('width', 200)
      .attr('transform', 'translate(150,20)')
    debugger
    legend.selectAll('rect')
      .data(this.LegendOptions)
      .enter()
      .append('rect')
      .attr('x', w - 65)
      .attr('y', function (d, i) { return i * 20 })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function (d, i) { return colorscale(i) })

    legend.selectAll('text')
      .data(this.LegendOptions)
      .enter()
      .append('text')
      .attr('x', w - 52)
      .attr('y', function (d, i) { return i * 20 + 9 })
      .attr('font-size', '11px')
      .attr('fill', '#737373')
      .text(function (d) { return d })
  }
}

window.spiderChart = new SpiderChart()
window.spiderChart.init()
