import { createRouter, createWebHashHistory } from 'vue-router';
import MainMenu from '@/menus/MainMenu.vue';
import Play from '@/menus/Play.vue';

const routes = [
    { path: '/', component: MainMenu },
    { path: '/play/:fen', component: Play },
];

export default createRouter({
    history: createWebHashHistory(),
    routes,
});
