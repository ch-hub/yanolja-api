module.exports = function(app){
    const hotel = require('./hotelController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
   
    //hotel 전체 조회
    app.get('/hotels',hotel.getHotel);

    // hotel 지역으로 조회
    app.get('/hotels/locations',hotel.getHotelLocation);

    // hotel 이름으로 조회
    app.get('/hotels/names',hotel.getHotelName);

    //hotel 내 주변
    app.get('/hotels/subway',hotel.getHotelSubway);

    //hotel 최근 조회
    app.get('/hotels/recent/:userIdx',jwtMiddleware,hotel.getHotelRecent);


    // hotel 상세 조회 API
    app.get('/hotels/:hotelIdx',hotel.getHotelByIdx);

    // hotel review 조회 API
    app.get('/hotels/:hotelIdx/review',hotel.getHotelReview);

    // hotel review 생성 API
    app.post('/hotels/review',jwtMiddleware,hotel.postHotelReview);

    // hotel review reviewIdx로 수정 API
    app.patch('/hotels/review/:reviewIdx',jwtMiddleware,hotel.patchHotelReview);

    // hotel review 삭제 API
    app.patch('/hotels/review/:reviewIdx/status',jwtMiddleware,hotel.deleteHotelReview);

}