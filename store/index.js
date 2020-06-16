/* import jwtDecode from 'jwt-decode'
import {
  setToken,
  unsetToken
} from '../utils/authentication'
import AssertAlive from '../mixins/assertAlive'
 */
// const URLSearchParams = require('url').URLSearchParams
const qs = require('querystring')

function myCopy(o) {
  let v, key
  const output = Array.isArray(o) ? [] : {}

  for (key in o) {
    v = o[key]
    if (v) {
      output[key] = (typeof v === 'object') ? myCopy(v) : v
    } else {
      output[key] = v
    }
  }
  return output
}

const asyncLocalStorage = {
  setItem: function (key, value) {
    return Promise.resolve().then(function () {
      localStorage.setItem(key, value)
    })
  },
  getItem: function (key) {
    return Promise.resolve().then(function () {
      return localStorage.getItem(key)
    })
  }
}

export default {
  // =================================================
  // State
  // =================================================
  state: () => {
    const state = {
      todos: []
    }
    return state
  },

  // =================================================
  // Actions
  // =================================================

  actions: {
    nuxtServerInit({
      commit
    }, {
      req
    }) {
      if (req.headers.cookie) {
        const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
        if (!jwtCookie) return null
        const jwt = jwtCookie.split('=')[1]
        commit('SET_TOKEN', jwt)
      }
    },
    /*
      ##### LOGIN LOGOUT / AUTH
    */
    login({
      commit
    }, data) {
      const vm = this
      commit('CHANGE_LOADING', true)
      return new Promise((resolve, reject) => {
        vm.$axios({
          method: 'post',
          url: '/api/member/login',
          // url: '/process',
          data: data,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        }).then(function (r) {
          if (r.data.code === 200) {
            setToken(r.data.data.token, jwtDecode(r.data.data.token).foto)
            commit('SET_TOKEN', r.data.data.token)
          } else {
            unsetToken()
            commit('SET_TOKEN', null)
          }
          commit('CHANGE_LOADING', false)
          resolve(r)
        }).catch(function (e) {
          unsetToken()
          commit('SET_TOKEN', null)
          commit('CHANGE_LOADING', false)
          reject(e)
        })
      })
    },
    logoutMethod({
      commit
    }) {
      return new Promise((resolve) => {
        unsetToken()
        commit('SET_TOKEN', null)
        resolve(true)
      })
    },
    simpleSignUp({
      commit
    }, data) {
      // {{base_url}}/member/register
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$axios({
          method: 'post',
          url: '/api/member/register',
          data: data,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        }).then(function (r) {
          if (r.data.code === 200) {
            setToken(r.data.data.token)
            commit('SET_TOKEN', r.data.data.token)
          } else {
            unsetToken()
            commit('SET_TOKEN', null)
          }
          resolve(r)
        }).catch(function (e) {
          reject(e)
        })
      })
    },
    verify_email({
      commit
    }, data) {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$axios({
          method: 'post',
          url: '/api/member/email/verification',
          data: data,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        }).then(function (r) {
          if (r.data.code === 200) {
            setToken(r.data.data.token)
            commit('SET_TOKEN', r.data.data.token)
          } else {
            unsetToken()
            commit('SET_TOKEN', null)
          }
          resolve(r)
        }).catch(function (e) {
          reject(e)
        })
      })
    },

    /* OPEN PUBLIC API */
    getTodos() {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$axios({
          method: 'post',
          url: '/getTodos',
          config: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        }).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    saveTodos({
      commit
    }, data) {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$axios({
          method: 'POST',
          url: '/saveTodos',
          data: data,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        }).then(function (r) {
          resolve(r)
        }).catch(function (e) {
          reject(e)
        })
      })
    },
    updateTodos({
      commit
    }, data) {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$axios({
          method: 'POST',
          url: '/updateTodos',
          data: data,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        }).then(function (r) {
          resolve(r)
        }).catch(function (e) {
          reject(e)
        })
      })
    },
    delTodos({
      commit
    }, data) {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$axios({
          method: 'POST',
          url: '/delTodos',
          data: data,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        }).then(function (r) {
          resolve(r)
        }).catch(function (e) {
          reject(e)
        })
      })
    },
  },
  // =================================================
  // Getters
  // =================================================

  getters: {
    todosGetters(state) {
      return state.todos
    },
    isAuthenticated(state) {
      if (!state.token) return false
      const alive = AssertAlive.AssertAlive(jwtDecode(state.token))
      // return alive.code === 200
      return alive.code
    },
    Token(state) {
      return state.token || null
    },
    loggedUser(state) {
      if (!state.token) return null
      // return state.token
      return jwtDecode(state.token)
    },
    fullMember(state) {
      if (!state.token) return 1
      return parseInt(jwtDecode(state.token).status)
    },
    cart2Getter(state) {
      return state.cart2
    },
  },
  // =================================================
  // Mutations
  // =================================================
  mutations: {
    todosMutation(state, stat) {
      state.todos = stat
    }
  }
}
