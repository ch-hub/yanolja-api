const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("./userProvider");
const userService = require("./userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// exports.getTest = async function (req, res) {
//     return res.send(response(baseResponse.SUCCESS))
// }

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postSignup = async function (req, res) {

    /**
     * Body: email, password, passwordCheck
     */
    const {userMail, userPassword,userPasswordCheck} = req.body;

    // 빈 값 체크
    if (!userMail)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (userMail.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(userMail))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 비밀번호 빈 값 체크
    if(!userPassword)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    // 비밀번호 길이 체크
    // 비밀번호 확인 빈 값 체크
    if(!userPasswordCheck)
        return res.send(response(baseResponse.SIGNUP_PASSWORDCHECK_EMPTY));
    if(!/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(userPassword))
        return res.send(response(baseResponse.SIGNUP_PASSWORD_REGIX));
    // 비밀번호와 비밀번호 확인 같은지
    if(userPasswordCheck!=userPassword)
        return res.send(response(baseResponse.SIGNUP_PASSWORDCHECK_WRONG));



    const signUpResponse = await userService.createUser(
        userMail,
        userPassword
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const userMail = req.query.userMail;

    if (!userMail) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS_USER, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(userMail);
        return res.send(response(baseResponse.SUCCESS_USER, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /users/{userIdx}
 */
exports.getUserByIdx = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdx = req.params.userIdx;

    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserIdx = await userProvider.retrieveUser(userIdx);
    return res.send(response(baseResponse.SUCCESS_USERIDX, userByUserIdx));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.postSignin = async function (req, res) {

    const {userMail, userPassword} = req.body;

    // TODO: email, password 형식적 Validation
    // 이메일 형식,비밀번호 형식
    // 빈 값 체크
    if (!userMail)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));

    // 길이 체크
    if (userMail.length > 30)
        return res.send(response(baseResponse.SIGNIN_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(userMail))
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    // 비밀번호 빈 값 체크
    if(!userPassword)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));



    const signInResponse = await userService.postSignIn(userMail, userPassword);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchNicknameUsersByIdx = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdxFromJWT = req.verifiedToken.userIdx

    const userIdx = req.params.userIdx;
    const userNickname = req.body.userNickname;

     // userid값을 dao에서가지고오기
     if (userIdxFromJWT != userIdx) {
           res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
       }
    else {
        if (!userNickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
        if (userNickname.length>10||userNickname.length<2)
            return res.send(errResponse(baseResponse.USER_NICKNAME_LENGTH));

        // 닉네임 정규표현식
        if(!/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/.test(userNickname))
            return res.send(errResponse(baseResponse.USER_NICKNAME_REGIX));

        const editUserInfo = await userService.editUser(userIdx, userNickname);
        return res.send(editUserInfo);
     }
};


exports.patchPasswordUsersByIdx = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdxFromJWT = req.verifiedToken.userIdx

    const userIdx = req.params.userIdx;
    const {userPassword,newUserPassword,newUserPasswordCheck} = req.body;

    // userid값을 dao에서가지고오기
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else {
        if (!userPassword) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
        if (!newUserPassword) return res.send(response(baseResponse.SIGNUP_NEWPASSWORD_EMPTY));
        if(!/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/.test(newUserPassword))
            return res.send(response(baseResponse.SIGNUP_PASSWORD_REGIX));

        if(!newUserPasswordCheck)
            return res.send(response(baseResponse.SIGNUP_NEWPASSWORDCHECK_EMPTY));
        // 비밀번호와 비밀번호 확인 같은지
        if(newUserPasswordCheck!=newUserPassword)
            return res.send(response(baseResponse.SIGNUP_NEWPASSWORDCHECK_WRONG));

        const editUserPassword = await userService.editUserPass(userIdx,userPassword, newUserPassword,newUserPasswordCheck);
        return res.send(editUserPassword);
    }
};

exports.patchPhonenumUsersByIdx = async function (req,res){
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const userPhonenum = req.body.userPhonenum
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        if(!userPhonenum) return res.send(errResponse(baseResponse.USER_USERPHONENUM_EMPTY));
        if(!/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/.test(userPhonenum))
            return res.send(response(baseResponse.SIGNUP_PHONENUM_REGIX));

        const editUserPhonenum = await userService.editUserPhone(userIdx,userPhonenum);
        return res.send(editUserPhonenum);
    }
}


exports.deleteUserByStatus = async function (req,res){
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    const userPassword = req.body.userPassword
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{
        if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        if (!userPassword)  return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

        const editUserStatus = await userService.editStatus(userIdx,userPassword);

        return res.send(editUserStatus);
    }
};

exports.getUserDetails = async function (req,res){
    const userIdx=req.params.userIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        //예외처리
        const userDetails = await userProvider.retrieveUserDetails(userIdx);
        return res.send(response(baseResponse.SUCCESS_USER_DETAILS,userDetails));
    }
};

exports.getUserKeep = async function (req,res){
    const userIdx = req.params.userIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{
        // if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        //예외처리

        const userKeep = await userProvider.retrieveUserKeep(userIdx);
        return res.send(response(baseResponse.SUCCESS_KEEP,userKeep));
    }
};

exports.postUserKeep = async function (req,res){
    const {userIdx, hotelIdx} = req.body;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{

        if(!hotelIdx) return res.send(errResponse(baseResponse.HOTEL_HOTELIDX_EMPTY));
        if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        // 예외처리

        const userKeepResponse = await userService.postUserKeeps(userIdx,hotelIdx);
        return res.send(userKeepResponse);
    }
};



exports.deleteKeepByStatus = async function (req,res){
    const keepIdx = req.params.keepIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const keepAccessCheck = await userProvider.KeepAccessCheck(keepIdx);

    if(keepAccessCheck[0].userIdx !==userIdxFromJWT)
        return res.send(errResponse(baseResponse.KEEPIDX_NOT_MATCH));
    else{
        if(!keepIdx) return res.send(errResponse(baseResponse.KEEP_KEEPIDX_EMPTY));
        //예외처리
        const editKeepStatus = await userService.keepStatus(keepIdx);
        return res.send(editKeepStatus);
    }
}

exports.getPoint = async function (req,res){
    const userIdx = req.params.userIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else {
        // if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        //예외처리
        const userPoint = await userProvider.retrieveUserPoint(userIdx);
        return res.send(response(baseResponse.SUCCESS_POINT,userPoint));
    }
};

exports.getCoupon = async function (req,res){
    const userIdx = req.params.userIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else {
        const userCoupon = await userProvider.retrieveUserCoupon(userIdx);
        return res.send(response(baseResponse.SUCCESS_COUPON,userCoupon));
        //if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        //예외처리
    }
}

exports.getReview = async function (req,res){
    const userIdx = req.params.userIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{
        const userReview = await userProvider.retrieveUserReview(userIdx);
        return res.send(response(baseResponse.SUCCESS_USER_REVIEW,userReview));
        //if(!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        //예외처리
    }
}

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdxResult = req.verifiedToken;

    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS,userIdxResult));
};

