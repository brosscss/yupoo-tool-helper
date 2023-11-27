const main = async () => {
    chrome.storage.sync.get('promotion_code', async function(data) {
        const promotion_code = data.promotion_code || '';
        let elements = document.querySelectorAll('.showalbumheader__gallerysubtitle');
        const cssbuy_promo_url = transformLink(elements[0].querySelector('a').getAttribute('href'), promotion_code);
        elements.forEach((element) => {
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
    let id = link.split('id=')[1];
    let transormed_link = "https://cssbuy.com/";
    if (id) {
        transormed_link = `https://cssbuy.com/item-${id}.html?promotionCode=${promotion_code}`;
    }

    return transormed_link;
}
  