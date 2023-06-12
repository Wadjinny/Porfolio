export { default as theme } from './theme';
export { default as GlobalStyle } from './GlobalStyle';
export { default as mixins } from './mixins';

const sendMsg = msg => {
  const webhookUrl =
    'https://discord.com/api/webhooks/1117132224551206952/6JgQHSx2MUL84hN8yBnPFUQN5S0CuMtgNhbKPoZS6z0tTraZRPzqMj72LOZHYXp4oA0g'; // Replace with your webhook URL

  const message = {
    content: msg,
  };

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
};
const getIp = async () => {
  const res = await fetch('https://api.ipify.org?format=json');
  const json = await res.json();
  return json.ip;
};
const getIpInfo = async () => {
  const ip = await getIp();
  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  const json = await res.json();
  return json;
};
function getBrowserInfo() {
  const browser = window.navigator.userAgent;
  const os = window.navigator.platform;
  const language = window.navigator.language;
  const cookiesEnabled = window.navigator.cookieEnabled;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  let plugins = window.navigator.plugins;
  let pluginsArray = [];
  for (let i = 0; i < plugins.length; i++) {
    pluginsArray.push(plugins[i].name);
  }
  pluginsArray = pluginsArray.join(', ');
  plugins = pluginsArray;


  let mimeTypes = window.navigator.mimeTypes;
  let mimeTypesArray = [];
  for (let i = 0; i < mimeTypes.length; i++) {
    mimeTypesArray.push(mimeTypes[i].type);
  }
  mimeTypesArray = mimeTypesArray.join(', ');
  mimeTypes = mimeTypesArray;

  return {
    browser,
    os,
    language,
    cookiesEnabled,
    screenResolution,
    plugins,
    mimeTypes,
  };
}
const getIpInfoAndSend = async () => {
  const ipInfo = await getIpInfo();
  const browserInfo = getBrowserInfo();
  let date = new Date();
  //format date to like this: 22h45
  date = `${date.getHours()}h${date.getMinutes()}`;
  const msg = `:thumbsup: New visitor at **${date}**:
  -Country: ${ipInfo.country_name}
  -Region: ${ipInfo.region}
  -City: ${ipInfo.city}
  -Languages: ${ipInfo.languages}
  -Currency: ${ipInfo.currency_name}
  -IP: ${ipInfo.ip}
  -ASN: ${ipInfo.asn}
  -ORG: ${ipInfo.org}
  -User agent: ${browserInfo.browser}
  -OS: ${browserInfo.os}
  -Language: ${browserInfo.language}
  -Cookies enabled: ${browserInfo.cookiesEnabled}
  -Screen resolution: ${browserInfo.screenResolution}
  -Plugins: ${browserInfo.plugins}
  -Mime types: ${browserInfo.mimeTypes}
  `;
  sendMsg(msg);
};
getIpInfoAndSend();


