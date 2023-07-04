import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3001/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['email', 'name'],
    });
    console.log('FacebookStrategy constructor');
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    console.log('validate facebook');
    const { name, emails } = profile;
    interface User {
      email: string;
      firstName: string;
      lastName: string;
    }
    const user: User = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    console.log('user :>> ', user);
    const payload: { user: User; accessToken: string } = {
      user,
      accessToken,
    };
    done(null, payload);
  }
}
