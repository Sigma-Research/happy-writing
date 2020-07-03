// getTaskList
// Parameters: { operatorID, type }
// Response: list
const tcb = require('tcb-admin-node')
const app = tcb.init({
    env: 'happy-writing-env-id'
})
const db = app.database()
const formatDate = (date) => {
   return new Date(date).toLocaleDateString('as-CH', 'Asia/Shanghai')
}
exports.main = async (event, context) => {
   const { operatorID, type } = event
   const userLookupData = {
      from: 'user',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user_data'
   }
   const courseLookupData = {
      from: 'course',
      localField: 'course_id',
      foreignField: '_id',
      as: 'course_data'
   }
   const res = await db
      .collection('task')
      .aggregate()
      .lookup(userLookupData)
      .lookup(courseLookupData)
      .end()
   const list = res.data.filter(item => {
      return item.state === type && item.operator_id === operatorID
   }).map(item => {
      const courseData = item.course_data[0]
      return {
         id: item._id,
         recommend: item.recommend,
         submitDate: formatDate(item.submit_date),
         reivewDate: formatDate(item.review_date),
         userName: item.user_data[0].nickname,
         courseTitle: courseData.title,
         courseSubtitle: courseData.chapter[item.chapter_index].subtitle
      }
   })
   return list
}
