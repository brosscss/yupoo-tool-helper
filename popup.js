let userLanguage = getPreferredLanguage();
const languageSelect = document.getElementById('language-select');
const saveButton = document.getElementById('save-button');

function getPreferredLanguage() {
  return chrome.storage.sync.get('language', (data) => {
    if (data.language) {
      languageSelect.value = data.language;
      loadLanguage(data.language);
    } 
  }) || 'en';
}

function loadLanguage(lang) {
  const url = chrome.runtime.getURL(`/lang/${lang}.json`);
  fetch(url)
    .then(response => response.json())
    .then(data => {
    document.getElementById('header').textContent = data.title;
    document.getElementById('label-language-select').textContent = data.label_language;
    document.getElementById('label-agent').textContent = data.label_agent;
    document.getElementById('label-promo-code').textContent = data.label_promo_code;
    document.getElementById('label-how-to-get-promo-code').textContent = data.label_how_to_get_promo_code;
    document.getElementById('save-button').textContent = data.save_button;
    document.getElementById('promotion_code').setAttribute('placeholder', data.label_promo_code);
    document.getElementById('label-your-url').textContent = data.label_your_url;
  })
  .catch(console.error);
}

if(saveButton) {
  document.getElementById('save-button').addEventListener('click', () => {
    const agent = document.getElementById('agent').value;
    const promotion_code = document.getElementById('promotion_code').value;
    userLanguage = languageSelect.value;
    languageSelect.value = userLanguage;
    chrome.storage.sync.set({agent: agent, promotion_code: promotion_code, language: userLanguage}, () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
        });
    });

  });
}

if(languageSelect) {
  languageSelect.addEventListener('change', (event) => {
    loadLanguage(event.target.value);
    setPreferredLanguage(event.target.value);
  });
}

function setPreferredLanguage(lang) {
  return chrome.storage.sync.set({language: lang}, () => {
    userLanguage = lang;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get('agent', function(data) {
    if (data.agent) {
      document.getElementById('agent').value = data.agent;
      document.getElementById('agent').setAttribute('disabled', true);
    }
  });

  chrome.storage.sync.get('promotion_code', function(data) {
    if (data.promotion_code) {
      document.getElementById('promotion_code').value = data.promotion_code;
    }
  }
  );

  document.getElementById('save-button').addEventListener('click', function() {
    const agent = document.getElementById('agent').value;
    const promotion_code = document.getElementById('promotion_code').value;
    chrome.storage.sync.set({agent: agent, promotion_code: promotion_code}, function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
      });
    });
  });

  document.getElementById('copy-your-url').addEventListener('click', function() {
    let url = prompt('Put the taobao/weidian/1688 link to transform');
    let promotion_code = document.getElementById('promotion_code').value;

    if (url) {
      let transformed_url = transformLink2(url, promotion_code);
      alert(transformed_url);
    }
  });
});

// DUPLICATE CODE ATM from content.js

const transformLink2 = (link, promotion_code) => {
  if (!link) {
      return link;
  }

  switch (link.split('/')[2]) {
      case 'item.taobao.com':
          return transformTaobaoLink2(link, promotion_code);
      case 'detail.1688.com':
          return transform1688Link2(link, promotion_code);
      case 'weidian.com':
          return transformWeidianLink2(link, promotion_code);
      default:
          return link;
  }
}

const transformTaobaoLink2 = (link, promotion_code) => {
  let id = link.split('id=')[1];
  let transormed_link = "https://cssbuy.com/";
  if (id) {
      transormed_link = `https://cssbuy.com/item-${id}.html?promotionCode=${promotion_code}`;
  }

  return transormed_link;
}

const transform1688Link2 = (link, promotion_code) => {
  let id = link.split('offer/')[1].split('.html')[0];
  let transormed_link = "https://cssbuy.com/";
  if (id) {
      transormed_link = `https://cssbuy.com/item-${id}.html?promotionCode=${promotion_code}`;
  }

  return transormed_link;
}

const transformWeidianLink2 = (link, promotion_code) => {
  let id = link.split('item.html?itemID=')[1];
  let transormed_link = "https://cssbuy.com/";
  if (id) {
      transormed_link = `https://cssbuy.com/item-${id}.html?promotionCode=${promotion_code}`;
  }

  return transormed_link;
}