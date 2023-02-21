import { Component, Input, OnInit } from '@angular/core';
import { AccountService, AccountReturn } from '../../services/account.service'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  @Input()
  username: string | undefined;

  name: string | undefined;
  bio: string | undefined;
  discord: string | undefined;
  avatar: any;

  constructor(
    private accountService: AccountService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() : void {
    this.load_account_info(this.username);
  }

  async load_account_info(username: string | undefined) {
    const response = await this.accountService.get_account_info(username).toPromise();
    this.name = response.name;
    this.username = response.username;
    this.bio = response.bio;
    this.discord = response.discord;
    this.avatar = this.sanitizer.bypassSecurityTrustResourceUrl(`${response.avatar}`);
  }


}
