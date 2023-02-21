import { Component, OnInit } from '@angular/core';
import { GameService, StartRoundReturn } from '../../services/game.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-start-round-dialog',
  templateUrl: './start-round-dialog.component.html',
  styleUrls: ['./start-round-dialog.component.css']
})
export class StartRoundDialogComponent implements OnInit {

  constructor(
    public thisDialog: MatDialogRef<StartRoundDialogComponent>,
    private GameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  current_game_id!: number;
  current_username!: string;
  start_round_response: StartRoundReturn | undefined;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.current_game_id = params['game_id'];
      this.current_username = params['username'];
    });
  }

  onBack(): void {
    this.thisDialog.close();
  }

  async startRound() {
    const response = await this.GameService.start_round(this.current_game_id).toPromise()
    this.start_round_response = response;

    // if start round unsuccessful, log in console and close window
    if (!this.start_round_response?.successful) {
      const config = new MatSnackBarConfig();
      config.panelClass = ['custom-class'];
      this._snackBar.open(this.start_round_response?.message, 'Got It');
      this.thisDialog.close();
    }
    // if start round successful, 'refresh' game page
    else if (this.start_round_response.successful) {
      this.thisDialog.afterClosed().pipe(
        tap(
          () => {
            this.router.navigate(['../round'], {queryParams: {username: this.current_username, game_id: this.current_game_id, round_num: this.start_round_response?.new_round_num}})
          }
        ),
        first()
      ).subscribe();

      this.thisDialog.close();
    }

    return;
  }

}
