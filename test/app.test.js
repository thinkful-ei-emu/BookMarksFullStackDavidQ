const app = require('../src/app');
require('dotenv').config();
//supertest is global variable called request
const testData = require('./bookmarks.fixture')();
const knex = require('knex');
const bkService = require('../src/service/bookmarks_service');
let db;

describe('all endpoint work',()=>{
  before('set up db',()=>{
    db = knex({
      client:'pg',
      connection:process.env.DB_URL_TEST
    });
    app.set('db',db);
    
  });
  after('ending db connection',()=>db.destroy());

  before('clean table',()=>db('bookmarks').truncate());

  afterEach(()=>{
    db('bookmarks').truncate();
  });
  describe('handles GET correctly',()=>{
    beforeEach('insert into db',()=>{
      return db.into('bookmarks').insert(testData);
    });
 
    it('resonse with a 200 code',()=>{
      return request(app).get('/').expect(200);
    });
    it('returns all bookmarks',()=>{
      return request(app)
        .get('/bookmarks')
        .expect(200)
        .expect((res)=>{
          expect(res.body).is.an('array');
        });
    });
    it('returns specific book',()=>{
      
      return request(app).get('/bookmarks/1')
        .expect(200)
        .expect((res)=>{
          expect(res.body[0]).is.an('object');
        });
    });
    it('returns a 400 if given invalid id',()=>{
      return request(app).get('/bookmarks/asdasd')
        .expect(400)
        .expect({error:'invalid id'});
    });
    it('returns 404 if id is not in DB',()=>{
      return request(app).get('/bookmarks/402111')
        .expect(404);
    });
  });

  describe('Handles POST request',()=>{
    beforeEach('insert into db',()=>{
      return db.into('bookmarks').insert(testData);
    });
    it(' returns a 400 if input is invalid',()=>{
      return request(app)
        .post('/bookmarks')
        .send({error:'this is a test'})
        .expect(400);
    });
    it(' returns a 400 if input is empty',()=>{
      return request(app)
        .post('/bookmarks')
        .expect(400);
    });
    it('returns 201 if post successful',()=>{
      return request(app)
        .post('/bookmarks')
        .send({title:'test_book',url:'www.test.com',rating:3})
        .expect(201)
        .expect((res)=>{
          console.log(res.headers.location, res.body);
          expect(res.body).to.be.an('array');
        });
    });
    /* it('returns a 400 code if resource already exsist',()=>{
      request(app).post('/bookmarks').send({id:1})
    }); */
  });
  describe('Handle Patch',()=>{
    beforeEach('insert into db',()=>{
      return db.into('bookmarks').insert(testData);
    });
    it('returns 201 if successfull',()=>{
      return request(app).patch('/bookmarks/1')
        .send({title:'the hobbit'})
        .expect(201)
        .then(()=>{
          expect(db.select('title').from('bookmarks').to.be('the hobbit'));
        });
    });
    it('returns 404 if selected item is not found',()=>{
      return request(app)
        .patch('/bookmarks/asdasd')
        .send({'title':'test'})
        .expect(404);
    });
    it('returns 400 if change is invalid',()=>{
      return request(app)
        .patch('/bookmarks/1')
        .send({'test':'test'})
        .expect(400, {error:'invalid change'});
    });
  });
  describe('handle Delete',()=>{
    beforeEach('insert into db',()=>{
      return db.into('bookmarks').insert(testData);
    });
    it('returns a 204 on success',()=>{
      return request(app)
        .delete('/bookmark/1')
        .expect(204);
    });
    it('returns a 404 if item not in db',()=>{
      return request(app)
        .delete('/bookmark/asdasd')
        .expect(404);
    });

  });
});