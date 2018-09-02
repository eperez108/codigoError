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
    this.maximumValueGroups = []
    this.groups = []
    this.studentQuestions = []
    this.anotaciones = []
    this.anotFiltradas = []
    this.groupsNameID = []
    this.LegendOptions = ['Student', 'Class average']
    this.reloadInterval = {}
    this.loc = document.location.href
    this.intervalLeaveURL = []
    this.intervalURL = []
    this.hypothesisClientManager = {}
  }

  init () {
    this.hypothesisClientManager.hypothesisClient = new HypothesisClient('6879-Q--ve1yLCItODnHueg4py6UT-qqq93bk-xgvra0-BVA')
    // Check if it is a folder
    if (this.loc.includes('https://drive.google.com/drive/folders/')) {
      // Check if the folder belongs to a student
      // esAlumno(loc);
      // Create the spider chart
      this.createSpiderChart()
      this.intervalLeaveURL = setInterval(() => this.checkLeaveURL(this.loc), 2000)
    } else {
      // Otherwise check if the URL has changed
      this.intervalURL = setInterval(() => this.checkURL(), 2000)
    }
  }

  // Function that checks if the URL has changed
  checkURL () {
    let currentLoc = document.location.href
    // If the location has chenged, check if its a folder which belongs to a student
    if (this.loc !== currentLoc) {
      if (currentLoc.includes('https://drive.google.com/drive/folders/')) {
        // this.esAlumno(loc)
        this.loc = currentLoc
        clearInterval(this.intervalURL)
        // Check if the user leaves the folder
        this.intervalLeaveURL = setInterval(() => this.checkLeaveURL(currentLoc), 2000)
        // Create the spider chart
        this.createSpiderChart()
      }
      // Update the location
      this.loc = currentLoc
    }
  }

  // Funcion that checks if the user leaves the folder
  checkLeaveURL (folderURL) {
    let currentLoc = document.location.href
    if (folderURL !== currentLoc) {
      d3.select('#divGraphic').remove()
      clearInterval(this.intervalLeaveURL)
      this.intervalURL = setInterval(() => this.checkURL(), 2000)
    }
  }

  // Function that creates the spider chart
  createSpiderChart () {
    // Retrieve the user groups
    this.retrieveGroups((err, groups) => {
      if (err) {
      // Handle error
      } else {
        // Filter the retrieved groups to obtain only the ID and the name of each one
        this.groupsNameID = _.map(groups, (group) => ({
          'id': group.id,
          'nombre': group.name
        }))
      }
    })
    // Retrieve current user annotations
    this.retrieveUserAnnotations((err, userAnnotations) => {
      if (err) {

      } else {
        this.data = []
        let userAnot = {
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
        // Filter annotations to get only those with 2 tags -> "isCriteriaOf" and "mark"
        let filteredAnnotations = this.filterAnnotations(userAnot)
        // Create a structure with the name of the axis that corresponds to the question, the value that corresponds the mark and the exam
        let studentQuestionsRep = this.obtainStudentQuestions(filteredAnnotations)
        // Filter the previously obtained list to eliminate the repeated objects
        this.studentQuestions = this.deleteRepeatedQuestions(studentQuestionsRep)
        // The groups to which the student belongs are obtained
        this.groups = this.obtainGroups(filteredAnnotations)
        // For each group, it gets the average grades of the class in each question
        let promises = []
        for (let i = 0; i < this.groups.length; i++) {
          promises.push(new Promise((resolve, reject) => {
            this.obtainAverageGrades(this.groups[i], (err, examAverageGrades) => {
              if (err) {
                reject(err)
              } else {
                resolve(examAverageGrades)
              }
            })
          }))
        }
        Promise.all(promises).then((resolves) => {
          let examAverageGrades = _.flatten(resolves)
          // To each mark of the student, the maximum possible mark for that question is added to calculate the percentages
          this.data.push(_.sortBy(examAverageGrades, 'axis'))
          let totalStudentQuestions = this.obtainPorcentages()
          this.data.unshift(_.sortBy(totalStudentQuestions, 'axis'))
          // Check that the div where the diagram is going to be inserted is created
          this.reloadInterval = setInterval(() => { return this.divIsReady() }, 3000)
        })
      }
    })
  }

  // function to check that the div where the diagram is going to be inserted is created
  divIsReady () {
    if (document.getElementsByClassName('a-gd-x')[0]) {
      clearInterval(this.reloadInterval)
      this.drawSpiderChart(this.data, this.LegendOptions)
    }
  }

  // Obtain the average grades of each question of an exam
  obtainAverageGrades (group, callback) {
    // Obtain annotations of a group
    this.retrieveGroupAnnotations(group, (err, groupAnnotations) => {
      if (err) {
        // Handle the error
        if (_.isFunction(callback)) {
          callback(err)
        }
      } else {
        // Filter annotations to get only those with 2 tags -> "isCriteriaOf" and "mark"
        let groupFilteredAnnotations = _.filter(groupAnnotations, (annotation) => (Utils.filterTags(annotation.tags)))
        // For each annotation the student's uri, the question and the mark are saved
        let studentsQuestionsGroupRep = _.map(groupFilteredAnnotations, (annotation) => ({
          'uri': annotation.uri,
          'pregunta': annotation.tags[0].slice(18),
          'nota': parseInt(annotation.tags[1].slice(10))
        }))
        // Repeated objects are deleted
        let studentsQuestionsGroup = _.uniqBy(studentsQuestionsGroupRep, (student) => (student.uri.concat(student.pregunta)))
        // The average mark is obtained for each question
        let averageGradeQuestions = _(studentsQuestionsGroup).groupBy('pregunta')
          .map((students, question) => ({
            'axis': question,
            'value': _.sumBy(students, 'nota') / students.length
          })).value()
        // The maximum value of each question is obtained
        let maximumValue = this.maximumValueGroup(groupAnnotations)
        this.maximumValueGroups = _.concat(this.maximumValueGroups, maximumValue)
        // The maximum value is assigned as a new attribute to each question of averageGradeQuestions
        _.map(averageGradeQuestions, function (question) {
          return _.assign(question, _.find(maximumValue, {
            pregunta: question.axis
          }))
        })
        let averageGradesQuestionsWithPorcentages = _.map(averageGradeQuestions, (question) => ({
          'axis': question.axis,
          'value': (question.value / question.puntuacionMayor),
          'maximumValue': question.puntuacionMayor,
          'mark': question.value,
          'group': group
        }))
        // Final structure: Axis (name of the question), value (percentage), maximumValue (maximum value of the question),
        // mark (average grade of the class) and group (group of exam the question belongs)
        if (_.isFunction(callback)) {
          callback(null, _.orderBy(averageGradesQuestionsWithPorcentages, 'axis'))
        }
      }
    })
  }

  // Get the maximum score of each question of an exam
  maximumValueGroup (groupAnnotations) {
    // The first annotations of the group that were generated automatically are obtained
    let rubric = _.filter(groupAnnotations, (value, key) => { return Utils.filterTags2(value.tags) })

    // They are grouped by question and the maximum value of each one is obtained
    let questionsMaximumValue = _(rubric).groupBy((d) => d.tags[1]).map((values, question) => ({
      'pregunta': question.slice(18),
      'puntuacionMayor': parseInt(_.maxBy(values, (o) => { return parseInt(o.tags[0].slice(10)) }).tags[0].slice(10))
    })).value()

    return questionsMaximumValue
  }

  // Function to retrieve user annotations
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

  // Function to retrieve user groups annotations
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

  // Function to retrieve user groups
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

  // Function that filters annotations to get only those with 2 tags -> "isCriteriaOf" and "mark"
  filterAnnotations (annotations) {
    return _.filter(annotations.rows, (annotation) => (Utils.filterTags(annotation.tags)))
  }

  // Funtion that creates a structure with the name of the axis that corresponds to the question, the value that corresponds the mark and the exam
  obtainStudentQuestions (annotations) {
    return _.map(annotations, (annotation) => ({
      'axis': annotation.tags[0].slice(18),
      'value': parseInt(annotation.tags[1].slice(10)),
      'group': annotation.group
    }))
  }

  // Function to delete the repeated objects of a list
  deleteRepeatedQuestions (studentQuestionsRep) {
    return _.uniqBy(studentQuestionsRep, 'axis')
  }

  // Function that obtains the groups to which the student belongs
  obtainGroups (annotations) {
    return _(annotations).map('group').uniq().value()
  }

  // Tor each mark of the student, the maximum possible mark for that question is added to calculate the percentages
  obtainPorcentages () {
    let maximumValueGroupsCopy = _.clone(this.maximumValueGroups)
    let studentQuestionsMaximum = _.map(this.studentQuestions, function (pregunta) {
      return _.assign(pregunta, _.find(maximumValueGroupsCopy, {
        pregunta: pregunta.axis
      }))
    })
    // Final structure: Axis (name of the question), value (percentage), maximumValue (maximum value of the question),
    // mark (average grade of the student) and group (group of exam the question belongs)
    let studentQuestionsTotal = _.map(studentQuestionsMaximum, (question) => ({
      'axis': question.axis,
      'value': (question.value / question.puntuacionMayor),
      'maximumValue': question.puntuacionMayor,
      'mark': question.value,
      'group': question.group
    }))
    return studentQuestionsTotal
  }

  // Function to draw the spider chart
  drawSpiderChart (data, leyenda) {
    let w = 350

    let h = 350

    let colorscale = d3.scale.category10()

    // Legend titles
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
    d3.select('#divGraphic').remove()
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

    this.groupsNameID = _.filter(this.groupsNameID, (group) => (this.groups.includes(group.id)))
    let listGroups = _.concat(this.groupsNameID, {'id': 'Total', 'nombre': 'Total'})

    d3.select('#divSelect')
      .append('select')
      .attr('class', 'desplegable')
      .attr('id', 'desplegable')
      .on('change', function (d, i) {
        let selectedExam = d3.select('#desplegable').node().value // Selected exam
        if (selectedExam === 'Total') { // Overview of exams
          this.LegendOptions = ['Student', 'Class average']
          window.spiderChart.drawSpiderChart(window.spiderChart.data, this.LegendOptions)
        } else { // View of a concrete exam
          let studentExamMarks = _.filter(window.spiderChart.data[0], {'group': selectedExam})
          let averageExamMarks = _.filter(window.spiderChart.data[1], {'group': selectedExam})
          let dataGroup = []
          dataGroup.push(studentExamMarks)
          dataGroup.push(averageExamMarks)
          // Legend with the average grades of the student and the class
          let studentMark = _.sumBy(studentExamMarks, 'mark')
          let classMark = _.sumBy(averageExamMarks, 'mark').toFixed(2)
          let examValue = _.sumBy(studentExamMarks, 'maximumValue')
          let studentPorcentage = ((studentMark / examValue) * 100).toFixed(2)
          let classPorcentage = ((classMark / examValue) * 100).toFixed(2)
          let studentLegend = 'Student: ' + studentMark + '/' + examValue + ' (' + studentPorcentage + '%)'
          let classLegend = 'Class average: ' + classMark + '/' + examValue + ' (' + classPorcentage + '%)'
          this.LegendOptions = [studentLegend, classLegend]
          window.spiderChart.drawSpiderChart(dataGroup, this.LegendOptions)
          d3.select('#desplegable')
            .property('value', selectedExam)
        }
      })
      .selectAll('option')
      .data(listGroups)
      .enter()
      .append('option')
      .attr('value', function (d) { return d.id })
      .text(function (d) { return d.nombre })

    d3.select('#desplegable')
      .property('value', 'Total')

    // Create legend
    let svg = d3.select('#body')
      .append('svg')
      .attr('id', 'svg')
      .attr('width', w + 300)
      .attr('height', h)

    // Create the legend title
    svg.append('text')
      .attr('class', 'title')
      .attr('transform', 'translate(70,0)')
      .attr('x', w - 70)
      .attr('y', 10)
      .attr('font-size', '12px')
      .attr('fill', '#404040')
      .text('Student results compared to the class average')

    let legend = svg.append('g')
      .attr('class', 'legend')
      .attr('height', 100)
      .attr('width', 200)
      .attr('transform', 'translate(120,20)')

    legend.selectAll('rect')
      .data(leyenda)
      .enter()
      .append('rect')
      .attr('x', w - 65)
      .attr('y', function (d, i) { return i * 20 })
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function (d, i) { return colorscale(i) })

    legend.selectAll('text')
      .data(leyenda)
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
