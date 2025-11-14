let displayData = [
    {
        title: 'Prefered Language',
        titleSw: 'Pendekeza Lugha',
        descr: 'Pick the language you vibe with most. Everything in the app—from menus to messages—will match your flow.',
        descrSw: 'Chagua lugha unayoelewa vizuri zaidi. Kila kitu kwenye app kitafuata mtiririko wako.'
    },
    {
        title: 'Choose your Gender',
        titleSw: 'Chagua Jinsia Yako',
        descr: 'Let us know how you identify. Helps us keep things personal, respectful, and just right for you.',
        descrSw: 'Tueleze jinsia yako ili kuboresha mawasiliano na kuhakikisha kila kitu kinakufaa.'
    },
    {
        title: 'Select Account Type',
        titleSw: 'Aina ya Akaunti',
        descr: 'Are you here to shop, sell, or do both? Pick your hustle and we’ll tailor the app to fit your grind.',
        descrSw: 'Wewe ni mnunuzi, muuzaji au yote mawili? Chagua njia yako ili app ikufae vilivyo.'
    },
    {
        title: 'Product Categories',
        titleSw: 'Pendekeza Bidhaa',
        descr: 'Tell us what you’re into—fashion, tech, beauty, etc. We’ll show you the good stuff first.',
        descrSw: 'Tuambie unapenda nini—mitindo, vifaa, urembo n.k. Tutaanza kukuonesha vitu vya maana kwanza.'
    },
    // {
    //     title: 'Setup Your Wallet',
    //     titleSw: 'Andaa Waleti Yako',
    //     descr: 'Create your in-app wallet to easily manage funds, shop smooth, and keep your transactions secure.',
    //     descrSw: 'Tengeneza waleti yako hapa ili kudhibiti pesa zako, kufanya manunuzi kwa urahisi na kwa usalama.'
    // }
];


function initLanguages(){
    let userLanguage = localStorage.getItem('lang');
    const allElements = get('*[sw]', true);
    allElements.forEach(el=>{
        let sw = el.getAttribute('sw');
        let en = el.getAttribute('en');
        if(userLanguage == 'sw'){
            el.innerHTML = el.innerHTML.replace(en, sw);
        }else{
            el.innerHTML = el.innerHTML.replace(sw, en);
        }
    });
};



initLanguages();
// initObserver();