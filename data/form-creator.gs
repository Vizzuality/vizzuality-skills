function formCreator(){
  const SECTIONS={
    core:{
      'Presentational':['HTML5','Semantic HTML','CSS3','Flexbox','Grid','Responsive design'],
      'Connections':['HTTP','Fetch/Axios/XHR'],
      'Git and repo/packages management':['Git','Monorepo','npm/yarn'],
      'Building and automation tools':['Webpack'],
      'Javascript':['ES6','Patterns',
        'Functional programming','Javascript performance',
      'Authentication','Promises','Service workers'],
      'Front end frameworks/libraries':['Backbone','Angular','Vue','Svelte'],
      'Typescript':['Typescript Basics','Typescript Configuration','Typescript Advanced patterns'],
      'React':['React Basics','Hooks','React Performance','Code structure'],
      'Next.js':['Next.js Basics','Next-Auth','Dynamic content/routing','API'],
      'State management':['Redux','Sagas','Recoil/Jotai','React-query'],
      'Style libraries':['Tailwind'],
      'Accessibility and SEO':['Accessibility','SEO']
    },
    specialization:{
      'Quality,testing and best practices':[
        'Code review','Debugging','TDD','Jest','Cypress','Speed insights',
        'Unit testing','Integration testing','e2e testing',
        'Documentation','Storybook or similar',
        'Maintenance','Scalability','RSPEC'
      ],
      'Visualization libraries':['D3','Recharts','Vega','Visx'],
      'Map libraries and map-related':
      ['React-simple-maps',
        'Leaflet',
        'Mapbox',
        'Layer Manager',
        'Cartography',
        'ArcGis/Esri',
        'Raster tiles',
        'Vector tiles',
        'Video tiles',
        'Deck.gl'
      ],
      'Animation,3d,and fancy':[
        'CSS3-JS animations',
        'React-spring',
        'Framer Motion',
        'WebGL',
        'Luma.gl',
        'Three.js/React three fiber',
        'Canvas',
        'SVG',
        'Unity',
      ],
      Mobile:[
        'Progressive Apps',
        'Service workers',
        'Mobile DB',
        'React Native',
        'Swift',
        'Android',
        'Kotlin'
      ],
      Architecture:['Patterns',
        'Architecture solutions'
      ],
      Performance:['Performance']
    },
    integration:{
      Design:['UX/UI',
        'Interaction',
        'Photoshop/Indesign',
        'Sketch',
        'Figma',
        '3d design'
      ],
      Devops:[
        'Github actions',
        'Docker',
        'Kubernetes',
        'AWS',
        'Netlify',
        'Vercel',
        'Lambda functions',
      ],
      'Data Science':[
        'Python',
        'Jupyter',
        'Data cleaning/processing',
        'GIS',
        'Carto'
      ],
      'Back end and APIS':[
        'Node',
        'Ruby',
        'Rails',
        'REST',
        'GraphQL',
        'Apollo',
        'Authentication',
        'SQL',
        'Postgres',
        'MongoDB',
        'P2P'
      ],
      'Client interaction and PM':[
        'PM',
        'Client interaction',
        'Agile methodology',
      ]
    }
  };

  var form=FormApp.create('Frontend skills v.2')
  .setDescription('Frontend team survey to rate our own skills')
  .setConfirmationMessage('Thanks for responding!')
  .setAllowResponseEdits(true)

  var item=form.addTextItem();
  item.setTitle('Your name').setRequired(true);

  var intro=form.addSectionHeaderItem().setTitle('Instructions').setHelpText(`
    The skills evaluation is based on a 0-4 scale:

    0🤷I've never even heard of it or I'd be uncomfortable working with it!

    1👬I'd be comfortable,but would need support

    2🐢I'd be comfortable alone,but it would take more time

    3🐎I'd be comfortable alone

    4🧙‍♀️I would be able to explain every concept in detail and work in very advanced features

    And an interest rating:

    📚Want to learn/Learning

    ❌Not interested
  `);

  Object.keys(SECTIONS).forEach(section=>{
      form.addPageBreakItem()
      .setTitle(section.toUpperCase());

      Object.keys(SECTIONS[section]).forEach(category=>{
          var categoryTitle=form.addSectionHeaderItem();
          categoryTitle.setTitle(category);

          SECTIONS[section][category].forEach(skill=>{
              var itemRating=form.addScaleItem().setHelpText('0🤷-1👬-2🐢-3🐎-4🧙‍♀️')
              itemRating.setTitle(skill+'|Rating').setBounds(0,4).setRequired(true);

              var item=form.addCheckboxItem();
              item.setTitle(skill+'|Interest');
              item.setChoices([
                  item.createChoice('📚Want to learn/Learning'),
                  item.createChoice('❌Not interested')
              ]);
          })
      })
  });

  Logger.log('Published URL:'+form.getPublishedUrl());
  Logger.log('Editor URL:'+form.getEditUrl());
}