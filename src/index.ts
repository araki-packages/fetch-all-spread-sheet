const {GoogleSpreadsheet} = require('google-spreadsheet');

interface ICredential {
  client_email: string;
  private_key: string;
}
const getValues = async (sheet: any, range?: any): Promise<any> => {
  await sheet.loadCells(range);
  const rows = await sheet.getRows();
  return rows.map((row: any) => {
    const headers = sheet.headerValues;
    const record: {[key: string]: string | null} = {};
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
    console.log('load information');
  }
  if (sheet == null) throw new Error('not fetch spreadsheet');
  return sheet;
};

const createGetAllSheet = async (id: string, credential: ICredential) => {
  const spreadSheet = await loadSheet(id, credential);
  const getSheet = <T>(sheetName: string): Promise<{key: string; title: string; value: T[]}> | undefined => {
    return Object.entries(spreadSheet.sheetsById)
      .map(([key, value]) => {
        const title = (value as any).title as string;
        return {
          key,
          title,
          value,
        }
      })
      .filter((val) => val.title === sheetName)
      .map(async (val) => {
        const table: any = await getValues(val.value);
        return {
          ...val,
          value: table
        }
      })[0];
  };
  return getSheet;
};

export default createGetAllSheet;
