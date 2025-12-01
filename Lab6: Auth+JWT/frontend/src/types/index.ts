export interface Msg {
    variant: 'regular' | 'error' | 'success',
    text: string | null,
}

export interface Post {
    id: number,
    title: string,
    body?: string,
}
