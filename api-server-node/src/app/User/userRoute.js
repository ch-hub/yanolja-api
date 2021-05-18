module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    // app.get('/app/test', user.getTest)

    // 1. 유저 생성 (회원가입) API
    app.post('/signup', user.postSignup);

    // 2. 유저 조회 API (+ 검색)
    app.get('/users',user.getUsers);

    // 3. 특정 유저 조회 API
    app.get('/users/:userIdx', user.getUserByIdx);


    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    app.post('/signin', user.postSignin);

    // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
    // JWT 검증 API
     app.get('/auto-login',jwtMiddleware,user.check);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/users/:userIdx/nickname',jwtMiddleware,user.patchNicknameUsersByIdx);

    // 비밀번호 수정 API
    app.patch('/users/:userIdx/password',jwtMiddleware,user.patchPasswordUsersByIdx);

    // 전화번호 수정 API
    app.patch('/users/:userIdx/phonenum',jwtMiddleware,user.patchPhonenumUsersByIdx);



    // 탈퇴하기 API
    app.patch('/users/:userIdx/status',jwtMiddleware,user.deleteUserByStatus);

    // 유저 정보 detail 조회 API
    app.get('/users/:userIdx/details',jwtMiddleware,user.getUserDetails);

    // 유저가 찜한 정보 조회 API
    app.get('/users/:userIdx/keep',jwtMiddleware,user.getUserKeep);

    //찜 등록 Api
    app.post('/users/keep',jwtMiddleware,user.postUserKeep);

    //찜 삭제 API
    app.patch('/users/keep/:keepIdx/status',jwtMiddleware,user.deleteKeepByStatus);

    //포인트 조회하기 API
    app.get('/users/:userIdx/points',jwtMiddleware,user.getPoint);

    // 쿠폰 조회하기 API
    app.get('/users/:userIdx/coupons',jwtMiddleware,user.getCoupon);

    // 내 예약 조회하기 API
    app.get('/users/:userIdx/reviews',jwtMiddleware,user.getReview);

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
//

// TODO: 탈퇴하기 API