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

// Service: Create, Update, Delete 비즈니스 로직 처리 nickname수정

exports.createUser = async function (userMail, userPassword) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(userMail);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(userPassword)
            .digest("hex");

        const insertUserInfoParams = [userMail, hashedPassword];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        // console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS_SIGNUP);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (userMail, userPassword) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(userMail);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].userMail
        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(userPassword)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        if(passwordRows[0]==undefined)
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
         if (passwordRows[0].userPassword !==hashedPassword) {
              return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
          }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(userMail);

         if (userInfoRows[0].userStatus === "N") {
             return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
         } else if (userInfoRows[0].userStatus === "D") {
             return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
         }

        console.log(userInfoRows[0].userId) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userId,
                userIdx : userInfoRows[0].userIdx,
                userMail : userInfoRows[0].userMail,
                userName : userInfoRows[0].userName
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "User",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS_SIGNIN, {'userId': userInfoRows[0].userId, 'userIdx' : userInfoRows[0].userIdx, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (userIdx, userNickname) {
    try {


        // console.log(userId)
        const userIdxRows = await userProvider.idxCheck(userIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, userIdx, userNickname);
        connection.release();

        return response(baseResponse.SUCCESS_PATCH_USER,{"userIdx" : userIdxRows[0].userIdx});

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editUserPass = async function (userIdx,userPassword,newUserPassword,newUserPasswordCheck){
    try {
        const idxRows = await userProvider.idxCheck(userIdx);
        const selectEmail = idxRows[0].userMail
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(userPassword)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        if (passwordRows[0] == undefined)
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        if (passwordRows[0].userPassword !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        const hashednewPassword = await crypto
            .createHash("sha512")
            .update(newUserPassword)
            .digest("hex");


        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResultPass = await userDao.updateUserPassword(connection, userIdx, hashednewPassword);
        connection.release();
        return response(baseResponse.SUCCESS_PATCH_USER_PASSWORD,{'userIdx' : passwordRows[0].userIdx});
    } catch (err) {
        logger.error(`App - editUserPASS Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}
exports.editUserPhone = async function (userIdx,userPhonenum)
{
    try{
        const userIdxRows = await userProvider.idxCheck(userIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResultPhone = await userDao.updateUserPhonenum(connection, userIdx, userPhonenum);
        connection.release();

        return response(baseResponse.SUCCESS_PATCH_USER_PHONENUM,{'userIdx' : userIdxRows[0].userIdx});
    }
    catch (err) {
        logger.error(`App - editUserPhone Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editStatus = async function (userIdx,userPassword){
    try{

        const userCheckRows = await userProvider.statusCheck(userIdx);

         const hashedPassword = await crypto
             .createHash("sha512")
             .update(userPassword)
             .digest("hex");
        if(userCheckRows[0]==undefined)
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
         if(userCheckRows[0].userPassword !== hashedPassword){
             return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
         }

        if (userCheckRows[0].userStatus === "N") {
            return errResponse(baseResponse.DELETE_USER_N);
        } else if (userCheckRows[0].userStatus === "D") {
            return errResponse(baseResponse.DELETE_USER_D);
        }
        const userIdxRows = await userProvider.idxCheck(userIdx);
         const connection = await pool.getConnection(async (conn) => conn);
         const editUserRows = await userDao.editStatusUser(connection,userIdx);
         connection.release();

        return response(baseResponse.SUCCESS_EXIT,{"userIdx" : userIdxRows[0].userIdx});
    }
    catch (err) {
        logger.error(`App - editUserStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

  exports.postUserKeeps = async function (userIdx,hotelIdx){
      try{
           const insertKeepParams = [userIdx,hotelIdx];
          const userIdxRows = await userProvider.idxCheck(userIdx);
            const postKeepRows = await userProvider.postKeep(hotelIdx);
            // if(postKeepRows.hotelIdx =="")
            //     return errResponse(baseResponse.HOTELIDX_NOT_EXIST);
          const connection = await pool.getConnection(async (conn) => conn);
          const insertUserRows = await userDao.insertUserKeep(connection,insertKeepParams);
          connection.release();
          return response(baseResponse.SUCCESS_POST_KEEP,{"hotelIdx" : postKeepRows[0].hotelIdx,"userIdx" : userIdxRows[0].userIdx});
      }
      catch (err) {
          logger.error(`App - postUserKeeps Service error\n: ${err.message}`);
          return errResponse(baseResponse.DB_ERROR);
      }
  };

exports.keepStatus = async function (keepIdx){
    try{
        const keepStatusCheck = await userProvider.KeepAccessCheck(keepIdx);
        if(keepStatusCheck[0].keepStatus=='D')
            return errResponse(baseResponse.USER_DELETE_KEEP);
        const connection = await pool.getConnection(async (conn) => conn);
        const keepStatusResult = await userDao.eidtKeepStatusUser(connection,keepIdx);
        connection.release();

        return response(baseResponse.SUCCESS_DELETE_KEEP,{"keepIdx" : keepStatusCheck[0].keepIdx,"userIdx" : keepStatusCheck[0].userIdx});
    }
    catch (err) {
        logger.error(`App - keepStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


