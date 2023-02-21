import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { GameReturn } from '../../services/game.service'

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css']
})
export class GameInfoComponent implements OnInit {

  @Input()
  game_info!: GameReturn; 

  tooltip_info: string | undefined;
  game_progress: number | undefined;
  game_progress_info: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.write_tooltip_info()
    this.set_game_progress()
  }

  write_tooltip_info() {
    this.tooltip_info = `Rounds Played: ${this.game_info.num_rounds_played}\n Active: ${this.game_info.is_active}\n Joinable: ${this.game_info.joinable}`
  }
  set_game_progress() {
    this.game_progress = (1 - (this.game_info.num_players_left/this.game_info.num_players))*100;
    this.game_progress_info = `${this.game_info.num_players_left}/${this.game_info.num_players} Players Left`
  }

}
