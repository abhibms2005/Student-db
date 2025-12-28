const fs = require('fs');
const path = require('path');
const vm = require('vm');

const storagePath = path.resolve(__dirname, '../src/utils/storage.js');
let code = fs.readFileSync(storagePath, 'utf8');

// Replace `export default { ... }` with `globalThis.__storage_export__ = { ... }`
code = code.replace(/export\s+default\s+\{/, 'globalThis.__storage_export__ = {');

// Simple localStorage shim
const localStorageShim = (() => {
  let store = {};
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; }
  };
})();

const context = {
  console,
  localStorage: localStorageShim,
  globalThis: {}
};
context.global = context;
context.globalThis = context;

try {
  vm.createContext(context);
  vm.runInContext(code, context, { filename: storagePath });

  const storage = context.__storage_export__;
  if (!storage) throw new Error('Failed to load storage export');

  console.log('--- read() result (keys) ---');
  const st = storage.read();
  console.log(Object.keys(st));

  console.log('\n--- getFacultyDashboard("f1") ---');
  const fd = storage.getFacultyDashboard('f1');
  console.log(Object.keys(fd));

  console.log('\n--- authenticateUser("bob@example.com","pass") ---');
  const auth = storage.authenticateUser('bob@example.com', 'pass');
  console.log({ success: auth.success, userId: auth.user && auth.user.id, role: auth.user && auth.user.role });

} catch (err) {
  console.error('Runner error:', err);
  process.exit(2);
}
