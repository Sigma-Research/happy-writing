// custom login
// Parameters: { accountID, password }
// Response: { ticket, operatorID }
const cloud = require('wx-server-sdk')
const tcb = require('tcb-admin-node')
cloud.init()
const app = tcb.init({
  env: 'happy-writing-env-id',
  credentials: require('./tcb_CustomLoginKeys.json')
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { accountID, password } = JSON.parse(event.body)
  const getUser = await db.collection('operator').where({ accountID, password }).get()
  console.log(getUser)
  const operatorID = getUser.data[0]._id
  const ticket = getUser ? app.auth().createTicket(operatorID, {
    refresh: 60 * 60 * 1000
  }) : null
  return { ticket, operatorID }
}
