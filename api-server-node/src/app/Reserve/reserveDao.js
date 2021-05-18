async function selectReserve(connection,userIdx){
    const selectReserveQuery = `
        select b.bookUsage,
               h.hotelName,
                r.roomType,
                b.visitTypeStatus,
                concat(date_format(r.roomCheckIn,'%Y/%m/%d(%a)%H:%i'), '~',date_format(r.roomCheckOut,'%Y/%m/%d(%a)%H:%i')) as checkOut,
               h.hotelLocation,
                h.hotelPhoneNum ,
                re.reviewStatus
        from Book as b
                 left join Room as r on r.roomIdx=b.roomIdx
                 left join Hotel as h on h.hotelIdx=r.hotelIdx
                 left join Review as re on re.hotelIdx=r.hotelIdx
        where b.bookStatus ='Y' AND b.userIdx = ?
        group by b.bookIdx;`;
    const[reserveRows] = await connection.query(selectReserveQuery,userIdx);
    return reserveRows;
}

async function insertReserve(connection,insertReserveParams){
    const insertReserveQuery = `
    INSERT INTO Book(roomIdx, visitTypeStatus, bookCheckIn,userIdx)
    VALUES (?,?,?,?);`;
    const insertReserveQueryRow = await connection.query(
        insertReserveQuery,
        insertReserveParams
    );
    return insertReserveQueryRow;
}

async function setReserve(connection,roomIdx){
    const setReserveQuery = `
    update Book set bookStatus = 'N'
    where roomIdx = ?;`;
    const setReserveQueryRow = await connection.query(
        setReserveQuery,
        roomIdx
    );
    return setReserveQueryRow;
}

async function accessHotelReserve(connection,roomIdx){
    const accessHotelReserveQuery=`
    SELECT userIdx, bookStatus
    FROM Book
    WHERE roomIdx = ? ;`;
    const [accessHotelReservewRow] = await connection.query(accessHotelReserveQuery,roomIdx);
    return accessHotelReservewRow;
}

async function deleteReserve(connection,deleteReviewParams){
    const deleteReserveQuery=`
    update Book set bookStatus = 'Y'
    where bookIdx = ?;`;

    const deleteReserveQueryRow = await connection.query(
        deleteReserveQuery,
        deleteReviewParams
    );
    return deleteReserveQueryRow;
}
async function deleteHotelReserve(connection,bookIdx){
    const deleteHotelReserveQuery=`
    SELECT userIdx, bookStatus
    From Book
    WHERE bookIdx = ?;`;

    const [deleteHotelReserveQueryRow] = await connection.query(deleteHotelReserveQuery,bookIdx);
    return deleteHotelReserveQueryRow;
}


module.exports = {
    selectReserve,
    insertReserve,
    deleteReserve,
    accessHotelReserve,
    setReserve,
    deleteHotelReserve
};