export interface Schema {
  project: string;
  orgName: string;
  meetupName: string;
  pastTalks: string;
  twitter: string;
  deployment: 'Azure' | 'Github Pages' | 'Netlify' | 'Now' | 'None';
  addPrettier: boolean;
}
