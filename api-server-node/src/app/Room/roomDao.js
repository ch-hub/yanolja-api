async function selectRoom(connection,hotelIdx){
    const selectRoomQuery = `
    select k.keepStatus,
           c.couponInfo,
           ri.imageRoomUrl as roomImage,
       date_format(r.roomCheckIn,'%m월%d일(%a)') as roomCheckIn,
       date_format(r.roomCheckOut,'%m월%d일(%a)') as roomCheckOut,
       r.roomType,
       concat(r.roomNum,'명 / 최대',r.roomLimit,'명') as 'roomLimit',
       r.roomUseTime,
       r.roomRunTime,
       (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'RentPrice',
            (select round(avg(priceRoom*3/4) ,0)from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'SaleRentPrice',
       r.roomCheckInAvailable,
       r.roomCheckOutAvailable,
       (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'StayPrice',
            (select round(avg(priceRoom*3/4) ,0)from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'SaleStayPrice'
    from Room as r
        left join RoomImage as ri on ri.roomIdx=r.roomIdx
        left join Hotel as h on h.hotelIdx=r.roomIdx
        left join Keep as k on k.hotelIdx = h.hotelIdx
        left join User as u on u.userIdx = k.userIdx
        left join Coupon as c on c.userIdx=u.userIdx
    where r.hotelIdx = ?
    group by r.roomIdx;`;
    const[roomRows] = await connection.query(selectRoomQuery,hotelIdx);
    return roomRows;
}



module.exports = {
    selectRoom
};