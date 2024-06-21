export default interface ProductionMethod {
    name: string;
    unlocking_technologies: string[];
    inputs: { good: string, amount: number }[];
    outputs: { good: string, amount: number }[];
}