const express = require("express");
const tokenMiddleware = require("./../middleware/tokenMiddleware");
const router = express.Router();
const baseUrl = require("./../controllers/api/baseUrl");
//base url
router.get("/", baseUrl);

var AdminLogin = require("./../controllers/admin/auth/login");
router.post("/admin/login", AdminLogin);

var EditAdminDetails = require("./../controllers/admin/auth/edit_admin_profile");
router.post("/admin/edit-admin-details", tokenMiddleware, EditAdminDetails);

var ChangePassword = require("./../controllers/admin/auth/change_password");
router.post("/admin/change-password", tokenMiddleware, ChangePassword);

var ForgotPassword = require("./../controllers/admin/auth/forgot_password");
router.post("/admin/forgot-password", ForgotPassword);

// Dashboard
var DashboardData = require("./../controllers/admin/dashboard/dashboard_data");
router.get("/admin/dashboard-data", tokenMiddleware, DashboardData);

// Users customer and counslor.
var UsersList = require("./../controllers/admin/users/user_list");
router.post("/admin/users-list", tokenMiddleware, UsersList);

var UserDetails = require("./../controllers/admin/users/user_details");
router.post("/admin/user-details", tokenMiddleware, UserDetails);

var TherapistList = require("./../controllers/admin/users/therapist_list");
router.post("/admin/therapist-list", tokenMiddleware, TherapistList);

var TherapistProfileStatus = require("./../controllers/admin/users/therapist_profile_status");
router.get("/admin/therapist-profile-status", tokenMiddleware, TherapistProfileStatus);

var SendEmail = require("./../controllers/admin/users/send_email_to_user");
router.post("/admin/send-email", tokenMiddleware, SendEmail);

var ReviewRating = require("./../controllers/admin/users/review_rating");
router.get("/admin/get-reviews-ratings", tokenMiddleware, ReviewRating);

var DeleteUser = require("./../controllers/admin/users/delete_user");
router.post("/admin/delete-user", tokenMiddleware, DeleteUser);

// Questions.
var QuestionsList = require("./../controllers/admin/questions/questions_list");
router.get("/admin/questions-list", tokenMiddleware, QuestionsList);

var GetQuestion = require("./../controllers/admin/questions/get_question");
router.get("/admin/get-question", tokenMiddleware, GetQuestion);

var AddQuestion = require("./../controllers/admin/questions/add_question");
router.post("/admin/add-question", tokenMiddleware, AddQuestion);

var EditQuestion = require("./../controllers/admin/questions/edit_question");
router.post("/admin/edit-question", tokenMiddleware, EditQuestion);

var DeleteQuestion = require("./../controllers/admin/questions/delete_question");
router.post("/admin/delete-question", tokenMiddleware, DeleteQuestion);

// Promo Code.
var PromoCodeList = require("./../controllers/admin/promo_code/promo_code_list");
router.get("/admin/promo-code-list", tokenMiddleware, PromoCodeList);

var AddPromoCode = require("./../controllers/admin/promo_code/add_promo_code");
router.post("/admin/add-promo-code", tokenMiddleware, AddPromoCode);

// Booking.
var BookingList = require("./../controllers/admin/booking/booking_list");
router.get("/admin/booking-list", tokenMiddleware, BookingList);

var BookingDetail = require("./../controllers/admin/booking/booking_details");
router.get("/admin/booking-detail", tokenMiddleware, BookingDetail);

var weekSchedule = require("./../controllers/admin/booking/weekSchedule");
router.post("/admin/therapist-week-schedule", tokenMiddleware, weekSchedule);

var allBookings = require("./../controllers/admin/booking/all_booking_list");
router.get("/admin/all-booking-list", tokenMiddleware, allBookings);

// Notification.
var NotificationList = require("./../controllers/admin/notification/notification_list");
router.get("/admin/notification-list", tokenMiddleware, NotificationList);

var DeleteNotification = require("./../controllers/admin/notification/delete_notification");
router.post("/admin/delete-notification", tokenMiddleware, DeleteNotification);

var SendNotification = require("./../controllers/admin/notification/send_notification");
router.post("/admin/send-notification", tokenMiddleware, SendNotification);

var NotificationUsers = require("./../controllers/admin/notification/all_users");
router.get("/admin/all-users-list", tokenMiddleware, NotificationUsers);

// Transactions.
var TransactionsList = require("./../controllers/admin/transactions/transactions-list");
router.get("/admin/transactions-list", tokenMiddleware, TransactionsList);

// Video Plans
// var VideoPlansList = require("./../controllers/admin/video_plans/video_plans_list");
// router.get("/admin/video-plans-list", tokenMiddleware, VideoPlansList);

var GetVideoPlan = require("./../controllers/admin/video_plans/get_video_plan_details");
router.get("/admin/get-video-plan-details", tokenMiddleware, GetVideoPlan);

// var AddVideoPlan = require("./../controllers/admin/video_plans/add_video_plan");
// router.post("/admin/add-video-plan", tokenMiddleware, AddVideoPlan);

var EditVideoPlan = require("./../controllers/admin/video_plans/edit_video_plan");
router.post("/admin/edit-video-plan", tokenMiddleware, EditVideoPlan);

var EditBookPaid = require("./../controllers/admin/booking/edit_book_paid");
router.post("/admin/edit-book-paid", tokenMiddleware,EditBookPaid);

var EditBooking = require("./../controllers/admin/booking/edit_booking");
router.post("/admin/edit-booking", tokenMiddleware,EditBooking);

// var DeleteVideoPlan = require("./../controllers/admin/video_plans/delete_video_plan");
// router.post("/admin/delete-video-plan", tokenMiddleware, DeleteVideoPlan);

// Other.
var GetConfiguration = require("./../controllers/admin/other/get_configuration");
router.get("/admin/get-configuration", tokenMiddleware, GetConfiguration);

var EditConfiguration = require("./../controllers/admin/other/edit_configuration");
router.post("/admin/edit-configuration", tokenMiddleware, EditConfiguration);

var GetPages = require("./../controllers/admin/other/get_pages");
router.get("/admin/get-pages", tokenMiddleware, GetPages);

var GetPageDetails = require("./../controllers/admin/other/get_page_details");
router.get("/admin/get-page-details", tokenMiddleware, GetPageDetails);

var EditPageContent = require("./../controllers/admin/other/edit_page_content");
router.post("/admin/edit-page-content", tokenMiddleware, EditPageContent);

// Utilities.
var ChangeStatus = require("./../controllers/admin/utility/change_status");
router.get("/admin/change-status", tokenMiddleware, ChangeStatus);

var UploadImage = require("./../controllers/admin/utility/upload");
router.post("/admin/upload-image", tokenMiddleware, UploadImage);

var callDetail = require("./../controllers/admin/booking/call_detail");
router.get("/admin/call-detail",callDetail);

var UserNotification = require("./../controllers/admin/notification/user_notification");
router.post("/admin/get-user-notification", tokenMiddleware, UserNotification);

// Group code.
var GroupCodeList = require("./../controllers/admin/group_code/group_code_list");
router.get("/admin/group-code-list", tokenMiddleware, GroupCodeList);

var AddGroupCode = require("./../controllers/admin/group_code/add_group_code");
router.post("/admin/add-group-code", tokenMiddleware, AddGroupCode);

var AllTherapist = require("./../controllers/admin/group_code/all_therapist");
router.get("/admin/all-therapist", tokenMiddleware, AllTherapist);

var GroupCodeDetails = require("./../controllers/admin/group_code/get_group_code_details");
router.get("/admin/get-group-info", tokenMiddleware, GroupCodeDetails);

var EditGroupCode = require("./../controllers/admin/group_code/edit_group_code");
router.post("/admin/edit-group-code", tokenMiddleware, EditGroupCode);

var GroupCodeDelete = require("./../controllers/admin/group_code/delete");
router.post("/admin/group-code/delete", tokenMiddleware, GroupCodeDelete);

var updatePermission = require("./../controllers/admin/group_code/update_permission");
router.put(
  "/admin/group-code/permission/update",
  tokenMiddleware,
  updatePermission
);

// library mannagement
// list
var libraryList = require("./../controllers/admin/library/list");
router.get("/admin/library/list", tokenMiddleware, libraryList);
// detail
var libraryDetail = require("./../controllers/admin/library/detail");
router.get("/admin/library/detail", tokenMiddleware, libraryDetail);
// add
var addLibrary = require("./../controllers/admin/library/add");
router.post("/admin/library/add", tokenMiddleware, addLibrary);
// edit
var editLibrary = require("./../controllers/admin/library/edit");
router.put("/admin/library/edit", tokenMiddleware, editLibrary);
// delete
var libraryDelete = require("./../controllers/admin/library/delete");
router.post("/admin/library/delete", tokenMiddleware, libraryDelete);
// change status
var libraryChangeStatus = require("./../controllers/admin/library/status");
router.patch(
  "/admin/library/change-status",
  tokenMiddleware,
  libraryChangeStatus
);
//topic list
var topicList = require("./../controllers/admin/library/topic_list");
router.get("/admin/topics", tokenMiddleware, topicList);

// assessment mannagement
// list
var assessmentList = require("./../controllers/admin/assessment/list");
router.get("/admin/assessment/list", tokenMiddleware, assessmentList);
// detail
var assessmentDetail = require("./../controllers/admin/assessment/detail");
router.get("/admin/assessment/detail", tokenMiddleware, assessmentDetail);
// add
var addAssessment = require("./../controllers/admin/assessment/add");
router.post("/admin/assessment/add", tokenMiddleware, addAssessment);
// edit
var editAssessment = require("./../controllers/admin/assessment/edit");
router.put("/admin/assessment/edit", tokenMiddleware, editAssessment);
// delete
var deleteAssessment = require("./../controllers/admin/assessment/delete");
router.post("/admin/assessment/delete", tokenMiddleware, deleteAssessment);


// exercises mannagement
// list
var exerciseList = require("./../controllers/admin/exercise/list");
router.get("/admin/exercise/list", tokenMiddleware, exerciseList);
// detail
var exerciseDetail = require("./../controllers/admin/exercise/detail");
router.get("/admin/exercise/detail", tokenMiddleware, exerciseDetail);
// add
var addExercise = require("./../controllers/admin/exercise/add");
router.post("/admin/exercise/add", tokenMiddleware, addExercise);
// edit
var editExercise = require("./../controllers/admin/exercise/edit");
router.put("/admin/exercise/edit", tokenMiddleware, editExercise);
// delete
var deleteExercise = require("./../controllers/admin/exercise/delete");
router.post("/admin/exercise/delete", tokenMiddleware, deleteExercise);
// moods-list
var listAllMoods = require("./../controllers/admin/exercise/moods-list");
router.get("/admin/exercise/moods-list", tokenMiddleware, listAllMoods);

// Survey Questions.
var surveyQuestionsList = require("./../controllers/admin/survey_question/list");
router.get("/admin/survey-question/list", tokenMiddleware, surveyQuestionsList);

var surveyQuestionDetail = require("./../controllers/admin/survey_question/detail");
router.get(
  "/admin/survey-question/detail",
  tokenMiddleware,
  surveyQuestionDetail
);

var addSurveyQuestion = require("./../controllers/admin/survey_question/add");
router.post("/admin/survey-question/add", tokenMiddleware, addSurveyQuestion);

var editSurveyQuestion = require("./../controllers/admin/survey_question/edit");
router.put("/admin/survey-question/edit", tokenMiddleware, editSurveyQuestion);

var deleteSurveyQuestion = require("./../controllers/admin/survey_question/delete");
router.post(
  "/admin/survey-question/delete",
  tokenMiddleware,
  deleteSurveyQuestion
);

// group code list
var groupCodeList = require("./../controllers/admin/survey_question/group_code_list");
router.get("/admin/group-code-list", tokenMiddleware, groupCodeList);

// moods
var moodsList = require("./../controllers/admin/moods/list");
router.get("/admin/moods/list", tokenMiddleware, moodsList);
var moodsDetail = require("./../controllers/admin/moods/detail");
router.get("/admin/moods/detail", tokenMiddleware, moodsDetail);
var addMoods = require("./../controllers/admin/moods/add");
router.post("/admin/moods/add", tokenMiddleware, addMoods);
var editMoods = require("./../controllers/admin/moods/edit");
router.put("/admin/moods/edit", tokenMiddleware, editMoods);
var deleteMoods = require("./../controllers/admin/moods/delete");
router.post("/admin/moods/delete", tokenMiddleware, deleteMoods);

// live video setting
var liveVideoDetail = require("./../controllers/admin/live_video_setting/detail");
router.get(
  "/admin/live-video-setting/detail",
  tokenMiddleware,
  liveVideoDetail
);
var editLiveVideo = require("./../controllers/admin/live_video_setting/edit");
router.put("/admin/live-video-setting/edit", tokenMiddleware, editLiveVideo);
var liveVideoTherapistList = require("./../controllers/admin/live_video_setting/therapist_list");
router.get(
  "/admin/live-video-setting/therapist-list",
  tokenMiddleware,
  liveVideoTherapistList
);


// Assessment Questions.
var assessmentQuestionsList = require("./../controllers/admin/assessment_question/list");
// router.get(
//   "/admin/assessment-question/list",
//   tokenMiddleware,
//   assessmentQuestionsList
// );
var assessmentQuestionDetail = require("./../controllers/admin/assessment_question/detail");
router.get(
  "/admin/assessment-question/detail",
  tokenMiddleware,
  assessmentQuestionDetail
);
var addAssessmentQuestion = require("./../controllers/admin/assessment_question/add");
router.post(
  "/admin/assessment-question/add",
  tokenMiddleware,
  addAssessmentQuestion
);
var editAssessmentQuestion = require("./../controllers/admin/assessment_question/edit");
router.put(
  "/admin/assessment-question/edit",
  tokenMiddleware,
  editAssessmentQuestion
);
var deleteAssessmentQuestion = require("./../controllers/admin/assessment_question/delete");
router.post(
  "/admin/assessment-question/delete",
  tokenMiddleware,
  deleteAssessmentQuestion
);
var categoryList = require("./../controllers/admin/assessment_question/category_list");
router.get(
  "/admin/assessment-question/categories",
  tokenMiddleware,
  categoryList
);

// live video list
var liveVideoList = require("./../controllers/admin/live_video/live_video_list");
router.get("/admin/live-video/list", tokenMiddleware, liveVideoList);
// support chat list
var supportChatList = require("./../controllers/admin/live_video/support_chat_list");
router.get("/admin/support-chat/list", tokenMiddleware, supportChatList);

module.exports = router;
