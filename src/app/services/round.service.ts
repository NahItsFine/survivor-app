import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Challenge } from './challenge.service';
// import { Round } from '../subcomponents/timeline-mat-step/timeline-mat-step.component';

// export interface RoundVote {
//     num: Number;
// }

// export interface RoundChallenge {
//     num: Number;
// }

// export interface RoundIdol {
//     num: Number;
// }

export interface RoundInfo {
    id: number;
    round_num: number;
    game_id: number;
    day: string;
    phase: number; // 0 = challenge, 1 = voting, 2 = idol, 3 = complete
    type: number; // 0 = tribe, 1 = individual, 2 = final 4, 3 = final 3
    eliminated_player: number | undefined;
    winning_tribe: number | undefined;
    winning_player: number | undefined;
    idol_roll: number | undefined;
    challenge_id: number | undefined;
  }

export interface VotablePlayer {
    player_id: number,
    username: string,
    account_name:string,
    discord_name:string,
    avatar:any,
    is_immune:boolean
}

export interface SocketPayload {
    type: number;
    message: string;
    round_info: RoundInfo;
    // round_vote: RoundVote;
    // round_challenge: RoundChallenge;
    // round_idol: RoundIdol;
    votable_players: Array<VotablePlayer>;
    votes_left: Array<number>;
    player_idols: any;
    idol_played_by: string;
    all_votes: any;
    eliminated_player: string;
    challenge: Challenge;
    challenge_tribes: Array<Array<any>>;
    challenge_players: Array<Array<any>>;
    challenge_winner: string;
    idol_predictions_left: Array<number>;
    idol_result: any;
}

@Injectable({
    providedIn: 'root'
  })
export class RoundService {

    // define web socket used for the round component instance
    game_id!: Number;
    round_num!: Number;
    sock_url!: string;

    socket!: WebSocket;
    public socket_observable: Observable<SocketPayload> | undefined;

    // initialize the socket
    constructor(
        private http: HttpClient
    ){
    }

    create_sock(game_id: Number, round_num: Number, username: string) {
        this.game_id = game_id;
        this.round_num = round_num;
        this.sock_url = `${environment.ws_endpoint}connect/game_id=${game_id}/round_num=${round_num}/username=${username}`;
    }

    connect_sock() {
        this.socket = new WebSocket(this.sock_url);

        // Define observable to observe any incoming messages from the socket server (Django)
        let observable = new Observable<SocketPayload>(observer => {
            this.socket.onmessage = (event) => {
                observer.next(event.data);
            };
        })
        this.socket_observable = observable;

        this.socket.onopen = () => {
            // console.log('### WebSocket connection created.');
        };
        this.socket.onclose = () => {
            // console.log('### WebSocket connection disconnected.');
        };
     }

     get_latest_round(game_id: number) {
        return this.http.get<RoundInfo>(`${environment.api_endpoint}get_latest_round?game_id=${game_id}`)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError) // then handle the error
        );
     }

     send_message(type: Number, username: string, message: string, game_id: Number, round_num: Number) {
        return this.socket.send(JSON.stringify({
            'type': type,
            'username': username,
            'message': message,
            'game_id': game_id,
            'round_num': round_num
        }))
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