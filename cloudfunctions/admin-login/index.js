// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcb = require('tcb-admin-node')
cloud.init()
const app = tcb.init({
  env: 'happy-writing-env-id',
  credentials: require('./tcb_CustomLoginKeys.json')
})
const db = cloud.database()

exports.main = async (event, context) => {
  const data = JSON.parse(event.body)
  const admin_id = data.adminId
  const admin_pwd = data.adminPwd
  let ticket, state
  await db.collection('t_admin').where({
    admin_id,
    admin_pwd
  }).get().then(async res => {
    ticket = await app.auth().createTicket(admin_id, {
      refresh: 60 * 60 * 1000 // 每一小时刷新一次登录态
    })
    state = {
      log: '登录成功',
      data: {}
    }
  }, error => {
    state = {
      log: '登录失败',
      data: error
    }
  })
  return {ticket, state}
}
