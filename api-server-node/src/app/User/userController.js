const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

// 인증번호 생성
exports.authNum = async function (req,res){
    const userPhonenum = req.body.userPhonenum;
    // 핸드폰 번호 validation
    if(!userPhonenum)
        return res.send(response(baseResponse.USER_PHONE_EMPTY));
    if(!/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/.test(userPhonenum))
        return res.send(response(baseResponse.SIGNUP_PHONENUM_REGIX));
    let str = ''
    for (let i = 0; i < 4; i++) {
        str += Math.floor(Math.random() * 10)
    }
    return res.send(response(baseResponse.SUCCESS_AUTHNUM, str));
}
/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {userPhonenum, userNickname} = req.body;


    if(!userPhonenum)
        return res.send(response(baseResponse.USER_PHONE_EMPTY));
    if(!/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/.test(userPhonenum))
        return res.send(response(baseResponse.SIGNUP_PHONENUM_REGIX));


    if(!userNickname)
        return res.send(response(baseResponse.USER_NICKNAME_EMPTY));

    if(!/^([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]).{1,11}$/.test(userNickname))
        return res.send(errResponse(baseResponse.USER_NICKNAME_REGIX));



    const signUpResponse = await userService.createUser(userPhonenum,userNickname);

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

    const userList = await userProvider.retrieveUserList();
    return res.send(response(baseResponse.USER_SUCCESS, userList));
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserByIdx = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdx = req.params.userIdx;

    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userIdx);
    return res.send(response(baseResponse.SUCCESS_USERIDX, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.postSignin = async function (req, res) {

    const userPhonenum = req.body.userPhonenum;

    // TODO: email, password 형식적 Validation
    if(!userPhonenum)
        return res.send(response(baseResponse.USER_PHONE_EMPTY));
    if(!/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/.test(userPhonenum))
        return res.send(response(baseResponse.SIGNUP_PHONENUM_REGIX));


    const signInResponse = await userService.postSignIn(userPhonenum);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdxFromJWT = req.verifiedToken.userIdx

    const userIdx = req.params.userIdx;
    const userNickname = req.body.userNickname;

    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!userNickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
        if(!/^([ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]).{1,11}$/.test(userNickname))
            return res.send(errResponse(baseResponse.USER_NICKNAME_REGIX));


        const editUserInfo = await userService.editUser(userIdx,userNickname);
        return res.send(editUserInfo);
    }
};

exports.patchStatus = async function (req,res){
    const userIdxFromJWT = req.verifiedToken.userIdx

    const userIdx = req.params.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        const editUserStatus = await userService.editUserStatus(userIdx);
        return res.send(editUserStatus);
    }
}









/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

exports.pingPong = async function (req,res){
    return res.send(response(baseResponse.PINGPONG_SUCCESS));
}