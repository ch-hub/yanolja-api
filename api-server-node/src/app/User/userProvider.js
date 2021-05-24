const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;
};

exports.retrieveUser = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await userDao.selectUserIdx(connection, userIdx);

    connection.release();

    return userResult[0];
};

exports.phoneCheck = async function (userPhonenum) {
    const connection = await pool.getConnection(async (conn) => conn);
    const phoneCheckResult = await userDao.selectUserPhonenum(connection, userPhonenum);
    connection.release();

    return phoneCheckResult;
};

exports.nicknameCheck = async function (userNickname){
    const connection = await pool.getConnection(async (conn) => conn);
    const nicknameCheckResult = await userDao.selectUserNickname(connection, userNickname);
    connection.release();

    return nicknameCheckResult;
}

exports.passwordCheck = async function (selectUserPasswordParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const passwordCheckResult = await userDao.selectUserPassword(
        connection,
        selectUserPasswordParams
    );
    connection.release();
    return passwordCheckResult[0];
};

exports.accountCheck = async function (userPhonenum) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAccountResult = await userDao.selectUserAccount(connection, userPhonenum);
    connection.release();

    return userAccountResult;
};

exports.idxCheck = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const idxCheckResult = await userDao.selectUserId(connection, userIdx);
    connection.release();

    return idxCheckResult;
};