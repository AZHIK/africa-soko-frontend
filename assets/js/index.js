const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const JSON_HEAD = {"Content-Type": "applicarion/json"}
const RWS_SERVER = "";
const CWS_SERVER = "";
// const MAIN_SERVER = "http://127.0.0.1:8000";
const MAIN_SERVER = "https://decorative-handmade-proceed-analytical.trycloudflare.com";
//const socket = new WebSocket(`${MAIN_SERVER.replace("http", "ws")}/online_status`);
const CLIENT_ID = "181406034089-stlf00e3mglhavcuk6uqav4i1dgvr073.apps.googleusercontent.com";
let OTP = ""


// const tokenClient = google.accounts.oauth2.initTokenClient({
//   client_id: CLIENT_ID,
//   scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.birthday.read",
//   callback: (response) => {
//     const accessToken = response.access_token;
//     fetch("https://people.googleapis.com/v1/people/me?personFields=genders,birthdays,names", {
//       headers: { "Authorization": `Bearer ${accessToken}` }
//     })
//     .then(res => res.json())
//     .then(data => console.log("User profile:", data))
//     .catch(err => console.error(err));
//   }
// });


let onboardData = {
  language: null,
  gender: null,
  role: null, //account
  categories: null,
  location: null
}

// constants up top

function resetCreateInputs(){
  let inputs = get('.floater-pages .productCreate .actInputs .input input, .floater-pages .productCreate .actInputs textarea', true);
  for(let inp of inputs){
    inp.value = '';
  }
  let toggles = get('.floater-pages .productCreate .actInputs .toggleCont', true);
  for(let tg of toggles){
    tg.setAttribute('value','off');
  }
  let colors = get('.floater-pages .productCreate .imgCollection .image', true);
  for(let c of colors){
    c.remove();
  }
  let attrs = get('.floater-pages .productCreate .attributes .attrList .attr', true);
  for(let a of attrs){
    if(!a.classList.contains('active')){a.remove()}
    else{
      a.querySelectorAll('input').forEach(i=>i.value='');
    }
  }
};
function retrieveSettingsData(){
  let toggles = get('.floater-pages .productCreate .actInputs .toggleCont', true);
  let settings = {};
  toggles.forEach(toggle=>{
    let key = toggle.getAttribute('value');
    let value = toggle.children[2].classList.contains('active') ? true : false;
    settings[key] = value;
  });
  // console.log(settings);
  return settings;
};
async function retrieveProductData() {
  let imgs = get('.floater-pages .productCreate .imgCollection .image img', true);
  let title = get('.floater-pages .productCreate .actInputs input[type="text"]').value.trim();
  let inventory = get('.floater-pages .productCreate .actInputs .inps input.commaInput').value.trim().replace(/,/g, '');
  let bpp = get('.floater-pages .productCreate .actInputs .inps input.commaInput', true)[1].value.trim().replace(/,/g, '');
  let description = get('.floater-pages .productCreate .actInputs textarea').value.trim();
  let attrs = get('.floater-pages .productCreate .attributes .attrList .attr', true);
  let category = get(".floater-pages .productCreate #category")?.value.trim();
  let unitType = get(".floater-pages .productCreate #unit_type")?.value.trim();
  let successPlay = new Audio("assets/audio/success.mp3");

  if (!imgs.length) return alert('Please add at least one product image.');
  if (!title) return alert('Please enter a product title.');
  if (!inventory || isNaN(inventory) || parseInt(inventory) < 1) return alert('Please enter a valid inventory size.');
  if (!bpp || isNaN(bpp) || parseInt(bpp) < 1) return alert('Please enter a valid base product price.');
  if (!description) return alert('Please enter a product description.');
  if (!category) return alert('Please select a product category.');
  if (!unitType) return alert('Please select a unit type.');

  // --- Description checks ---
  const wordCount = description.split(/\s+/).filter(Boolean).length;
  const hashtagCount = (description.match(/#/g) || []).length;

  if (wordCount < 20)
    return alert('Description must be at least 20 words long.');

  if (hashtagCount < 5)
    return alert('Description must include at least 5 hashtags (#).');

  // --- Attribute handling ---
  let attributes = [];
  attrs.forEach(attr => {
    let attrName = attr.children[0].value.trim();
    let attrValues = attr.children[1].value.trim().split('\n').map(v => v.trim());
    if (attrName && attrValues.length) attributes.push({ name: attrName, values: attrValues });
  });

  // --- Image upload handling ---
  let uploadedURLs = [];
  getPop(".createPostPending");
  for (let img of imgs) {
    let src = img.src;
    let ext = src.split(";base64,")[0].split("data:image/")[1];

    if (!src.startsWith("data:")) {
      uploadedURLs.push(src);
      continue;
    }
    let filename = `product_${Date.now()}_${Math.floor(Math.random() * 9999)}.${ext}`;
    console.log("Uploading", filename);

    try {
      let rsp = await fetch(`${MAIN_SERVER}/upload`, {
        method: "POST", credentials: "include",
        headers: {
          // "Authorization": `Bearer ${localStorage.getItem("sokoni_identity")}`,
          "Content-Type": "application/json"
        },
        // headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: src, filename })
      });

      if (rsp.ok) {
        let js = await rsp.json();
        uploadedURLs.push(`${MAIN_SERVER}/sokoni_uploads/${js.filename}`);
      } else {
        console.error("Upload failed:", rsp.status);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  }

  // --- Final product data ---
  let productData = {
    images: uploadedURLs,
    title,
    stock: parseInt(inventory),
    price: parseFloat(bpp),
    description,
    category,
    unit_type: unitType,
    attributes,
    settings: retrieveSettingsData()
  };

  // --- Send to backend ---
  fetch(`${MAIN_SERVER}/create_product`, {
    method: "POST", credentials: "include",
    headers: JSON_HEAD,
    body: JSON.stringify({
      id: localStorage.getItem("sokoni_identity"),
      data: productData
    })
  }).then(rsp => {
    if (rsp.status == 200) {
      rsp.json().then(js_dt => console.log(js_dt));
      successPlay.play();
      get(".createPostPending .el-status").style.display = "flex";
      get(".createPostPending .default-btn").classList.remove("load");
      get(".createPostPending .default-btn").onclick = () => {
        resetCreateInputs();
        shutPop('.createPostPending');
        get(".createPostPending .el-status").style.display = "none";
        get(".createPostPending .default-btn").classList.add("load");
        loadInventory();
      };
    }
  });
};



function extractHashtags(description) {
  const tags = description.match(/#\w+/g) || []; // find all hashtags
  const htmlTags = tags.map(tag => `<p>${tag}</p>`).join('');
  console.log(htmlTags)
  return htmlTags
};
function disableTouchAction(){
  window.addEventListener('contextmenu', e => e.preventDefault());
};
function inpSplit(text, size = 3, spaceType="-") {
  return size > 0 ? text.match(new RegExp(`.{1,${size}}`, 'g')).join(spaceType) : text;
};
function isValid(phone) {
  return /^[76]\d{2}-\d{3}-\d{3}$/.test(phone);
};
function cropText(text, maxLength) {
  if (text.length > maxLength) {
    return {
      isLong: true,
      cropped: text.slice(0, maxLength) + "..."
    };
  } else {
    return {
      isLong: false,
      cropped: text
    };
  }
};
function isStandalone() {
  return (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
};
function downloadPWA() {
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  window.addEventListener('touchend', () => {
    if (!isStandalone()) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => deferredPrompt = null);
    } else {
      console.log('Install prompt not available.');
    }
  });
};
function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz01234567890123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
function get(el, all=false){return all ? document.querySelectorAll(el) : document.querySelector(el)};
function getFloater(className){
  if(className == '.storyView') switchTheme('#cdcbc9');
  if(className == '.storyCreate') switchTheme('#111111ff');
  const floater = document.querySelector(`.floater-pages ${className}`);
  if(floater.classList.contains("profileBase")){
    floater.classList.add("load");
    setTimeout(()=>{
      floater.classList.remove("load");
    }, 2000);
  }
  floater.classList.add('active');
  // console.log(className)
};
function getPop(className){
  switchTheme("#cdcbc9")
  setTimeout(()=>{
    const popCont = document.querySelector('.all-popups');
    popCont.classList.add('active');
    popCont.querySelector(className).classList.add('active');
  }, 200)
};
function shutPop(className){
  switchTheme("#faf8f5")
  const popCont = document.querySelector('.all-popups');
  popCont.querySelector(className).classList.remove('active');
  setTimeout(()=>{
    popCont.classList.remove('active');
  }, 200)
};
function getDscr(num, id){
  let allDscr = get(`#${id} .popDescrCont .popDescr`, true);
  allDscr.forEach(dsc=>dsc.classList.remove("active"));
  allDscr[num].classList.add("active");
  allDscr[num].querySelector(".default-btn").classList.remove("load");
};
function tgActive(cls){
  try{cls.classList.toggle("active");return}catch(e){}
  get(cls).classList.toggle("active");
};
function rmActive(cls){
  get(cls).classList.remove("active");
};
function addActive(cls){
  get(cls).classList.add("active");
};
function sharePost(url){
  if (navigator.share) {
    navigator.share({
      title: "Sokoni Africa",
      text: "Post from Sokoni Africa App",
      url: url
    })
    .then(() => console.log("Shared successfully"))
    .catch(err => console.error("Error sharing:", err));
  } else {
    console.log("Web Share API not supported on this browser.");
  }
};
function copyClip(text="barefawl.com"){
  navigator.clipboard.writeText(text)
  .then(() => console.log("Copied!"))
  .catch(err => console.error("Failed:", err));
};
function closeFloater(className){
    const floater = document.querySelector(className);
    floater.classList.remove('active');
};
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
function disableEnter(){
  const allInputs = document.querySelectorAll('input');
  allInputs.forEach(inp=>{
    inp.addEventListener('keypress', (e)=>{
      if(e.keyCode === 13){
        e.preventDefault();
        return false;
      }
    });
    inp.addEventListener('keyup', (e)=>{
      if(e.keyCode === 13){
        e.preventDefault();
        return false;
      }
    });
    inp.addEventListener('keydown', (e)=>{
      if(e.keyCode === 13){
        e.preventDefault();
        return false;
      }
    });
  });
};
function formatMoney(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
function formatShort(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
};
function formatDate(input) {
  const date = new Date(input);
  const now = new Date();
  const diffMs = now - date;
  const diffHrs = diffMs / (1000 * 60 * 60);

  // If less than 72 hours, show relative time
  if (diffHrs < 72) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  // Otherwise, show formatted date
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11 ? 'st' :
    day % 10 === 2 && day !== 12 ? 'nd' :
    day % 10 === 3 && day !== 13 ? 'rd' : 'th';

  return `${day}${suffix} ${month}, ${year}`;
};
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
};
function embedLinks(description) {
  return description.replace(/https?:\/\/(?:www\.)?([\w-]+)\.\w+(?:\/[^\s]*)?/gi, (match, domain) => {
    const siteName = domain.toLowerCase();
    return `<a href="${match}" target="_blank">${siteName}</a>`;
  });
}
function getBadgeImage(badge) {
  if (badge === "gold") return "assets/images/badges/gold.png";
  if (badge === "blue") return "assets/images/badges/blue.png";
  return "";
};
function def(fn){fn()};

// complex functions

async function applyLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolve([latitude, longitude]);
      },
      (err) => reject(err.message),
      { enableHighAccuracy: true }
    );
  });
};
function applyValues(){
    const allSteps = get('.main-content .stepContent', true);
    allSteps.forEach(step=>{
      if(onboardData[step.id] == null){
        onboardData[step.id] = step.getAttribute('value')
      }
    });
    localStorage.setItem('lang', allSteps[0].getAttribute('value'));
};
function initEnterKeyHint(){
  document.querySelectorAll("input").forEach(inp=>{
    inp.enterKeyHint = "done";
  })
}
function initTitleDesc(index){
    let target = displayData[index];
    const titleEl = get('.onboarding .first-content .titleDsc');
    const descrEl = get('.onboarding .first-content .description');
    if(localStorage.getItem('lang') == 'sw'){
        titleEl.textContent = target.titleSw;
        descrEl.textContent = target.descrSw;
    }else{
        titleEl.textContent = target.title;
        descrEl.textContent = target.descr;
    };
};
function initOnboardingSteps() {
  const onboarding = get('.section-content.onboarding');
  const stepsList = onboarding.querySelectorAll('.stepsList i');
  const call2Action = onboarding.querySelectorAll('.call2actionBtn');
  const stepsContent = onboarding.querySelector('.main-content');

  initTitleDesc(0);
  
  setTimeout(() => {
    stepsList[0].classList.add('active');

    // Previous button
    call2Action[0].onclick = () => {
      let leftMargin = Number(call2Action[1].getAttribute('left'));
      if (leftMargin <= 0) return;

      stepsList[leftMargin].classList.remove('active');

      applyValues();
      initTitleDesc(leftMargin - 1);
      initLanguages();

      stepsContent.style.marginLeft = `calc(-${leftMargin - 1}00vw - var(--minimal-padding))`;
      call2Action[1].setAttribute('left', `${leftMargin - 1}`);

      if (leftMargin - 1 === 0) {
        call2Action[1].parentElement.classList.remove('active');
      }
    };

    // Next button
    call2Action[1].onclick = async () => {
      let leftMargin = Number(call2Action[1].getAttribute('left'));
      try {
        call2Action[1].parentElement.classList.add('active');
        stepsList[leftMargin + 1].classList.add('active');

        applyValues();
        initTitleDesc(leftMargin + 1);
        initLanguages();

        stepsContent.style.marginLeft = `calc(-${leftMargin + 1}00vw - var(--minimal-padding))`;
        call2Action[1].setAttribute('left', `${leftMargin + 1}`);
      } catch (error) {
        // Last step reached: submit onboarding data
        applyValues();
        call2Action[1].classList.add("load");

        // Ensure categories is array
        if (onboardData.categories && typeof onboardData.categories === "string") {
          onboardData.categories = onboardData.categories.split("|");
        }

        try {
          const rsp = await fetch(`${MAIN_SERVER}/update_user`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("sokoni_identity")}`
            },
            body: JSON.stringify({ data: onboardData })
          });

          if (rsp.status !== 200) throw new Error("Failed to update user");

          const data = await rsp.json();
          if (data.status !== "success") throw new Error(data.detail || "Update failed");

          localStorage.setItem("sokoni_role", onboardData.role || "customer");

          onboarding.classList.add('disabled');
          get('.section-content.appContent').classList.add('active');
          getPop(".welcome");
          applyRole();
          // Optional: loadExplorePosts(); initAllEndpoints();
        } catch (err) {
          console.error("Onboarding submission failed:", err);
          alert("Failed to complete onboarding. Please try again.");
          call2Action[1].classList.remove("load");
        }
      }
    };
  }, 1000);
  
  window.addEventListener('click', ()=>{
    let targetIndex = call2Action[1].getAttribute('left');
    let targetContent = stepsContent.querySelectorAll('.stepContent')[targetIndex];
    if ( targetContent.hasAttribute('value') ){
      call2Action[1].classList.remove('disabled');
    }else{
      call2Action[1].classList.add('disabled');
    };
  });
};

function startOnboarding(response){
  let idToken;
  try{
    idToken = response?.credential;
    // console.log(response, idToken);
  }catch(e){}

  const startupPage = get('.section-content.startup');
  const onboarding = get('.section-content.onboarding');
  const appContent = get('.section-content.appContent');

  const stepsContent = onboarding.querySelector('.main-content');
  const call2Action = onboarding.querySelectorAll('.call2actionBtn');
  // const onboardInp = onboarding.querySelector('#onboardingInput input');

  fetch(`${MAIN_SERVER}/authenticate`, {
    method: "POST", credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      auth_type: "email",
      auth_by: idToken,
      referee: window.location.href.split("#")[1] || null
    })
  }).then(data_json=>{
    data_json.json()
    .then(response=>{
      shutPop('.signIn');

      console.log(response);
      if(response.status == "failed") return;
      localStorage.setItem("sokoni_identity", response.___access_token);
      localStorage.setItem("___refresh_token", response.___refresh_token);
      // socket.send(localStorage.getItem("sokoni_identity"));

      startupPage.classList.add('disabled');
      subscribeUser();
      showLocations();

      if(!response.new) { // existing user
        localStorage.setItem("sokoni_role", response.role);
        
        appContent.classList.add("active");

        getPop(".welcome");
        applyRole();
        return;
      }
      
      initOnboardingSteps();
      onboarding.classList.add('active');
      // onboardInp.addEventListener('input',()=>{
      //     let targetIndex = call2Action[1].getAttribute('left');
      //     let targetContent = stepsContent.querySelectorAll('.stepContent')[targetIndex];
      //     if ( targetContent.hasAttribute('value') ){
      //         call2Action[1].classList.remove('disabled');
      //     }else{
      //         call2Action[1].classList.add('disabled');
      //     };
      // });
    });
  }).catch(error => {
    console.error('Authentication request failed:', error);
    alert('Google login failed. Please try again.');
    const onbBtn = document.querySelector('.all-popups .signIn .default-btn.googleLogin');
    onbBtn.classList.remove("load");
  });
};
function onboardingTrigger(){
  const onbBtn = document.querySelectorAll('.all-popups .signIn .default-btn.googleLogin');
  console.log(onbBtn);
  onbBtn.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      startOnboarding();
    });
  })
  
  const skipBtn = document.querySelector('.all-popups .signIn .guestCont');
  skipBtn.addEventListener('click', ()=>{
    shutPop('.signIn');
    get(".section-content.startup").classList.add("disabled");
    get(".section-content.appContent").classList.add("active");
    getPop(".welcome");
    showLocations();
  });
};
function googleLogin() {
  const onbBtn = document.querySelector('.all-popups .signIn .default-btn.googleLogin');

  window.addEventListener('load', () => {
    onbBtn.addEventListener('touchend', ()=>{
      console.log("touched");
      onbBtn.classList.add("load");

      // tokenClient.requestAccessToken()
      google.accounts.id.prompt();
    });
  });
};
function verifyPhone(el){
  const nLogin = document.querySelector("#numberLogin");
  let phone = nLogin.value.replaceAll("-","");
  if(el) el.classList.add("load");

  if(phone.length < 8){
    setTimeout(()=>{
      el.classList.remove("load");
      return;
    }, 1000);
  };

  setTimeout(()=>{
    fetch(`${MAIN_SERVER}/authenticate`, {
      method: "POST", credentials: "include",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        auth_type: "phone",
        auth_by: phone,
        OTP: OTP,
        referee: window.location.href.split("#")[1] || null
      })
    }).then(rsp=>{
      if(rsp.status == 200){
        rsp.json().then(otp=>{
          if(otp.status == "success"){
            localStorage.setItem("sokoni_identity", otp.___access_token);
            localStorage.setItem("___refresh_token", otp.___refresh_token);
            // socket.send(localStorage.getItem("sokoni_identity"));

            const btn = document.querySelector(".loginBtn");
            btn.classList.add("load");
            shutPop(".signIn");
            subscribeUser();
            showLocations();
            
            if(otp.new){
              initOnboardingSteps();
              get('.section-content.startup').classList.add('disabled');
              get('.section-content.onboarding').classList.add('active');
            }else{
              // console.log(otp)
              localStorage.setItem("sokoni_role", otp.role);

              get('.section-content.startup').classList.add('disabled');
              get('.section-content.appContent').classList.add('active');
              getPop(".welcome");
              applyRole();
              // loadExplorePosts();
              // initAllEndpoints();
            }
          }else{
            initOTPinput('.loginOTP', get('.loginBtn'), verifyPhone, otp.otp);
            getDscr(2, "userSignIn");
            OTP = otp.otp;
          }
        });
      }
    })
  }, 1500);
};
function getIn(user_data){
  fetch(`${MAIN_SERVER}/authenticate`, {
    method: "POST", credentials: "include",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(user_data)
  })
  .then(rsp=>rsp.json())
  .then(json_data=>{
    console.log(json_data);
    if(json_data.status = "failed") return;
    try {
      let rec_data = json_data.data.split("uuid-");
      decrypt(rec_data[0], `uuid-${rec_data[1]}`)
      .then(final_data=>{
        setTimeout(()=>{
          final_data = JSON.parse(final_data)

          localStorage.setItem("auth", JSON.stringify(final_data))
          shutPop('.signIn');
          get('.section-content.startup').classList.add('disabled');
          get('.section-content.onboarding').classList.add('disabled');
          get('.section-content.appContent').classList.add('active');
          loadExplorePosts();
          initAllEndpoints()
        }, 100);
      });
    } catch (error) {};
  });
};

function handleLoader(){
  const loader = document.querySelector('.loader');
  
  if(/iPad|iPhone|iMac/.test(navigator.userAgent)){
    document.body.setAttribute("ios", "");
  };
  // downloadPWA();
  window.addEventListener('load', ()=>{
    refreshToken();
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: startOnboarding,
      ux_mode: "popup"
    });
    if(localStorage.getItem("sokoni_identity")){
      console.log("getting in")
      const startupPage = get('.section-content.startup');
      const appContent = get('.section-content.appContent');
      startupPage.classList.add('disabled');
      appContent.classList.add('active');
      // loadExplorePosts();
      // initAllEndpoints();
    };
    get('.exploreReload').ontouchstart = ()=>{
      if(!get('.exploreReload').classList.contains("active")) return;
      loadExplorePosts();
    };
    if(!isStandalone()) {window.click();return};
    setTimeout(()=>{
      loader.classList.add('disabled');
    }, 2000);
  })
};
function watchStartupScroll(){
    const startupScroll = document.querySelector('.startup-scroll');
    const swipeAnimation = document.querySelector('.swipeInstruct');
    window.addEventListener("load", ()=>{
      setTimeout(()=>{
        // if(startupScroll.hasAttribute('scrolled')) return;
          swipeAnimation.classList.toggle('active');
          setTimeout(()=>{
              swipeAnimation.classList.toggle('active');
          }, 5000);
      }, 2000);
    });
}
function inputGaps(input, size, isNum){
    input.addEventListener("input", (e) => {
        if(isNum && /[a-zA-Z]/.test(e.key)) return;
        let value = input.value.replace(/\s/g, '');
        let formatted = value.match(/.{1,3}/g)?.join(' ') || '';
        input.value = formatted;
    });
};
function parseTime(str) {
  if (str.toLowerCase() === "yesterday") return -1;
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
};
function renderChats(chatList) {
  let unread = JSON.parse(localStorage.getItem("sokoni_unread")) || {};
  const container = document.querySelector('.allChats');
  container.innerHTML = "";

  const sorted = [...chatList].sort((a, b) => parseTime(b.time) - parseTime(a.time));

  sorted.forEach(chat => {
    const isActive = chat.unread > 0 ? ' active' : '';
    const sentIcon = chat.sentByUser ? '<i class="fi fi-rr-check-double"></i> ' : '';

    const chatCard = document.createElement('div');
    chatCard.className = `chatCard${isActive}`;
    chatCard.innerHTML = `
      <div class="details">
        <img src="${chat.img}">
        <div class="data">
          <div class="nameTime jstCnt">
            <h2>${chat.name} ${chat.badge ? `<img src="assets/images/badges/${chat.badge}.png"></img>` : ''}</h2>
            <p class="time">${formatDate(chat.time)}</p>
          </div>
          <div class="msgSize jstCnt">
            <p>${sentIcon}${chat.message.length > 15 ? chat.message.slice(0, 20) + "..." : chat.message}</p>
            <span>${chat.unread}</span>
          </div>
        </div>
      </div>
      <i class="fi fi-rr-trash delete"></i>
    `;
    enableSwipe(chatCard);
    chatCard.addEventListener('click', ()=>{
      getFloater('.chatroom')
    });
    chatCard.onclick = ()=>{
      unread[chat.sender_id] = 0;
      localStorage.setItem("sokoni_unread", JSON.stringify(unread))
      getConversation(chat.sender_id, [chat.img, chat.name]);
    }
    container.appendChild(chatCard);
  });
};
function enableSwipe(chatCard) {
  const details = chatCard.querySelector('.details');
  let startX = 0;
  let currentX = 0;
  let moved = false;

  chatCard.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    moved = false;
  });

  chatCard.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].clientX;
    let deltaX = currentX - startX;

    if (deltaX < 0) {
      moved = true;
      details.style.marginLeft = `${deltaX}px`;
    }
  });

  chatCard.addEventListener('touchend', () => {
    if (!moved) return;

    const finalDelta = currentX - startX;

    if (finalDelta <= -150) {
      chatCard.classList.add('deleted');
      details.removeAttribute('style');
    } else {
      details.style.marginLeft = `0px`;
    }

    startX = 0;
    currentX = 0;
    moved = false;
  });
};
async function switchTheme(color='#faf8f5') {
    // let { StatusBar, StatusBarStyle } = Capacitor.Plugins;

    document.getElementById('themeColorMeta').content = color;
    // if(color=="#faf8f5"){document.body.classList.add("white")}
    // else{document.body.classList.remove("white")};
    // await StatusBar.setStyle({ style: StatusBarStyle.Light });
};
async function logOut(){
  localStorage.removeItem("sokoni_identity");
  localStorage.removeItem("sokoni_role");
  fetch(`${MAIN_SERVER}/logout`, {method: "POST"})
  .then(rsp=>rsp.json())
  .then(js=>{
    location.reload();
  })
};
function enableCategories(){
  const unitMap = {
    Fashion: ["Piece", "Pair", "Set"],
    Electronics: ["Piece", "Box", "Set"],
    Home: ["Piece", "Set", "Box"],
    Automotive: ["Piece", "Set"],
    Industrial: ["Piece", "Kg", "Litre (L)"],
    Healthcare: ["Piece", "Pack", "Box", "Bottle"],
    Agriculture: ["Kg", "Litre (L)", "Dozen"],
    Education: ["Piece", "Pack", "Set", "Book"],
    Travel: ["Ticket", "Package"],
    Business: ["Package", "Service"],
    Energy: ["Litre (L)", "Bottle", "Unit"],
    Food: ["Piece", "Pack", "Box", "Dozen", "Carton", "Plate", "Kg", "G"],
    Beauty: ["Piece", "Bottle", "Pack"],
    Toys: ["Piece", "Box", "Set"],
    Sports: ["Piece", "Pair", "Set"],
    "Real Estate": ["Unit"],
    Construction: ["Piece", "Kg", "Meter"],
    Books: ["Piece"],
    Pets: ["Piece", "Pack", "Kg"],
    Crafts: ["Piece", "Set", "Pack"]
  };

  const categorySelect = document.getElementById("category");
  const unitType = document.getElementById("unit_type");

  // Fill category options (English)
  masterCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat[0];
    opt.textContent = cat[0];
    categorySelect.appendChild(opt);
  });

  // Populate units based on selected category
  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value;
    unitType.innerHTML = '<option value="" selected>-- Unit Type --</option>';

    if (unitMap[selected]) {
      unitMap[selected].forEach(unit => {
        const opt = document.createElement("option");
        opt.value = unit.toLowerCase().split(" ")[0];
        opt.textContent = unit;
        unitType.appendChild(opt);
      });
    }
  });
};





// FUNCTION CALLOUTS 
// FUNCTION CALLOUTS 
// FUNCTION CALLOUTS 
// FUNCTION CALLOUTS 


handleLoader();
initEnterKeyHint();
enableCategories();
googleLogin();
disableTouchAction();
watchStartupScroll();
onboardingTrigger();
switchTheme();
applyLocation().then(coords => {
  onboardData.location = coords;
});