module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
    PINGPONG_SUCCESS : { "isSuccess": true, "code": 1000, "message":"핑퐁성공" },
    USER_SUCCESS : { "isSuccess": true, "code": 1000, "message":"전체 조회 성공" },
    SUCCESS_USERIDX : { "isSuccess": true, "code": 1000, "message":"userIdx로 조회 성공" },
    SUCCESS_AUTHNUM : { "isSuccess": true, "code": 1000, "message":"인증번호 생성 성공" },
    SUCCESS_SIGNUP : { "isSuccess": true, "code": 1000, "message":"회원가입 성공" },
    SUCCESS_SIGNIN : { "isSuccess": true, "code": 1000, "message":"로그인 성공" },
    SUCCESS_EDIT_NICKNAME : { "isSuccess": true, "code": 1000, "message":"닉네임 변경 성공" },
    SUCCESS_EDIT_STATUS : { "isSuccess": true, "code": 1000, "message":"탈퇴 성공" },



    //Request error
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 Idx 값을 확인해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    
    
    
    USER_PHONE_EMPTY : { "isSuccess": false, "code": 2019, "message": "회원 핸드폰 번호를 입력해주세요" },
    SIGNUP_PHONENUM_REGIX : { "isSuccess": false, "code": 2020, "message": "핸드폰 번호 입력 형식이 아닙니다" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2021, "message": "회원 닉네임을 입력해주세요" },
    USER_NICKNAME_REGIX : { "isSuccess": false, "code": 2022, "message": " 닉네임은 2~12자 한글,영문,숫자로만 이루어져야 합니다" },

    
    
    // Response error
    SIGNUP_REDUNDANT_PHONENUM : { "isSuccess": false, "code": 3001, "message": "이미 등록된 핸드폰 번호입니다" },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },
    SIGNIN_NO_PHONENUM : { "isSuccess": false, "code": 3003, "message": "회원가입되지 않은 회원입니다" },
    DELETE_STATUS : { "isSuccess": false, "code": 3004, "message": "이미 탈퇴된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "삭제된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},


}
