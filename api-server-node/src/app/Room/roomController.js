const jwtMiddleware = require("../../../config/jwtMiddleware");
const roomProvider = require("./roomProvider");
const roomService = require("./roomService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

// 방 정보 조회

exports.getRoom = async function(req,res) {
    hotelIdx = req.params.hotelIdx;
    const roomListResult = await roomProvider.retrieveRoomList(hotelIdx);
    return res.send(response(baseResponse.SUCCESS_ROOM,roomListResult));
}

