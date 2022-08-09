import { getToken, setToken, removeToken, settimeKey } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router/index'
const state = {
  token: getToken(), // 初始时把cookie里面的token拿出来
  userInfo: {}
}

const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 移除token
  removeToken(state) {
    state.token = null
    removeToken(null)
  },
  //
  setuserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 移除userInfo
  removeuserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  async login(context, data) {
    const res = await login(data)
    // console.log(res)
    // 设置token获取的开始时间
    settimeKey()
    context.commit('setToken', res)
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    console.log(res)
    const avator = await getUserDetailById(res.userId)
    context.commit('setuserInfo', { ...res, ...avator })
    return {
      ...res,
      ...avator
    }
  },
  logOut(context) {
    context.commit('removeToken')
    context.commit('removeuserInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
