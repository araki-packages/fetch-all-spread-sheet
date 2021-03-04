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
    const record: { [key: string]: string | null } = {};
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

const loadSheet = async (id: string, credential: ICredential): Promise<any> => {
  const sheet = new GoogleSpreadsheet(id);
  await sheet.useServiceAccountAuth(credential);
  await sheet.loadInfo();
  console.log('load information');
  if (sheet == null) throw new Error('not fetch spreadsheet');
  return sheet;
};

const createGetAllSheet = async (id: string, credential: ICredential, isDebug: boolean = false) => {
  const spreadSheet = await loadSheet(id, credential);
  isDebug && console.log(spreadSheet);
  const getSheet = async <T>(sheetName: string): Promise<{ key: string; title: string; value: T[] } | null> => {
    isDebug && console.log('getSheet : ', sheetName);
    const sheet = Object.entries(spreadSheet.sheetsById)
      .map(([key, value]) => {
        const title = (value as any).title as string;
        return {
          key,
          title,
          value,
        }
      })
      .find((val) => val.title === sheetName);
    isDebug && console.log('target sheet', sheet);
    if (sheet == null) return null;
    const table: any = await getValues(sheet.value);
    isDebug && console.log('target table', table);
    const result = {
      ...sheet,
      value: table,
    };
    isDebug && console.log('result', result);
    return result;
  };
  return getSheet;
};

export default createGetAllSheet;
