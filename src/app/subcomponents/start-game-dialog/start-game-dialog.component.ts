import { Component, OnInit } from '@angular/core';
import { GameService, StartGameReturn } from '../../services/game.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-start-game-dialog',
  templateUrl: './start-game-dialog.component.html',
  styleUrls: ['./start-game-dialog.component.css']
})
export class StartGameDialogComponent implements OnInit {

  constructor(
    public thisDialog: MatDialogRef<StartGameDialogComponent>,
    private GameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  current_game_id!: number;
  current_username!: string;
  start_game_response: StartGameReturn | undefined;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.current_game_id = params['game_id'];
      this.current_username = params['username'];
    }); 
  }

  onBack(): void {
    this.thisDialog.close();
  }

  async startGame() {
    const response = await this.GameService.start_game(this.current_game_id).toPromise()
    this.start_game_response = response;

    // if start game unsuccessful, log in console and close window
    if (!this.start_game_response?.successful) {
      const config = new MatSnackBarConfig();
      config.panelClass = ['custom-class'];
      this._snackBar.open(this.start_game_response?.message, 'Got It');
      this.thisDialog.close();
    }
    // if start game successful, 'refresh' game page
    else if (this.start_game_response.successful) {
      this.thisDialog.afterClosed().pipe(
        tap(
          () => {
            // this.router.navigate(['/'])
            this.router.navigateByUrl('/', {skipLocationChange: true})
            this.router.navigate(['../game'], {queryParams: {username: this.current_username, game_id: this.current_game_id}})
          }
        ),
        first()
      ).subscribe();

      this.thisDialog.close();
    }

    return;
  }

}
