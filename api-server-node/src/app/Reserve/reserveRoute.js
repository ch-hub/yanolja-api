module.exports = function(app) {
    const reserve = require('./reserveController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 예약 내역 조회
    app.get('/reserves/:userIdx',jwtMiddleware,reserve.getReserve);

    // 예약하기
    app.post('/reserves',jwtMiddleware,reserve.postReserve);

    // 예약 삭제하기(환불)
    app.patch('/reserves/:bookIdx',jwtMiddleware,reserve.deleteReserve);
}