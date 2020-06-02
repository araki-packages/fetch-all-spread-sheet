const { GoogleSpreadsheet } = require('google-spreadsheet');

interface ICredential {
  client_email: string;
  private_key: string;
}
const getValues = async (sheet: any, range?: any): Promise<any> => {
  await sheet.loadCells(range);
  const rows = await sheet.getRows();
  return rows.map((row: any) => {
    const headers = sheet.headerValues;
    const record: {[key: string]: string | null } = {};
    headers.map((header: any) => {
      try {
        const value = row[header];
        record[header] = value === '' ? null : value;
      } catch (err) {
        record[header] = null;
      }
    });
    return record;
  });
};

let sheet: any | null = null;
const loadSheet = async (id: string, credential: ICredential): Promise<any> => {
  if (sheet == null) {
    sheet = new GoogleSpreadsheet(id);
    await sheet.useServiceAccountAuth(credential);
    await sheet.loadInfo();
  }
  if (sheet == null) throw new Error('not fetch spreadsheet');
  return sheet;
};

const createGetAllSheet = async (id: string, credential: ICredential) => {
  const spreadSheet = await loadSheet(id, credential);
  const bookSheets = await Promise.all(
    Object.entries(spreadSheet.sheetsById).map(async ([key, value]) => {
      const table: any = await getValues(value);
      const title: any = (value as any).title;
      return {
        key,
        title,
        value: table,
      };
    })
  );
  const getSheet = <T>(sheetName: string): { key: string; title: string; value: T[]} | undefined => {
    return bookSheets.find(sheet => sheet.title === sheetName);
  };
  return getSheet;
};

export default createGetAllSheet;
