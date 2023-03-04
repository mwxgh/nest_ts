/**
 *  Authentication attribute
 */
export interface AuthenticationAttribute {
  token: string
  expiresIn: string
  refreshToken?: string
  expiresRefreshIn?: string
}
