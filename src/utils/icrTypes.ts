export interface ICredit {
  organizationId: string;
  id: string;
  tokenId: string;
  tokenAddress: string;
  amount: number;
  supply: number;
  serialization: string;
  type: string;
  project: {
    fullName: string;
    id: string;
  };
}

export interface IRetirement {
  id: string;
  reason?: string;
  comment?: string;
  beneficiary?: string;
  organizationId: string;
  serialization: string;
  amount: number;
  project?: {
    id: string;
    fullName: string;
  };
}

export interface IReservation {
  id: string; // Replace 'string' with the actual data type of 'item.id'
  amount: number; // Replace 'number' with the actual data type of 'item.amount.toNumber()'
  createdAt: Date; // Replace 'Date' with the actual data type of 'item.createdAt'
  updatedAt: Date; // Replace 'Date' with the actual data type of 'item.updatedAt'
  tokenId: string; // Replace 'string' with the actual data type of 'item.tokenId'
  tokenAddress: string; // Replace 'string' with the actual data type of 'item.tokenAddress'
  type: string; // Replace 'string' with the actual data type of 'item.type'
  reservedToDate: Date; // Replace 'Date' with the actual data type of 'item.reservedToDate'
  serialization: string; // Replace 'string' with the actual data type of 'item.serialization'
  isComplete: boolean; // Replace 'boolean' with the actual data type of '!!item.txId'
  project: {
    id: string; // Replace 'string' with the actual data type of 'item.projectId'
    fullName: string; // Replace 'string' with the actual data type of 'item.projects.projectInformations.fullName'
  };
  reserver: {
    id: string; // Replace 'string' with the actual data type of 'item.accessTokens.appId'
    name: string | undefined; // Replace 'string' with the actual data type of 'item.accessTokens.apps?.appsInformation?.name'
  };
  creditId: string;
}
export enum organization_type {
  projectProponent = "projectProponent",
  projectDeveloper = "projectDeveloper",
  marketParticipant = "marketParticipant",
  other = "other",
  validationBody = "validationBody",
}
export enum CreditActionEnum {
  transfer = "transfer",
  retire = "retire",
  transfer_retire = "transfer_retire",
}
export interface ICreditRequests {
  id: string;
  createdAt: string;
  updatedAt: string;
  tokenId: string;
  tokenAddress: string;
  creditId: string;
  serialization: string;
  amount: number;
  fromOrganizationId: string;
  toOrganizationId: string;
  project: {
    id: string;
    fullName: string;
  };
  txId: string;
  state: string;
  retirementReason?: string;
  retirementComment?: string | null;
  beneficiaryName?: string;
  action: CreditActionEnum;
  type: string;
  toAddress?: string;
}
