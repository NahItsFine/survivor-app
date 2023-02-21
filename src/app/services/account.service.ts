import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AccountReturn {
    username: string;
    name: string;
    bio: string;
    discord: string;
    avatar: string;
}

export interface CreateAccountReturn {
  account_created: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient
  ) { }

  get_account_info(username: string | undefined): Observable<AccountReturn> {
    return this.http.get<AccountReturn>(`${environment.api_endpoint}account?username=${username}`)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  create_account(
    pass_username: string,
    pass_password: string,
    pass_name: string,
    pass_discord: string,
    pass_avatar: string,
    pass_bio: string
  ): Observable<CreateAccountReturn> {
    const body = {username: pass_username, password: pass_password, name: pass_name, discord: pass_discord, avatar: pass_avatar, bio: pass_bio};
    return this.http.post<CreateAccountReturn>(`${environment.api_endpoint}create_account`, body)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

}