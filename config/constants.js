const constant = {
  // Validation message
  BASEURL: "https://syked.co.za/",
  SERVER_URL: process.env.SERVER_URL,
  BASE_URL: process.env.BASE_URL,
  CHAT_URL: process.env.CHAT_URL,
  CUSTOMER_IMAGE_UPLOAD_PATH: "/var/www/html/public/uploads/user/customer",
  THERAPIST_IMAGE_UPLOAD_PATH: "/var/www/html/public/uploads/user/therapist",
  ID_UPLOAD_PATH: "/var/www/html/public/uploads/user/id_proof",
  APP_PATH: "/var/www/html/",
  BASE_PATH: "https://syked.co.za/", // this ise used once we upload angular setup on diffrent folder

  // after create order send reponse url
  PAYFAST_RETURN_URL: "https://syked.co.za/apporder",
  PAYFAST_CANCEL_URL: "https://syked.co.za/apporder",
  PAYFAST_NOTIFY_URL: "https://api.syked.co.za/order/notify",
  PAYFAST_NOTIFY_URL_DUPLICATE: "https://api.syked.co.za/reorder/notify",

  PAYFAST_MERCHANT_ID: "14242749",
  PAYFAST_MERCHANT_KEY: "o2txbdocmidj7",
  PAYFAST_PAYMENT_URL: "https://www.payfast.co.za/eng/process",

  TOKEN_VALIDATION: "Token required.",
  EMAIL_VALIDATION: "Email is required.",
  PASSWORD_VALIDAATION: "Password is required.",
  SOMETHING_WENT_WRONG:
    "Something went wrong. Please, try again, if issue persist. Please, report to support team for further help.",
  PHONE_EXIST: "This mobile number is already registered with us.",
  EMAIL_EXIST: "This email is already registered with us.",
  REGISTRATION_SUCCESS: "You have been registered successfully.",
  RECORD_NOT_FOUND: "Record not found.",
  WRONG_CODE: "You have entered wrong verification code.",
  MOBILE_VERIFY_SUCCESS: "Your mobile number has been verified successfully.",
  WRONG_CREDENTIALS: "You have entered wrong credentials.",
  LOGIN_SUCCESSFULLY: "Login successfully.",
  FORGOT_PASSWORD:
    "If this email is registered with us, You will receive an email containing the password reset instructions.",
  EMAIL_NOT_EXIST: "Sorry, email is not exist.",
  UPDATE_INFO_SUCCESSFULLY: "User information updated successfully.",
  //TOKEN_:"You have entered wrong verification code.",
  GOOGLE_TOKEN_VALIDATION: " Token is required",
  GOOGLE_TOKEN_INVALID: "Token is invalid",
  FACEBOOK_TOKEN_VALIDATION: "Token is required",
  FACEBOOK_TOKEN_INVALID: "Token is invalid",

  PROFILE_UPDATE_SUCCESS: "Profile has been updated successfully.",
  ACCOUNT_INACTIVE:
    "Sorry! Your account was inactive mode. Please contact to support team.",

  INVALID_USER_TYPE: "You are not authorised.",
  INVALID_VALUE: "Inavlid value.",
  INVALID_STATUS: "Invalid status",
  RESET_PASSWORD_SUCCESS: "Password has been updated successfully.",
  CHANGE_PASSWORD_NOT_MATCH: "Old password does not match.",
  PASSWORD_CHANGE_SUCCESS: "Password has been updated successfully.",
  OLD_PASSWORD_NEW_PASSWORD_SAME:
    "Old password and new password should be different.",
  LIST_SUCCESS: "Record List.",
  DETAIL_SUCCESS: "Record detail.",
  THERAPIST_SUCCESS: "Therapist List.",
  SCHEDULE_SUCCESS: "Schedule List.",
  WEEK_SCHEDULE: "Week schedule.",
  RECORD_UPDATED_SUCCESS: "Record updated successfully.",
  CANCEL_SUCCESS: "Request has been cancelled successfully.",
  ACCEPTED_SUCCESS: "Request has been confirmed successfully.",
  COMPLETED_SUCCESS: "Request has been completed successfully.",
  NOTIFICATION_LIST: "Notification list",
  INACTIVE_USER: "Your account is inactivated by admin.",
  NOTIFICATION_DELETE_SUCCESS: "Notification deleted successful.",

  PLAN_NOT_FOUND:
    "You dont have any video plan, Please contact to syked support team.",
  PLAN_EXPIRED:
    "Your subscription plan has been expired,Please contact to syked support team.",

  VIDEO_PLAN: "Video Plan",
  REQUEST_DELETE_SUCCESS: "Request deleted successfully.",
  INVALID_DEVICE_TYPE: "Invalid device type",
  REFERRAL_CODE_NOT_EXIST: "Sorry! Referral code does not exist.",
  EMAIL_NOT_EXISTS: "",
  INVALID_TYPE: "Invalid type.",
  INVALID_THERAPY_TYPE: "Invalid therapy type.",
  GROUP_CODE_NOT_EXIST: "Sorry! group code does not exist.",

  INVALID_PROMOCODE: "Promo code is invalid",
  PROMOCODE_INACTIVE: "Promo code is inactive",
  INVALID_CATEGORY: "Invalid category.",
  PROMOCODE_NOT_AVAILABLE: "This promocode is not available yet.",
  PROMOCODE_EXPIRE: "This promocode has been expired.",
  LIMIT_USED_PROMOCODE: "The limit of this promocode has expired.",
  CLICK_PAYNOW: "Click Pay Now to complete booking.",
  PROMOCODE_INFO: "Promo code Info",
  RATING_ADDED_SUCCESSFUL: "Review added successful",
  ORDER_CREATED_SUCESSFULL: "Order created successful",
  ORDER_UPDATED_SUCESSFULL: "Booking updated successful.",
  NOT_PERMISSION_MESSAGE: "Sorry! You have no permission to update booking.",
  NOT_UPDATE_MESSAGE: "Sorry! Now you have not update booking.",
  BANK_INFORMATION_ADDED_SUCCESSFUL: "Bank information added successfully.",
  BANK_INFORMATION_UPDATED_SUCCESSFUL: "Bank information updated successfully.",
  BANK_INFORMATION_EXIST: "Bank information already exists.",
  PLAN_UPDATE_SUCCESSFUL: "Plan has been updated successfully.",
  RESEND_OTP_SUCCESS: "resend otp send successfully.",
  ALERT_ADMIN_FAIL: "Soory! Alert to admin not successfully!",
  NOT_PERMISSION_TO_ACTION:
    "Soory! You have no permission to perform this action!",
  ALERT_ADMIN_SUCCESS: "Alert to admin successfully!",
  LAT_LAONG_UPDATE_SUCCESSFUL: "lat long updated successfully",
  NOTE_CREATED_SUCESSFULL: "Note created successfully.",
  NOTE_UPDATED_SUCESSFULL: "Note updated successfully.",
  NOTE_DELETED_SUCESSFULL: "Note deleted successfully.",
  ASSESSMENT_QUESTION_ADDED_SUCESSFULL:
    "Your assessment has been successfully emailed to you.",
  MOOD_ADDED_SUCCSESFUL: "Mood added successfully.",
  COMMENT_ADDED_SUCCSESFUL: "Comment added successfully.",
  SURVEY_ADDED_SUCCSESFUL: "Survey question added successfully.",
  NOTIFICATION_NOT_FOUND: "No notifications.",
  REVIEW_NOT_FOUND: "No reviews.",
  NOTIFICATION_SENT_SUCCSESFUL: "Notification sent successfully.",

  // notification messages
  BOOKING_TITLE: "Booking Request",
  BOOKING_MESSAGE: "You have a booking request.",
  UPDATE_BOOKING_TITLE: "Update Booking Request",
  UPDATE_BOOKING_MESSAGE: "Customer was updated booking request.",
  ORDER_UPDATED_SUCCESSFUL: "order updated successful",
  BOOKING_CANCEL_TITLE: "Cancel Request",
  BOOKING_CANCEL_MESSAGE: "[CUSTOMER_NAME] has cancelled your request.",

  REQUEST_CANCEL_TITLE: "Cancelled Request",
  REQUEST_CANCEL_MESSAGE: "[THERAPIST_NAME] has cancelled your request.",
  REQUEST_CONFIRM_TITLE: "Confirmed Request",
  REQUEST_CONFIRM_MESSAGE: "[THERAPIST_NAME] has confirmed your request.",
  REQUEST_COMPLETE_TITLE: "Completed Request",
  REQUEST_COMPLETE_MESSAGE: "[THERAPIST_NAME] has completed your request.",

  DUPLICATE_BOOKING_TITLE: "Booking Request",
  DUPLICATE_BOOKING_MESSAGE: "You have a booking request.",
  MOOD_TITLE: "Mood",
  MOOD_MESSAGE: "How are you feeling today?",

  CANCEL_BOOKING_TITLE: "Cancel Booking Request",
  CANCEL_BOOKING_MESSAGE: "You have a cancel booking request.",
  CONFIRM_BOOKING_TITLE: "Confirm Booking Request",
  CONFIRM_BOOKING_MESSAGE: "You have a confirmed booking notification.",

  // price manage for therapist
  SOCIAL_WORKER: 299,
  REGISTERED_COUNCILLOR: 499,
  COUNSELLING_PSYCHOLOGIST: 599,
  CLINICAL_PSYCHOLOGIST: 699,
  DEFAULT_PRICE: 299,

  // type manage for therapist
  SOCIAL_WORKER_TYPE: "Social Worker",
  REGISTERED_COUNCILLOR_TYPE: "Registered Counsellor",
  COUNSELLING_PSYCHOLOGIST_TYPE: "Counselling Psychologist",
  CLINICAL_PSYCHOLOGIST_TYPE: "Clinical Psychologist",
  DEFAULT_TYPE: "",
};

// export module pool to be used in other files
module.exports = Object.freeze(constant);

/*ValidationStatusCode: 400,
    ConflictStatusCode: 409,
    SuccessStatusCode: 200,
    ErrorStatusCode: 500,
    NotFoundStatusCode: 204,//404, // not use for not recored.
    RecordNotFoundStatusCode: 204,*/
