import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import packages from './modules/package'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        auth: {
            namespaced: true,
            ...auth
        },
        packages: {
            namespaced: true,
            ...packages
        }
    }
})