/**
 *  Attribute authentication
 */
export interface AttributeAuthentication {
  token: string
  expiresIn: string
  refreshToken?: string
  expiresRefreshIn?: string
}
