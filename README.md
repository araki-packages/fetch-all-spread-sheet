# fetch-all-spread-sheet

スプレッドシートを全権取得する

## Example

```typescript
import createGetAllSheet from '@araki-packages/fetch-all-spread-sheet';
import credential from './google-generated-creds.json';
const getSheet = createGetAllSheet('SpreadSheetID', credential);
interface ISheetName {
  record: string;
  record2: string;
};
const sheetData = getSheet<ISheetName>('sheet_name');
console.log(JSON.stringify(sheetData));
/**
 *
 * {
 *   key: '219391239',
 *   title: 'sheet_name
 *   value: [
 *     {
 *       record: 'foo',
 *       record2: 'bar',
 *     },
 *     //...
 *   ]
 * }
 */

```
