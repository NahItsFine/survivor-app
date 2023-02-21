import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { rounds } from '../../services/game.service'

import { GameService } from '../../services/game.service'
import { ChallengeService } from '../../services/challenge.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-timeline-mat-step',
  templateUrl: './timeline-mat-step.component.html',
  styleUrls: ['./timeline-mat-step.component.css']
})
export class TimelineMatStepComponent implements OnInit {
  
  @Input() round!: rounds;
  @Input() game_id!: number | undefined;
  @Input() current_user!: string | undefined;

  challenge_name: string | undefined;
  winner_name: string | undefined;
  eliminated_player: string | undefined;

  constructor(
    private ChallengeService: ChallengeService,
    private GameService: GameService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.load_challenge_name(this.round.challenge_id)
    this.load_eliminated_player(this.round!.eliminated_player)
    if(this.round.winning_player){
      this.load_winner_name_player(this.round.winning_player)
    }
    if(this.round.winning_tribe){
      this.load_winner_name_tribe(this.round.winning_tribe)
    }
  }

  
  async load_winner_name_tribe(id: number | undefined) {
    const response = await this.GameService.get_tribe_name_by_id(id).toPromise()
    this.winner_name = response.name == 0 ? 'Orange Tribe': 'Purple Tribe'
  }
  async load_winner_name_player(id: number | undefined) {
    const response = await this.GameService.get_player_name_by_id(id).toPromise()
    this.winner_name = response.name.toString()
  }
  async load_eliminated_player(id: number | undefined) {
    const response = await this.GameService.get_player_name_by_id(id).toPromise()
    this.eliminated_player = response.name.toString()
  }
  async load_challenge_name(challenge_id: number | undefined) {
    const response = await this.ChallengeService.get_challenge_name(challenge_id).toPromise()
    this.challenge_name = response.challenge_name
  }

  go_to_round(){
    this.router.navigate(['../round'], {queryParams: {username:this.current_user, game_id: this.game_id, round_num: this.round?.round_num}})
  }
}
