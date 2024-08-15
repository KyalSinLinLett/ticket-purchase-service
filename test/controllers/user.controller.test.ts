// UserController.test.ts
import { UserController } from 'controllers/UserController'
import { Request, Response, NextFunction } from 'express'
import { mockApp, mockUserService, mockAccessTokenService } from '../mocks'
import { HttpStatusCode } from 'types/http'
import { encrypt } from 'utils/index'
import moment from 'moment'
import { configuration } from 'config/index'

describe('UserController', () => {
  let userController: UserController
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    userController = new UserController(
      mockApp,
      mockUserService,
      mockAccessTokenService,
    )

    req = {
      body: {},
      useragent: {
        browser: 'TestBrowser',
        isMobile: false,
        isMobileNative: false,
        isTablet: false,
        isiPad: false,
        isiPod: false,
        isiPhone: false,
        isAndroid: false,
        isBlackberry: false,
        isOpera: false,
        isIE: false,
        isEdge: false,
        isIECompatibilityMode: false,
        isSafari: false,
        isFirefox: false,
        isWebkit: false,
        isChrome: false,
        isKonqueror: false,
        isOmniWeb: false,
        isSeaMonkey: false,
        isFlock: false,
        isAmaya: false,
        isEpiphany: false,
        isDesktop: false,
        isWindows: false,
        isWindowsPhone: false,
        isLinux: false,
        isLinux64: false,
        isMac: false,
        isChromeOS: false,
        isBada: false,
        isSamsung: false,
        isRaspberry: false,
        isBot: false,
        isCurl: false,
        isAndroidTablet: false,
        isWinJs: false,
        isKindleFire: false,
        isSilk: false,
        isCaptive: false,
        isSmartTV: false,
        silkAccelerated: false,
        version: '',
        os: '',
        platform: '',
        geoIp: {},
        source: '',
      },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    next = jest.fn()
  })

  describe('newUserApi', () => {
    it('should create a new user and return a success message', async () => {
      const mockUser = { id: 1, email: 'test@test.com' }
      mockUserService.createUser = jest.fn().mockResolvedValue(mockUser)

      req.body = {
        email: 'test@test.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '1234567890',
        dob: '1990-01-01',
        country: 'US',
      }

      await userController.newUserApi(req as Request, res as Response, next)

      expect(mockUserService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@test.com',
          password_hash: expect.any(String),
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '1234567890',
          dob: '1990-01-01',
          country: 'US',
          is_active: true,
          last_login_at: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      )

      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK)
      expect(res.json).toHaveBeenCalledWith({
        status: 1,
        message: 'sign-up success!',
        data: mockUser,
      })
    })

    it('should handle errors and call next', async () => {
      const error = new Error('data and salt arguments required')
      mockUserService.createUser = jest.fn().mockRejectedValue(error)

      await userController.newUserApi(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('authUserApi', () => {
    it('should authenticate a user and return a success message', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password_hash: 'hashedPassword',
      }
      const mockToken = { token: 'accessToken' }

      mockUserService.getUser = jest.fn().mockResolvedValue(mockUser)
      mockUserService.updateUser = jest.fn().mockResolvedValue(mockUser)
      mockAccessTokenService.getAccessToken = jest.fn().mockResolvedValue(null)
      mockAccessTokenService.createAccessToken = jest
        .fn()
        .mockResolvedValue(mockToken)

      req.body = {
        email: 'test@test.com',
        password: 'password123',
      }

      await userController.authUserApi(req as Request, res as Response, next)

      expect(mockUserService.getUser).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      })
    })

    it('should handle invalid email error', async () => {
      mockUserService.getUser = jest.fn().mockResolvedValue(null)

      req.body = {
        email: 'invalid@test.com',
        password: 'password123',
      }

      await userController.authUserApi(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new Error('email does not exist'))
    })

    it('should handle incorrect password error', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password_hash: 'hashedPassword',
      }
      mockUserService.getUser = jest.fn().mockResolvedValue(mockUser)

      req.body = {
        email: 'test@test.com',
        password: 'wrongPassword',
      }

      await userController.authUserApi(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(new Error('wrong password'))
    })

    it('should handle errors and call next', async () => {
      const error = new Error('Authentication failed')
      mockUserService.getUser = jest.fn().mockRejectedValue(error)

      await userController.authUserApi(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
