let userLanguage = getPreferredLanguage();
const languageSelect = document.getElementById('language-select');
const promotion_code = getPromotionCode() || '';

document.getElementById('agent').setAttribute('disabled', true);
function loadLanguage(lang) {
    const url = chrome.runtime.getURL(`/lang/${lang}.json`);
    fetch(url)
      .then(response => response.json())
      .then(data => {
      document.getElementById('title').textContent = data.title;
      document.getElementById('label-language-select').textContent = data.label_language;
      document.getElementById('label-agent').textContent = data.label_agent;
      document.getElementById('label-promo-code').textContent = data.label_promo_code;
      document.getElementById('label-how-to-get-promo-code').textContent = data.label_how_to_get_promo_code;
      document.getElementById('save-button').textContent = data.save_button;
      document.getElementById('promotion_code').setAttribute('placeholder', data.label_promo_code);
    })
    .catch(console.error);
}

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

languageSelect.addEventListener('change', (event) => {
  loadLanguage(event.target.value);
  setPreferredLanguage(event.target.value);
});

function getPromotionCode() {
    return chrome.storage.sync.get('promotion_code', (data) => {
        if (data.promotion_code) {
            document.getElementById('promotion_code').value = data.promotion_code;
        }
    });
}

function getPreferredLanguage() {
    return chrome.storage.sync.get('language', (data) => {
      if (data.language) {
        languageSelect.value = data.language;
        loadLanguage(data.language);
      } 
    }) || 'en';
  }
  
function setPreferredLanguage(lang) {
    return chrome.storage.sync.set({language: lang}, () => {
      userLanguage = lang;
    });
}