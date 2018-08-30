import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function page(name) {
  try {
    return require(`@/pages/${name}`).default
  } catch (e) {
    console.warn(`cant find page '${name}'`)
    return require(`@/pages/base-default`).default
  }
}

function route(path, file, meta = {}, children = []) {
  return {
    path: path,
    component: page(file),
    meta: meta,
    children: children
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    route('/', 'index'),
    route('/:id', 'single-beer')
  ]
})
