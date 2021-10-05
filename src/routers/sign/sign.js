const express = require('express');
const app = express();
const argon2 = require('argon2');

const database = require('./database');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/test', (req, res) => {
  res.send('test');
});

app.get('/users', (req, res) => {
  res.send(database);
})

// 회원가입 부분 
// argon2를 이용해서 암호화를 해준다.
app.post('/signup', async (req, res) => {
  const { username, password, age, birthday } = req.body; 
  const hash = await argon2.hash(password);
  database.push({
      username,
      password: hash,
      age,
      birthday
  });
  res.send(database);
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = database.filter((user) => {
      return user.username === username; // 참인 경우만 모아서 배열로 반환해준다.
  });
  if (user.length === 0 ) { // 참인경우가 없다면 user.length는 0일 것이다.
      res.status(403).send('해당하는 id가 없습니다.'); // 클라이언트가 잘못했다.
      // res.status(500); // server가 잘못했다.
      return;
  }
  // 참인경우가있따면 
  if (!(await argon2.verify(user[0].password, password))) { // req.body의 password와 database를 비교한다.
      res.status(403).send('패스워드가 틀립니다.'); // 클라이언트가 잘못했다.
      return;
  }

  res.send('로그인 성공!');
});

app.listen(4040, () => {
  console.log('server on!');
})
