const express = require('express');
const bookmarksService = require('../service/bookmarks_service');
const route = express.Router();
const parse = express.json();

route.get('/', (req, res, next) => {
  bookmarksService.getAllBookmarks(req.app.get('db'))
    .then(bookmark => {
      res.status(200);
      res.json(bookmark);
    })
    .catch(err => {
      console.log(err);
      next();
    });
}).post('/', parse,(req, res, next)=>{
  //check if all req items in item
  let newItem;
  if(!req.body.title || !req.body.url || !req.body.rating)
    return res.status(400).json({error:'invalid bookmark'});
  else
    newItem = req.body;
  bookmarksService.addBookmark(req.app.get('db'), newItem)
    .then((newBook)=>{
      res.status(201)
        .location(`/bookmarks/${newBook[0].id}`)
        .json(newBook); 
    });
  

}); 

function validateId(id){
  return !isNaN(id);
}

route.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  console.log(id);
  if(validateId(id)){
    bookmarksService.getById(req.app.get('db'), id)
      .then(bookmark => {
        console.log('this is the resp from db:',bookmark);
        if(bookmark.length >= 1 ){
          res.status(200);
          res.json(bookmark);
        }else{
          res.status(404).json({error:'book not found'});
        }
      })
      .catch(next);
  } else {
    res.status(400);
    res.json({error:'invalid id'});
  }
}).patch('/:id',parse,(req,res,next)=>{
  let id = req.params.id;
  let {title,url,rating,description} = req.body;
  let body ={title,url,rating,description};
  if(!body.title && !body.url && !body.rating &&!body.description)
    return res.status(400).json({error:'invalid change'});
  if(validateId(id)){
    bookmarksService.updateBookMark(req.app.get('db'),id,body)
      .then(result => {
        res.status(201).json(result);
      }).catch(next);

  }else{
    res.status(404).json({error:'bookmark not found'});
  }

}).delete('/:id',(req,res,next)=>{
  let id = req.params.id;
  if(validateId(id)){
    bookmarksService.deleteBookMark(req.app.get('db'),id)
      .then(()=>{
        res.status(204).end();
      }).catch(next);
  }
  else
    res.status(404).json({error:'bookmark not found'}); 
});

module.exports = route;