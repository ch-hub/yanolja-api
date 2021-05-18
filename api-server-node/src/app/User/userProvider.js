const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (userMail) {
    if (!userMail) {
        const connection = await pool.getConnection(async (conn) => conn);
        const userListResult = await userDao.selectUser(connection);
        connection.release();

        return userListResult;

    } else {
        const connection = await pool.getConnection(async (conn) => conn);
        const userListResult = await userDao.selectUserEmail(connection, userMail);
        connection.release();

        return userListResult;
    }
};

exports.retrieveUser = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await userDao.selectUserId(connection, userIdx);

    connection.release();

    return userResult[0];
};

exports.emailCheck = async function (userMail) {
    const connection = await pool.getConnection(async (conn) => conn);
    const emailCheckResult = await userDao.selectUserEmail(connection, userMail);
    connection.release();

    return emailCheckResult;
};
exports.idxCheck = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const idxCheckResult = await userDao.selectUserId(connection, userIdx);
    connection.release();

    return idxCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const passwordCheckResult = await userDao.selectUserPassword(
        connection,
        selectUserPasswordParams
    );
    connection.release();
    return passwordCheckResult[0];
};

exports.accountCheck = async function (userMail) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAccountResult = await userDao.selectUserAccount(connection, userMail);
    connection.release();

    return userAccountResult;
};

exports.statusCheck = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userCheckResult = await userDao.selectUserStatus(connection, userIdx);
    connection.release();

    return userCheckResult;
};


exports.retrieveUserDetails = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const userResultDetails = await userDao.selectUserDetails(connection,userIdx);
    connection.release();
    return userResultDetails[0];
};

exports.retrieveUserKeep = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const userResultKeep = await userDao.selectUserKeep(connection,userIdx);
    connection.release();
    return userResultKeep;
};

exports.postKeep = async function(hotelIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const userPostKeep = await userDao.postUserKeep(connection,hotelIdx);
    connection.release();
    return userPostKeep;
};

exports.KeepAccessCheck = async function (keepIdx)
{   const connection = await pool.getConnection(async (conn) => conn);
    const keepCheck = await userDao.selectKeepCheck(connection,keepIdx);
    connection.release();
    return keepCheck;

}
exports.retrieveUserPoint = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const userResultPoint = await userDao.selectUserPoint(connection,userIdx);
    connection.release();
    return userResultPoint;
}

exports.retrieveUserCoupon = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const userResultCoupon = await userDao.selectUserCoupon(connection,userIdx);
    connection.release();
    return userResultCoupon;
}

exports.retrieveUserReview = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const userResultReview = await userDao.selectUserReview(connection,userIdx);
    connection.release();
    return userResultReview;
}

