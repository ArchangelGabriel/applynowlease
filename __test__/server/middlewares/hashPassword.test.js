import hashPassword from 'server/middlewares/hashPassword'

describe('hashPassword', () => {

  test('should call next immediately if req.body.password is undefined', () => {
    const req = { body: {} }
    const next = jest.fn()
    hashPassword(req, null, next)
    expect(next).toHaveBeenCalled()
  })    

  test('testPassword should not equal to req.body.password if req.body.password is defined', () => {
    const testPassword = 'test_password'
    const req = { body: { password: testPassword } }
    const next = function(nextReq) {
      expect(nextReq.body.password).not.toEqual(testPassword)
    }

    return hashPassword(req, null, next.bind(null, req))
  })

})