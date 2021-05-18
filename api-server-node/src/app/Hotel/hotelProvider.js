const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const hotelDao = require("./hotelDao");

// 모든 호텔 조회

exports.retrieveHotelLists = async function ()
{
    const connection = await pool.getConnection(async (conn) => conn);
    const hotelListResult = await hotelDao.selectHotels(connection);
    connection.release();

    return hotelListResult;
};


exports.retrieveHotelList = async function (hotelLocation)
{
    const connection = await pool.getConnection(async (conn) => conn);
    const hotelListResult = await hotelDao.selectHotel(connection,hotelLocation);
    connection.release();
    return hotelListResult;
};

exports.retrieveHotelName = async function (hotelSearch)
{
    const connection = await pool.getConnection(async (conn) => conn);
    const hotelListName = await hotelDao.selectHotelName(connection,hotelSearch);
    connection.release();

    return hotelListName;
}

exports.retrieveHotelSub = async function (hotelSubway)
{
    const connection = await pool.getConnection(async (conn) => conn);
    const hotelListResult = await hotelDao.selectHotelSub(connection,hotelSubway);
    connection.release();
    return hotelListResult;
}
// 호텔 틀정 idx 조회
exports.retrieveHotel = async function (hotelIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const hotelResult = await hotelDao.selectHotelIdx(connection,hotelIdx);
    connection.release();
    return hotelResult[0];
};

// 호텔 리뷰 조회
exports.retrieveHotelReview = async function (hotelIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const hotelReview = await hotelDao.selectHotelReview(connection,hotelIdx);
    connection.release();
    return hotelReview;
}

exports.ReviewAccessCheck = async function (reviewIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const hotelReviewAccess = await hotelDao.accessHotelReview(connection,reviewIdx);
    connection.release();
    return hotelReviewAccess;
}

exports.userIdxHotel = async function (userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdxReview = await hotelDao.userIdxReviews(connection,userIdx);
    connection.release();
    return userIdxReview;
}

exports.getRecent = async function (userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const recentHotel = await hotelDao.recentHotelTime(connection,userIdx);
    connection.release();
    return recentHotel;
}
