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
  relatedToId: number;
  relatedTo?: number;
  relatedName?: string;
  createdBy: string;
  startDate: Date;
  deadLine: Date;
}

export interface CreateTaskDto {
  creatorUserId: number;
  title: string;
  description: string;
  assignedToUserId: number;
  relatedToId: string;
  createdBy: string;
  startDate: Date;
  deadLine: Date;
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