import { Component, OnInit } from '@angular/core';
import { GameService, StartGameReturn } from '../../services/game.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { Player } from '../../services/game.service'

@Component({
  selector: 'app-transfer-idol-dialog',
  templateUrl: './transfer-idol-dialog.component.html',
  styleUrls: ['./transfer-idol-dialog.component.css']
})
export class TransferIdolDialogComponent implements OnInit {

  constructor(
    public thisDialog: MatDialogRef<TransferIdolDialogComponent>,
    private GameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  current_game_id!: number;
  current_username!: string;
  transfer_idol_response: StartGameReturn | undefined;

  selected_player: Array<string> | undefined;

  //List of Active Players
  active_game_players: Array<Player> | undefined;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.current_game_id = params['game_id'];
      this.current_username = params['username'];
    }); 
    this.load_active_game_players(this.current_game_id)
  }

  onBack(): void {
    this.thisDialog.close();
  }

  async transferIdol() {
    if (this.selected_player){
      const response = await this.GameService.transfer_idol(this.current_game_id,this.current_username,this.selected_player[0]!).toPromise()
      this.transfer_idol_response = response;

      // if transfer idol unsuccessful, log in console and close window
      if (!this.transfer_idol_response?.successful) {
        const config = new MatSnackBarConfig();
        config.panelClass = ['custom-class'];
        this._snackBar.open(this.transfer_idol_response?.message, 'Got It');
        this.thisDialog.close();
      }
      // if transfer idol successful, open snackbar
      else if (this.transfer_idol_response.successful) {
        this._snackBar.open(this.transfer_idol_response?.message + this.selected_player[1], 'Got It');
        this.thisDialog.close();
      }

      return;
    } else {
      this._snackBar.open('Uhhh, You Kinda Need To Select Someone', 'Ok...');
    }
    
  }

  async load_active_game_players(game_id: number | undefined) {
    const response = await this.GameService.get_active_game_players(game_id).toPromise();
    this.active_game_players = response.players
    // Remove current user from list
    for (let i = 0; i< this.active_game_players.length; i++){
      if (this.active_game_players[i].username == this.current_username){
        this.active_game_players.splice(i, 1)
        break
      }
    }
  }

}
