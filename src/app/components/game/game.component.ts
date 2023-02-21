import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service'
import { GameReturn, Player } from '../../services/game.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StartGameDialogComponent } from 'src/app/subcomponents/start-game-dialog/start-game-dialog.component';
import { StartRoundDialogComponent } from 'src/app/subcomponents/start-round-dialog/start-round-dialog.component';
import { EndGameDialogComponent } from 'src/app/subcomponents/end-game-dialog/end-game-dialog.component'
import { TransferIdolDialogComponent } from 'src/app/subcomponents/transfer-idol-dialog/transfer-idol-dialog.component'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  game_id: number | undefined

  full_game_info!: GameReturn

  name: string | undefined;
  discord_link: string | undefined;
  num_rounds_played: number | undefined;
  game_stage: Number | undefined;
  is_active: boolean | undefined;
  joinable: boolean | undefined;

  page_loaded: boolean | undefined;

  // Current Player
  player_username: string | undefined;
  player_name: string | undefined;
  player_discord: string | undefined;
  player_avatar: any;
  player_idol_count: string | number | undefined;
  is_still_playing: boolean | undefined;
  is_admin: boolean | undefined;
  player_tribe_id: number | undefined;
  player_tribe_colour: number | undefined;

  //List of Players
  game_players: Array<Player> | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private GameService: GameService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.page_loaded = false;
    this.route.queryParams.subscribe(params => {
      this.game_id = params['game_id'];
      this.player_username = params['username']
    }); 
    this.load_game_info(this.game_id);
    this.load_game_players(this.game_id);
    this.load_current_player(this.player_username, this.game_id);
    this.page_loaded = true;
  }

  async load_game_info(game_id: number | undefined) {
    const response = await this.GameService.get_game_info(game_id).toPromise();
    this.full_game_info = response;
    this.name = response.name;
    this.discord_link = response.discord_link;
    this.num_rounds_played = response.num_rounds_played;
    this.game_stage = response.game_stage;
    this.is_active = response.is_active;
    this.joinable = response.joinable;
  }

  async load_current_player(player_username: string | undefined, game_id: number | undefined) {
    const response = await this.GameService.get_game_current_player(player_username, game_id).toPromise()
    this.player_name = response.name;
    this.player_discord = response.discord_name;
    this.player_avatar = this.sanitizer.bypassSecurityTrustResourceUrl(`${response.avatar}`);
    this.player_idol_count = response.idol_count;
    this.is_still_playing = response.is_still_playing;
    this.is_admin = response.is_admin;
    this.player_tribe_id = response.tribe_id;
    this.player_tribe_colour = response.tribe_colour;

  }

  async load_game_players(game_id: number | undefined) {
    const response = await this.GameService.get_game_players(game_id).toPromise();
    this.game_players = response.players
  }

  start_game_confirm(): void{
    const dialogRef = this.dialog.open(StartGameDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '30%',
    });
  }

  start_round_confirm(): void{
    const dialogRef = this.dialog.open(StartRoundDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '30%',
    });
  }

  end_game_confirm(): void{
    const dialogRef = this.dialog.open(EndGameDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '30%',
    });
  }

  open_transfer_dialog(): void{
    const dialogRef = this.dialog.open(TransferIdolDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '30%',
    });
  }

  onBack(): void{
    this.router.navigate(['../account'], {queryParams: {username: this.player_username}})
  }
}
