const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

beforeEach((done) => {
  User.remove({}).then(() => done());
});



describe('POST /users/login',()=>{
  if('Should login user and return auth token',(done)=>{
      request(app).post('users/login')
      .send({
        email:users[1].email,
        password:users[1].password
      }).ecpect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
        expect(user.tokens[0]).toInclude({
          access:'auth',
          token:res.headers['x-auth']
        });
        done();
      }).catch((e)=>done(e));

      })
  });
  if('Should reject valid login',(done)=>{

  });
})
