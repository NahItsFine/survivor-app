import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Challenge {
    id: number;
    name: string;
    type: number;           // 0 = tribe, 1 = individual, 2 = final 4, 3 = tower
    description: string;
    means: string;
    icon: string;
}

export interface ChallengeNameReturn {
  challenge_name: string;
}

export interface AllChallengesReturn {
    message: string;
    tribal_challenges: Challenge[];
    individual_challenges: Challenge[];
    final_four_challenges: Challenge[];
    tower_challenge: Challenge[];
}

@Injectable({
providedIn: 'root'
})
export class ChallengeService {
  
    constructor(
      private http: HttpClient
    ) { }
  
    get_all_challenges(): Observable<AllChallengesReturn> {
      return this.http.get<AllChallengesReturn>(`${environment.api_endpoint}challenges`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    get_challenge_name(challenge_id: number | undefined): Observable<ChallengeNameReturn> {
      return this.http.get<ChallengeNameReturn>(`${environment.api_endpoint}get_challenge_name?challenge_id=${challenge_id}`)
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