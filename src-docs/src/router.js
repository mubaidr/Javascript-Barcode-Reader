import Vue from 'vue'
import Router from 'vue-router'
import GettingStarted from './views/GettingStarted.vue'
import Home from './views/Home.vue'
import Samples from './views/Samples.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/getting-started',
      name: 'getting-started',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: GettingStarted,
    },
    {
      path: '/samples',
      name: 'samples',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Samples,
    },
    {
      path: '*',
      redirect: '/home',
    },
  ],
})
