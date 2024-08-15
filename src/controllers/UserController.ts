import { App } from "app";
import { RequestHandler } from "express";
import { Details } from "express-useragent";
import moment from "moment";
import { JsonResponse } from "types/index";
import { AUTH_USER_API, NEW_USER_API } from "data/route";
import { UserService } from "services/user";
import { CreationOptional, FindOptions, InferAttributes } from "sequelize";
import { AccessToken, User } from "db/init";
import { encrypt, generateHash, validateHash } from "utils/index";
import { AccessTokenService } from "services/accessToken";
import { HttpStatusCode } from "types/http";
import { configuration } from "config/index";

export class UserController {
    app: App;
    userService: UserService;
    accessTokenService: AccessTokenService
    constructor(
        app: App,
        userService: UserService,
        accessTokenService: AccessTokenService
    ) {
        this.app = app;
        this.userService = userService;
        this.accessTokenService = accessTokenService;
        this.initRoute();
    }

    newUserApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {
        const {
            email,
            password,
            first_name,
            last_name,
            phone_number,
            dob,
            country
        } = req.body;

        const now = moment().toDate();
        let user;
        try {
            user = await this.userService.createUser({
                email,
                password_hash: generateHash(password),
                first_name,
                last_name,
                phone_number,
                dob,
                country,
                is_active: true,
                last_login_at: null,
                created_at: now,
                updated_at: now
            })
        } catch (error) {
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({ status: 0, message: error.message });
        }

        return res
            .status(HttpStatusCode.OK)
            .json({ status: 1, message: "sign-up success!", data: user });
    }

    authUserApi: RequestHandler = async (req, res, next): Promise<JsonResponse> => {
        const { email, password } = req.body;

        const options: FindOptions<User> = {};
        if (!!email) options.where = { ...options.where, email };

        let user = await this.userService.getUser(options);

        if (!user)
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({ status: 0, message: "email does not exist!" });

        if (!validateHash(password, user.password_hash))
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({ status: 0, message: "wrong password!" });

        user = await this.userService.updateUser(user.id, { last_login_at: moment().toDate() } as InferAttributes<User>)

        // remove this block if wanna allow multiple logins for same user
        const isTknExist = await this.accessTokenService.getAccessToken({ where: { user_id: user.id, invalidated: false } });
        if (!!isTknExist) {
            await this.accessTokenService.updateAccessToken(isTknExist.token, { invalidated: true } as InferAttributes<AccessToken>)
        }

        const acsToken = await this.accessTokenService.createAccessToken({
            token: encrypt(`${user.id}`, Buffer.from(configuration.encryptionKey, 'base64')),
            user_id: user.id,
            expiry: moment().add(1, 'week').toDate(),
            invalidated: false,
            user_agent: JSON.stringify(req.useragent as Details),
            registration_datetime: moment().toDate()
        })

        return res
            .status(HttpStatusCode.OK)
            .json({ status: 1, message: "auth success!", data: user, token: acsToken.token });
    }

    initRoute = (): void => {
        this.app.route(NEW_USER_API, this.newUserApi);
        this.app.route(AUTH_USER_API, this.authUserApi);
    };
}
