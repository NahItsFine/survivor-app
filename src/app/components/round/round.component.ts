import { ThrowStmt } from '@angular/compiler';
import { stringify } from '@angular/compiler/src/util';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RoundService, SocketPayload } from '../../services/round.service';
import { GameService, CurrentPlayerReturn } from '../../services/game.service';
import { constants } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css']
})
export class RoundComponent implements OnInit {

  @Input() game_id!: number;
  @Input() round_num!: Number;
  @Input() player_id!: number;
  @Input() username!: string;
  @Input() is_admin!: boolean;

  socket_payload!: SocketPayload;
  round_phase: Number | undefined;
  payload_msg: string | undefined;

  round_started: boolean | undefined;
  user_still_playing: boolean | undefined;
  is_final_round: boolean | undefined;

  step_council_display: boolean | undefined;
  step_council_complete: boolean | undefined;
  step_challenge_display: boolean | undefined;
  step_challenge_complete: boolean | undefined;
  step_idol_display: boolean | undefined;
  step_idol_complete: boolean | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    public roundService: RoundService,
    private GameService: GameService,
    private _snackBar: MatSnackBar,
  ) { }
  
  ngOnInit() {

   this.route.queryParams.subscribe(params => {
      this.game_id = params['game_id'];
      this.round_num = params['round_num'];
      // this.player_id = params['player_id'];
      this.username = params['username'];
      // this.is_admin = params['is_admin'];
    });   

    this.load_current_player(this.username,this.game_id);
    this.user_still_playing = true;

    // create and initialize the web socket
    this.roundService.create_sock(this.game_id, this.round_num, this.username);
    this.roundService.connect_sock();
    
    // define observer to receive data from the socket
    const observer = {
      next: (data: SocketPayload) => {
        this.socket_payload = JSON.parse(String(data));
        this.round_phase = this.socket_payload.round_info.phase;
        this.payload_msg = this.socket_payload.message;

        // check payload type
        this.checkPayloadType(this.socket_payload);

        // check round type
        if(this.socket_payload.round_info.type == constants.ROUND_TYPE_FINAL_3){
          this.is_final_round = true;
        }
        else{
          this.is_final_round = false;
        }

        // perform different actions based on received ROUND PHASE
        // see BE socket_models.py for definitions
        switch(this.round_phase){
          case constants.ROUND_PHASE_INIT: {
            this.roundInit();
            break;
          }
          default: {
            this.councilStart();
            break;
          }
        }
      },
      error: (err: Error) => console.log('Observer Encountered Error: ' + err)
    }
    this.roundService.socket_observable?.subscribe(observer);

  }

  // EVENT FUNCTIONS      ##########################################################

  async load_current_player(player_username: string | undefined, game_id: number | undefined) {
    const response = await this.GameService.get_game_current_player(player_username, game_id).toPromise();
    this.is_admin = response.is_admin;
    this.player_id = response.player_id;
  }

  // # TO-DO: remove after testing
  onTest(message: string) {
    // component to FE service to BE handler (to BE service to DB functions)
    const response = this.roundService.send_message(constants.MESSAGE_TEST, this.username, message, this.game_id, this.round_num);
  }
  // Go back to game page
  onBack(): void{
    this.roundService.send_message(constants.MESSAGE_DISCONNECT, this.username, "Disconnect User", this.game_id, this.round_num);
    this.router.navigate(['../game'], {queryParams: {username: this.username, game_id: this.game_id}})
  }
  // Send payload type 0 to initialize round in db 
  onRoundStart(): void{
    this.roundService.send_message(constants.MESSAGE_START_ROUND, this.username, "Round Start Requested", this.game_id, this.round_num);
  }

  checkPayloadType(socket_payload: SocketPayload){
    if(socket_payload.type == constants.PAYLOAD_NOT_PLAYING){
      this.user_still_playing = false;
    }
    else if(socket_payload.type == constants.PAYLOAD_EVENT){
      this._snackBar.open(socket_payload.message, 'Cool Beans.');
    }
  }

  // ROUND LOGIC FUNCTIONS      ##########################################################
  // PAYLOAD RECEIVE TYPE 0 = ROUND NOT YET STARTED
  roundInit(){
    this.round_started = false;
    return;
  }
  councilStart(){
    this.round_started = true;
    return;
  }
}