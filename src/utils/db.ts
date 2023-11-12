export interface IOrganization {
  id: string;
  installationId: string;
}
export const validStateVariables: string[] = [];
let organizations: IOrganization[] = [];
export const getOrganizations = () => organizations;
export function resetOrganizations(defaultValues: IOrganization[]) {
  organizations = defaultValues;
  return organizations;
}
export function findOrganization(organizationId: string) {
  const organization = organizations.find((org) => org.id === organizationId);
  return organization;
}
export function addOrganization(organization: IOrganization) {
  organizations.push(organization);
  return organization;
}

export const accessTokens: {
  token: string;
  expiresAt: Date;
  organizationId: string;
  installationId: string;
}[] = [];
