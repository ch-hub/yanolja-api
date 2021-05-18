module.exports = function(app) {
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // room 정보 조회 API
    app.get('/rooms/:hotelIdx',room.getRoom);


}
