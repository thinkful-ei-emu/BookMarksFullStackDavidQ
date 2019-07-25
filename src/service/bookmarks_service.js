const bookmarksService = {
  getAllBookmarks(db) {
    return db.select('*').from('bookmarks');
  },
  getById(db, id) {
    return db.select('*').from('bookmarks').where({id});
  },
  addBookmark(db,newBook){
    return db('bookmarks').insert(newBook).returning('*');
  },
  updateBookMark(db,id,update){
    return db('bookmarks').where({id}).update({update});
  },
  deleteBookMark(db,id){
    return db('bookmarks').where({id}).delete();
  }
};

module.exports = bookmarksService;