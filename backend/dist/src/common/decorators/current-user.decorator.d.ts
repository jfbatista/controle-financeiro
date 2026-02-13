export interface CurrentUserData {
    userId: number;
    email: string;
    companyId: number;
    permissions: string[];
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
