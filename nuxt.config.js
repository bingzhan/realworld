module.exports = {
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes, resolve) {
      routes.splice(0);
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout'),
          children: [
            {
              path: '/login',
              name: 'login',
              component: resolve(__dirname, 'pages/login')
            },
            {
              path: '/register',
              name: 'register',
              component: resolve(__dirname, 'pages/login')
            },
            {
              path: '',
              name: 'home',
              component: resolve(__dirname, 'pages/home')
            },
            {
              path: '/profile/:username',
              name: 'profile',
              component: resolve(__dirname, 'pages/profile')
            },
            {
              path: '/settings',
              name: 'settings',
              component: resolve(__dirname, 'pages/settings')
            },
            {
              path: '/editor',
              name: 'editor',
              component: resolve(__dirname, 'pages/editArticle')
            },
            {
              path: '/article/:slug',
              name: 'article',
              component: resolve(__dirname, 'pages/article')
            }
          ]
        }
      ])
    }
  },
  plugins: [
    '~/plugins/request.js',
  ]
}