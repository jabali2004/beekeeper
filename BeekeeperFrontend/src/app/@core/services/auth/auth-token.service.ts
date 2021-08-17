import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private token: string = null;

  constructor() {}

  /**
   * Return token if given
   */
  public getToken(): string {
    return this.token !== null ? this.token : this.readToken();
  }

  /**
   * Set token variable and write token to local storage
   */
  public setToken(token: string): void {
    this.token = token;
    this.writeToken(token);
  }

  /**
   * Clear token from localStorage
   */
  public clearToken(): void {
    this.token = null;
    this.deleteToken();
  }

  /**
   * Write token to local storage
   */
  private writeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Read token from local storage
   */
  private readToken(): string {
    return localStorage.getItem('token');
  }

  /**
   * Delete token in local storage
   */
  private deleteToken(): void {
    localStorage.removeItem('token');
  }

  /**
   * Decode token
   */
  // private decodeToken(token: string): Token | void {
  //   try {
  //     return jwt_decode(token) as Token;
  //   } catch (error) {
  //     return;
  //   }
  // }
}
