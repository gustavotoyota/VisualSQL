import colors from 'vuetify/es5/util/colors'

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Visual SQL Tool',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    // lib css
    'codemirror/lib/codemirror.css',
    // merge css
    'codemirror/addon/merge/merge.css',
    // theme css
    'codemirror/theme/base16-dark.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/draggable.js',
    '~/plugins/monaco.js',
    { src: '~/plugins/codemirror.js', mode: 'client' },
    '~/plugins/directives.js',
    '~/plugins/vuex.js',
    '~/plugins/app.js',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    '~/components',

    '~/components/MainMenu',

    '~/components/LeftSidebar',
    '~/components/LeftSidebar/ModulesWindow',
    '~/components/LeftSidebar/ModulesWindow/Head',
    '~/components/LeftSidebar/ModulesWindow/Content',
    '~/components/LeftSidebar/DatabaseWindow',
    '~/components/LeftSidebar/DatabaseWindow/Head',
    '~/components/LeftSidebar/DatabaseWindow/Content',

    '~/components/MainContent',
    '~/components/MainContent/TabButtons',
    '~/components/MainContent/TabContents',
    '~/components/MainContent/TabContents/TabContent',
    '~/components/MainContent/TabContents/TabContent/TabDisplay',
    '~/components/MainContent/TabContents/TabContent/TabDisplay/DisplayButtons',
    '~/components/MainContent/TabContents/TabContent/TabDisplay/DisplayButtons/NodeButtons',
    '~/components/MainContent/TabContents/TabContent/TabDisplay/DisplayNodes',
    '~/components/MainContent/TabContents/TabContent/TabDisplay/DisplayNodes/DisplayNode',
    '~/components/MainContent/TabContents/TabContent/TabDisplay/DisplayNodes/DisplayNode/NodeSockets',
    '~/components/MainContent/TabContents/TabContent/TabDisplay/DisplaySVG',

    '~/components/RightSidebar',
  ],

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },


  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },


  pwa: {
    meta: {
      name: 'Visual SQL Tool',
    },
  },


}
