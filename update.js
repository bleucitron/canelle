const fetch = require('isomorphic-fetch');
const { token } = require('./secret.json');

const baseUrl = "https://dns.api.gandi.net/api/v5";
const zoneId = "b1c53f5e-11ad-11e9-87de-00163e4e76d5";

const url = `${baseUrl}/zones/${zoneId}/records/@/A`;

const headers = {
  "Content-Type": "application/json",
  "X-Api-key": token
};

const currentRecord = fetch(url, {
  method: 'GET',
  headers
})
.then(resp => resp.json())
.then(res => res.rrset_values[0]);

const currentPublicIP = fetch('https://ipinfo.io/ip')
.then(resp => resp.text())
.then(ip => ip.slice(0, ip.length - 1));

Promise.all([currentRecord, currentPublicIP])
.then(([record, ip]) => {
  const needsUpdate = record !== ip;

  if (needsUpdate) {
    const now = new Date();
    console.log(now.toISOString());
    console.log('Recording new IP', ip);

    const body = {
      "rrset_values": [ip]
    };

    return fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    })
    .then(res => {
      const { status, statusText, ok } = res;
      console.log(`${statusText} (Status: ${status})`);
      if (ok) console.log('Done !');
    })
  }

  return;
})
.catch(err => {
  const now = new Date();
  console.log(now.toISOString());
  console.log('ERR', err)
});
