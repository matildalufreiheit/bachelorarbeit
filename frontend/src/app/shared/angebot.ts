export interface Angebot {
    ID: number;
    InstitutionID: number;
    Zielgruppe: string; // Falls Zielgruppen-String existiert
    ZielgruppenIDs?: number[]; // Falls Zielgruppen als Array vorliegt
    Name: string;
    Beschreibung: string;
    url: string;
    TagIDs?: number[];
    Arten?: string[];
    ArtIDs?: number[];
}
