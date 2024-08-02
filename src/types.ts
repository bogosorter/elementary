export type File = {
    path: string;
    content: string;
};

export type DocumentInfo = {
    path: string;
    content: string;

    recentlyOpened: string[];
}
