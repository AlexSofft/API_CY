import "cypress-localstorage-commands"
import { setAddBookRequestBody, setChangeBookRequestBody } from "../support/utils";

Cypress.Commands.add('createUser', () => {
    cy.fixture("logindata").then(data => {
        cy.request('POST', '/Account/v1/User', data)
    })
})

Cypress.Commands.add('getToken', () => {
    cy.fixture("logindata").then(data => {
        cy.request({
            method: 'POST',
            url: '/Account/v1/GenerateToken',
            body: data
        })
    })
})

Cypress.Commands.add('getUserInfo', (userID) => {
    cy.getLocalStorage('token').then(token => {
        console.log(`LOG ${token}`)
        console.log(`LOG ${userID}`)
        cy.request({
            method: 'GET',
            url: '/Account/v1/User/' + userID,
            failOnStatusCode: false,
            auth: {
                'bearer': token
            }
        })
    })
})


Cypress.Commands.add('deleteUser', () => {
    cy.getLocalStorage("userID").then(userID => {
        cy.getLocalStorage('token').then(token => {
            console.log(`LOG delete user isbn ${token}`)
            console.log(`LOG delete user userID ${userID}`)
            cy.request({
                method: 'DELETE',
                url: '/Account/v1/User/' + userID,
                auth: {
                    'bearer': token
                }
            })
        })
    })
})

Cypress.Commands.add('addBook', (isbn) => {
    console.log(`LOG addBook ${isbn}`)
    cy.getLocalStorage("userID").then(userID => {
        cy.getLocalStorage('token').then(token => {
            cy.request({
                method: 'POST',
                url: '/BookStore/v1/Books',
                body: setAddBookRequestBody(userID, isbn),
                auth: {
                    'bearer': token
                }
            })
        })
    })
})

Cypress.Commands.add('changeBook', (isbn, newIsbn) => {
    console.log(`LOG old isbn ${isbn}`)
    console.log(`LOG changed isbn ${newIsbn}`)
    cy.getLocalStorage('userID').then(userID => {
        cy.getLocalStorage('token').then(token => {
            cy.request({
                method: 'PUT',
                url: '/BookStore/v1/Books/' + isbn,
                auth: {
                    'bearer': token
                },
                body: {
                    "userId": userID,
                    "isbn": newIsbn
                }
            })
        })
    })
})

// Cypress.Commands.add('deleteBook', (isbn, userID) => {
   
// })

