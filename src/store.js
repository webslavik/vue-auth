import Vue from 'vue'
import Vuex from 'vuex'
import axiosAuth from './axios-auth';
import axios from 'axios';

import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null,
  },

  getters: {
    user: (state) => state.user,
    isAuth(state)  {
      return state.idToken !== null;
    }
  },

  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    storeUser(state, user) {
      state.user = user;
    },
    clearAuthData(state) {
      state.idToken = null;
      state.userId = null;
    }
  },

  actions: {
    setLogoutTimer({ commit }, timer) {
      setTimeout(() => {
        commit('clearAuthData');
      }, timer * 1000);
    },

    logout({ commit }) {
      commit('clearAuthData');
      router.replace('/signin');
    },

    signin({ commit, dispatch }, authData) {
      axiosAuth.post('/verifyPassword?key=AIzaSyCIGm9ObhVE48izkeSQ-w26fd72A_iilzU', {
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
          dispatch('setLogoutTimer', res.data.expiresIn);
          router.replace('/dashboard');
        })
        .catch(error => console.log(error))
    },
    signup({ commit, dispatch }, authData) {
      axiosAuth.post('/signupNewUser?key=AIzaSyCIGm9ObhVE48izkeSQ-w26fd72A_iilzU', {
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
          dispatch('setLogoutTimer', res.data.expiresIn);
        })
        .catch(error => console.log(error))
    },
    storeUser({ commit, state }, userData) {
      if (!state.idToken) {
        return;
      }
      axios.post(`/users.json?auth=${state.idToken}`, userData)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    fetchUser({ commit, dispatch, state }, userData) {
      if (!state.idToken) {
        return;
      }
      axios.get(`/users.json?auth=${state.idToken}`)
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
  }
})