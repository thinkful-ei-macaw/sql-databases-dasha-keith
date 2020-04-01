

const shoppingBinding = {

  getShoppingStuff(db) {
    return db
      .from('shopping_list')
      .select('*');

  },

  deleteStuff(db, id) {
    return db
      .from('shopping_list')
      .where( {id} )
      .delete();
  },

  updateList(db, id, newStuff) {
    return db('shopping_list')
      .where( {id} )
      .update(newStuff)
      .returning('*');

  },

  insertStuff(db, newStuff){
    return db
      .insert(newStuff)
      .into('shopping_list')
      .returning('*')
      .then(rows => rows[0]);
  },

  getById(db, id) {
    return db
      .from('shopping_list')
      .select()
      .where( {id} )
      .first();
  }

};

module.exports = shoppingBinding;