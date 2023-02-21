import { Component, OnInit, Input, SimpleChanges  } from '@angular/core';
import { Player } from '../../services/game.service'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.css']
})
export class PlayerInfoComponent implements OnInit {

  @Input()
  player!: Player; 

  cur_avatar: any;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.cur_avatar = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.player.avatar}`);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.cur_avatar = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.player.avatar}`);
  }
  
}
