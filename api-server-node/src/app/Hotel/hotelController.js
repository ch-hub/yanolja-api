const jwtMiddleware = require("../../../config/jwtMiddleware");
const hotelProvider = require("./hotelProvider");
const hotelService = require("./hotelService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

exports.getHotel = async function (req, res){
    const hotelListResult = await hotelProvider.retrieveHotelLists();
    return res.send(response(baseResponse.SUCCESS, hotelListResult));
}

exports.getHotelLocation = async function (req, res){
    const hotelLocation = req.query.hotelLocation;
    if(!hotelLocation)
        return res.send(errResponse(baseResponse.HOTEL_LOCATION_EMPTY));
    const hotelListResult = await hotelProvider.retrieveHotelList(hotelLocation);
    if(hotelListResult == "")
        return res.send(errResponse(baseResponse.HOTEL_LOCATION_WRONG));
    return res.send(response(baseResponse.SUCCESS_HOTEL_L, hotelListResult));
}

exports.getHotelName = async function (req, res){
    const hotelSearch = req.query.hotelName;
    if(!hotelSearch)
        return res.send(errResponse(baseResponse.HOTEL_NAME_EMPTY));
    const hotelNameResult = await hotelProvider.retrieveHotelName(hotelSearch);
    if(hotelNameResult == "")
        return res.send(errResponse(baseResponse.HOTEL_NAME_WRONG));
    const hotelTimeResult = await hotelService.patchTime(hotelSearch);
    return res.send(response(baseResponse.SUCCESS_HOTEL_N, hotelNameResult));
}

exports.getHotelRecent = async function (req,res){
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const userIdx = req.params.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{
        const hotelRecent = await hotelProvider.getRecent(userIdx);
        return res.send(response(baseResponse.SUCCESS_HOTEL_RECENT,hotelRecent));
    }
}

exports.getHotelSubway = async function (req, res){
    const hotelSubway = req.query.hotelSubway;
    if(!hotelSubway)
        return res.send(errResponse(baseResponse.HOTEL_SUBWAY_EMPTY));
    const hotelSubwayResult = await hotelProvider.retrieveHotelSub(hotelSubway);
    if(hotelSubwayResult == "")
        return res.send(errResponse(baseResponse.HOTEL_SUBWAY_WRONG));
    return res.send(response(baseResponse.SUCCESS_HOTEL_S, hotelSubwayResult));
}




exports.getHotelByIdx = async function (req, res){
    const hotelIdx=req.params.hotelIdx;
    if(!hotelIdx) return res.send(errResponse(baseResponse.HOTEL_HOTELIDX_EMPTY));
    const hotelByHotelIdx = await hotelProvider.retrieveHotel(hotelIdx);
    return res.send(response(baseResponse.SUCCESS_HOTEL_DETAILS,hotelByHotelIdx));
};

exports.getHotelReview = async function (req, res){
    const hotelIdx=req.params.hotelIdx;
    if(!hotelIdx) return res.send(errResponse(baseResponse.HOTEL_HOTELIDX_EMPTY));
    const hotelReview = await hotelProvider.retrieveHotelReview(hotelIdx);
    return res.send(response(baseResponse.SUCCESS_HOTEL_REVIEW,hotelReview));
}

exports.postHotelReview = async function (req,res){
    const {hotelIdx,kindness,cleanliness,convenience,supplySatisfaction,hotelReview,userIdx}=req.body;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    if (userIdxFromJWT != userIdx) {
        res.send(errResponse(baseResponse.USER_IDX_NOT_MATCH));
    }
    else{
        if(!hotelIdx) return res.send(errResponse(baseResponse.HOTEL_HOTELIDX_EMPTY));
        if (!hotelReview) return res.send(errResponse(baseResponse.REVIEW_CONTENT_EMPTY));
        if (hotelReview.length < 10) return res.send(errResponse(baseResponse.REVIEW_CONTENT_SHORT));
        if (hotelReview.length > 1000) return res.send(errResponse(baseResponse.REVIEW_CONTENT_LONG));
        if (!kindness) return res.send(errResponse(baseResponse.REVIEW_KINDNESS_EMPTY));
        if (!cleanliness) return res.send(errResponse(baseResponse.REVIEW_CLEANLINESS_EMPTY));
        if (!convenience) return res.send(errResponse(baseResponse.REVIEW_CONVENIENCE_EMPTY));
        if (!supplySatisfaction) return res.send(errResponse(baseResponse.REVIEW_SUPPLYSATISFACTION_EMPTY));
        if (kindness>5||kindness<0) return res.send(errResponse(baseResponse.REVIEW_KINDNESS_GRADE));
        if (cleanliness>5||cleanliness<0) return res.send(errResponse(baseResponse.REVIEW_CLEANLINESS_GRADE));
        if (convenience>5||convenience<0) return res.send(errResponse(baseResponse.REVIEW_CONVENIENCE_GRADE));
        if (supplySatisfaction>5||supplySatisfaction<0) return res.send(errResponse(baseResponse.REVIEW_SUPPLYSATISFACTION_GRADE));
        if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));


        // 더 많은 예외처리
        const hotelReviewResponse = await hotelService.createReview(hotelIdx,kindness,cleanliness,convenience,supplySatisfaction,hotelReview,userIdx);

        return res.send(hotelReviewResponse);
    }

}

exports.patchHotelReview = async function (req,res){
    const {kindness,cleanliness,convenience,supplySatisfaction,hotelReview,userIdx}=req.body;
    reviewIdx=req.params.reviewIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const reviewAccessCheck = await hotelProvider.ReviewAccessCheck(reviewIdx);
    if(reviewAccessCheck[0].userIdx !==userIdxFromJWT) {
        return res.send(errResponse(baseResponse.REVIEWPATCH_NOT_MATCH));
    }
    else{
        if (!hotelReview) return res.send(errResponse(baseResponse.REVIEW_CONTENT_EMPTY));
        if (hotelReview.length < 10) return res.send(errResponse(baseResponse.REVIEW_CONTENT_SHORT));
        if (hotelReview.length > 1000) return res.send(errResponse(baseResponse.REVIEW_CONTENT_LONG));
        if (!kindness) return res.send(errResponse(baseResponse.REVIEW_KINDNESS_EMPTY));
        if (!cleanliness) return res.send(errResponse(baseResponse.REVIEW_CLEANLINESS_EMPTY));
        if (!convenience) return res.send(errResponse(baseResponse.REVIEW_CONVENIENCE_EMPTY));
        if (!supplySatisfaction) return res.send(errResponse(baseResponse.REVIEW_SUPPLYSATISFACTION_EMPTY));
        if (kindness>5||kindness<0) return res.send(errResponse(baseResponse.REVIEW_KINDNESS_GRADE));
        if (cleanliness>5||cleanliness<0) return res.send(errResponse(baseResponse.REVIEW_CLEANLINESS_GRADE));
        if (convenience>5||convenience<0) return res.send(errResponse(baseResponse.REVIEW_CONVENIENCE_GRADE));
        if (supplySatisfaction>5||supplySatisfaction<0) return res.send(errResponse(baseResponse.REVIEW_SUPPLYSATISFACTION_GRADE));
        if (!userIdx) return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        // 더많은 예외처리

        const patchHotelReviewResponse = await hotelService.patchReview(kindness,cleanliness,convenience,supplySatisfaction,hotelReview,userIdx,reviewIdx);

        return res.send(patchHotelReviewResponse);
    }

}

exports.deleteHotelReview = async function (req, res){
    reviewIdx = req.params.reviewIdx;
    const userIdxFromJWT = req.verifiedToken.userIdx;
    const reviewAccessCheck = await hotelProvider.ReviewAccessCheck(reviewIdx);
    if(reviewAccessCheck[0].userIdx !==userIdxFromJWT) {
        return res.send(errResponse(baseResponse.REVIEWDELETE_NOT_MATCH));
    }
    else{
        if(!reviewIdx) return res.send(errResponse(baseResponse.REVIEW_IDX_EMPTY));
        // 더 많은 예외처리
        const deleteHotelReviewResponse = await hotelService.deleteReview(reviewIdx);

        return res.send(deleteHotelReviewResponse);
    }
}


