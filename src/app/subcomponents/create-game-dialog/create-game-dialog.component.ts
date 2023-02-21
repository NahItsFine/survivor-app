import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GameService, JoinCreateGameReturn } from '../../services/game.service';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-game-dialog',
  templateUrl: './create-game-dialog.component.html',
  styleUrls: ['./create-game-dialog.component.css']
})
export class CreateGameDialogComponent implements OnInit {

  password_message: string | undefined;
  passwords_match: boolean | undefined;
  submit_message: string | undefined;
  hide: boolean | undefined;
  service_return: JoinCreateGameReturn | undefined;

  @Input()
  username!: string;

  constructor(
    public thisDialog: MatDialogRef<CreateGameDialogComponent>,
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

  async onCreate(
    name: string,
    password: string,
    password_confirm: string,
    discord: string) {

    // make sure all fields are filled in
    if(name == "" || password == "" || password_confirm == "" || name == "" || discord == ""){
      this.submit_message = "Please fill in all required fields.";
      return;
    }
    
    // make sure passwords match
    if(!this.passwords_match){
      this.submit_message = "Passwords do not match.";
      return;
    }

    // send data to BE to (1) create game, (2) create player as admin for that game
    const response = await this.gameService.create_game(this.username, name, password, discord).toPromise();
    this.service_return = response;

    // if create game unsuccessful, notify user and do nothing
    if (!this.service_return?.successful) {
      this.submit_message = this.service_return?.message;
    }
    // if create game successful, go to game page
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

  onPasswordChange(p1: string, p2: string){
    let message_tag = document.getElementById("p_password");
    if (p1 == p2 && p1 != ""){
      this.password_message = "Passwords match!";
      message_tag?.classList.add('text-success');
      message_tag?.classList.remove('text-warn');
      this.passwords_match = true;
      return;
    }
    else {
      this.password_message = "Passwords do not match!";
      message_tag?.classList.remove('text-success');
      message_tag?.classList.add('text-warn');
      this.passwords_match = false;
      return;
    }
  }

}
