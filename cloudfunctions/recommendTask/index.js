// 云函数入口文件
const tcb = require('tcb-admin-node')
const app = tcb.init({
  env: 'happy-writing-env-id'
})
const db = app.database()

exports.main = async (event, context) => {
  const { task_id, state } = event
  try {
    await db
        .collection('task')
        .doc(task_id)
        .update({
          recommend: state,
          recommend_date: new Date()
        })
    return {
      status: 200,
    }
  } catch (e) {
    console.log(e)
    return {
      status: 404
    }
  }
}