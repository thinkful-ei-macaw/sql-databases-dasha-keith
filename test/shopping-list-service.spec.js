const shoppingBinding = require('../src/shopping-list-Service.js')
const knex = require('knex');

console.log(process.env.DB_URL);

describe('Shopping List Service Object', function () {
    let db;
    let testStuff = [
        {
            id: 1,
            name: 'Name1',
            price: '1.00',
            category: 'Snack',
            date_added: new Date(),
            checked: false
        },
        {
            id: 2,
            name: 'Name2',
            price: '8.08',
            category: 'Main',
            date_added: new Date(),
            checked: true
        },
        {
            id: 3,
            name: 'Name3',
            price: '100.00',
            category: 'Lunch',
            date_added: new Date(),
            checked: false
        }
    ];


    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())


    afterEach(() => db('shopping_list').truncate())


    after(() => db.destroy());

    context(`Given 'shopping_list' has no data`, () => {
        it(`shoppingBinding() resolves an empty array`, () => {
            return shoppingBinding.getShoppingStuff(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it('insertStuff() inserts a thing and gives it an ID', () => {
            const newThing = {
                name: 'test',
                date_added: new Date(),
                price: '1.00',
                checked: false,
                category: 'Breakfast'
            };
            return shoppingBinding.insertStuff(db, newThing)
                .then(actual => {
                    expect(actual).to.eql({...newThing, id: 1})
                })

        })
    })
    context(`Given 'shopping_list has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testStuff)
        })
        it('getShoppingStuff() grabs the junk from the db', () => {
    
            return shoppingBinding.getShoppingStuff(db)
                .then(actual => {
                    expect(actual).to.eql(testStuff.map(item => {
                        return {
                            ...item,
                            date_added: new Date(item.date_added)
                        }
                    }))
                })
        })
        it('deleteStuff() deletes the stuff with the chosen ID', () => {
            const idKill = 2;
            return shoppingBinding.deleteStuff(db, idKill)
                .then(() => {
                    shoppingBinding.getShoppingStuff(db)
                        .then(actual => {
                            expect(actual).to.eql(testStuff.filter(item => item.id !== idKill).map(item => {
                                return { ...item, date_added: new Date(item.date_added) }
                            })
                            )
                        }
                        )
                })
        })
    
    
    
        it('updateList() updates the thing with the chosen ID', () => {
            const updateItemId = 1
            const newData = {
                name: 'updated',
                date_added: new Date(),
                price: '5.00',
                checked: false,
                category: 'Lunch'
            }
            return shoppingBinding.updateList(db, updateItemId, newData)
                .then(() => shoppingBinding.getById(db, updateItemId))
                .then(item => {
                    expect(item).to.eql({
                        id: updateItemId,
                        ...newData,
                    })
                })
    
    
    
        })
    
    
    
    
    
    
    
    })
})

