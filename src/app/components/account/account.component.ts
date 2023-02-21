import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ChallengeService, AllChallengesReturn, Challenge } from '../../services/challenge.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateGameDialogComponent } from 'src/app/subcomponents/create-game-dialog/create-game-dialog.component';
import { JoinGameDialogComponent } from 'src/app/subcomponents/join-game-dialog/join-game-dialog.component';
import { GameReturn, GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  username!: string;
  challenges!: AllChallengesReturn;
  challenges_loaded!: boolean;

  current_games: GameReturn[] | undefined;
  completed_games: GameReturn[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private challengeService: ChallengeService,
    public dialog: MatDialog,
    private gameService: GameService
  ) {}

  ngOnInit() : void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
    });    
    this.challenges_loaded = false;
    this.load_all_challenges();
    this.get_account_games();
  }

  async load_all_challenges(){
    const response = await this.challengeService.get_all_challenges().toPromise();
    this.challenges = response;
    this.challenges_loaded = true;
  }

  async get_account_games(){
    const cur_games = await this.gameService.get_current_games(this.username).toPromise();
    this.current_games = cur_games;
    const comp_games = await this.gameService.get_completed_games(this.username).toPromise();
    this.completed_games = comp_games;
  }

  onLogout(){
    this.router.navigate(['../'])
  }

  openCreateGame(): void{
    const dialogRef = this.dialog.open(CreateGameDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '30%',
      data: this.username
    });
  }

  openJoinGame(): void{
    const dialogRef = this.dialog.open(JoinGameDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '30%',
      data: this.username
    });
  }

  goToGame(game: GameReturn): void{
    this.router.navigate(['../game'], {queryParams: {username: this.username, game_id: game.game_id}})
  }

  // TEMPORARY
  test(){
    // this.router.navigate(['../round'], {queryParams: {game_id: 1, round_num: 2, player_id: 3, username: this.username, account_id: 3, is_admin: true}})
    this.router.navigate(['../round'], {queryParams: {username: this.username, game_id: 1, round_num: 2}})
  }

}
