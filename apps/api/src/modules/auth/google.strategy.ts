import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '1072280603428-60ssmmc1p197eab5ua55b26udl3m21to.apps.googleusercontent.com', // Fallback for dev
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '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', // Fallback for dev
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
            googleId: profile.id
        };
        done(null, user);
    }
}
