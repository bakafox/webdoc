export interface Page {
    id: string,
    title: string,
    body: string,
}

export interface PageOverview extends Omit<Page, 'body'> {}

export interface PageStas extends Omit<Page, 'body'> {
    views: number,
    time_spent: number,
    last_visit: number, // Дату питона мы перевели в Unix Time
}
