import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GameService, JoinCreateGameReturn } from '../../services/game.service';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-join-game-dialog',
  templateUrl: './join-game-dialog.component.html',
  styleUrls: ['./join-game-dialog.component.css']
})
export class JoinGameDialogComponent implements OnInit {

  join_message: string | undefined;
  hide: boolean | undefined;
  service_return: JoinCreateGameReturn | undefined;

  @Input()
  username!: string;

  constructor(
    public thisDialog: MatDialogRef<JoinGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private gameService : GameService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = this.data;
    this.hide = true;
  }

  onBack(): void {
    this.thisDialog.close();
  }

  async onJoin(
    name: string,
    password: string,
  ) {

    // make sure all fields are filled in
    if(name == "" || password == ""){
      this.join_message = "Please fill in all required fields.";
      return;
    }

    // make sure password is correct, then send data to BE to (1) join game, (2) create player for that game
    const response = await this.gameService.join_game(this.username, name, password).toPromise();
    this.service_return = response;

    // if join game unsuccessful, notify user and do nothing
    if (!this.service_return?.successful) {
      this.join_message = this.service_return?.message;
    }
    // if join game successful, go to game page
    else if (this.service_return.successful) {
      this.thisDialog.afterClosed().pipe(
        tap(
          () => this.router.navigate(['../game'], {queryParams: {username: this.username, player_id: this.service_return?.player_id, game_id: this.service_return?.game_id}})
        ),
        first()
      ).subscribe();

      this.thisDialog.close();
    }

    return;
  }

}
