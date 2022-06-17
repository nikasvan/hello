interface ConvosListItem {
  lastMessageID: string;
}
export interface ConvosList {
  [key: string]: Record<string, ConvosListItem>;
}

interface ConvosByIDItem {
  timestamp: number;
  isLastMessage: boolean;
}

export interface ConvosByID {
  [key: string]: ConvosByIDItem;
}
