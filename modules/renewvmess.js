const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sellvpn.db');

async function renewvmess(username, exp, quota, limitip, serverId, bot, GROUP_ID) {
  if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username)) {
    return '❌ Username tidak valid.';
  }

  return new Promise((resolve) => {
    db.get('SELECT * FROM Server WHERE id = ?', [serverId], (err, server) => {
      if (err || !server) return resolve('❌ Server tidak ditemukan.');

      const url = `http://${server.domain}:5888/renewvmess?user=${username}&exp=${exp}&quota=${quota}&iplimit=${limitip}&auth=${server.auth}`;
      axios.get(url)
        .then(res => {
          if (res.data.status === "success") {
            const data = res.data.data;
            return resolve(`
♻️ *RENEW VMESS PREMIUM* ♻️

🔹 *Informasi Akun*
┌─────────────────────────────
│ Username : \`${username}\`
│ Kadaluarsa : \`${data.exp}\`
│ Kuota : \`${data.quota} GB\`
│ Batas IP : \`${data.limitip} IP\`
└─────────────────────────────
✅ Akun berhasil diperpanjang.
`);
          } else {
            const errorMsg = `❌ Gagal Perpanjang. kontak admin untuk solusi.: ${res.data.message}`;
        if (bot && GROUP_ID) {
          bot.telegram.sendMessage(GROUP_ID, `❌ Gagal Perpanjang step 1: ${res.data.message}`, { parse_mode: 'Markdown' });
        }
        return resolve(errorMsg);
          }
        }).catch((error) => {
      const errorMsg = 
	  '❌ Gagal Perpanjang. Silahkan coba beberapa saat lagi.\n\n' +
  'Penyebab gagal Diantaranya :\n' +
  '- Server sedang OFFLINE atau Maintenance.\n' +
  '- Username yang dimasukkan salah atau sudah abis masa aktif.\n\n' +
  'NOTE: Jangan hawatir saldo Anda sedang diproses untuk dikembalikan.';
      if (bot && GROUP_ID) {
        bot.telegram.sendMessage(GROUP_ID, `❌ Gagal Perpanjang step 2: ${error.message}`, { parse_mode: 'Markdown' });
      }
      return resolve(errorMsg);
	  })
    });
  });
}

module.exports = { renewvmess };