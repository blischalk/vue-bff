import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import store from '../stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
  ]
})

function isRootPath(to) {
  return to.path === '/';
}

function isAuthenticated() {
  return store.state.isAuthenticated;
}

function canUserAccess(to) {
  return isRootPath(to) || isAuthenticated();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function syncLoginState() {
  const response = await fetch("/backend/auth/loggedin");
  const data = await response.json();
  if (data.loggedin) {
    store.commit('login');
  } else {
    store.commit('logout');
  };
}

router.beforeEach(async (to, from) => {
  await syncLoginState();
  const canAccess = canUserAccess(to);
  if (!canAccess) return '/'
})

export default router
