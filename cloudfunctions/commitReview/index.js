// 云函数入口文件
const tcb = require('tcb-admin-node')
const app = tcb.init({
  env: 'happy-writing-env-id'
})
const db = app.database()

exports.main = async (event, context) => {
    const { task_id, type, data } = event
    const state = type === 'finish' ? 'reviewed' : 'submitted'
    const review_date = type === 'finish' ? new Date() : null
    const viewed = !(type === 'finish')
    console.log(data, state, review_date, viewed)
    try {
        const res = await db
            .collection('task')
            .doc(task_id)
            .update({
                review_data: data,
                state: state,
                review_date: review_date,
                viewed: viewed
            })
        console.log(res)
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