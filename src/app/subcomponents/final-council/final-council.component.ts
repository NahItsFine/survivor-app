import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RoundService, SocketPayload, VotablePlayer } from '../../services/round.service';
import { GameService, Player } from '../../services/game.service'
import { DomSanitizer } from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmVoteDialogComponent } from 'src/app/subcomponents/confirm-vote-dialog/confirm-vote-dialog.component';
import { constants } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-final-council',
  templateUrl: './final-council.component.html',
  styleUrls: ['./final-council.component.css']
})
export class FinalCouncilComponent implements OnInit {

  @Input()
  socket_payload!: SocketPayload;
  @Input()
  is_admin: boolean | undefined;
  @Input()
  username: string | undefined;
  @Input()
  roundService!: RoundService;

  discussion_period: boolean | undefined;

  vote_received: boolean | undefined;
  votable_players: Array<VotablePlayer> | undefined;
  num_votes_left: number | undefined;
  num_votes_total: number | undefined;

  vote_reveal_period: boolean | undefined;
  all_votes: Map<string, number> | undefined;
  all_votes_display: Map<string, Array<any>> | undefined; // Array = [num votes against, bool idol played]
  max_vote!: number;
  show_vote_result: boolean | undefined;
  winning_player: string | undefined;
  winning_player_info!: Player;

  vote_tie: boolean | undefined;
  tie_occured!: boolean;
  game_completed!: boolean;

  selected_player: string | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private GameService: GameService
  ) { }
  
  ngOnInit(): void {
    this.vote_received = false;
    this.num_votes_left = 0;
    this.num_votes_total = 0;
    this.show_vote_result = false;
    this.max_vote = 1;
    this.vote_tie = false;
    this.tie_occured = false;
    this.discussion_period = true;

    this.is_game_completed(this.socket_payload.round_info.game_id)

    this.checkPayloadType(this.socket_payload)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkPayloadType(this.socket_payload)
  }

  sanitizeAvatar(a: string){
    return this.sanitizer.bypassSecurityTrustResourceUrl(a);
  }

  checkPayloadType(socket_payload: SocketPayload){
    if(socket_payload.type == constants.PAYLOAD_VOTE){
      console.log(`votable players: ${socket_payload.votable_players}`)
      this.votable_players = socket_payload.votable_players;
      this.discussion_period = false;
    }
    else if(socket_payload.type == constants.PAYLOAD_VOTE_RECEIVED){
      this.vote_received = true;
    }
    else if(socket_payload.type == constants.PAYLOAD_VOTES_LEFT){  
      this.num_votes_left = socket_payload.votes_left[0];
      this.num_votes_total = socket_payload.votes_left[1];
    }
    else if(socket_payload.type == constants.PAYLOAD_ALL_VOTES){
      this.vote_reveal_period = true;
      // call function to display slowly update displayed votes
      this.voteCount(socket_payload.all_votes);
    }
    // ELIMINATED PLAYER IN THIS CASE IS ACTUALLY WINNING PLAYER !!!!!!!!!!
    else if(socket_payload.type == constants.PAYLOAD_VOTE_ELIMINATED){
      this.winning_player = socket_payload.eliminated_player; // username
      this.get_player_info(this.winning_player, socket_payload.round_info.game_id)
    }
    else if(socket_payload.type == constants.PAYLOAD_VOTE_TIE){
      this.tie_occured = true;
      setTimeout(() => {  
        this.vote_tie = true;
        this.vote_received = false;
        this.vote_reveal_period = false;
        this.num_votes_left = 0;
        this.num_votes_total = 0;
        this.show_vote_result = false;
        this.max_vote = 1;
        this.tie_occured = false;

        this._snackBar.open('There has been a TIE. A re-vote will occur among the tied players.', 'Dang OK.');
      }, 3000*(this.num_votes_total!-this.num_votes_left!+2));
    }
  }

  onVotePeriod(): void{
    const response = this.roundService.send_message(constants.MESSAGE_FINAL_COUNCIL_START, this.username!, "Prep vote tracker and votable players", this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
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

  onVoteRevealPeriod(): void{
    const response = this.roundService.send_message(constants.MESSAGE_VOTE_REVEAL, this.username!, "Show who own the game", this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
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

  async get_player_info(player_username: string, game_id: number) {
    const response = await this.GameService.get_player_from_username(player_username, game_id).toPromise();
    console.log(`!!!response:${JSON.stringify(response)}`)
    console.log(`!!!response[0]:${JSON.stringify(response[0])}`)
    this.winning_player_info = response[0]
    console.log(`!!!winning_player_info-204:${JSON.stringify(this.winning_player_info)}`)
  }

  async is_game_completed(game_id: number | undefined) {
    // check if game completed
    const game = await this.GameService.get_game_info(game_id).toPromise();
    (!game.is_active && !game.joinable)
      ? this.game_completed = true
      : this.game_completed = false

    console.log(`!!!game_completed: ${this.game_completed}`)
    
      // get player username from id
    const usernameResponse = await this.GameService.get_player_name_by_id(this.socket_payload.round_info.winning_player).toPromise()
    const username = usernameResponse.name.toString()

    console.log(`!!!username: ${username}`)

    // get winner
    this.get_player_info(username, this.socket_payload.round_info.game_id)
    console.log(`!!!winning_player_info: ${JSON.stringify(this.winning_player_info)}`)
    
  }
  
}
