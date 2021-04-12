import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import { getToken } from '../../auth/utils'

const auth0secret = process.env.AUTH_0_SECRET;

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = '...'

export const handler = async (
	event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
	logger.info('Authorizing a user', event.authorizationToken)
	try {
		const jwtToken = await verifyToken(event.authorizationToken)
		logger.info('User was authorized', jwtToken)

		return {
			principalId: jwtToken.sub,
			policyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Action: 'execute-api:Invoke',
						Effect: 'Allow',
						Resource: '*'
					}
				]
			}
		}
	} catch (e) {
		logger.error('User not authorized', { error: e.message })

		return {
			principalId: 'user',
			policyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Action: 'execute-api:Invoke',
						Effect: 'Deny',
						Resource: '*'
					}
				]
			}
		}
	}
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
	try {
		const token = getToken(authHeader)
		//const jwt: JwtPayload = decode(token, { complete: true }) as JwtPayload
		const jwt: JwtPayload = verify(token, auth0secret) as JwtPayload

		// TODO: Implement token verification
		// You should implement it similarly to how it was implemented for the exercise for the lesson 5
		// You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
		return jwt;
	} catch (err) {
		throw err
	}
}
