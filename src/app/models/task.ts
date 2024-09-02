export interface TaskDto {
  id?: number;
  title?: string;
  description?: string;
  assignedToUserId?: number;
  assignedToUserName?: string;
  createdAt?: Date;
  isClosed?: boolean;
  creatorUserId?: number;
  notesCount?: number;
  relatedToId: number;
  categoryId?: number;
  relatedName?: string;
  createdBy?: string;
  startDate?: Date;
  deadLine?: Date;
  isDeleted?: boolean;
}

export interface TaskResponse {
  lstData: TaskDto[];
  rowsCount: number;
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

export interface LogResponse {
  lstData: TaskLogsDto[];
  rowsCount: number;
}

export interface NoteResponse {
  lstData: TaskNoteDto[];
  rowsCount: number;
}