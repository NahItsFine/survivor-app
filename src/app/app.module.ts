// Angular Config
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Angular Materials Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatStepperModule } from '@angular/material/stepper'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list'; 
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 

// Useful Packages
import { HttpClientModule } from '@angular/common/http';

// Modules and Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountComponent } from './components/account/account.component';
import { GameComponent } from './components/game/game.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { ImageUploadComponent } from './subcomponents/image-upload/image-upload.component'
import { AccountInfoComponent } from './subcomponents/account-info/account-info.component';
import { RulesComponent } from './subcomponents/rules/rules.component';
import { ChallengeInfoComponent } from './subcomponents/challenge-info/challenge-info.component';
import { RoundComponent } from './components/round/round.component';
import { TimelineComponent } from './subcomponents/timeline/timeline.component';
import { TimelineMatStepComponent } from './subcomponents/timeline-mat-step/timeline-mat-step.component';
import { CreateGameDialogComponent } from './subcomponents/create-game-dialog/create-game-dialog.component';
import { JoinGameDialogComponent } from './subcomponents/join-game-dialog/join-game-dialog.component';
import { PlayerInfoComponent } from './subcomponents/player-info/player-info.component';
import { GameInfoComponent } from './subcomponents/game-info/game-info.component';
import { StartGameDialogComponent } from './subcomponents/start-game-dialog/start-game-dialog.component';
import { EndGameDialogComponent } from './subcomponents/end-game-dialog/end-game-dialog.component';
import { CurrentRoundComponent } from './subcomponents/current-round/current-round.component';
import { RoundCouncilComponent } from './subcomponents/round-council/round-council.component';
import { ConfirmVoteDialogComponent } from './subcomponents/confirm-vote-dialog/confirm-vote-dialog.component';
import { StartRoundDialogComponent } from './subcomponents/start-round-dialog/start-round-dialog.component';
import { TransferIdolDialogComponent } from './subcomponents/transfer-idol-dialog/transfer-idol-dialog.component';
import { RoundChallengeComponent } from './subcomponents/round-challenge/round-challenge.component';
import { RoundIdolComponent } from './subcomponents/round-idol/round-idol.component';
import { GameWinnerComponent } from './subcomponents/game-winner/game-winner.component';
import { FinalCouncilComponent } from './subcomponents/final-council/final-council.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccountComponent,
    GameComponent,
    CreateAccountComponent,
    ImageUploadComponent,
    AccountInfoComponent,
    RulesComponent,
    ChallengeInfoComponent,
    RoundComponent,
    TimelineComponent,
    TimelineMatStepComponent,
    CreateGameDialogComponent,
    JoinGameDialogComponent,
    PlayerInfoComponent,
    GameInfoComponent,
    StartGameDialogComponent,
    EndGameDialogComponent,
    CurrentRoundComponent,
    RoundCouncilComponent,
    ConfirmVoteDialogComponent,
    StartRoundDialogComponent,
    TransferIdolDialogComponent,
    RoundChallengeComponent,
    RoundIdolComponent,
    GameWinnerComponent,
    FinalCouncilComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSliderModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatGridListModule,
    MatSnackBarModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  providers: [ImageUploadComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
