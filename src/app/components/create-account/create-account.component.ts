import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, CreateAccountReturn } from '../../services/account.service'
import { ImageUploadComponent } from '../../subcomponents/image-upload/image-upload.component'

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  submit_message: string | undefined;
  password_message: string | undefined;
  passwords_match: boolean | undefined;
  service_return: CreateAccountReturn | undefined;
  hide: boolean | undefined;

  constructor(
    private router: Router,
    private accountService: AccountService,
    public uploadedImage: ImageUploadComponent
  ) { }

  ngOnInit(): void {
    this.hide = true;
  }

  onBack(){
    this.router.navigate(['../login']);
  }

  async onSubmit(
    username: string,
    password: string,
    password_confirm: string,
    name: string,
    discord: string,
    avatar: string,
    bio: string
  ) {
    // make sure all fields are filled in
    if(username == "" || password == "" || password_confirm == "" || name == "" || discord == "" || avatar == "" || bio == ""){
      this.submit_message = "Please fill in all required fields.";
      return;
    }
    
    // make sure passwords match
    if(!this.passwords_match){
      this.submit_message = "Passwords do not match.";
      return;
    }

    // send info to service
    const response = await this.accountService.create_account(
      username, 
      password,
      name,
      discord,
      avatar,
      bio
    ).toPromise();
    this.service_return = response;

    // response (route to account created component)
    if (!this.service_return?.account_created) {
      this.submit_message = this.service_return?.message;
    }
    else{
      let form_tag = document.getElementById("create_form");
      form_tag?.classList.add('element-hidden');
      let back_tag = document.getElementById("create_done");
      back_tag?.classList.remove('element-hidden');
    }
  }

  onPasswordChange(p1: string, p2: string){
    let message_tag = document.getElementById("p_password");
    if (p1 == p2 && p1 != ""){
      this.password_message = "Passwords match!";
      message_tag?.classList.add('text-success');
      message_tag?.classList.remove('text-warn');
      this.passwords_match = true;
      return;
    }
    else {
      this.password_message = "Passwords do not match!";
      message_tag?.classList.remove('text-success');
      message_tag?.classList.add('text-warn');
      this.passwords_match = false;
      return;
    }
  }

}
