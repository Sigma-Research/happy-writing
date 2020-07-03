<<<<<<< HEAD
<<<<<<< HEAD
// getTaskList
// Parameters: { operatorID, type }
// Response: list
=======
// 云函数入口文件
>>>>>>> aa22483c931ff35900c8dda4b60e6a59aae7e777
=======
// 云函数入口文件
>>>>>>> aa22483c931ff35900c8dda4b60e6a59aae7e777
const tcb = require('tcb-admin-node')
const app = tcb.init({
    env: 'happy-writing-env-id'
})
const db = app.database()
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> aa22483c931ff35900c8dda4b60e6a59aae7e777
exports.main = async (event, context) => {
    const { operator_id } = event
    try {
        // set attribute
        const submittedList = await db
            .collection('task')
            .where({
                operator_id,
                state: 'submitted'
            })
            .get()
        console.log(submittedList.data)
        const submitted = await Promise.all(
            submittedList.data.map(async (item) => {
                const task_id = item._id
                const { submit_date, state, chapter_index, recommend, user_id, course_id } = item
                // split
                const user = await db
                    .collection('user')
                    .doc(user_id)
                    .get()
                const user_name = user.data[0].nickname
                // split
                const course = await db
                    .collection('course')
                    .doc(course_id)
                    .get()
                const course_title = course.data[0].title
                const chapter_title = course.data[0].chapter[chapter_index].subtitle
                return {
                    task_id,
                    submit_date,
                    user_name,
                    course_title,
                    chapter_title,
                    chapter_index,
                    state,
                    recommend
                }
            })
        )
        const reviewedList = await db
            .collection('task')
            .where({
                operator_id,
                state: 'reviewed'
            })
            .get()
        console.log(reviewedList.data)
        const reviewed = await Promise.all(
            reviewedList.data.map(async (item) => {
                const task_id = item._id
                const { review_date, state, chapter_index, recommend, user_id, course_id } = item
                const user = await db
                    .collection('user')
                    .doc(user_id)
                    .get()
                const user_name = user.data[0].nickname
                const course = await db
                    .collection('course')
                    .doc(course_id)
                    .get()
                const course_title = course.data[0].title
                const chapter_title =course.data[0].chapter[chapter_index].subtitle
                return {
                    task_id,
                    review_date,
                    user_name,
                    course_title,
                    chapter_title,
                    chapter_index,
                    state,
                    recommend
                }
            })
        )
        return {
            status: 200,
            data: {
                submitted,
                reviewed
            }
        }
    } catch (e) {
        console.log(e)
        return {
            status: 404,
            data: null
        }
    }
<<<<<<< HEAD
}
>>>>>>> aa22483c931ff35900c8dda4b60e6a59aae7e777
=======
}
>>>>>>> aa22483c931ff35900c8dda4b60e6a59aae7e777
