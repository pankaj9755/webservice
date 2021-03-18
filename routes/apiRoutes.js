/**
 * routes file for calling API for web and app
 */
const express = require("express");
const tokenMiddleware = require("./../middleware/tokenMiddleware");
var tokenOptionalMiddleware = require("./../middleware/tokenOptionalMiddleware");
const router = express.Router();

//base url
const baseUrl = require("./../controllers/api/baseUrl");
const test = require("./../controllers/api/test");

router.get("/", baseUrl);
router.get('/test',test);

//Common Api
router.post('/upload-image',require("./../controllers/api/utility_api/uploadImage"));
router.post('/reset-password',require("./../controllers/api/auth/resetPassword"));
router.post('/change-password',tokenMiddleware,require("./../controllers/api/auth/changePassword"));
router.post('/utility_api/contact-us',require("./../controllers/api/utility_api/contactUs"));
router.post('/get-content',require("./../controllers/api/content"));
router.post('/utility_api/user-subscribe',require("./../controllers/api/utility_api/subscription"));
router.post('/update-video-plan',tokenMiddleware,require("./../controllers/api/updateVideoPlanTime"));

router.post('/check-plan',tokenMiddleware,require("./../controllers/api/checkPlan"));



//Customer Api
router.post('/customer/registration',require("./../controllers/api/auth/customer/registration"));
router.post('/register',require("./../controllers/api/auth/customer/registration"));

router.post('/customer/mobile_verify',tokenMiddleware,require("./../controllers/api/auth/customer/mobile_verify"));
router.post('/customer/social-registration',require("./../controllers/api/auth/customer/socialRegistration"));
router.post('/customer/login',require("./../controllers/api/auth/customer/login"));
router.post('/customer/google-login',require("./../controllers/api/auth/customer/googleLogin"));
router.post('/customer/facebook-login',require("./../controllers/api/auth/customer/facebookLogin"));
router.post('/customer/resend-otp',tokenMiddleware,require("./../controllers/api/auth/customer/resendOtp"));

router.post('/customer/disclaimer',tokenMiddleware,require("./../controllers/api/auth/customer/disclaimer"));
router.post('/customer/forgot-password',require("./../controllers/api/auth/customer/forgotPassword"));
router.post('/customer/update-profile',tokenMiddleware,require("./../controllers/api/auth/customer/updateProfile"));
router.post('/customer/question-list',require("./../controllers/api/customer/questionsList"));
router.post('/customer/request-list',tokenMiddleware,require("./../controllers/api/customer/requestList"));
router.post('/customer/request-detail',tokenMiddleware,require("./../controllers/api/customer/requestDetail"));
router.get('/customer/request-month-list',tokenMiddleware,require("./../controllers/api/customer/requestMonthList"));

router.post('/customer/request-cancel',tokenMiddleware,require("./../controllers/api/customer/requestCancel"));
router.get('/customer/notification-list',tokenMiddleware,require("./../controllers/api/customer/notificationList"));
router.post('/customer/request-rating',tokenMiddleware,require("./../controllers/api/customer/rating"));
router.post('/customer/delete-notification',tokenMiddleware,require("./../controllers/api/customer/deleteNotification"));
router.post('/customer/get-chat',tokenMiddleware,require("./../controllers/api/customer/chatHistory"));
router.get('/customer/get-video-plan',require("./../controllers/api/customer/videoPlan"));
router.post('/customer/buy-video-plan',tokenMiddleware,require("./../controllers/api/customer/buyVideoPlan"));
router.post('/customer/request-delete',tokenMiddleware,require("./../controllers/api/customer/requestDelete"));

//Therapist Api
router.post('/therapist/update-profile',tokenMiddleware,require("./../controllers/api/therapist/editProfile"));
router.get('/therapist/profile-detail',tokenMiddleware,require("./../controllers/api/therapist/profileDetail"));
router.get('/therapist/bank-info',tokenMiddleware,require("./../controllers/api/therapist/bankInfo"));
router.post('/therapist/add-bank',tokenMiddleware,require("./../controllers/api/therapist/addBankInfo"));
router.post('/therapist/edit-bank',tokenMiddleware,require("./../controllers/api/therapist/editBankInfo"));

router.get('/therapist/counselor-detail',require("./../controllers/api/therapist/counselorDetail"));
router.get('/therapist/therapist-list',tokenOptionalMiddleware,require("./../controllers/api/therapist/therapistList"));
router.get('/therapist/get-schedule',tokenMiddleware,require("./../controllers/api/therapist/getSchedule"));
router.post('/therapist/edit-schedule',tokenMiddleware,require("./../controllers/api/therapist/editSchedule"));

router.get('/therapist/week-schedule',require("./../controllers/api/therapist/weekSchedule"));
router.get('/therapist/request-list',tokenMiddleware,require("./../controllers/api/therapist/requestList"));
router.get('/therapist/request-detail',tokenMiddleware,require("./../controllers/api/therapist/requestDetail"));
router.post('/therapist/update-request-status',tokenMiddleware,require("./../controllers/api/therapist/updateRequestStatus"));
router.get('/therapist/notification-list',tokenMiddleware,require("./../controllers/api/therapist/notificationList"));
router.post('/therapist/delete-notification',tokenMiddleware,require("./../controllers/api/therapist/deleteNotification"));
router.get('/therapist/request-month-list',tokenMiddleware,require("./../controllers/api/therapist/requestMonthList"));
router.post('/therapist/get-chat',tokenMiddleware,require("./../controllers/api/therapist/chatHistory"));
router.get('/therapist/my-reviews',tokenMiddleware,require("./../controllers/api/therapist/myReview"));
router.post('/therapist/request-delete',tokenMiddleware,require("./../controllers/api/therapist/requestDelete"));
//
router.post('/order/create',tokenMiddleware,require("./../controllers/api/request/create"));
router.get('/order/my-order-detail',tokenMiddleware,require("./../controllers/api/request/CustomerOwnReuestDetail"));
router.post('/order/update-status',tokenMiddleware,require("./../controllers/api/request/updateRequestStatusUpdate"));
router.post('/order/apply-promo',tokenMiddleware,require("./../controllers/api/request/applyPromo"));

router.get('/my-review',tokenMiddleware,require("./../controllers/api/therapist/myReview"));
router.get('/last-question-information',tokenOptionalMiddleware,require("./../controllers/api/customer/lastQuestionData"));
router.get('/edit-request-detail',tokenMiddleware,require("./../controllers/api/customer/editRequestDetail"));
router.post('/edit-request',tokenMiddleware,require("./../controllers/api/request/edit"));
router.get('/unread-notify-count',tokenMiddleware,require("./../controllers/api/utility_api/unreadNotificatioCount"));
router.post('/customer/reffral-code-discount',tokenMiddleware,require("./../controllers/api/customer/reffralCodeDiscount"));

// payment callback 
router.all('/order/notify',require("./../controllers/api/payment/notifyPayFast"));
router.all('/reorder/notify',require("./../controllers/api/payment/notifyReorderPayFast"));
router.all('/order/video/notify',require("./../controllers/api/payment/videoPlanNotifyPayFast"));
router.post('/register-binding',require("./../controllers/api/twilioNotify"));
router.post('/tsend-notification',require("./../controllers/api/sendtwilioNotify"));

router.post('/video-alert',tokenMiddleware,require("./../controllers/api/utility_api/videoCallAlert"));
router.post('/video-agreement-action',tokenMiddleware,require("./../controllers/api/utility_api/videoAgreementAction"));

router.get('/home-therapist',require("./../controllers/api/therapist/homeScreenTherapist"));
router.get('/home-reviews',require("./../controllers/api/utility_api/homeReviewList"));


router.get('/customer/group-code-benefit',tokenMiddleware,require("./../controllers/api/customer/groupCodeDiscount"));
router.get('/customer-location',tokenMiddleware,require("./../controllers/api/customer/customerLocation"));
router.get('/phone-call',require("./../controllers/api/customer/phoneCall"));

module.exports = router;
