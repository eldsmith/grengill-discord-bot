import "babel-polyfill"
import Vue from 'vue';
import App from './components/app';
import Vuex from "vuex";
import appStore from './store';

Vue.use(Vuex);

const store = new Vuex.Store(appStore);

new Vue({
    el: "#app",
    store,
    render: h => h(App)
});