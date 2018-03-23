import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth';
import globalAxios from './main';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null,
  },
  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    storeUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    signin({ commit }, authData) {
      axios.post('/verifyPassword?key=AIzaSyCIGm9ObhVE48izkeSQ-w26fd72A_iilzU', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true,
      })
        .then(res => {
          console.log(res);
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId,
          });
        })
        .catch(error => console.log(error))
    },
    signup({ commit, dispatch }, authData) {
      axios.post('/signupNewUser?key=AIzaSyCIGm9ObhVE48izkeSQ-w26fd72A_iilzU', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true,
      })
        .then(res => {
          console.log(res);
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId,
          });
          dispatch('storeUser', authData);
        })
        .catch(error => console.log(error))
    },
    storeUser({ commit }, userData) {
      console.log('Store user', userData);
      globalAxios.post('/users.json', userData)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    fetchUser({ commit, dispatch }, userData) {
      globalAxios.post('/users.json', userData)
        .then(res => {
          console.log(res)
          const data = res.data
          const users = []
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }
          console.log(users)
          this.email = users[0].email;

          commit('storeUser', users[0]);
        })
        .catch(error => console.log(error))
    }
  },
  getters: {
    user: (state) => state.user,
  }
})