const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reserveProvider = require("./reserveProvider");
const reserveDao = require("./reserveDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.createReserve = async function (roomIdx, visitTypeStatus, bookCheckIn,userIdx){
    try{
        const insertReserveParams=[roomIdx, visitTypeStatus, bookCheckIn,userIdx];
        const hotelReserveAccess = await reserveProvider.ReserveAccessCheck(roomIdx);
        if(hotelReserveAccess[0].bookStatus == 'N')
            return errResponse(baseResponse.BOOK_STATUS_N);
        const connection = await pool.getConnection(async (conn) => conn);
        const insertReserveRows = await reserveDao.insertReserve(connection,insertReserveParams);
        const setReserveRows = await reserveDao.setReserve(connection,roomIdx);
        connection.release();
        return response(baseResponse.SUCCESS_POST_RESERVE,{"userIdx" : hotelReserveAccess[0].userIdx});
    }
    catch (err) {
        logger.error(`App - createReserve Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.deleteReserves = async function (bookIdx){
    try{
        const deleteReserveParams = [bookIdx];
        const reserveStatusCheck = await reserveProvider.ReserveDeleteCheck(bookIdx);
        console.log(reserveStatusCheck[0].bookStatus);
        if(reserveStatusCheck[0].bookStatus =='Y')
            return errResponse(baseResponse.BOOK_STATUS_Y);
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteReserveRows = await reserveDao.deleteReserve(connection,deleteReserveParams);
        connection.release();
        return response(baseResponse.SUCCESS_DELETE_RESERVE,{"userIdx" : reserveStatusCheck[0].userIdx});
    }
    catch (err) {
        logger.error(`App - deleteReserve Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


