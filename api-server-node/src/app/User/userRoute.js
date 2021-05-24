module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 서버 확인
    app.get('/pingpong',user.pingPong);

    //인증번호 생성 API
    app.post('/certifications',user.authNum);

    // 1. 유저 생성 (회원가입) API
    app.post('/signup', user.postUsers);

    // 2. 유저 조회 API (+ 검색)
    app.get('/users',user.getUsers);

    // 3. 특정 유저 조회 API
    app.get('/users/:userIdx', user.getUserByIdx);

    // 로그인 하기 API (JWT 생성)
    app.post('/signin', user.postSignin);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/users/:userIdx', jwtMiddleware, user.patchUsers);

    //회원 탈퇴
    app.patch('/users/:userIdx/status',jwtMiddleware,user.patchStatus);

    

};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API


// TODO: 탈퇴하기 API