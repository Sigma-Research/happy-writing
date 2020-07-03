<<<<<<< HEAD
// getTaskDetail
// Parameters: { taskID }
// Response: { studentName, courseTitle, state, chapterTitle, homeworkContent, reviewData, recommend, homeworkImageURL}
=======
// 云函数入口文件
>>>>>>> aa22483c931ff35900c8dda4b60e6a59aae7e777
const tcb = require('tcb-admin-node')
const app = tcb.init({
  env: 'happy-writing-env-id'
})
const db = app.database()

exports.main = async (event, context) => {
<<<<<<< HEAD
  const { taskID } = event
  const getTaskResult = await db
      .collection('task')
      .doc(taskID)
      .get()
  const taskData = getTaskResult.data[0]
  const getUserResult = await db
        .collection('user')
        .doc(taskData.user_id)
        .get()
  const getCourseResult = await db
     .collection('course')
     .doc(taskData.course_id)
     .get()
  const getHomeworkImageResult = await app
     .getTempFileURL({
       fileList: [taskData.homework_image]
     })
  const courseData = getCourseResult.data[0]
  const chapterData = courseData.chapter[taskData.chapter_index]
  return {
    studentName: getUserResult.data[0].nickname,
    courseTitle: courseData.title,
    state: taskData.state,
    chapterTitle: chapterData.subtitle,
    homeworkContent: chapterData.content,
    reviewData: taskData.review_data,
    recommend: taskData.recommend,
    homeworkImageURL: getHomeworkImageResult.fileList[0].tempFileURL
  }
}
=======
  const { task_id } = event
  try {
    // delete try
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
>>>>>>> aa22483c931ff35900c8dda4b60e6a59aae7e777
