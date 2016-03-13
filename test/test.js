var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app.js');
var expect = chai.expect;

chai.use(chaiHttp);


describe('/all', function() {
  it('should return all posts', function(done){
    chai.request(server)
      .post('/all')
      .send({
        order: 'ascending',
        compare: 'createdAt'
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        expect(JSON.parse(res.text).length).to.equal(56);
        done();
      })
  });
  it('should return posts ascending by date', function(done){
    chai.request(server)
      .post('/all')
      .send({
        order: 'ascending',
        compare: 'createdAt'
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        var sorted = data.reduce(function(a,b){
          var dateA = new Date(a.createdAt);
          var dateB = new Date(b.createdAt);
          if(dateA > dateB){
            return false;
          }
          return b;
        })
        expect(sorted).to.not.equal(false);
        done();
      })
  });
  it('should return posts descending by date', function(done){
    chai.request(server)
      .post('/all')
      .send({
        order: 'descending',
        compare: 'createdAt'
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        var sorted = data.reduce(function(a,b){
          var dateA = new Date(a.createdAt);
          var dateB = new Date(b.createdAt);
          if(dateA < dateB){
            return false;
          }
          return b;
        })
        expect(sorted).to.not.equal(false);
        done();
      })
  });
  it('should return posts ascending by price', function(done){
    chai.request(server)
      .post('/all')
      .send({
        order: 'ascending',
        compare: 'price'
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        var sorted = data.reduce(function(a,b){
          if(a.price > b.price){
            return false;
          }
          return b;
        })
        expect(sorted).to.not.equal(false);
        done();
      })
  });
  it('should return posts descending by price', function(done){
    chai.request(server)
      .post('/all')
      .send({
        order: 'descending',
        compare: 'price'
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        var sorted = data.reduce(function(a,b){
          if(a.price < b.price){
            return false;
          }
          return b;
        })
        expect(sorted).to.not.equal(false);
        done();
      })
  });
});

describe('/user', function(){

  it('should return zero users when given bogus id', function(done){
     chai.request(server)
      .post('/user')
      .send({
        id: 'nonexistent user'
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        expect(data.length).to.equal(0);
        done();
      })
  });

  it('should return all posts for a given user', function(done){
     chai.request(server)
      .post('/user')
      .send({
        id: '53f6c9c96d1944af0b00000b'
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        expect(data.length).to.equal(6);
        done();
      })
  });

});

describe('/single', function(){
  it('should return single post', function(done){
    chai.request(server)
      .post('/single')
      .send({
        id: '53fb8f26456e74467b000001'
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        expect(data.length).to.equal(1);
        done();
      })
  });
  it('should return nothing for bogus ID', function(done){
    chai.request(server)
      .post('/single')
      .send({
        id: 'nonexistent post'
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        expect(data.length).to.equal(0);
        done();
      })
  });
  it('should return post corresponding to given ID', function(done){
    var postID = '53fb8f26456e74467b000001';
    chai.request(server)
      .post('/single')
      .send({
        id: postID
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        expect(data[0].id).to.equal(postID);
        done();
      })
  });
});

describe('/loc', function(){
  it('should return nothing for distant coordinates', function(done){
    chai.request(server)
      .post('/loc')
      .send({
        lat: -50,
        lon: 50,
        dist: 50
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        expect(data.length).to.equal(0);
        done();
      })
  });
  it('should return all posts within 50 miles of given coordinates', function(done){
    chai.request(server)
      .post('/loc')
      .send({
        lat: 36.1665407118837763,
        lon: -115.1408087193642729,
        dist: 50
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        var data = JSON.parse(res.text);
        expect(data.length).to.equal(15);
        done();
      })
  });
})