import fetchAllSpreadSheet from './index';
const credential: any = require('../credential.json');
const id = '1rLxrom65x5QrN_dL1VXE1hyk2R4eKdC_P8NYxLsMXVw';
fetchAllSpreadSheet(id, credential).then(console.log).catch((err) => {
  console.log(JSON.stringify(err.response.data));
  console.log('fail');
  // console.error(err);
  console.log('fail');
  console.log('fail');
});

