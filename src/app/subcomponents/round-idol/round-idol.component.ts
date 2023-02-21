import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RoundService, SocketPayload } from '../../services/round.service';
import { constants } from '../../../environments/environment';

@Component({
  selector: 'app-round-idol',
  templateUrl: './round-idol.component.html',
  styleUrls: ['./round-idol.component.css']
})
export class RoundIdolComponent implements OnInit {

  @Input()
  socket_payload!: SocketPayload;
  @Input()
  is_admin: boolean | undefined;
  @Input()
  username: string | undefined;
  @Input()
  roundService!: RoundService;

  prediction_received!: boolean;
  idol_revealed!: boolean;
  slider_value: number | undefined;
  num_predictions_left: number | undefined;
  num_predictions_total: number | undefined;
  idol_result: any;
  show_text!: boolean;

  constructor() { }

  ngOnInit(): void {
    this.prediction_received = false;
    this.idol_revealed = false;
    this.show_text = false;

    this.checkPayloadType(this.socket_payload)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkPayloadType(this.socket_payload)
  }

  checkPayloadType(socket_payload: SocketPayload){
    if(socket_payload.type == constants.PAYLOAD_IDOL_PREDICTION_RECEIVED){
      this.prediction_received = true;
      this.show_text = true;
    }
    else if(socket_payload.type == constants.PAYLOAD_IDOL_PREDICTIONS_LEFT){
      this.num_predictions_left = socket_payload.idol_predictions_left[0];
      this.num_predictions_total = socket_payload.idol_predictions_left[1];
    }
    else if (socket_payload.type == constants.PAYLOAD_IDOL_REVEAL){
      this.idol_revealed = true;
      this.idol_result = socket_payload.idol_result;
    }
  }

  onSubmit(){
    const response = this.roundService.send_message(constants.MESSAGE_IDOL_PREDICTION, this.username!, this.slider_value!.toString(), this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
  }

  onRandomizeIdol(){
    const response = this.roundService.send_message(constants.MESSAGE_IDOL_RANDOMIZE, this.username!, "Randomize Idol Roll", this.socket_payload.round_info.game_id, this.socket_payload.round_info.round_num);
  }
  
}
