async function selectHotels(connection){
    const selectHotelQuery = `
       select h.hotelIdx,
              h.hotelName,
              hi.imageHotelUrl,
              (select round((avg(re.kindness+re.cleanliness+re.convenience+re.supplySatisfaction)/4),1) from Review as re) as hotelGrade,
              (select count(*) from Review as rev where h.hotelIdx=rev.hotelIdx) as 'TotalReview',
              (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'Price',
              h.hotelEvent
       from Hotel as h
            left join Review as re on h.hotelIdx=re.hotelIdx
            left join Room as r on r.hotelIdx=h.hotelIdx
            left join HotelImage as hi on hi.hotelIdx=h.hotelIdx
       group by h.hotelIdx;`;
    const[hotelRows] = await connection.query(selectHotelQuery);
    return hotelRows;
};

async function selectHotel(connection,hotelLocation){
    const selectHotelQuery = `
       select h.hotelIdx,
              concat(date_format(r.roomCheckIn, '%m.%d'),' ~ ',date_format(r.roomCheckOut, '%m.%d'),' \` ', r.roomNum,'명') as 'checkIn',
              c.couponInfo,
              hi.imageHotelUrl,
              h.hotelName,
              (select round((avg(re.kindness+re.cleanliness+re.convenience+re.supplySatisfaction)/4),1) from Review as re) as hotelGrade,
              (select count(*) from Review as rev where h.hotelIdx=rev.hotelIdx) as 'TotalReview',             
              r.roomUseTime as 'Rent',
              (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'RentPrice',
               (select round(avg(priceRoom*3/4) ,0)from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'SaleRentPrice',
              r.roomCheckInAvailable as 'roomCheckInAvailable',
              (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'StayPrice',
             (select round(avg(priceRoom*3/4) ,0)from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'SaleStayPrice',
            h.hotelEvent
       from Hotel as h
            left join Review as re on h.hotelIdx=re.hotelIdx
            left join Room as r on r.hotelIdx=h.hotelIdx
            left join HotelImage as hi on hi.hotelIdx=h.hotelIdx
            left join User as u on u.userIdx=re.userIdx
            left join Coupon as c on c.userIdx=u.userIdx
       where h.hotelLocation LIKE CONCAT ('%',${hotelLocation},'%')
       group by h.hotelIdx;`;
    const[hotelRows] = await connection.query(selectHotelQuery,hotelLocation);
    return hotelRows;
}

async function selectHotelName(connection,hotelSearch){
    const selectHotelNameQuery = `
    select h.hotelIdx,
           concat(date_format(r.roomCheckIn, '%m.%d'), ' ~ ', date_format(r.roomCheckOut, '%m.%d'), ' \` ', r.roomNum,
                  '명') as 'checkIn',                  
           c.couponInfo,
           hi.imageHotelUrl,
           h.hotelName,
           (select round((avg(re.kindness+re.cleanliness+re.convenience+re.supplySatisfaction)/4),1) from Review as re) as hotelGrade,
           (select count(*) from Review as rev where h.hotelIdx=rev.hotelIdx) as 'TotalReview',
            r.roomUseTime as 'Rent',
            (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'RentPrice',
            (select round(avg(priceRoom*3/4) ,0)from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'SaleRentPrice',
            r.roomCheckInAvailable as 'roomCheckInAvailable',
            (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'StayPrice',
            (select round(avg(priceRoom*3/4) ,0)from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'SaleStayPrice',
            h.hotelInformation,
            h.hotelEvent
    from Hotel as h
             left join Review as re on h.hotelIdx=re.hotelIdx
             left join Room as r on r.hotelIdx=h.hotelIdx
             left join HotelImage as hi on hi.hotelIdx=h.hotelIdx
             left join User as u on u.userIdx=re.userIdx
             left join Coupon as c on c.userIdx=u.userIdx
        where h.hotelName LIKE CONCAT ('%',${hotelSearch},'%')
       group by h.hotelIdx;`
    const [hotelNameRows] = await connection.query(selectHotelNameQuery,hotelSearch);
    return hotelNameRows;
}
async function selectHotelSub(connection,hotelSubway){
    const selectHotelQuery = `
        select h.hotelIdx,
               concat(date_format(r.roomCheckIn, '%m.%d'), ' ~ ', date_format(r.roomCheckOut, '%m.%d'), ' \` ',
                      r.roomNum, '명') as 'checkIn',
                c.couponInfo,
               hi.imageHotelUrl,
               h.hotelName,
               (select round((avg(re.kindness+re.cleanliness+re.convenience+re.supplySatisfaction)/4),1) from Review as re) as hotelGrade,
               (select count(*) from Review as rev where h.hotelIdx=rev.hotelIdx) as 'TotalReview',
                r.roomUseTime as 'Rent',
                (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'RentPrice',
                (select round(avg(priceRoom*3/4) ,0)from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'SaleRentPrice',
                r.roomCheckInAvailable as 'roomCheckInAvailable',
                (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'StayPrice',
                (select round(avg(priceRoom*3/4) ,0)from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'SaleStayPrice',
                h.hotelInformation,
               h.hotelEvent
        from Hotel as h
                 left join Review as re on h.hotelIdx=re.hotelIdx
                 left join Room as r on r.hotelIdx=h.hotelIdx
                 left join HotelImage as hi on hi.hotelIdx=h.hotelIdx
                 left join User as u on u.userIdx=re.userIdx
                 left join Coupon as c on c.userIdx=u.userIdx
       where h.hotelLocation LIKE CONCAT ('%',${hotelSubway},'%')
       group by h.hotelIdx;`;
    const[hotelRows] = await connection.query(selectHotelQuery,hotelSubway);
    return hotelRows;
}

async function hotelNameUpdate(connection,hotelSearch){
    const hotelNameUpdateQuery = `
    update Hotel set hotelSearchDate = current_time
    where hotelName LIKE CONCAT ('%',${hotelSearch},'%');`;
    const [hotelNameUpdates] = await connection.query(hotelNameUpdateQuery,hotelSearch);
    return hotelNameUpdates;
}
// hotel idx로 조회
async function selectHotelIdx(connection,hotelIdx){
    const selectHotelIdxQuery=`
    select h.hotelIdx,
            hi.imageHotelUrl,
            h.hotelName,
           (select concat(round((avg(re.kindness+re.cleanliness+re.convenience+re.supplySatisfaction)/4),1),'/5') from Review as re) as hotelGrade,
           (select count(*) from Review as rev where h.hotelIdx=rev.hotelIdx) as 'TotalReivew',
           (select count(*) from ReviewComment as rc where rc.hotelIdx=re.hotelIdx) as 'TotalReviewComment',
            h.hotelLocation,
            h.hotelPhoneNum,
            c.couponInfo,
           k.keepStatus
       from Hotel as h
            left join Review as re on h.hotelIdx=re.hotelIdx
            left join Room as r on r.hotelIdx=h.hotelIdx
            left join HotelImage as hi on hi.hotelIdx=h.hotelIdx
            left join User as u on u.userIdx=re.userIdx
            left join Coupon as c on c.userIdx=u.userIdx
            left join Keep as k on k.userIdx=u.userIdx
       where h.hotelIdx = ?
       group by h.hotelIdx;`;
    const [hotelRow] = await connection.query(selectHotelIdxQuery,hotelIdx);
    return hotelRow;
}

// 호텔 리뷰 조회
async function selectHotelReview(connection,hotelIdx){
    const selectHotelReviewQuery=`
    select h.hotelName,
       (select concat(round((avg(re.kindness+re.cleanliness+re.convenience+re.supplySatisfaction)/4),1),'/5') from Review as re) as hotelGrade,
       date_format(r.reviewCreatedAt,'%Y-%m-%d') as reviewCreatedAt,
       u.userNickname,
       ro.roomType,
       ro.roomInformation as roomInfo,
       r.hotelReview as reviewComment,
       ri.reviewImageUrl as reviewImage,
       rc.reviewComment as 'reviewComment'
from Review as r
    left join Hotel as h on r.hotelIdx=h.hotelIdx
    left join User as u on r.userIdx=u.userIdx
    left join Book as b on r.bookIdx = b.bookIdx
    left join Room as ro on ro.roomIdx = b.roomIdx
    left join ReviewImage as ri on ri.reviewIdx=r.reviewIdx
    left join ReviewComment as rc on rc.reviewIdx=r.reviewIdx
where h.hotelIdx= ? ;`;
    const [hotelReview] = await connection.query(selectHotelReviewQuery,hotelIdx);
    return hotelReview;
}

async function insertHotelReview(connection,insertHotelReviewParams){
    const InsertHotelReviewQuery = `
    INSERT INTO Review(hotelIdx,kindness,cleanliness,convenience,supplySatisfaction,hotelReview,userIdx)
    VALUES (?,?,?,?,?,?,?);`;

    const insertHotelReviewQueryRow = await connection.query(
        InsertHotelReviewQuery,
        insertHotelReviewParams
    );
    return insertHotelReviewQueryRow;
}

async function patchHotelReview(connection,patchHotelReviewParams){
    const PatchHotelReviewQuery = `
    update Review set kindness=? ,cleanliness=? ,convenience=? ,supplySatisfaction=?, hotelReview=?, userIdx=?,reviewUpdatedAt=current_time,reviewStatus='P'
    where reviewIdx = ?;`;

    const patchHotelReviewQueryRow = await connection.query(
        PatchHotelReviewQuery,
        patchHotelReviewParams
    );
    return patchHotelReviewQueryRow;
}

async function accessHotelReview(connection,reviewIdx){
    const accessHotelReviewQuery=`
    SELECT userIdx,reviewStatus
    FROM Review
    WHERE reviewIdx = ? ;`;
    const [accessHotelReviewRow] = await connection.query(accessHotelReviewQuery,reviewIdx);
    return accessHotelReviewRow;
}

async function deleteHotelReview(connection,deleteHotelReviewParams){
    const DeleteHotelReviewQuery = `
    update Review set reviewStatus = 'D'
    where reviewIdx = ?;`;

    const deleteHotelReviewQueryRow = await connection.query(
        DeleteHotelReviewQuery,
        deleteHotelReviewParams
    );
    return deleteHotelReviewQueryRow;
}

async function userIdxReviews(connection,userIdx){
    const userIdxReviewsQuery = `
    SELECT userIdx
    FROM Review
    WHERE userIdx = ?;`;
    const [userIdxReviewsRow] = await connection.query(userIdxReviewsQuery,userIdx);
    return userIdxReviewsRow;
}
async function recentHotelTime(connection,userIdx){
    const recentHotelTimeQuery = `
    select h.hotelName,
       concat(date_format(r.roomCheckIn, '%y%m.%d(%a)'),' ~ ',date_format(r.roomCheckOut, '%y%m.%d(%a)'),' | 1박2일','성인', r.roomNum,'명') as 'checkIn'
from Hotel as h
    left join Room as r on r.hotelIdx=h.hotelIdx
    left join Book as b on b.roomIdx=r.roomIdx
    left join User as u on u.userIdx=b.userIdx
group by h.hotelName
order by h.hotelSearchDate desc;`;
    const [recentHotelRow] = await connection.query(recentHotelTimeQuery,userIdx);
    return recentHotelRow;
}

module.exports = {
   selectHotel,
   selectHotelIdx,
   selectHotelReview,
   insertHotelReview,
   patchHotelReview,
   deleteHotelReview,
    accessHotelReview,
    selectHotelName,
    selectHotels,
    selectHotelSub,
    userIdxReviews,
    hotelNameUpdate,
    recentHotelTime
};
