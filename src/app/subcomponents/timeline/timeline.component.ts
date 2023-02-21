import { JsonpClientBackend } from '@angular/common/http';
import { GameService } from '../../services/game.service'
import { Component, Input, OnInit } from '@angular/core';
import { rounds } from '../../services/game.service'


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  @Input()
  game_id: number | undefined

  @Input()
  current_user: string | undefined

  rounds: Array<rounds> | undefined;

  constructor(
    private GameService: GameService,
  ) { }

  ngOnInit(): void {
      this.game_id = +this.game_id!
      this.load_game_rounds(this.game_id);
  }

  async load_game_rounds(game_id: number | undefined) {
    const response = await this.GameService.get_game_rounds(game_id).toPromise();
    this.rounds = response.rounds
  }

}
