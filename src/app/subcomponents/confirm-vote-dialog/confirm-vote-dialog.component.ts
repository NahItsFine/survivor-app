import { Component, Input, OnInit, Inject } from '@angular/core';
import { RoundService, VotablePlayer } from '../../services/round.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { constants } from '../../../environments/environment';
@Component({
  selector: 'app-confirm-vote-dialog',
  templateUrl: './confirm-vote-dialog.component.html',
  styleUrls: ['./confirm-vote-dialog.component.css']
})
export class ConfirmVoteDialogComponent implements OnInit {

  constructor(
    public thisDialog: MatDialogRef<ConfirmVoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  game_id!: number;
  round_num!: number;
  username!: string;
  voted_player!: VotablePlayer;
  roundService!: RoundService;

  ngOnInit(): void {
    this.game_id = this.data.game_id;
    this.round_num = this.data.round_num;
    this.username = this.data.username;
    this.voted_player = this.data.voted_player;
    this.roundService = this.data.roundService;
  }

  onBack(): void {
    this.thisDialog.close();
  }

  onVote() {
    const response = this.roundService.send_message(constants.MESSAGE_VOTE_SENT, this.username, this.voted_player.username, this.game_id, this.round_num);
    this.thisDialog.close();
  }

}
