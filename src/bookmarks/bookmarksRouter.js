const route = require('express').Router();
const bookmarksService = require('../service/bookmarks_service');

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
}); 

function validateId(id){
  if(typeof id !== 'number') {
    return false;
  } else {
    return true;
  }
}

route.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  if(validateId(id)){
    bookmarksService.getById(req.app.get('db'), id)
      .then(bookmark => {
        res.status(200);
        res.json(bookmark);
      })
      .catch(next);
  } else {
    res.status(400);
    res.json({error:'invalid id'});
  }
});

module.exports = route;