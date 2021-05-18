// 모든 유저 조회
 async function selectUser(connection) {
     const selectUserListQuery = `
                 SELECT userMail, userNickname
                 FROM User;
                 `;
     const [userRows] = await connection.query(selectUserListQuery);
     return userRows;
 }

// 이메일로 회원 조회
async function selectUserEmail(connection, userMail) {
    const selectUserEmailQuery = `
                SELECT userMail, userNickname 
                FROM User 
                WHERE userMail = ?;
                `;
    const [emailRows] = await connection.query(selectUserEmailQuery, userMail);
    return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userIdx) {
    const selectUserIdQuery = `
                 SELECT userNickname, userId,  userMail, userPassword, userPhonenum,userIdx
                 FROM User 
                 WHERE userIdx = ?;
                 `;
    const [userRow] = await connection.query(selectUserIdQuery, userIdx);
    return userRow;
}

// 유저 생성 (usernickname)
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
        INSERT INTO User(userMail, userPassword)
        VALUES (?, ?);
    `;
    const insertUserInfoRow = await connection.query(
        insertUserInfoQuery,
        insertUserInfoParams
    );

    return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
    const selectUserPasswordQuery = `
        SELECT userMail, userNickname, userPassword, userIdx
        FROM User
        WHERE userMail = ? AND userPassword = ?;`;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        selectUserPasswordParams
    );

    return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, userMail) {
    const selectUserAccountQuery = `
        SELECT userStatus, userId, userMail, userName, userIdx
        FROM User 
        WHERE userMail = ?;`;
    const selectUserAccountRow = await connection.query(
        selectUserAccountQuery,
        userMail
    );
    return selectUserAccountRow[0];
}

async function updateUserInfo(connection, userIdx, userNickname) {
    const updateUserQuery = `
  UPDATE User 
  SET userNickname = ?
  WHERE userIdx = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [userNickname, userIdx]);
    return updateUserRow[0];
}

async function updateUserPassword(connection, userIdx, hashednewPassword) {
    const updateUserQuery = `
  UPDATE User 
  SET userPassword = ?
  WHERE userIdx = ?;`;
    const updateUserRowPassword = await connection.query(updateUserQuery, [hashednewPassword, userIdx]);
    return updateUserRowPassword[0];
}

async function updateUserPhonenum(connection,userIdx,userPhonenum){
    const updateUserQuery = `
  UPDATE User 
  SET userPhonenum = ?
  WHERE userIdx = ?;`;
    const updateUserRowPhonenum = await connection.query(updateUserQuery, [userPhonenum, userIdx]);
    return updateUserRowPhonenum[0];
}

async function  editStatusUser(connection,userIdx){
    const editStatusQuery = `
        UPDATE User
        SET userStatus = 'D'
        WHERE userIdx = ? ;`;
    const updateUserStatus = await connection.query(editStatusQuery,userIdx);
    return updateUserStatus[0];

}
async function selectUserStatus(connection, userIdx) {
    const selectUserStatusQuery = `
        SELECT userStatus, userPassword
        FROM User 
        WHERE userIdx = ?;`;
    const selectUserCheckRow = await connection.query(
        selectUserStatusQuery,
        userIdx
    );
    return selectUserCheckRow[0];
}



async function selectUserDetails(connection,userIdx){
    const selectUserDetailsQuery = `
        select u.userIdx,
               u.profileImageUrl,
               u.userNickname,
               sum(p.pointUsageNum)as userPoint,
               (select count(*) from Coupon as c where u.userIdx=c.userIdx) as userCoupon,
               (select count(*) from Book as b where u.userIdx=b.userIdx AND b.bookUsage='Y') as 'roomUsage'
        from User as u
                 left join Point as p on u.userIdx=p.userIdx
        where u.userIdx = ?;
`;
    const [detailRow] = await connection.query(selectUserDetailsQuery,userIdx);
    return detailRow;
}


async function selectUserKeep(connection,userIdx){
    const selectUserKeepQuery = `
    select concat(date_format(r.roomCheckIn, '%m.%d'),' ~ ',date_format(r.roomCheckOut, '%m.%d'),' \` ') as 'CheckIn',
       r.roomNum as 'The Number ',
       c.couponInfo,
       hi.imageHotelUrl as 'hotelImageUrl',
       h.hotelName ,
       (select round((avg(re.kindness+re.cleanliness+re.convenience+re.supplySatisfaction)/4),1) from Review as re) as hotelGrade,
       (select count(*) from Review as rev where h.hotelIdx=rev.hotelIdx) as 'Total Review',
       (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'RentPrice',
       (select round(avg(priceRoom*3/4) ,0)from Price as p where p.roomIdx=r.roomIdx and useType='R') as 'SalePrice',
       r.roomCheckInAvailable,
       (select priceRoom from Price as p where p.roomIdx=r.roomIdx and useType='S') as 'StayPrice',
       h.useInformation,
       h.hotelEvent
    from Keep as k
        left join User as u on u.userIdx=k.userIdx
        left join Hotel as h on h.hotelIdx=k.hotelIdx
        left join Room as r on r.hotelIdx=h.hotelIdx
        left join HotelImage as hi on hi.hotelIdx=h.hotelIdx
        left join Coupon as c on c.userIdx=u.userIdx
    where u.userIdx= ?
    group by h.hotelIdx;`;

    const[keepRow] = await connection.query(selectUserKeepQuery,userIdx);
    return keepRow;
}

async function postUserKeep(connection,hotelIdx){
    const postUserKeepQuery = `
     SELECT hotelIdx
     FROM Keep
     WHERE hotelIdx = ?;`;

    const postUserKeepQueryRow = await connection.query(postUserKeepQuery, hotelIdx);
    return postUserKeepQueryRow[0];
}

// 찜 등록

async function insertUserKeep(connection,insertKeepParams){
    const insertUserKeepQuery = `
     INSERT INTO Keep(userIdx,hotelIdx)
     values (?,?);`;

    const insertUserKeepQueryRow = await connection.query(
        insertUserKeepQuery,insertKeepParams
    );
    return insertUserKeepQueryRow;
}



 async function eidtKeepStatusUser(connection,keepIdx){
    const editKeepStatusQuery = `
    UPDATE Keep
    SET keepStatus = 'D'
    WHERE keepIdx = ?;`;
    const updateKeepStatus = await connection.query(editKeepStatusQuery,keepIdx);
    return updateKeepStatus[0];
 }

 async function selectKeepCheck(connection,keepIdx){
    const selectKeepCheckQuery = `
    SELECT userIdx,keepStatus,keepIdx
    From Keep
    WHERE keepIdx = ?;`;
    const selectKeep = await connection.query(selectKeepCheckQuery,keepIdx);
    return selectKeep[0];
 };

async function selectUserPoint(connection,userIdx){
    const selectUserPointQuery=`
    select ifnull(sum(p.pointUsageNum),0) as 'UseAvailablePoint'
    from Point as p 
    where p.userIdx = ? and p.pointStatus='Y';`;
    const[PointRow] = await connection.query(selectUserPointQuery,userIdx);
    return PointRow;
}

async function selectUserCoupon(connection,userIdx){
    const selectUserCouponQuery=`
        select count(*) as 'TotalCoupon'
        from Coupon as c
        where c.userIdx= ?;`;
    const[CouponRow] = await connection.query(selectUserCouponQuery,userIdx);
    return CouponRow;
}

async function selectUserReview(connection,userIdx){
    const selectUserReviewQuery=`
        select h.hotelName,
       (select concat(round((avg(re.kindness+re.cleanliness+re.convenience+re.supplySatisfaction)/4),1),'/5') from Review as re) as hotelGrade,
       date_format(r.reviewCreatedAt,'%Y-%m-%d') as reviewCreatedAt,
       u.userNickname,
       ro.roomType,
       ro.roomInformation as roomInfo,
       r.hotelReview as reviewComment,
       ri.reviewImageUrl as reviewImage,
       rc.reviewComment
from Review as r
    left join Hotel as h on r.hotelIdx=h.hotelIdx
    left join User as u on r.userIdx=u.userIdx
    left join Book as b on r.bookIdx = b.bookIdx
    left join Room as ro on ro.roomIdx = b.roomIdx
    left join ReviewImage as ri on ri.reviewIdx=r.reviewIdx
    left join ReviewComment as rc on rc.reviewIdx=r.reviewIdx
where u.userIdx= ? ;`;
    const[ReviewRow] = await connection.query(selectUserReviewQuery,userIdx);
    return ReviewRow;
}

module.exports = {
    selectUser,
    selectUserEmail,
    selectUserId,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
    updateUserInfo,
    editStatusUser,
    selectUserDetails,
    selectUserKeep,
    insertUserKeep,
    eidtKeepStatusUser,
    selectUserPoint,
    selectUserCoupon,
    selectUserReview,
    selectUserStatus,
    postUserKeep,
    selectKeepCheck,
    updateUserPassword,
    updateUserPhonenum
};
