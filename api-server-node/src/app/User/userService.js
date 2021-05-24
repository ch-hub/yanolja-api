const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (userPhonenum,userNickname) {
    try {
        // 이메일 중복 확인
        const phoneRows = await userProvider.phoneCheck(userPhonenum);
        if (phoneRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONENUM);

        const nicknameRows = await userProvider.nicknameCheck(userNickname);
        if(nicknameRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        const insertUserInfoParams = [userPhonenum, userNickname];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection,insertUserInfoParams);
        connection.release();
        return response(baseResponse.SUCCESS_SIGNUP);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (userPhonenum) {
    try {
        const phoneRows = await userProvider.phoneCheck(userPhonenum);
        if (phoneRows.length < 1)
            return errResponse(baseResponse.SIGNIN_NO_PHONENUM);



        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(userPhonenum);

        if (userInfoRows[0].userStatus === "N") 
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);


        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userPhonenum,
                userIdx: userInfoRows[0].userIdx,
                userNickname : userInfoRows[0].userNickname
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS_SIGNIN, {'userId': userInfoRows[0].userIdx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (userIdx, userNickname) {
    try {
        const idxRows = await userProvider.idxCheck(userIdx);

        const nicknameRows = await userProvider.nicknameCheck(userNickname);
        if(nicknameRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, userIdx, userNickname)
        connection.release();

        return response(baseResponse.SUCCESS_EDIT_NICKNAME,{'userIdx' : idxRows[0].userIdx});

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserStatus = async function (userIdx){
    try{
        const idxRows = await userProvider.idxCheck(userIdx);
        
        if(idxRows[0].userStatus=='N')
            return errResponse(baseResponse.DELETE_STATUS);

        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResultStatus = await userDao.updateUserStatus(connection, userIdx)
        connection.release();

        return response(baseResponse.SUCCESS_EDIT_STATUS,{'userIdx' : idxRows[0].userIdx});
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
