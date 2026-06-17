export interface CsvTransactionRow {
  transaction_date: string;
  description: string;
  amount: number;
  currency_code: string;
  type: string;
  category_name: string;
}

function escapeCsvValue(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateTransactionsCsv(transactions: CsvTransactionRow[]): string {
  const header = "Data,Opis,Kwota,Waluta,Typ,Kategoria";
  const rows = transactions.map(
    (transaction) =>
      [
        transaction.transaction_date,
        escapeCsvValue(transaction.description),
        transaction.amount,
        transaction.currency_code,
        transaction.type,
        escapeCsvValue(transaction.category_name),
      ].join(",")
  );

  return [header, ...rows].join("\n");
}
