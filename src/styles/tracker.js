
const sendMsg = msg => {
  const webhookUrl =
    'https://discord.com/api/webhooks/1213528271551991909/RB8eKQ57Rycfai6eZYQsLEEJ_NLlYVuxlfTdOOcScmsiEmcaADTzXQ6YfW3nSwcd0wE5'; // Replace with your webhook URL

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
const setVisitRecord = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const today = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  const visitList = localStorage.getItem('visitList');
  if (visitList) {
    localStorage.setItem('visitList', `${visitList},${today}`);
  } else {
    localStorage.setItem('visitList', today);
  }
};
const getVisitRecord = () => {
  const visitList = localStorage.getItem('visitList');
  if (visitList) {
    const visitListArray = visitList.split(',');
    return visitListArray;
  } else {
    return [];
  }
};

const getIpInfoAndSend = async () => {
  const ipInfo = await getIpInfo();
  const browserInfo = getBrowserInfo();
  const filterd_out_orgs = ["MICROSOFT-CORP-MSN-AS-BLOCK", "AMAZON-AES", undefined]
  if (filterd_out_orgs.includes(ipInfo.org)) {
    return
  }

  let date = new Date();
  //format date to like this: 22h45
  date = `${date.getHours()}h${date.getMinutes()}`;
  const visitList = getVisitRecord();
  const msg = `:thumbsup: New visitor at **${date}**:
    -**UserName:** ${localStorage.getItem('username')}
    -**Country:** ${ipInfo.country_name}
    -**Region:** ${ipInfo.region}
    -**City:** ${ipInfo.city}
    -**Languages:** ${ipInfo.languages}
    -**Currency:** ${ipInfo.currency_name}
    -**IP:** ${ipInfo.ip}
    -**ASN:** ${ipInfo.asn}
    -**ORG:** ${ipInfo.org}
    -**User agent:** ${browserInfo.browser}
    -**OS:** ${browserInfo.os}
    -**Language:** ${browserInfo.language}
    -**Cookies enabled:** ${browserInfo.cookiesEnabled}
    -**Screen resolution:** ${browserInfo.screenResolution}
    -**Plugins:** ${browserInfo.plugins || 'none'}
    -**Mime types:** ${browserInfo.mimeTypes || 'none'}
    -**Visit list:** ${visitList.join(', ') || 'none'}
    `;
  sendMsg(msg);
  setVisitRecord();
};

const getElementDetail = (element) => {
  let details = {
    tag: element.tagName,
    text: element.textContent.substring(0, 100),
    href: element.href,
  };
  return details;
}
const formatTracking_info = (element,event) => {
  const details = getElementDetail(element);
  const username = localStorage.getItem('username') || '--User--';
  let msg = `:atom: The ${username} ${event}:
  -**Tag:** ${details.tag}
  -**Text:** ${details.text}
  `;
  msg += details.href ? `-**Href:** ${details.href}` : '';
  return msg;
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function getVisibleElements() {
  // Select all elements on the page
  const allElements = document.querySelectorAll('main section');

  // Filter visible elements
  const visibleElements = Array.from(allElements).filter(element => {
      const style = window.getComputedStyle(element);
      return (
          element.offsetWidth > 0 &&
          element.offsetHeight > 0 &&
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          isElementInViewport(element)
      );
  });

  return visibleElements;
}

async function fetchWordList() {
  return fetch('/word-list.json').then(response => response.json());
  
}

document.addEventListener("click",(e)=>{sendMsg(formatTracking_info(e.target,'clicked on'))})
document.addEventListener("scrollend", (event) => {
  let el = getVisibleElements();
  if (el.length > 0) {
    el = el[0]; 
    const username = localStorage.getItem('username') || '--User--';
    sendMsg(` :arrow_double_down: ${username} scrolled to ${el.id}`);
  }
});


(async () => {
  let username = localStorage.getItem('username');
  if (!username) {
    const wordList = await fetchWordList();
    const random_word_gen = () => wordList[Math.floor(Math.random() * wordList.length)];
    const random_word = random_word_gen()+'-'+random_word_gen()+'-'+random_word_gen();
    console.log(random_word);
    localStorage.setItem('username', random_word);
  }
  getIpInfoAndSend();
})();




let res = "";
export default res;
