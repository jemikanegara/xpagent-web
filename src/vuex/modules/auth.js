const state = {
    isAuth: false,
    hasProfile: false
}

const getters = {
    isAuth: state => {
        return state.isAuth
    },
    hasProfile: state => {
        return state.hasProfile
    }
}

const mutations = {
    authCheck: (state, payload) => {
        state.isAuth = payload
    },
    hasProfileCheck: (state, payload) => {
        state.hasProfile = payload
    }
}

const actions = {
    authCheck: ({ commit }, payload) => {
        commit('authCheck', payload)
    },
    hasProfileCheck: ({ commit }, payload) => {
        commit('hasProfileCheck', payload)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}