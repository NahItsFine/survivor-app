import { Component, OnInit } from '@angular/core';
import { GameService, StartGameReturn } from '../../services/game.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-end-game-dialog',
  templateUrl: './end-game-dialog.component.html',
  styleUrls: ['./end-game-dialog.component.css']
})
export class EndGameDialogComponent implements OnInit {

  constructor(
    public thisDialog: MatDialogRef<EndGameDialogComponent>,
    private GameService: GameService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  current_game_id!: number;
  current_username!: string;
  end_game_response: StartGameReturn | undefined;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.current_game_id = params['game_id'];
      this.current_username = params['username'];
    }); 
  }

  onBack(): void {
    this.thisDialog.close();
  }

  async endGame() {
    const response = await this.GameService.end_game(this.current_game_id).toPromise()
    this.end_game_response = response;

    // if start game unsuccessful, log in console and close window
    if (!this.end_game_response?.successful) {
      alert("Error in closing game.");
      this.thisDialog.close();
    }
    // if start game successful, 'refresh' game page
    else if (this.end_game_response.successful) {
      this.thisDialog.afterClosed().pipe(
        tap(
          () => {
            this.router.navigate(['/'])
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
