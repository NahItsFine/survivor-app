import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface GameReturn {
    game_id: number;
    password: string;
    name: string;
    discord_link: string;
    num_rounds_played: number;
    game_stage: number;
    is_active: boolean;
    joinable: boolean;
    num_players: number;
    num_players_left: number;
}

export interface rounds {
  round_num: number | undefined;
  day: string | undefined;
  eliminated_player: number | undefined;
  type: number | String | undefined;
  winning_tribe: number | undefined;
  winning_player: number | undefined;
  challenge_id: number | undefined;
}


export interface CurrentPlayerReturn {
  player_id: number;
  name: string;
  discord_name: string;
  avatar: string;
  idol_count: number;
  is_still_playing: boolean;
  is_admin: boolean;
  tribe_id: number;
  tribe_colour: number;
}
export interface PlayersReturn {
  players: Array<Player>
}

export interface Player {
  username: string;
  player_id: number;
  name: string | undefined;
  discord_name: string | undefined;
  avatar: string | undefined;
  bio: string | undefined;
  is_still_playing: boolean | undefined;
  tribe_id: number | undefined;
  is_admin: boolean;
  tribe_colour: number;
}

export interface roundWinnerReturn {
  name: string | number;
}
export interface roundsReturn {
  rounds: Array<rounds>;
}

export interface JoinCreateGameReturn {
  successful: boolean;
  message: string;
  game_id: number;
  player_id: number;
}

export interface StartGameReturn {
  successful: boolean;
  message: string;
}
export interface StartRoundReturn {
  successful: boolean;
  message: string;
  new_round_num: number;
}

@Injectable({
    providedIn: 'root'
  })
  export class GameService {
  
    constructor(
      private http: HttpClient
    ) { }
  
    get_game_info(game_id: number | undefined): Observable<GameReturn> {
      return this.http.get<GameReturn>(`${environment.api_endpoint}game?game_id=${game_id}`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    get_game_rounds(game_id: number | undefined) {
      return this.http.get<roundsReturn>(`${environment.api_endpoint}game_rounds?game_id=${game_id}`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    get_tribe_name_by_id(tribe_id: number | undefined){
      return this.http.get<roundWinnerReturn>(`${environment.api_endpoint}name_by_id?tribe_id=${tribe_id}`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }
    get_player_name_by_id(player_id: number | undefined){
      return this.http.get<roundWinnerReturn>(`${environment.api_endpoint}name_by_id?player_id=${player_id}`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    get_game_current_player(username: string | undefined, game_id: number | undefined) {
      return this.http.get<CurrentPlayerReturn>(`${environment.api_endpoint}current_player?username=${username}&game_id=${game_id}`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    get_game_players(game_id: number | undefined) {
      return this.http.get<PlayersReturn>(`${environment.api_endpoint}game_players?game_id=${game_id}`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    get_active_game_players(game_id: number | undefined) {
      return this.http.get<PlayersReturn>(`${environment.api_endpoint}active_game_players?game_id=${game_id}`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    join_game(username: string, name: string, password: string) {
      return this.http.get<JoinCreateGameReturn>(`${environment.api_endpoint}game_join?username=${username}&name=${name}&password=${password}`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    create_game(
      _username: string,
      _name: string,
      _password: string,
      _discord: string
    ): Observable<JoinCreateGameReturn> {
      const body = {username: _username, name: _name, password: _password, discord: _discord};
      return this.http.post<JoinCreateGameReturn>(`${environment.api_endpoint}game_create`, body)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    start_game(game_id: number) {
      return this.http.patch<StartGameReturn>(`${environment.api_endpoint}start_game?game_id=${game_id}`,'')
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    start_round(game_id: number) {
      return this.http.post<StartRoundReturn>(`${environment.api_endpoint}start_round?game_id=${game_id}`,'')
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    end_game(game_id: number) {
      return this.http.patch<StartGameReturn>(`${environment.api_endpoint}end_game?game_id=${game_id}`,'')
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    transfer_idol(game_id: number, giver_uername: string, taker_username: string) {
      return this.http.patch<StartGameReturn>(`${environment.api_endpoint}transfer_idol?game_id=${game_id}&giver_username=${giver_uername}&taker_username=${taker_username}`,'')
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    get_current_games(username: string){
      return this.http.get<GameReturn[]>(`${environment.api_endpoint}get_games?username=${username}&complete=False`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    get_completed_games(username: string){
      return this.http.get<GameReturn[]>(`${environment.api_endpoint}get_games?username=${username}&complete=True`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
    }

    get_player_from_username(username: string, game_id: number){
      return this.http.get<Player[]>(`${environment.api_endpoint}get_player_from_username?username=${username}&game_id=${game_id}`)
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