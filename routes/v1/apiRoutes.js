/**
 * routes file for calling API for web and app
 */
const express = require("express");
const tokenMiddleware = require("./../../middleware/tokenMiddleware");
const router = express.Router();

//base url
const baseUrl = require("./../../controllers/api/v1/baseUrl");
router.get("/v1/user/base-url", baseUrl.base_url);

// signup controller
const signUp = require("./../../controllers/api/v1/auth/customer/signUpController");
router.post("/v1/user/registration", signUp.registration);
router.post("/v1/user/mobile_verify", tokenMiddleware, signUp.verification);
router.post("/v1/user/resend-otp", tokenMiddleware, signUp.resendOtp);
router.patch("/v1/user/disclaimer", tokenMiddleware, signUp.disclaimer);
router.get(
  "/v1/user/disclaimer-content",
  tokenMiddleware,
  signUp.disclaimerContent
);

// login controller
const login = require("./../../controllers/api/v1/auth/customer/loginController");
router.post("/v1/user/login", login.signIn);
router.post("/v1/user/forgot/password", login.forgotPassword);
router.post("/v1/user/reset/password", login.resetPassword);

// notification
const notificationController = require("./../../controllers/api/v1/notificationController");
router.get(
  "/v1/user/notifications",
  tokenMiddleware,
  notificationController.list
);
router.delete(
  "/v1/user/notifications/:id",
  tokenMiddleware,
  notificationController.delete
);
router.patch(
  "/v1/user/notifications/:id",
  tokenMiddleware,
  notificationController.read
);
router.get(
  "/v1/user/notification/auto-send",
  notificationController.autoSendNotification
);

// customer
const customerProfile = require("./../../controllers/api/v1/auth/customer/profileController");
router.post(
  "/v1/user/change/password",
  tokenMiddleware,
  customerProfile.changePassword
);
router.put(
  "/v1/customer/profile/update",
  tokenMiddleware,
  customerProfile.editProfile
);
const therapistController = require("./../../controllers/api/v1/customer/therapistController");
router.get(
  "/v1/customer/therapists",
  tokenMiddleware,
  therapistController.list
);
router.get(
  "/v1/customer/therapists/:id",
  tokenMiddleware,
  therapistController.detail
);
router.get(
  "/v1/customer/therapist/week/schedule",
  tokenMiddleware,
  therapistController.weekSchedule
);
router.get(
  "/v1/customer/questions",
  tokenMiddleware,
  therapistController.questionList
);

router.get(
  "/v1/customer/all-question-answer-list",
  tokenMiddleware,
  therapistController.questionAnswerList
);

// request controller
const requestController = require("./../../controllers/api/v1/customer/requestController");
router.get("/v1/customer/requests", tokenMiddleware, requestController.list);
router.get(
  "/v1/customer/requests/:id",
  tokenMiddleware,
  requestController.detail
);
router.get(
  "/v1/customer/request-month-list",
  tokenMiddleware,
  requestController.monthList
);
router.delete(
  "/v1/customer/request/delete/:id",
  tokenMiddleware,
  requestController.delete
);
router.delete(
  "/v1/customer/request/cancel/:id",
  tokenMiddleware,
  requestController.cancel
);
// for ios
router.post(
  "/v1/customer/request/delete",
  tokenMiddleware,
  requestController.delete
);
// for ios
router.post(
  "/v1/customer/request/cancel",
  tokenMiddleware,
  requestController.cancel
);
router.post("/v1/customer/requests", tokenMiddleware, requestController.create);
router.put("/v1/customer/requests", tokenMiddleware, requestController.edit);
router.patch(
  "/v1/customer/requests",
  tokenMiddleware,
  requestController.updateStatus
);
router.post(
  "/v1/customer/request/change-status",
  tokenMiddleware,
  requestController.updateStatus
);
router.get(
  "/v1/customer/request/owndetail",
  tokenMiddleware,
  requestController.customerOwnDetail
);
router.patch(
  "/v1/customer/duplicate-request",
  tokenMiddleware,
  requestController.acceptRejectDuplicateRequest
);
router.post(
  "/v1/customer/request/confirm-reorder",
  tokenMiddleware,
  requestController.confirmReorder
);

// review rating controller
const ratingController = require("./../../controllers/api/v1/customer/ratingController");
router.post(
  "/v1/customer/request-rating",
  tokenMiddleware,
  ratingController.addRating
);

// offer controller
const offerController = require("./../../controllers/api/v1/customer/offerController");
router.post(
  "/v1/customer/request/reffral-code-discount",
  tokenMiddleware,
  offerController.referralCodeDiscount
);
router.post(
  "/v1/customer/request/apply-promo",
  tokenMiddleware,
  offerController.applyPromocode
);
router.post(
  "/v1/customer/request/check-group-code",
  tokenMiddleware,
  offerController.checkGroupCode
);

// library controller
const libraryController = require("./../../controllers/api/v1/customer/libraryController");
router.get("/v1/customer/libraries", tokenMiddleware,libraryController.list);
router.get("/v1/customer/libraries-web", tokenMiddleware, libraryController.libraryList);
router.get("/v1/customer/libraries/:id", tokenMiddleware, libraryController.detail);
//~ router.post(
  //~ "/v1/customer/library/comment/post",
  //~ tokenMiddleware,
  //~ libraryController.postComment
//~ );

// assessment controller
const assessmentController = require("./../../controllers/api/v1/customer/assessmentController");
router.get("/v1/customer/assessments", assessmentController.list);
router.get("/v1/customer/assessments/:id", libraryController.detail);

// assessment question controller
const assessmentQuestionController = require("./../../controllers/api/v1/customer/assessmentQuestionController");
router.get(
  "/v1/customer/assessment-questions",
  tokenMiddleware,
  assessmentQuestionController.list
);
router.get(
  "/v1/customer/all-assessment-questions", tokenMiddleware, 
  assessmentQuestionController.allAssessmentQuestion
);
router.post(
  "/v1/customer/assessment-questions",
  tokenMiddleware,
  assessmentQuestionController.add
);

// exercise controller
const exerciseController = require("./../../controllers/api/v1/customer/exerciseController");
router.get("/v1/customer/exercises", tokenMiddleware, exerciseController.list);
router.get(
  "/v1/customer/exercises/:id",
  tokenMiddleware,
  exerciseController.detail
);

// blog controller
const blogController = require("./../../controllers/api/v1/customer/blogController");
router.get("/v1/customer/blog", blogController.list);
router.get("/v1/customer/blog/:id", blogController.detail);
router.post("/v1/customer/post-comment", tokenMiddleware,blogController.addComment); // deepak confirm

router.post("/v1/customer/library/comment/post",tokenMiddleware, blogController.addComment);


// note controller
const noteController = require("./../../controllers/api/v1/customer/noteController");
router.get("/v1/customer/notes", tokenMiddleware, noteController.list);
router.get("/v1/customer/notes/:id", tokenMiddleware, noteController.detail);
router.post("/v1/customer/notes", tokenMiddleware, noteController.create);
router.put("/v1/customer/notes", tokenMiddleware, noteController.update);
router.delete("/v1/customer/notes/:id", tokenMiddleware, noteController.delete);

// survey question controller
const surveyQuestionController = require("./../../controllers/api/v1/customer/surveyQuestionController");
router.get(
  "/v1/customer/survey-questions",
  tokenMiddleware,
  surveyQuestionController.list
);
router.get(
  "/v1/customer/survey-questions/:id",
  tokenMiddleware,
  surveyQuestionController.detail
);
router.post(
  "/v1/customer/survey-questions",
  tokenMiddleware,
  surveyQuestionController.add
);

// mood controller
const moodController = require("./../../controllers/api/v1/customer/moodController");
router.get("/v1/customer/moods", tokenMiddleware, moodController.list);
router.post("/v1/customer/moods", tokenMiddleware, moodController.addMood);

// therapist
const therapistProfile = require("./../../controllers/api/v1/therapist/profileController");
router.put(
  "/v1/therapist/profile/update",
  tokenMiddleware,
  therapistProfile.editProfile
);
router.get(
  "/v1/therapist/bankinfo",
  tokenMiddleware,
  therapistProfile.getBankInfo
);
router.post(
  "/v1/therapist/bankinfo",
  tokenMiddleware,
  therapistProfile.addBankInfo
);
router.put(
  "/v1/therapist/bankinfo",
  tokenMiddleware,
  therapistProfile.editBankInfo
);
router.get(
  "/v1/therapist/my-reviews",
  tokenMiddleware,
  therapistProfile.myReview
);

const scheduleController = require("./../../controllers/api/v1/therapist/scheduleController");
router.get("/v1/therapist/schedule", tokenMiddleware, scheduleController.list);
router.post("/v1/therapist/schedule", tokenMiddleware, scheduleController.edit);

// therapist request controller
const requestTherapist = require("./../../controllers/api/v1/therapist/requestController");
router.get("/v1/therapist/requests", tokenMiddleware, requestTherapist.list);
router.get(
  "/v1/therapist/requests/:id",
  tokenMiddleware,
  requestTherapist.detail
);
router.get(
  "/v1/therapist/request-month-list",
  tokenMiddleware,
  requestTherapist.monthList
);
router.delete(
  "/v1/therapist/request/delete/:id",
  tokenMiddleware,
  requestTherapist.delete
);
router.patch(
  "/v1/therapist/requests",
  tokenMiddleware,
  requestTherapist.updateStatus
);
router.post(
  "/v1/therapist/requests",
  tokenMiddleware,
  requestTherapist.updateStatus
);
router.post(
  "/v1/therapist/duplicate-request",
  tokenMiddleware,
  requestTherapist.duplicateBooking
);
// for ios
router.post(
  "/v1/therapist/request/delete",
  tokenMiddleware,
  requestTherapist.delete
);

// common
const uploadImage = require("./../../controllers/api/v1/utility_api/uploadImage");
router.post("/v1/user/upload-image", uploadImage);
router.get(
  "/v1/user/content/:type",
  require("./../../controllers/api/v1/content")
);
const chatController = require("./../../controllers/api/v1/chatController");
router.get("/v1/user/chat", tokenMiddleware, chatController.list);
router.get(
  "/v1/user/support-chat",
  tokenMiddleware,
  chatController.supportChatList
);
router.get("/v1/user/live-chat-list", chatController.liveChatList);

const videoPlanController = require("./../../controllers/api/v1/videoPlanController");
router.get("/v1/customer/get-video-plan", videoPlanController.planList);
router.post(
  "/v1/customer/check-plan",
  tokenMiddleware,
  videoPlanController.checkPlan
);
router.post(
  "/v1/user/video-token-info",
  tokenMiddleware,
  videoPlanController.videoTokenInfo
);
router.put(
  "/v1/user/plan/update",
  tokenMiddleware,
  videoPlanController.updatePlan
);
router.post(
  "/v1/user/video-alert",
  tokenMiddleware,
  videoPlanController.videoCallAlert
);
router.post(
  "/v1/user/video-agreement-action",
  tokenMiddleware,
  videoPlanController.videoAgreementAction
);
router.put(
  "/v1/customer/update/lat-long",
  tokenMiddleware,
  videoPlanController.updateLatLong
);
router.get("/v1/user/live-video-info", videoPlanController.liveVideoSetting);

// dashboar controller
const dashboardController = require("./../../controllers/api/v1/customer/dashboardController");
router.get(
  "/v1/user/top-rated-theripist",
  tokenMiddleware,
  dashboardController.topRatedList
);
router.get(
  "/v1/user/upcoming-session",
  tokenMiddleware,
  dashboardController.upcommingBooking
);

module.exports = router;
