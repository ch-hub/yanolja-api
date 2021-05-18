const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const reserveDao = require("./reserveDao");


// 모든 예약 내역 조회

exports.retrieveReserveList = async function(userIdx)
{
    const connection = await pool.getConnection(async (conn) => conn);
    const reserveListResult = await reserveDao.selectReserve(connection,userIdx);
    connection.release();
    return reserveListResult;
}

exports.ReserveAccessCheck = async function (roomIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const hotelReserveAccess = await reserveDao.accessHotelReserve(connection,roomIdx);
    connection.release();
    return hotelReserveAccess;
}

exports.ReserveDeleteCheck = async function (bookIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteReserveAccess = await reserveDao.deleteHotelReserve(connection,bookIdx);
    connection.release();
    return deleteReserveAccess;
}