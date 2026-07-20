/**
 * Acme Bank demo account data.
 */
const ACCOUNTS = [
  { id: 'ACME-CHK-116129', name: 'ACME UNLIMITED CHEQUING ACCOUNT', number: '1 116129', type: 'chequing', balance: 3389.05, currency: 'USD' },
  { id: 'ACME-SAV-6549743', name: 'ACME HIGH INTEREST SAVINGS ACCOUNT', number: '9400 6549743', type: 'savings', balance: 2833.04, currency: 'USD' },
];

const INVESTMENTS = [
  { id: 'ACME-TFSA-0008649', name: 'MUTUAL FUND TFSA', number: '1996 0008649', balance: 76000.0 },
  { id: 'ACME-RSP-1155815', name: 'DAILY INTEREST RSP', number: '1 1155815', balance: 12000.0 },
];

module.exports = { ACCOUNTS, INVESTMENTS };
