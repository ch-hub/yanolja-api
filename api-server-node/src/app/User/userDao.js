// 모든 유저 조회
async function selectUser(connection) {
    const selectUserListQuery = `
                SELECT userIdx, userNickname,userPhonenum ,userStatus
                FROM User;
                `;
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
}


// userId 회원 조회
async function selectUserIdx(connection, userIdx) {
    const selectUserIdQuery = `
                 SELECT userIdx, userNickname,userPhonenum,userStatus 
                 FROM User 
                 WHERE userIdx = ?;
                 `;
    const [userRow] = await connection.query(selectUserIdQuery, userIdx);
    return userRow;
}

// 핸드폰 번호 중복조회

async function selectUserPhonenum(connection, userPhonenum) {
    const selectUserPhoneQuery = `
                SELECT userPhonenum, userNickname,userIdx 
                FROM User 
                WHERE userPhonenum = ?;
                `;
    const [phoneRows] = await connection.query(selectUserPhoneQuery, userPhonenum);
    return phoneRows;
}

// 닉네임 중복 조회
async function selectUserNickname(connection, userNickname) {
    const selectUserNicknameQuery = `
                SELECT userPhonenum, userNickname,userIdx 
                FROM User 
                WHERE userNickname = ?;
                `;
    const [nicknameRows] = await connection.query(selectUserNicknameQuery, userNickname);
    return nicknameRows;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
        INSERT INTO User(userPhonenum,userNickname)
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
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ? AND password = ?;`;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        selectUserPasswordParams
    );

    return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, userPhonenum) {
    const selectUserAccountQuery = `
        SELECT userIdx, userPhonenum,userStatus
        FROM User 
        WHERE userPhonenum = ?;`;
    const selectUserAccountRow = await connection.query(
        selectUserAccountQuery,
        userPhonenum
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

async function selectUserId(connection, userIdx) {
    const selectUserIdQuery = `
                 SELECT userNickname, userPhonenum,userIdx,userStatus
                 FROM User 
                 WHERE userIdx = ?;
                 `;
    const [userRow] = await connection.query(selectUserIdQuery, userIdx);
    return userRow;
}

async function updateUserStatus(connection,userIdx){
    const editStatusQuery = `
        UPDATE User
        SET userStatus = 'N'
        WHERE userIdx = ? ;`;
    const updateUserStatus = await connection.query(editStatusQuery,userIdx);
    return updateUserStatus[0];

}

module.exports = {
    selectUser,
    selectUserIdx,
    selectUserPhonenum,
    selectUserNickname,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
    updateUserInfo,
    selectUserId,
    updateUserStatus
};
