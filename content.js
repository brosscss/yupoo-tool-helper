const main = async () => {
    chrome.storage.sync.get('promotion_code', async function(data) {
        const promotion_code = data.promotion_code || '';
        let elements = document.querySelectorAll('.showalbumheader__gallerysubtitle');
        if (!elements.length) {
            return;
        }
        let link = elements[0].querySelector('a');
        if (!link) return;
        const cssbuy_promo_url = transformLink(link.getAttribute('href'), promotion_code);
        elements.forEach((element) => {
                let links = element.querySelectorAll('a');
                links.forEach((link) => {
                    if (link.getAttribute('href').includes('wegobuy') || link.getAttribute('href').includes('pandabuy') || link.getAttribute('href').includes('sugargoo')) {
                        link.remove();
                    }
                });
    
                let new_link = document.createElement('a');
                new_link.setAttribute('rel', 'nofollow noopener');
                new_link.setAttribute('href', cssbuy_promo_url); 
                new_link.setAttribute('target', '_blank');
                new_link.setAttribute('style', 'margin-left: 15px; background-color: #4CAF50; border: none; color: white; padding: 5px 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px;');
                new_link.textContent = ' Buy with CSSBuy';
                let css_logo = document.createElement('img');
                css_logo.setAttribute('src', chrome.runtime.getURL('icon.png'));
                css_logo.setAttribute('width', '30');
                css_logo.setAttribute('height', '30');
                css_logo.setAttribute('style', 'margin-right: 5px; vertical-align: middle; margin-left: 15px;');
                new_link.appendChild(css_logo);

                element.appendChild(new_link);
        });

        elements = document.querySelectorAll('.showalbumheader__tabgroup');
        elements.forEach((element) => {
            let shareModal = document.getElementById('shareSocial');
            let shareModalCopy = shareModal.cloneNode(true);
            shareModalCopy.setAttribute('id', 'get_css_promo_code');
            shareModalCopy.setAttribute('style', 'display: block; margin-top: 20px; margin-bottom: 20px; margin-left: 5px; margin-right: 5px;');
            shareModalCopy.textContent = 'Copy your cssbuy promo code url';
            shareModalCopy.addEventListener('click', () => {
                navigator.clipboard.writeText(cssbuy_promo_url);
                setTimeout(() => {
                    shareModalCopy.textContent = 'Copied!';
                }, 100);

                setTimeout(() => {
                    shareModalCopy.textContent = 'Copy your cssbuy promo code url';
                }, 1000);
            });

            element.appendChild(shareModalCopy);
            
        });
    });

}

main();

const transformLink = (link, promotion_code) => {
    if (!link) {
        return link;
    }

    switch (link.split('/')[2]) {
        case 'item.taobao.com':
            return transformTaobaoLink(link, promotion_code);
        case 'detail.1688.com':
            return transform1688Link(link, promotion_code);
        case 'weidian.com':
            return transformWeidianLink(link, promotion_code);
        default:
            return link;
    }
}

const transformTaobaoLink = (link, promotion_code) => {
    let id = link.split('id=')[1];
    let transormed_link = "https://cssbuy.com/";
    if (id) {
        transormed_link = `https://cssbuy.com/item-${id}.html?promotionCode=${promotion_code}`;
    }

    return transormed_link;
}

const transform1688Link = (link, promotion_code) => {
    let id = link.split('offer/')[1].split('.html')[0];
    let transormed_link = "https://cssbuy.com/";
    if (id) {
        transormed_link = `https://cssbuy.com/item-${id}.html?promotionCode=${promotion_code}`;
    }

    return transormed_link;
}

const transformWeidianLink = (link, promotion_code) => {
    let id = link.split('item.html?itemID=')[1];
    let transormed_link = "https://cssbuy.com/";
    if (id) {
        transormed_link = `https://cssbuy.com/item-${id}.html?promotionCode=${promotion_code}`;
    }

    return transormed_link;
}