// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '7h4fhyi0wb'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-2.amazonaws.com/dev`

export const authConfig = {
	// TODO: Create an Auth0 application and copy values from it into this map
	domain: 'dev-qt8zh-wb.eu.auth0.com',            // Auth0 domain
	clientId: 'Q9id8k3smotnu9dHKsf7ijiNUTVDhgJV',          // Auth0 client id
	callbackUrl: 'http://localhost:3000/callback'
}
