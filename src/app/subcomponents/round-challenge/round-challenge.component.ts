import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RoundService, SocketPayload } from '../../services/round.service';
import { constants } from '../../../environments/environment';
import { Challenge } from '../../services/challenge.service'

@Component({
  selector: 'app-round-challenge',
  templateUrl: './round-challenge.component.html',
  styleUrls: ['./round-challenge.component.css']
})
export class RoundChallengeComponent implements OnInit {

  @Input()
  socket_payload!: SocketPayload;
  @Input()
  is_admin: boolean | undefined;
  @Input()
  username: string | undefined;
  @Input()
  roundService!: RoundService;

  challenge_determined: boolean | undefined;
  challenge: Challenge | undefined;
  show_spinner!: boolean;

  returned_tribes_list: Array<Array<number>> | undefined;  // [[id, colour (int)], [id, colour (int)]]
  tribes_list: Array<Array<string>> | undefined;      // [[id, colour (str)], [id, colour (str)]]
  players_list: Array<Array<string>> | undefined;     // [[username, name], [username, name]]

  winner_is_individual!: boolean;
  selected_tribe: number | undefined;
  selected_player: string | undefined;
  show_winner!: boolean;
  winner: string | undefined;

  constructor() { }

  ngOnInit(): void {
    this.challenge_determined = false;
    this.show_spinner = false;
    this.winner_is_individual = true;
    this.show_winner = false;
    this.checkPayloadType(this.socket_payload);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkPayloadType(this.socket_payload);
  }

  checkPayloadType(socket_payload: SocketPayload){
    console.log(`Socket Payload - Round Challenge: ${JSON.stringify(socket_payload)}`)
    if(socket_payload.type == constants.PAYLOAD_CHALLENGE){
      this.show_spinner = true;
      this.challenge = this.socket_payload.challenge;
      setTimeout(() => {  
        this.show_spinner = false;
        this.challenge_determined = true;
      }, 1500);
      
      this.returned_tribes_list = this.socket_payload.challenge_tribes;
      this.players_list = this.socket_payload.challenge_players;

      // lists to be displayed on FE component
      if(this.socket_payload.round_info.type == constants.ROUND_TYPE_TRIBE && constants.ROUND_TYPE_TRIBE != null){
        this.winner_is_individual = false;
        this.tribes_list = Array<Array<string>>();
        // parse through all tribes, assign a paired list to each tribe id of tribe id and tribe name
        for(let i = 0; i < this.returned_tribes_list.length; i++){
          if(this.returned_tribes_list[i][1] == constants.TRIBE_ORANGE){
            this.tribes_list![i] = [this.returned_tribes_list[i][0].toString(), 'Orange Tribe'];
          }
          else if(this.returned_tribes_list[i][1] == constants.TRIBE_PURPLE){
            this.tribes_list![i] = [this.returned_tribes_list[i][0].toString(), 'Purple Tribe'];
          }
        }
      }
    }
    else if (this.socket_payload.type == constants.PAYLOAD_CHALLENGE_WINNER){
      this.winner = this.socket_payload.round_info.type < constants.ROUND_TYPE_FINAL_3 ? this.socket_payload.challenge_winner: this.socket_payload.eliminated_player;
      this.show_winner = true;
    }
    else {
      this.challenge_determined = false;
    }
  }

  onRandomizeChallenge(): void{
    const response = this.roundService.send_message(constants.MESSAGE_RANDOMIZE_CHALLENGE, this.username!, "Randomize a challenge for this round", this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
  }

  onSubmitChallengeWinner(): void{
    if(this.winner_is_individual){
      const response = this.roundService.send_message(constants.MESSAGE_CHALLENGE_WINNER, this.username!, this.selected_player!, this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
    }
    else{
      const response = this.roundService.send_message(constants.MESSAGE_CHALLENGE_WINNER, this.username!, this.selected_tribe!.toString(), this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
    }
  }
}
