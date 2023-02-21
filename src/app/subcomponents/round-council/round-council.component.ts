import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RoundService, SocketPayload, VotablePlayer } from '../../services/round.service';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmVoteDialogComponent } from 'src/app/subcomponents/confirm-vote-dialog/confirm-vote-dialog.component';
import { constants } from '../../../environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-round-council',
  templateUrl: './round-council.component.html',
  styleUrls: ['./round-council.component.css']
})
export class RoundCouncilComponent implements OnInit {

  @Input()
  socket_payload!: SocketPayload;
  @Input()
  is_admin: boolean | undefined;
  @Input()
  username: string | undefined;
  @Input()
  roundService!: RoundService;

  vote_received: boolean | undefined;
  votable_players: Array<VotablePlayer> | undefined;
  num_votes_left: number | undefined;
  num_votes_total: number | undefined;

  disable_idol_btn: boolean | undefined;
  idol_use_period: boolean | undefined;
  player_idol_count: number | undefined;
  player_used_idol: boolean | undefined;
  players_who_used_idol: Array<string> | undefined;

  vote_reveal_period: boolean | undefined;
  all_votes: Map<string, number> | undefined;
  all_votes_display: Map<string, Array<any>> | undefined; // Array = [num votes against, bool idol played]
  max_vote!: number;
  show_vote_result: boolean | undefined;
  eliminated_player: string | undefined;

  vote_tie: boolean | undefined;
  vote_tie_again!: boolean;
  tie_occured!: boolean;
  has_eliminated_player!: boolean;

  selected_player: string | undefined;
  player_can_vote : boolean | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }
  
  ngOnInit(): void {
    this.vote_received = false;
    this.idol_use_period = false;
    this.player_used_idol = false;
    this.num_votes_left = 0;
    this.num_votes_total = 0;
    this.players_who_used_idol = [];
    this.show_vote_result = false;
    this.max_vote = 1;
    this.vote_tie = false;
    this.vote_tie_again = false;
    this.tie_occured = false;
    this.disable_idol_btn = false
    this.player_can_vote = false;
    this.has_eliminated_player = false;

    this.checkPayloadType(this.socket_payload)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkPayloadType(this.socket_payload)
  }

  sanitizeAvatar(a: string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(a);
  }

  checkPayloadType(socket_payload: SocketPayload){
    console.log(`Socket Payload - Round Council: ${JSON.stringify(socket_payload)}`)
    if(socket_payload.type == constants.PAYLOAD_VOTE){
      this.votable_players = socket_payload.votable_players;
      this.votable_players.forEach(votable_player => {
        if(votable_player.username == this.username){
          this.player_can_vote = true;
        }
      });
    }
    else if(socket_payload.type == constants.PAYLOAD_VOTE_RECEIVED){
      this.vote_received = true;
    }
    else if(socket_payload.type == constants.PAYLOAD_VOTES_LEFT){  
      this.num_votes_left = socket_payload.votes_left[0];
      this.num_votes_total = socket_payload.votes_left[1];
    }
    else if(socket_payload.type == constants.PAYLOAD_VOTE_IDOLS){
      this.idol_use_period = true;

      let player_idols = new Map<string, number>();
      for(var player in socket_payload.player_idols){
        player_idols.set(player, socket_payload.player_idols[player])
      }
      this.player_idol_count = player_idols.get(this.username!);
    }
    else if(socket_payload.type == constants.PAYLOAD_IDOL_USED){
      this.disable_idol_btn = true;
      if(socket_payload.idol_played_by == this.username){
        this.player_used_idol = true;
      }
      this.players_who_used_idol!.push(socket_payload.idol_played_by);
    }
    else if(socket_payload.type == constants.PAYLOAD_ALL_VOTES){
      this.disable_idol_btn = true;
      this.vote_reveal_period = true;
      // call function to display slowly update displayed votes
      this.voteCount(socket_payload.all_votes);
    }
    else if(socket_payload.type == constants.PAYLOAD_VOTE_ELIMINATED){
      this.disable_idol_btn = true;
      if(this.vote_tie_again || this.socket_payload.round_info.phase >= constants.ROUND_PHASE_CHALLENGE_START)
        this.show_vote_result = true;
      this.eliminated_player = socket_payload.eliminated_player;
    }
    else if(socket_payload.type == constants.PAYLOAD_VOTE_TIE){
      this.tie_occured = true;
      setTimeout(() => {  
        this.vote_tie = true;
        this.vote_received = false;
        this.idol_use_period = false;
        this.player_used_idol = false;
        this.vote_reveal_period = false;
        this.num_votes_left = 0;
        this.num_votes_total = 0;
        this.show_vote_result = false;
        this.max_vote = 1;
        this.tie_occured = false;
        this.disable_idol_btn = true;

        this._snackBar.open('There has been a TIE. A re-vote will occur among the tied players.', 'Dang OK.');
      }, 3000*(this.num_votes_total!-this.num_votes_left!+2));
    }
    else if(socket_payload.type == constants.PAYLOAD_VOTE_TIE_AGAIN){
      this.tie_occured = true;
      setTimeout(() => {  
        this.vote_tie_again = true;
        this.votable_players = socket_payload.votable_players;

        this._snackBar.open('There has been ANOTHER TIE. Refer to the information displayed on screen.', 'Omg OK.');
      }, 3000*(this.num_votes_total!-this.num_votes_left!+2));
    }
  }

  onVote(voted_player: VotablePlayer){
    const dialogRef = this.dialog.open(ConfirmVoteDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '30%',
      data: {
        username: this.username,
        game_id: this.socket_payload.round_info.game_id,
        round_num: this.socket_payload.round_info.round_num,
        voted_player: voted_player,
        roundService: this.roundService
      }
    });
  }

  onIdolUsePeriod(): void{
    const response = this.roundService.send_message(constants.MESSAGE_VOTE_IDOL, this.username!, "Allow users to play idols", this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
  }

  onUseIdol(): void{
    const response = this.roundService.send_message(constants.MESSAGE_VOTE_USE_IDOL, this.username!, "User has played an idol", this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
  }

  onVoteRevealPeriod(): void{
    const response = this.roundService.send_message(constants.MESSAGE_VOTE_REVEAL, this.username!, "Show results of vote", this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
  }

  onEliminateSelectedPlayer(): void{
    const response = this.roundService.send_message(constants.MESSAGE_UNANIMOUS_ELIMINATION, this.username!, this.selected_player!, this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
    this.has_eliminated_player = true;
  }

  onEliminateRandomPlayer(): void{
    const response = this.roundService.send_message(constants.MESSAGE_RANDOM_ELIMINATION, this.username!, "Eliminate random player", this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
    this.has_eliminated_player = true;
  }

  voteCount(in_all_votes: any): void {
    let all_votes_temp = new Map<string, number>();
    let all_votes_display_temp = new Map<string, Array<any>>();
    this.max_vote = 1;

    // initialize maps (username, votes_against)
    for(var player in in_all_votes){
      all_votes_temp.set(player, in_all_votes[player]['votes_against'])
      all_votes_display_temp.set(player, [0, in_all_votes[player]['idol_played']])

      if(in_all_votes[player]['votes_against'] > this.max_vote){
        this.max_vote = in_all_votes[player]['votes_against'];
      }
    }
    this.all_votes = all_votes_temp;
    this.all_votes_display = all_votes_display_temp;

    // delay initial vote start to build suspense
    this.sleep(2000).then(() => { 
      let j = 1;
      // iterate through 1 number at a time; pseudo-max vote count
      for (let i = 1; i <= this.max_vote; i++) {
        // for each player see if they have a vote tallied against them for the 'i'th value, increment delay
        for(var player in in_all_votes){
          j = this.tally_vote(player, i, j)
        }
      } 
    });
    
    return;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  tally_vote(player: string, i: number, j: number){  
    // check if vote against for 'i'th value
    let vote_against = (i <= this.all_votes!.get(player)!);

    setTimeout(() => {  
      // update counter with delay
      if(vote_against){
        this.all_votes_display!.set(player, [i, this.all_votes_display!.get(player)![1]]);
      }
      if(i == this.max_vote && !this.show_vote_result){
        setTimeout(() => {  
          if(!this.tie_occured)
            this.show_vote_result = true;
        }, 3000*(this.num_votes_total!-this.num_votes_left!-j+1));
      }
    }, 3000*j);

    // return based on if vote was tallied against with delay
    if(vote_against)
      return j+1;
    else
      return j;
  }
  
}
