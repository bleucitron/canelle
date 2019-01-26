const fetch = require('isomorphic-fetch');
const { token } = require('./secret.json');

const baseUrl = "https://dns.api.gandi.net/api/v5";
const zoneId = "b1c53f5e-11ad-11e9-87de-00163e4e76d5";

const url = `${baseUrl}/zones/${zoneId}/records/@/A`;

const headers = {
  "Content-Type": "application/json",
  "X-Api-key": token
};

fetch('https://ipinfo.io/ip')
.then(resp => resp.text())
.then(ip => {
  ip = ip.slice(0, ip.length - 1);
  console.log('Current public IP', ip);

  const body = {
    "rrset_values": [ip]
  };

  return fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });
})
.then(res => {
  const { status, statusText, ok } = res;
  console.log(statusText);
  console.log('Status:', status);
  if (ok) console.log('Done !');
})
.catch(err => console.log('ERR', err));

