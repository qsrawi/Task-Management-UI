export interface TaskDto {
    id: number;
    title: string;
    description: string;
    assignedToUserId: number;
    assignedToUserName: string;
    createdAt: Date;
    isClosed: boolean;
    notesCount: number;
  }
  