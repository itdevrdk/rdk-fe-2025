export enum KajianStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  REPLAY = 'replay',
}

export interface KajianSpeaker {
  name: string;
  title: string;
}

export interface KajianEvent {
  id: string;
  event: string;
  title: string;
  speaker: KajianSpeaker;
  date: string;
  time: string;
  location: string;
  registrationUrl: string;
  thumbnailUrl?: string;
  status?: KajianStatus;
  streamingUrl?: string;
}
