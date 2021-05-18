const jwtMiddleware = require("../../../config/jwtMiddleware");
const reserveProvider = require("./reserveProvider");
const reserveService = require("./reserveService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


exports.getReserve = async function (req,res){
    const userIdx = req.params.userIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) {
         res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{
        const reserveListResult = await reserveProvider.retrieveReserveList(userIdx);
        return res.send(response(baseResponse.SUCCESS_RESERVE,reserveListResult));
    }
}


exports.postReserve = async function (req,res){
    const {roomIdx, visitTypeStatus, bookCheckIn,userIdx}= req.body;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{
        if (!roomIdx) return res.send(errResponse(baseResponse.ROOM_ROOMIDX_EMPTY));
        if (!visitTypeStatus) return res.send(errResponse(baseResponse.RESERVE_VISITTYPE_EMPTY));
        if (!bookCheckIn) return res.send(errResponse(baseResponse.RESERVE_CHECKIN_EMPTY));
        if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        if (visitTypeStatus!='W'&& visitTypeStatus !='C')
            return res.send(errResponse(baseResponse.RESERVE_VISITTYPE_WRONG));
        if(bookCheckIn>20 || bookCheckIn<10)
            return res.send(errResponse(baseResponse.RESERVE_CHECKIN_TIME));
        // 예외처리

        const roomReserveResponse = await reserveService.createReserve(roomIdx, visitTypeStatus, bookCheckIn,userIdx);
        return res.send(roomReserveResponse);
    }
}


exports.deleteReserve = async function (req,res){
    bookIdx=req.params.bookIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const reserveAccessCheck = await reserveProvider.ReserveDeleteCheck(bookIdx);
    if(reserveAccessCheck[0].userIdx !==userIdxFromJWT) {
        return res.send(errResponse(baseResponse.RESERVEDELETE_NOT_MATCH));
    }
    else {
        // 예외처리
        const deleteReserveResponse = await reserveService.deleteReserves(bookIdx);
        return res.send(deleteReserveResponse);
    }
}



