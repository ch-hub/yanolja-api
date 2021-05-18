const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const roomDao = require("./roomDao");


// 모든 방 정보 조회
exports.retrieveRoomList = async function(hotelIdx)
{
    const connection = await pool.getConnection(async (conn) => conn);
    const roomListResult = await roomDao.selectRoom(connection,hotelIdx);
    connection.release();
    return roomListResult;
}

