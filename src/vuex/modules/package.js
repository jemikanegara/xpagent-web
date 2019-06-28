const state = {
    packages: [],
    filteredPackages: []
}

const getters = {
    packages: state => {
        return state.packages
    },
    filteredPackages: state => {
        return state.filteredPackages
    }
}

const mutations = {
    updatePackages: (state, payload) => {
        state.packages = payload
    },
    filterPackages: (state, payload) => {
        state.filterPackages = payload
    }
}

const actions = {
    updatePackages: ({ commit }, payload) => {
        commit('updatePackages', payload)
    },
    deletePackage: ({ commit }, { packages, id }) => {
        const payload = packages.splice(id, 1)
        commit('updatePackages', payload)
    },
    filterPackages: ({ commit }, payload) => {
        commit('filterPackages', payload)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}