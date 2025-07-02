// uiinterface.ts


export const VIDEO_DIMENSION = {
  width: 1080,
  height: 1920,
} as const;

export interface UiVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?:boolean;
  transformtion: { 
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}



export interface UiUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}