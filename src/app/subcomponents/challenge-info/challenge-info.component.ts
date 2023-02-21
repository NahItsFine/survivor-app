import { Component, Input, OnInit } from '@angular/core';
import { Challenge } from '../../services/challenge.service'

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.css']
})
export class ChallengeInfoComponent implements OnInit {

  @Input()
  challenge!: Challenge; 

  constructor() { }

  ngOnInit(): void {
  }

}
