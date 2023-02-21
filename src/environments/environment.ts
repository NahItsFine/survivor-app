// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // api_endpoint: 'https://f3d8-2607-fea8-20c0-63c-c09e-d3fd-947a-13d.ngrok.io/api/',
  // ws_endpoint: 'wss:///f3d8-2607-fea8-20c0-63c-c09e-d3fd-947a-13d.ngrok.io/ws/'
  api_endpoint: 'https://virtual-survivor-service.herokuapp.com/api/',
  ws_endpoint: 'wss:://virtual-survivor-service.herokuapp.com/ws/'
};

export const constants = {
  // define constants for sent messages
  MESSAGE_TEST: -1,
  MESSAGE_START_ROUND: 0,
  MESSAGE_VOTE_SENT: 1,
  MESSAGE_VOTE_IDOL: 2,
  MESSAGE_VOTE_USE_IDOL: 3,
  MESSAGE_VOTE_REVEAL: 4,
  MESSAGE_UNANIMOUS_ELIMINATION: 5,
  MESSAGE_RANDOM_ELIMINATION: 6,
  MESSAGE_RANDOMIZE_CHALLENGE: 7,
  MESSAGE_CHALLENGE_WINNER: 8,
  MESSAGE_IDOL_PREDICTION: 9,
  MESSAGE_IDOL_RANDOMIZE: 10,
  MESSAGE_FINAL_COUNCIL_START: 11,
  MESSAGE_WINNER: 12,
  MESSAGE_DISCONNECT: 13,
  
  // define constants for types of payloads to receive
  PAYLOAD_NOT_PLAYING: -1,
  PAYLOAD_INFO: 0,
  PAYLOAD_VOTE: 1,
  PAYLOAD_VOTE_RECEIVED: 2,
  PAYLOAD_VOTES_LEFT: 3,
  PAYLOAD_VOTE_IDOLS: 4,
  PAYLOAD_IDOL_USED: 5,
  PAYLOAD_ALL_VOTES: 6,
  PAYLOAD_VOTE_ELIMINATED: 7,
  PAYLOAD_VOTE_TIE: 8,
  PAYLOAD_VOTE_TIE_AGAIN: 9,
  PAYLOAD_CHALLENGE: 10,
  PAYLOAD_CHALLENGE_WINNER: 11,
  PAYLOAD_IDOL_PREDICTION_RECEIVED: 12,
  PAYLOAD_IDOL_PREDICTIONS_LEFT: 13,
  PAYLOAD_IDOL_REVEAL: 14,
  PAYLOAD_EVENT: 15,

  // define constants for round phase
  ROUND_PHASE_INIT: 0,
  ROUND_PHASE_COUNCIL_START: 1,
  ROUND_PHASE_COUNCIL_IDOLS: 2,
  ROUND_PHASE_COUNCIL_REVEAL: 3,
  ROUND_PHASE_CHALLENGE_START: 4,
  ROUND_PHASE_CHALLENGE_REVEAL: 5,
  ROUND_PHASE_IDOL_START: 6,
  ROUND_PHASE_FINAL_COUNCIL: 7,
  ROUND_PHASE_COMPLETE: 8,

  // 0 = tribe, 1 = individual, 2 = final 4, 3 = final 3
  ROUND_TYPE_TRIBE: 0,
  ROUND_TYPE_INDIVIDUAL: 1,
  ROUND_TYPE_FINAL_4: 2,
  ROUND_TYPE_FINAL_3: 3,

  // define challenge type constants
  CHALLENGE_TRIBE: 0,
  CHALLENGE_INDIVIDUAL: 1,
  CHALLENGE_FINAL_4: 2,
  CHALLENGE_TOWER: 3,

  // define event constants
  EVENT_NONE: 0,
  EVENT_PRECOUNCIL_ROUND_0: 1,
  EVENT_PRECOUNCIL_FINAL: 2,
  EVENT_PRECOUNCIL_FINAL_CHALLENGE: 6,
  EVENT_PRECHALLENGE_SWAP: 3,
  EVENT_PRECHALLENGE_MERGE: 4,
  EVENT_PRECHALLENGE_FINAL_4: 5,

  // define misc. constants
  UNDEFINED: -1,
  INDEX_VOTE_TRACKER: 0,
  INDEX_IDOL_TRACKER: 1,
  INDEX_TIE_COUNT: 2,
  COUNCIL_NOT_IMMUNE: 0,
  COUNCIL_TEMP_IMMUNE: 1,
  COUNCIL_IMMUNE: 2,
  TRIBE_ORANGE: 0,
  TRIBE_PURPLE: 1,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
