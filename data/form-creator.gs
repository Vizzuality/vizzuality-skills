function formCreator() {
  const SECTIONS = {
    core: {
      'Presentational': ['HTML5', 'Semantic HTML', 'CSS3', 'Flexbox', 'Grid', 'Responsive design'],
      'Connections': ['HTTP', 'XHR / AJAX'],
      'Git and repo/packages management': ['Git', 'Monorepo', 'npm / yarn'],
      'Building and automation tools': ['Webpack'],
      'Javascript': ['ES6', 'Patterns',
        'Functional programming', 'Javascript performance',
        'Authentication', 'Promises', 'Service workers'],
      'Front end frameworks / libraries': ['Backbone', 'Angular', 'Angular 2', 'Vue',
        'Typescript'],
      'React': ['Basics', 'Hooks', 'React Performance', 'Code structure'],
      'State management': ['Redux', 'Sagas', 'Recoil/Jotai'],
      'Accessibility and SEO': ['Accessibility', 'SEO']
    },
    specialization: {
      'Quality, testing and best practices': [
        'Code review', 'Debugging', 'TDD', 'Jest', 'Cypress', 'Speed insights',
        'Unit testing', 'Integration testing', 'e2e testing',
        'Documentation', 'Storybook or similar',
        'Maintenance', 'Scalability', 'RSPEC'
      ],
      'Visualization libraries':['D3', 'Recharts', 'Vega'],
      'Map libraries and map-related':
        ['React-simple-maps',
          'Leaflet',
          'Mapbox',
          'Layer Manager',
          'Cartography',
          'ArcGis / Esri',
          'Raster tiles',
          'Vector tiles',
          'Video tiles',
          'Deck.gl'
        ],
        'Animation, 3d, and fancy':[
          'CSS3 - JS animations',
          'React-spring',
          'Framer Motion',
          'WebGL',
          'Luma.gl',
          'Three.js / React three fiber',
          'Canvas',
          'SVG',
          'Unity',
        ],
      Mobile:[
        'Progressive Apps',
        'Service workers',
        'Offline',
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
    integration: {
      Design: ['UX/UI',
        'Interaction',
        'Design communication',
        'Photoshop / Indesign',
        'Sketch',
        '3d design'
      ],
      Devops: ['CI',
        'Docker',
        'Kubernetes',
        'Cloud',
        'AWS',
        'Netlify',
        'Vercel',
        'Lambda functions',
        'Online DB (Fauna)'
      ],
      'Data Science': [
        'Python',
        'Jupyter',
        'Data cleaning / processing',
        'GIS',
        'Carto'
      ],
      'Back end and APIS': [
        'Node',
        'Ruby',
        'Rails',
        'GraphQL',
        'Apollo',
        'REST',
        'Authentication',
        'SQL',
        'Postgres',
        'MongoDB',
        'P2P'
      ],
      'Client interaction and PM': [
        'PM',
        'Client interaction',
        'SCRUM',
        'Agile methodology',
        'Kanban'
      ]
    }
  };

  var form = FormApp.create('Frontend skills v.2')
    .setDescription('Frontend team survey to rate our own skills. Rate your knowledge / performance with some skill from 0-10 and your interest in it')
    .setConfirmationMessage('Thanks for responding!')
    .setAllowResponseEdits(true)

  Object.keys(SECTIONS).forEach(section => {
    var sectionTitle = form.addSectionHeaderItem();
    sectionTitle.setTitle(section.toUpperCase());

    Object.keys(SECTIONS[section]).forEach(category => {
      var categoryTitle = form.addSectionHeaderItem();
      categoryTitle.setTitle(category);

      SECTIONS[section][category].forEach(skill => {
        var itemRating = form.addScaleItem();
        itemRating.setTitle(skill + '| rating').setBounds(1, 10).setRequired(true);

        var item = form.addCheckboxItem();
        item.setTitle(skill + '| interest');
        item.setChoices([
            item.createChoice('Want to learn'),
            item.createChoice('Learning'),
            item.createChoice('Not interested')
        ]).setRequired(true);
      })
    })
  });

  Logger.log('Published URL: ' + form.getPublishedUrl());
  Logger.log('Editor URL: ' + form.getEditUrl());
}