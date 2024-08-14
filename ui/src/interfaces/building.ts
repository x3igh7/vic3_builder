export default interface Building {
  name: string;
  displayName: string;
  required_construction: number;
  unlocking_technologies: string[];
  production_method_groups: string[];
}
