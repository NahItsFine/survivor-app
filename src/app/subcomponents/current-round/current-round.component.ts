import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RoundInfo } from '../../services/round.service'
import { RoundService } from '../../services/round.service'
import { GameService } from '../../services/game.service'
import { ChallengeService } from '../../services/challenge.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { constants } from 'src/environments/environment';

@Component({
  selector: 'app-current-round',
  templateUrl: './current-round.component.html',
  styleUrls: ['./current-round.component.css']
})
export class CurrentRoundComponent implements OnInit {

  @Input() game_id!: number;
  @Input() current_user!: string;
  current_round: RoundInfo | undefined

  challenge_name: string | undefined;
  winner_name: string | undefined;
  eliminated_player: string | undefined;
  is_final_round: boolean | undefined;

  constructor(
    private ChallengeService: ChallengeService,
    private GameService: GameService,
    private RoundService: RoundService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.load_current_round(this.game_id)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.load_current_round(this.game_id)
  }

  async load_current_round(id: number) {
    const response = await this.RoundService.get_latest_round(id).toPromise()
    this.current_round = response
  
    if(this.current_round?.winning_player){
      this.load_winner_name_player(this.current_round!.winning_player)
    }
    if(this.current_round?.winning_tribe){
      this.load_winner_name_tribe(this.current_round!.winning_tribe)
    }
    if(this.current_round?.eliminated_player){
      this.load_eliminated_player(this.current_round!.eliminated_player)
    }
    if(this.current_round?.type == constants.ROUND_TYPE_FINAL_3){
      this.is_final_round = true
    } else {
      this.is_final_round = false
    }
    console.log(`Current Round: ${JSON.stringify(this.current_round)})`)
    if(this.current_round?.challenge_id){
      this.load_challenge_name(this.current_round?.challenge_id)
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
    this.router.navigate(['../round'], {queryParams: {username: this.current_user, game_id: this.game_id, round_num: this.current_round?.round_num}})
  }

}
