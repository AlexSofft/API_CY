describe('bookstore API', () => {
    beforeEach(() => {
        cy.restoreLocalStorage()
    })

    before(() => {
        cy.createUser().then(response => {
            expect(response.body).to.have.property('userID')
            expect(response.body).to.have.property('books')
            cy.fixture('logindata').then(data =>
                expect(response.body).to.have.property('username', `${data.userName}`)
            )
            cy.setLocalStorage('userID', response.body.userID)
            cy.saveLocalStorage()
        })
        cy.getToken().then(response => {
            expect(response.status).to.eq(200)
            expect(response.body.result).to.eq('User authorized successfully.')
            cy.setLocalStorage('token', response.body.token)
            cy.saveLocalStorage()
        })
    })

    after(() => {
        cy.deleteUser().then(response => {
            expect(response.statusText).to.eq('No Content')
        })
    })

    it('get books', () => {
        cy.request('GET', '/BookStore/v1/Books').then(response => {
            expect(response.status).to.eq(200)
            expect(response.body.books).to.exist
            expect(response.body.books).not.to.be.empty
            cy.setLocalStorage('bookISBN', response.body.books[0].isbn)
            cy.setLocalStorage('newBookISBN', response.body.books[2].isbn)
            cy.saveLocalStorage()
            console.log(`book ${response.body.books[0].isbn}`)
            console.log(`new book ${response.body.books[2].isbn}`)
        })
    })

    it('get book', () => {
        cy.getLocalStorage('bookISBN').then(isbn => {
            cy.request('GET', `/BookStore/v1/Books?ISBN=${isbn}`).then(response => {
                expect(response.status).to.eq(200)
                expect(response.body.books[0].isbn).to.eq(isbn)
                console.log(`isbn get ${response.body.books[0].isbn}`)
            })
        })
    })

    it('add book', () => {
        cy.getLocalStorage('bookISBN').then(isbn => {
            cy.addBook(isbn).then(response => {
                expect(response.status).to.eq(201)
                expect(response.body.books[0].isbn).to.eq(isbn)
                console.log(`isbn add ${response.body.books[0].isbn}`)
            })
            cy.getLocalStorage('userID').then(userID => {
                cy.getUserInfo(userID).then(response => {
                    expect(response.status).to.eq(200)
                    expect(response.body.books[0].isbn).to.eq(isbn) // userId not userID  
                })
            })
        })
    })

    it('change book', () => {
        cy.getLocalStorage('bookISBN').then(isbn => {
            cy.getLocalStorage('newBookISBN').then(change => {
                cy.changeBook(isbn, change).then(response => {
                    expect(response.status).to.eq(200)
                    expect(response.body.books[0].isbn).to.eq(change)
                })
                cy.getLocalStorage('userID').then(userID => {
                    cy.getUserInfo(userID).then(response => {
                        expect(response.status).to.eq(200)
                        console.log(`changeBook ${Object.keys(response.body)}`)
                        expect(response.body.books[0].isbn).to.eq(change) // userId not userID  
                    })
                })
            })

        })
    })

    it('delete all books', () => {
        cy.getLocalStorage('userID').then(userID => {
            cy.getLocalStorage('token').then(token => {
                console.log(`userID ${userID}`)
                console.log(`token ${token}`)
                cy.request({
                    method: 'DELETE',
                    url: `/BookStore/v1/Books?UserId=` + userID,
                    auth: {
                        'bearer': token
                    }
                }).then(response => {
                    console.log(`deletebooks ${Object.keys(response)}`)
                    expect(response.status).to.eq(204)
                    expect(response.statusText).to.eq('No Content')
                })
            })
        })
    })


    // it('delete book', () => {
    //     cy.getLocalStorage('newBookISBN').then(isbn => {
    //         cy.getLocalStorage('userID').then(userID => {
    //             cy.getLocalStorage('token').then(token => {
    //                 cy.request({
    //                     method: "DELETE",
    //                     url: `​/BookStore/v1/Book`,
    //                     auth: {
    //                         'bearer': token
    //                     }, 
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: {
    //                         "isbn": isbn,
    //                         "userId": `${userID}`
    //                     }
    //                 }).then(response => {
    //                     console.log(`delete book ${Object.keys(response.body)}`)
    //                     expect(response.status).to.eq(204)
    //                     expect(response.body.message).to.eq('No content')
    //                 })
    //             })
    //         })
    //     })
    // })


})