describe('account API', () => {
  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  after(() => {
    cy.deleteUser().then(response => {
      expect(response.status).to.eq(204)
      expect(response.statusText).to.eq('No Content')
    })
  })

  context('user creation', () => {
    it('create user', () => {
      cy.createUser().then(response => {
        expect(response.body).to.have.property('userID')
        expect(response.body).to.have.property('books')
        cy.fixture('logindata').then(data =>
          expect(response.body).to.have.property('username', `${data.userName}`)
        )
        cy.setLocalStorage('userID', response.body.userID)
        cy.saveLocalStorage()
      })
    })

    it('fail to create user', () => {
      cy.fixture('logindata').then(data =>
        cy.request({
          method: 'POST',
          url: '/Account/v1/User',
          failOnStatusCode: false,
          body: data
        }).then(response => {
          expect(response.status).to.eq(406)
          expect(response.body.message).to.eq('User exists!')
        }))
    })

    it('generate token', () => {
      cy.getToken().then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.result).to.eq('User authorized successfully.')
        cy.setLocalStorage('token', response.body.token)
        cy.saveLocalStorage()
      })
    })
  })

  context('user authotization', () => {
    it('check user authorize', () => {
      cy.fixture('logindata').then(data =>
        cy.request({
          method: 'POST',
          url: '/Account/v1/Authorized',
          failOnStatusCode: false,
          body: data
        }).then(response => {
          expect(response.status).to.eq(200)
          expect(response.body).to.eq(true)
        }))
    })

    it('check fail to authorize', () => {
      cy.fixture('logindata').then(data =>
        cy.request({
          method: 'POST',
          url: '/Account/v1/Authorized',
          failOnStatusCode: false,
          body: {
            "userName": "fakeUser",
            "password": "password"
          }
        }).then(response => {
          expect(response.status).to.eq(404)
          expect(response.body.message).to.eq('User not found!')
        }))
    })
  })

  context('user info', () => {
    it('get user info by UUID', () => {
      cy.getLocalStorage('userID').then(userID => {
        cy.getUserInfo(userID).then(response => {
          expect(response.status).to.eq(200)
          expect(response.body.userId).to.eq(userID) // userId not userID  
        })
      })
    })

    it('fail to get user info by UUID', () => {
      // const fakeId = '1'
      cy.getUserInfo('25').then(response => {
        expect(response.status).to.eq(401)
        console.log(`RESPONSE get ${Object.keys(response.body)}`)
        expect(response.body.message).to.eq('User not found!')
      })
    })
  })

})