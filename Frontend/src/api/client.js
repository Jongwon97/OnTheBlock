import axios from 'axios'
// import * as utils from 'utils'
// import * as hooks from 'hooks'

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND + 'ontheblock/api'
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

const readAccessToken = () => {
    const accessToken = localStorage.getItem("accessToken")
    return accessToken === null ? "" : accessToken
}

const readRefreshToken = () => {
    const refreshToken = localStorage.getItem("refreshToken")
    return refreshToken === null ? "" : refreshToken
}
  
  
const success = (response) => {return response}
const failure = async (error) => {
    // if access token is NOT valid
    if (error.response?.status === 401) {
      const config = error.config
      if (config === undefined) return
      // send refresh token in header to get new one
      return await axios.get("jwt/reissue", {headers:{"refreshToken":readRefreshToken()}})
        // if refresh token is valid
        .then(async (response) => {
          // save new tokens
          localStorage.setItem("accessToken", response.data.accessToken)
          localStorage.setItem("refreshToken", response.data.refreshToken)
          // do original work
          config.headers["accessToken"] = readAccessToken()
          return await axios(config)
        })
        // if refresh token is NOT valid
        .catch((error) => {
          alert("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.")
          // delete all tokens
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          // go to main page
          window.location.href = '/' 
          return Promise.reject(error)
        })
    } else {
      return Promise.reject(error)
    }
}
  
export const client = () => {
  const instance =  axios.create();
  instance.interceptors.response.use(success, failure)
  return instance
}
  

export const clientWithToken = () => {
  const instance = axios.create({
    headers: {
      "Content-type": 'application/json; charset=UTF-8',
      "accessToken": readAccessToken(),
    }
  })
  instance.interceptors.response.use(success, failure)
  return instance
}


export const clientWithTokenAndMedia = () => {
  const instance = axios.create({
    headers: {
      "accessToken": readAccessToken(),
    },
  });
  instance.interceptors.response.use(success, failure);
  return instance;
};