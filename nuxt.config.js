import colors from 'vuetify/es5/util/colors'




const title = 'Visual SQL'
const description = 'Visual SQL is a free online tool for efficient SQL query building. Build SQL queries visually and avoid the inconvenient side of SQL with Visual SQL.'




export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: `${title} | Free Online SQL Tool`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: description },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/polyfill.js' },
    { src: '~/plugins/draggable.js' },
    { src: '~/plugins/monaco.js' },
    { src: '~/plugins/intersection-observer.js' },

    { src: '~/plugins/app/expand-transition/expand-transition.js' },
    { src: '~/plugins/app/utils/global-mixin.js' },
    { src: '~/plugins/app/utils/utils.js' },

    { src: '~/plugins/app/app.js' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: [
    { path: '~/components', pathPrefix: false },
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
    '@nuxtjs/gtm',
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
    icon: {
      fileName: 'pwa-icon.png',
    },
    meta: {
      name: title,
    },
    manifest: {
      name: title,
      short_name: title,
      description: description,
      background_color: '#272727',
    },
  },


  server: {
    host: '0.0.0.0' // default: localhost
  },


  gtm: {
    id: 'GTM-KH4V429'
  },

}
