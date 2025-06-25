export type Guest = {
    additionals: number;
    confirmAttendance: boolean;
    createdAt: string;
    fullName: string;
    id: number;
    tableId: number;
    ticketGenerated: boolean;
}

export type Table = {
    capacity: number,
    createdAt: string,
    id: number,
    name: string
    guests: Guest[]
}

export type GeneralTicket = {
  createdAt: string,
  folio: number,
  id: number,
  pdfUrl: string,
  qrCodeUrl: string,
  tableId: null | number
}