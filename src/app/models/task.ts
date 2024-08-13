export interface TaskDto {
  id: number;
  title: string;
  description: string;
  assignedToUserId: number;
  assignedToUserName: string;
  createdAt: Date;
  isClosed: boolean;
  creatorUserId?: number;
  notesCount?: number;
}

export interface CreateTaskDto {
  creatorUserId: number;
  title: string;
  description: string;
  assignedToUserId: number;
}
  
export interface TaskNoteDto {
  id: number;
  userId: string;
  userName: string;
  taskItemId: number;
  note: string;
  createdAt: Date;
}

export interface CreateTaskNoteDto {
  userId: number;
  taskItemId: number;
  note: string;
}

export interface TaskLogsDto {
  date : Date;
  modifierUser: string;
  userName : string;
  fieldName : string;
  action : string;
  value : string;
}