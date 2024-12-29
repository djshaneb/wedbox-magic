export interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  torch?: boolean;
}

export interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

export interface ExtendedMediaStreamTrack extends MediaStreamTrack {
  getCapabilities(): ExtendedMediaTrackCapabilities;
}