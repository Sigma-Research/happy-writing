// 云函数入口文件
const tcb = require('tcb-admin-node')
const app = tcb.init({
  env: 'happy-writing-env-id'
})
const db = app.database()

exports.main = async (event, context) => {
  const { task_id } = event
  try {
    const task = await db
        .collection('task')
        .doc(task_id)
        .get()
    const taskDetail = task.data[0]
    const { chapter_index, review_data, state, recommend, homework_image, user_id, course_id} = taskDetail
    try {
      const user = await db
          .collection('user')
          .doc(user_id)
          .get()
      const user_name = user.data[0].nickname
      try {
        const course = await db
            .collection('course')
            .doc(course_id)
            .get()
        const courseData = course.data[0]
        const course_title = courseData.title
        const chapter_title = courseData.chapter[chapter_index].subtitle
        const homework_content = courseData.chapter[chapter_index].content
        return {
          status: 200,
          data: {
            task_id,
            user_name,
            course_title,
            chapter_title,
            chapter_index,
            state,
            homework_content,
            review_data,
            recommend,
            homework_image
          }
        }
      } catch (e) {
        console.log(e)
        return {
          status: 404,
          data: null
        }
      }
    } catch (e) {
      console.log(e)
      return {
        status: 404,
        data: null
      }
    }
  } catch (e) {
    console.log(e)
    return {
    }
  }
}