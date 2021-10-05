const express = require('express');
// const { resourceLimits } = require('worker_threads');
const app = express();

//bodyparser를 쓰기 위한 코드
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const database = require('./database');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
    // __dirname 은 localhost:portnumber일 것이다. 뒤는 url부분
    // render를 사용하기 위해서 ejs, pug를 찾아본다.
})
app.get('/database', function(req, res) {
    res.send(database);
})
app.get('/database/:id', function(req, res) {
    const id = req.params.id; // String
    const data = database.find((el) => el.id === Number(id));
    res.send(data);

    //database의 id는 숫자인데 params.id는 문자이다.
    //parans.id를 숫자로 바꿔준다.
})


/// 글쓰기
app.post('/database', function(req, res) {
    const title = req.body.title;
    database.push({
        id: database.length + 1,
        title,
    }),
    res.send('값 추가가 완료되었습니다.');
    console.log(database);
})

//// 수정
// 어떤 아이디를 어떤 아이디로 바꿀것인지
// 수정하고 싶은 id와 내용을 클라이언트가 보내주면 server가 database를 처리할 것이다.Number
//database의 index는 id - 1이다 왜냐? 우리가 id 값을 길이에 따라 줬으니깐.
app.put('/database', function(req, res) {
    const id = req.body.id; // 2가된다.
    const title = req.body.title; // 글4;
    database[id - 1].title = title; //database의 2번째 요소의 title은 내가 작성하는 타이틀이된다.
    res.send("값 수정 완료");
    console.log(database);
})
// 삭제
app.delete('/database', function(req, res) {
    const id = req.body.id; 
    database.splice(id - 1, 1);
    res.send(" 삭제 완료");
    console.log(database);
})


/// URL이 아닌 방법을 통해서 CRUD를 하는 법
// http 메소드를 통해서 어떻게 할 수 있냐?
//  생성의 의미는 post를 쓰기로 하고
//  수정의 의미를 가진건 put이나 patch라고 한다.
//  삭제의 의미를 가진건 delete라고 한다.

// 똑같은 url에서 다양한 동작이 가능해진다.
// API 작성
app.listen(4040, () => {
  console.log("server on!");
})

// fetch 라는 api호출을 써본다.
// axios 라는 library를 써본다.
