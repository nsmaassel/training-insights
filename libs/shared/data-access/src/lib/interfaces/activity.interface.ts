export interface Activity {
  id: string;
  uploadedFileId: string;
  userId?: string;
  startTime: Date;
  endTime: Date;
  type: ActivityType;
  duration: number; // in seconds
  distance?: number; // in meters
  avgHeartRate?: number;
  maxHeartRate?: number;
  calories?: number;
  zones?: IntensityZones;
  deviceInfo?: DeviceInfo;
  laps: Lap[];
}

export interface IntensityZones {
  zone1Duration: number; // time in seconds
  zone2Duration: number;
  zone3Duration: number;
  zone4Duration: number;
  zone5Duration: number;
}

export interface DeviceInfo {
  manufacturer: string;
  product: string;
  serialNumber?: string;
}

export interface Lap {
  startTime: Date;
  duration: number;
  distance?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  calories?: number;
}

export enum ActivityType {
  RUN = 'RUN',
  BIKE = 'BIKE',
  SWIM = 'SWIM',
  STRENGTH = 'STRENGTH',
  OTHER = 'OTHER'
}