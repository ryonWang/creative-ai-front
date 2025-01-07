import request from '@/utils/request'

// 获取验证码
export function getVerify(data) {
  return request({
    url: '/captcha/get',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 校验验证码
export function checkVerify(data) {
  return request({
    url: '/captcha/check',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}