import Cookies from 'js-cookie'

// cookie
// 怎么操作cookie
// 借助第三方库（js-cookie），原生的cookie接口操作太麻烦
const TokenKey = 'hesass_token'
const timeKey = 'time_key'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function gettimeKey() {
  return Cookies.get(timeKey)
}

export function settimeKey() {
  return Cookies.set(timeKey, Date.now())
}
