const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const hotelProvider = require("./hotelProvider");
const hotelDao = require("./hotelDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


exports.createReview = async function (hotelIdx,kindness,cleanliness,convenience,supplySatisfaction,hotelReview,userIdx){
    try{
        const insertHotelReviewParams=[hotelIdx,kindness,cleanliness,convenience,supplySatisfaction,hotelReview,userIdx];
        //예외처리 if(!hotelIdx가 없다면?)
        const userIdxCheck = await hotelProvider.userIdxHotel(userIdx);
        const connection = await pool.getConnection(async (conn) => conn);
        const insertUserRows = await hotelDao.insertHotelReview(connection,insertHotelReviewParams);
        connection.release();
        return response(baseResponse.SUCCESS_POST_HOTEL_REVIEW,{"userIdx" : userIdxCheck[0].userIdx});
    }
    catch (err) {
        logger.error(`App - createHotelReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.patchTime = async function(hotelSearch){
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const patchHotelReviewRows = await hotelDao.hotelNameUpdate(connection,hotelSearch);

        connection.release();
        return response(baseResponse.SUCCESS_PATCH_HOTEL_REVIEW);
    }
    catch (err) {
        logger.error(`App - patchHotelTime Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.patchReview = async function (kindness,cleanliness,convenience,supplySatisfaction,hotelReview,userIdx,reviewIdx){
    try{
        const userIdxCheck = await hotelProvider.userIdxHotel(userIdx);
        const patchHotelReviewParams=[kindness,cleanliness,convenience,supplySatisfaction,hotelReview,userIdx,reviewIdx];
        const connection = await pool.getConnection(async (conn) => conn);
        const patchHotelReviewRows = await hotelDao.patchHotelReview(connection,patchHotelReviewParams);

        connection.release();
        return response(baseResponse.SUCCESS_PATCH_HOTEL_REVIEW,{"userIdx" : userIdxCheck[0].userIdx});
    }
    catch (err) {
        logger.error(`App - patchHotelReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteReview = async function (reviewIdx){
    try{
        const deleteHotelReviewParams = [reviewIdx];
        const deleteReviewRow = await hotelProvider.ReviewAccessCheck(reviewIdx);
        if(deleteReviewRow[0].reviewStatus=='D')
            return errResponse(baseResponse.USER_DELETE_REVIEW);
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteHotelReviewRows = await hotelDao.deleteHotelReview(connection,deleteHotelReviewParams);
        connection.release();
        return response(baseResponse.SUCCESS_DELETE_HOTEL_REVIEW,{"userIdx" : deleteReviewRow[0].userIdx});
    }
    catch (err) {
        logger.error(`App - deleteHotelReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

