// getTaskDetail
// Parameters: { taskID }
// Response: { studentName, courseTitle, state, chapterTitle, homeworkContent, reviewData, recommend, homeworkImageURL}
const tcb = require('tcb-admin-node')
const app = tcb.init({
  env: 'happy-writing-env-id'
})
const db = app.database()

exports.main = async (event, context) => {
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
