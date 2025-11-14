const btnFunctions = {
    'openPop1': [getPop, '.signIn'],
    'openCheck': [getCheckoutData, ''],
    'createData': [retrieveProductData, '']
}
let CamUsed = false;


function initKYC() {
  const btn = document.querySelector(".KYCSubmission .default-btn");
  const inputs = document.querySelectorAll(".KYCSubmission .input input");
  const fileInps = document.querySelectorAll(".KYCSubmission .input input[type='file']")
  let inpLogic = Array.from(inputs).map(i => i.value != "");
  let doc_links = {};
  console.log(inpLogic);

  inputs.forEach(inp =>{
    inp.addEventListener("input", ()=>{
        inpLogic = Array.from(inputs).map(i => i.value != "");
        if(inpLogic.includes(false)) {
            btn.classList.add("disabled");
        }else{btn.classList.remove("disabled")};
    });
  });
  btn.addEventListener("click", ()=>{
    btn.classList.remove("load");
    fileInps.forEach(finps=>{
        let file = finps.files[0];
        const now = new Date();
        const timestamp = now.getFullYear() + "-" +
                        String(now.getMonth() + 1).padStart(2, "0") + "-" +
                        String(now.getDate()).padStart(2, "0") + "T" +
                        String(now.getHours()).padStart(2, "0") + ":" +
                        String(now.getMinutes()).padStart(2, "0") + "_" +
                        String(now.getSeconds()).padStart(2, "0");

        const randomSuffix = Math.random().toString(36).substring(2, 10);
        const fileExt = file.type.split("/")[1];
        const fileName = `${timestamp.replace(":", "")}_${randomSuffix}.${fileExt}`;

        const formData = new FormData();
        formData.append("file", file, fileName);

        fetch(`${MAIN_SERVER}/upload`, {
            method: "POST",
            credentials: "include",
            body: formData
        })
        .then(rsp => rsp.json())
        .then(rec_dt => {
            doc_links[finps.parentElement.getAttribute("idTag")] = rec_dt.filename;
            console.log(doc_links);
            if(Object.keys(doc_links).length == fileInps.length){
                fetch(`${MAIN_SERVER}/update_user`, {
                method: "POST", credentials: "include",
                headers: JSON_HEAD,
                body: JSON.stringify({ 
                    id: localStorage.getItem("sokoni_identity"),
                    data: {"KYC": {
                            "TIN": inputs[0].value,
                            "NIDA":  inputs[1].value,
                            "documents": doc_links,
                            "status": "pending",
                            "created_at": timestamp
                        }
                    }
                })
                }).then(rsp => {
                if (rsp.status === 200) {
                    doc_links = {};
                    inputs.forEach(innp => innp.value = "")
                    btn.classList.remove("load");
                    btn.classList.add("disabled");
                    initStatusMessage("Profile Updated Successfully😁🎉");
                }
                });
            };
        });
    });
  });
};
function initProfileObserver(usernames = []) {
  const page = document.querySelector('.updateProfile')
  const confirmBtn = page.querySelector('.default-btn')
  const inputs = page.querySelectorAll('input:not([type="file"]), textarea')
  const usernameInput = page.querySelector('[idTag="username"] input')
  console.log(inputs)

  // Store initial values
  const initialValues = {}
  inputs.forEach(inp => initialValues[inp.closest('[idTag]')?.getAttribute('idTag')] = inp.value)
  page.querySelectorAll('textarea').forEach(t => initialValues[t.getAttribute('idTag')] = t.value)

  // Disable spaces in username
  usernameInput.addEventListener('input', () => {
    usernameInput.value = usernameInput.value.replace(/\s/g, '')
  })

  // Listen for changes
  inputs.forEach(inp => {
    inp.addEventListener('input', checkChanges)
  })
  page.querySelectorAll('textarea').forEach(t => {
    t.addEventListener('input', checkChanges)
  })

  function checkChanges() {
    let changed = false

    for (const inp of inputs) {
      const tag = inp.closest('[idTag]')?.getAttribute('idTag')
      if (!tag) continue
      if (inp.value !== (initialValues[tag] ?? '')) {
        changed = true
        break
      }
    }

    if (!changed) {
      for (const t of page.querySelectorAll('textarea')) {
        const tag = t.getAttribute('idTag')
        if (t.value !== (initialValues[tag] ?? '')) {
          changed = true
          break
        }
      }
    }

    // Check username uniqueness
    const uname = usernameInput.value.trim().toLowerCase()
    if (usernames.map(u => u.toLowerCase()).includes(uname)) changed = false

    confirmBtn.classList.toggle('disabled', !changed)
  }
};
function initSearchSettings(dom_el) {
  const mainContainer = document.querySelector(dom_el)
  const input = mainContainer.querySelector('.searchInp input')
  const toggles = mainContainer.querySelectorAll('.toggleCont')

  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase()

    toggles.forEach(t => {
      const text = (
        t.querySelector('h4')?.textContent + ' ' +
        t.querySelector('p')?.textContent
      ).toLowerCase()

      if (text.includes(term) || term === '') {
        t.style.display = ''
      } else {
        t.style.display = 'none'
      }
    })
  })
};
function initSliderButtons(){
    const allButtons = document.querySelectorAll('.slider-btn');
    allButtons.forEach(btn=>{
        let btnHtml = `
            <p><span  sw="anza safari" en="get started">${btn.textContent}</span></p>
            <div class="icons">
                <i class="fi fi-rr-angle-small-right"></i>
                <i class="fi fi-rr-angle-small-right"></i>
                <i class="fi fi-rr-angle-small-right"></i>
                <i class="fi fi-rr-angle-small-right"></i>
            </div>`;
        btn.innerHTML = btnHtml;
        const btnWidth = btn.getBoundingClientRect().width;
        const btnDragger = btn.querySelector('p');
        let lastTouchX = 0;

        btnDragger.addEventListener('touchstart', (e)=>{
            btn.classList.add('active');
            lastTouchX = e.touches[0].clientX;
        });
        btnDragger.addEventListener('touchend', ()=>{
            let draggerX = getComputedStyle(btnDragger).left;
            let draggerRight = getComputedStyle(btnDragger).right;
            draggerX = Number(draggerX.replace('px', ''));
            draggerRight = Number(draggerRight.replace('px', ''));
            btn.classList.remove('active');
            btnDragger.style.left = "0px";
        });
        btnDragger.addEventListener('touchmove', (e)=>{
            if ( btn.classList.contains('active') ){
                let draggerWidth = getComputedStyle(btnDragger).width;
                let draggerRight = getComputedStyle(btnDragger).right;
                let draggerX = getComputedStyle(btnDragger).left;
                draggerWidth = Number(draggerWidth.replace('px', ''));
                draggerRight = Number(draggerRight.replace('px', ''));
                draggerX = Number(draggerX.replace('px', ''));
                let currentX = e.touches[0].clientX;
                let diffX = currentX - lastTouchX;

                if( draggerX <= 0 && diffX < 0 ) return;
                if(( draggerX + draggerWidth + 10 > btnWidth ) && diffX > 0 ){
                    let fnName = btn.getAttribute('fn');
                    let fn = btnFunctions[fnName];
                    btn.classList.remove('active');
                    btnDragger.style.left = "0px";
                    fn[0](fn[1]);
                    return;
                };

                btnDragger.style.left = `${draggerX + diffX}px`;
                lastTouchX = currentX;
            }
        });
    });
};
function initToggleBtn(){
    let toggle_btn = get(".toggle-btn", true);
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.removeAttribute("style");
        });
    }, { threshold: 0.1 });
    toggle_btn.forEach(tg_btn => {
        observer.observe(tg_btn);
    });
    toggle_btn.forEach(tg_btn =>{
        tg_btn.onclick = ()=>{tg_btn.classList.toggle("active")};
    })
};
function initDefaultButtons(){
    const allDefaultBtns = get('.default-btn', true);
    allDefaultBtns.forEach(btn=>{
        btn.addEventListener('click', (e)=>{
            try {
                navigator.vibrate(10);
            } catch (error) {}
            
            let randSpan = document.createElement('span');
            randSpan.style.top = `${e.offsetY}px`;
            randSpan.style.left = `${e.offsetX}px`;
            btn.appendChild(randSpan);
            setTimeout(()=>{randSpan.remove()}, 1000);
        });
    });
};
function initLargeSelections(){
    const allSelections = document.querySelectorAll('.largeSelections');
    allSelections.forEach(sltLarge=>{
        let allOpts = sltLarge.querySelectorAll('.option');
        allOpts.forEach(opt=>{
            opt.onclick = ()=>{
                let optValue = opt.getAttribute('value');
                sltLarge.setAttribute('value-selected', optValue);
                sltLarge.parentElement.setAttribute('value', optValue);
                allOpts.forEach(options=>options.classList.remove('active'));
                opt.classList.add('active');
            };
        });
    });
};
function initSmallSelections(){
    const allSelections = get('.selection:not(.postSlt)', true);
    allSelections.forEach(select=>{
        let selected = [];
        let attrOpt = select.getAttribute('options') || '';
        let options = attrOpt.split('|').map(opt=>opt.split('$'));
        if(select.id == 'categories'){options = masterCategories;};
        options.forEach(opt=>{
            let pSelect = document.createElement('p');
            pSelect.className = 'select';
            pSelect.innerHTML = `
                <i class="fi fi-sr-check-circle"></i>
                <span en="${opt[0]}" sw="${opt[1]}">${opt[0]}</span>`;
            pSelect.onclick = ()=>{
                // select.querySelectorAll('p').forEach(p=>p.classList.remove('active'));
                pSelect.classList.toggle('active');
                const value = opt[0].toLowerCase();
                const index = selected.indexOf(value);
                if (index > -1) {
                    selected.splice(index, 1);
                } else {
                    selected.push(value);
                }
                let rValue = selected.join('|')
                select.setAttribute('value', rValue);
                select.parentElement.setAttribute('value', rValue);
            };
            select.appendChild(pSelect);
        });
    });
};
function initCheckoutSelection(){
    const uSelections = get(".categories .uSelect", true);
    uSelections.forEach(uSelect=>{
        let opts = uSelect.querySelectorAll(".optSlt");
        opts.forEach(opt=>{
            opt.addEventListener("click", ()=>{
                opts.forEach(o=>o.classList.remove("active"));
                opt.classList.add("active");
            })
        })
    });
};
function initInputs(){
    const allInputs = get('input', true);
    allInputs.forEach(input=>{
        input.spellcheck = false;
        input.autocomplete = 'off';

        let type = input.getAttribute('vtype');
        let spacing = Number(input.getAttribute('space')) || 0;
        input.addEventListener('input', (e)=>{
            let inputVal = input.value;
            if (isNaN(e.data) && type == 'int'){
                inputVal = inputVal.replace(e.data, '');
            };
            let spaceType = input.getAttribute('spaceType') || "-"
            inputVal = inpSplit(inputVal.replaceAll(spaceType,''), spacing, spaceType);
            if (spacing == 0) return;
            input.value = inputVal;

            let mainParent = input.parentElement.parentElement.parentElement;
            if (isValid(inputVal)){
                mainParent.setAttribute('value', '');
                // onboardData.wallet.phone = Number(inputVal.replaceAll('-',''));
            }else{mainParent.removeAttribute('value')}
        });
    });
};
function initScrollAll(){
    let scrollList = [
        ['.page.exploreCont .searchBar', '.page.exploreCont'],
        ['.header', '.page.feedCont'],
        ['.page.liveMarket .header', '.page.liveMarket'],
        ['.page.searchResults .header', '.page.searchResults'],
        // ['.header', '.page.feedCont'],
        // ['.header', '.page.feedCont'],
        // ['.header', '.page.feedCont'],
    ]
    scrollList.forEach(scr=>{
        initScrollEffect(scr[0], scr[1]);
    })
};
function initMainNavigation(){
    const navContent = document.querySelector('.section-content.appContent .sectionNavCont');
    const mainNavCont = document.querySelector('.section-content.appContent .main-navigation');
    const navI = mainNavCont.querySelectorAll('i:not(.main');
    navI.forEach((nav, index)=>{
        nav.ontouchend = ()=>{
            navI.forEach(i=>{
                i.className = i.className.replace('sr', 'rr');
                i.classList.remove('active');
            });
            nav.className = nav.className.replace('rr', 'sr');
            nav.classList.add('active');
            navContent.style.marginLeft = `-${index}00vw`;
        };
    });
};
function initAllStories(filteredStories=[]){
    window.addEventListener("load",()=>{
        setTimeout(()=>{
            const storiesCont = document.querySelector('.section-content.appContent .sectionNavCont .page .storiesList');
            const userStory = storiesCont.querySelector('.story');
            userStory.querySelector('i img').addEventListener('touchend', ()=>{
                getFloater('.storyCreate');
                if ( CamUsed ) return;
                CamUsed = true;
                initCamera();
                // initSaturateScale();
                // initVideoLenses();
                // initSliderSelect('.floater-pages .page.storyCreate .controls .cameraType')
            });
            filteredStories.forEach(story=>{
                let newStory = document.createElement('div');
                newStory.className = 'storyCont';
                let innerHtml = `
                    <div class="story" style='background-image: url(${story.thumbnail});'>
                    <img src="${story.profile.photo}" class="pinProfile">
                    </div>
                    <p class='username'>${story.profile.username}</p>`
                newStory.innerHTML = innerHtml;
                newStory.onclick = ()=>{getFloater('.storyView')}
                storiesCont.appendChild(newStory);
            });
        }, 1000);
    })
};
function initRecommendations() {
    const postGrids = document.querySelectorAll('.exploreCont .explorePosts .postGrid');
    const shuffledPosts = shuffleArray([...mockPosts]);

    postGrids.forEach((grid, index) => {
        grid.innerHTML = "";
        const gridPosts = shuffledPosts.filter((_, i) => i % postGrids.length === index);

        gridPosts.forEach(post => {
            const badgeImg = getBadgeImage(post.badge);
            const postHTML = `
                <div class="postCont" style='background-image: url(${post.postImg});'>
                <div class="postHead">
                    <div class="leftData">
                    <img src="${post.profilePic}" alt="" class="profilePic acti">
                    <div class="userData">
                        <h4>${post.username} ${badgeImg ? `<img src="${badgeImg}">` : ""}</h4>
                        <div class="group">
                        <p><i class="fi fi-sr-marker"></i> ${post.location}</p>
                        <p><i class="fi fi-sr-calendar"></i> ${post.date}</p>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="postActions">
                    <i class="fi fi-rr-heart"></i>
                    <i class="fi fi-rr-bookmark"></i>
                    <i class="fi fi-rr-shopping-cart"></i>
                </div>
                </div>
            `;
            grid.innerHTML += postHTML;
            let iActions = grid.querySelectorAll('.postCont i');
            iActions.forEach(i=>{
                i.addEventListener('touchend', ()=>{
                    if(i.className.includes('-sr-')){
                        i.className = i.className.replace('sr-', 'rr-');
                    }else{i.className = i.className.replace('rr-', 'sr-');}
                })
            })
        });
    });
};
function initSokoniSearch(mockTitles) {
  const input = document.querySelector(`.sokoniSearch`);
  if (!input) return console.warn(`Input with not found.`);

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);

    if (!query) {return;}
    const results = mockTitles
      .filter(title => {
        const lower = title.toLowerCase();
        return terms.every(term => lower.includes(term));
      })
      .sort((a, b) => {
        const aPos = Math.min(...terms.map(t => a.toLowerCase().indexOf(t)));
        const bPos = Math.min(...terms.map(t => b.toLowerCase().indexOf(t)));
        return aPos - bPos;
      })
      .map(title => {
        let highlighted = title;
        terms.forEach(term => {
          const regex = new RegExp(`(${term})`, "gi");
          highlighted = highlighted.replace(regex, "<b>$1</b>");
        });
        return highlighted;
      });

    const exploreSuggest = document.querySelector('.exploreCont .searchOptions');
    exploreSuggest.innerHTML = '';
    results.forEach((result, index)=>{
        let search = document.createElement('div');
        search.className = 'search';
        search.innerHTML = `
            <i class="fi fi-rr-search"></i>
            <p>${result}</p>
            <i class="fi fi-rr-cross-small"></i>
        `;
        exploreSuggest.appendChild(search);
        search.addEventListener('touchstart', ()=>{
            input.focus();
            input.value = '';// || search.querySelector('p').textContent.toLowerCase();
            getFloater('.searchResults');
        });
        setTimeout(()=>{search.classList.add('active')}, index*60);
    })
  });
};
function initPriceDraggable() {
    const priceDrag = document.querySelector('.filterSort .priceDrag');
    let dragInputs = priceDrag.querySelectorAll('input');
    let dragSect = priceDrag.querySelector('.dragSect');
    let draggables = dragSect.querySelectorAll('.draggable');
    let activeDrag = null;

    let props = {
        x: parseFloat(getComputedStyle(dragSect).getPropertyValue('--start')),
        width: parseFloat(getComputedStyle(dragSect).getPropertyValue('--length')),
        max: Number(priceDrag.getAttribute('max'))
    };

    draggables.forEach((drag, index) => {
        let maxWidth = dragSect.clientWidth;
        let lastX = 0;

        drag.addEventListener('touchstart', (e) => {
            lastX = e.touches[0].clientX;
            activeDrag = index;
        });

        drag.addEventListener('touchmove', (e) => {
            let deltaX = e.touches[0].clientX - lastX;
            let percDelta = (deltaX / maxWidth) * 100;

            if (activeDrag === 0) {
                let newX = props.x + percDelta;
                if (newX >= 3 && newX <= props.x + props.width - 15) {
                    props.x = newX;
                    props.width -= percDelta;
                    let maxAmount = `${formatShort(newX * props.max / 100)}`;
                    drag.querySelector('span').textContent = maxAmount;
                    // dragInputs[index].value = formatMoney(Math.round(newX * props.max / 100));
                }
            } else if (activeDrag === 1) {
                let newWidth = props.width + percDelta;
                if (newWidth >= 10 && props.x + newWidth <= 98) {
                    props.width = newWidth;
                    let maxAmount = `${formatShort((newWidth + props.x) * props.max / 100)}`;
                    drag.querySelector('span').textContent = maxAmount;
                    // dragInputs[index].value = formatMoney(Math.round((newWidth * props.max / 100), 4));
                }
            }

            dragSect.style.setProperty('--start', `${props.x}%`);
            dragSect.style.setProperty('--length', `${props.width}%`);

            lastX = e.touches[0].clientX;
        });

        drag.addEventListener('touchend', () => {
            activeDrag = null;
        });
    });
};
function initRating(){
    const allRatings = get('.rateSlt', true);
    allRatings.forEach(rating=>{
        let stars = rating.querySelectorAll("i");
        stars.forEach((star, s)=>{
            star.addEventListener("touchstart", ()=>{
                stars.forEach((st, si)=>{
                    if(si <= s){st.className = "fi fi-sr-star";}
                    else{st.className = "fi fi-rr-star"}
                });
            })
        })
    })
};
function initCommaInput(){
    const commaInputs = document.querySelectorAll('.commaInput');
    commaInputs.forEach(inp=>{
        inp.addEventListener('input', ()=>{
            inp.value = formatMoney(inp.value.replaceAll(',',''));
        });
    });
};
function initScrollEffect(stickyClass, triggerClass){
    const stickyElement = document.querySelector(stickyClass);
    const triggerElement = document.querySelector(triggerClass);
    let div = document.createElement("div");
    // div.scr

    let prevScrollY = 0;
    try{
        triggerElement.addEventListener('scroll', ()=>{
            if (prevScrollY < triggerElement.scrollTop && triggerElement.scrollTop > 0){
                stickyElement.classList.add('hidden');
            }else{
                stickyElement.classList.remove('hidden');
            }
            prevScrollY = triggerElement.scrollTop;
        });
    }catch(err){}
};
function initOTPinput(otpclass, initBtn, callback, OTP="112266"){
    const otpInput = get(otpclass);
    const allSpans = otpInput.querySelectorAll('span');
    const mainInput = otpInput.querySelector('input');

    mainInput.addEventListener('input', ()=>{
        if(String(mainInput.value) == OTP.replaceAll('"', "")){
            initBtn.classList.remove('disabled');
        }else{initBtn.classList.add('disabled')};
        allSpans.forEach((span, i)=>{
            if (i > String(mainInput.value).length - 1) {
                span.classList.remove('active');
            }else{
                span.classList.add('active');
            };
        });
    })

    initBtn.addEventListener('click', ()=>{
        otpInput.classList.add('success');
        initBtn.classList.add('disabled');
        initBtn.classList.add('load');
        setTimeout(()=>{
            mainInput.disabled = true;
            callback();
        }, 1000);
    })
    setTimeout(()=>{otpInput.setAttribute('otpValue','timeout')}, 180000);
};
function initCardCreate(){
    const onboardInput = document.querySelector('#onboardingInput');
    const userCard = document.querySelector('#wallet .userCard');
    const finish = document.querySelector('.el-status.finishStat');
    const cardPopup = document.querySelector('.content-popup.contact-verification');
    const onboardBtn = document.querySelector('.onboarding .call2action .default-btn');
    const inputRect = onboardInput.getBoundingClientRect();
    const inputStyles = getComputedStyle(onboardInput);

    cardPopup.classList.add('cardMode');
    onboardInput.parentElement.removeAttribute('value');
    onboardBtn.parentElement.classList.remove('active');
    onboardInput.click();

    setTimeout(()=>{
        const cardPoper = window.innerHeight - (cardPopup.getBoundingClientRect().height + inputRect.top);
        cardPopup.style.bottom = `${cardPoper}px`;
        cardPopup.parentElement.classList.remove('active');
        onboardInput.style.opacity = 0;

        setTimeout(()=>{
            onboardInput.style.display = 'none';
            userCard.style.display = 'flex'
            cardPopup.classList.add('activate');
            finish.style.opacity = '1';
        }, 5000);
    }, 1000);
};
function initSaturateScale(){
    const video = document.querySelector('video');
    const scale = document.querySelector('.floater-pages .page.storyCreate .controls .adjust .scale');
    let scrollWidth =  (scale.scrollWidth - scale.clientWidth);
    scale.scrollLeft = scrollWidth/2;

    scale.addEventListener('scroll', ()=>{
        let saturate = (scale.scrollLeft / scrollWidth) * 2;
        video.style.filter = `saturate(${saturate})`;
    });
};
function initVideoLenses(){
    const video = document.querySelector('video');
    const scaleP = document.querySelectorAll('.floater-pages .page.storyCreate .controls .lenses p');
    scaleP.forEach((scale, i)=>{
        scale.ontouchend = ()=>{
            video.style.scale = (i + 1);
            scaleP.forEach(p=>p.classList.remove('active'));
            scale.classList.add('active');
        };
    });
};
function initSliderSelect(classname, targetclass){
    const typeCont = get(classname);
    typeCont.querySelectorAll('p').forEach((p, index)=>{
        p.addEventListener('touchend', ()=>{
            typeCont.setAttribute('active', `${index}`);
            if(!targetclass) return;
            const targetEl = get(targetclass);
            targetEl.style.marginLeft = `-${index}00vw`
        });
    })
};
function initPhotoCapture(){
    const clickSound = new Audio('assets/audio/shutter.mp3');
    const video = document.querySelector('video');
    const imageSlt = document.querySelector('.floater-pages .page.storyCreate .controls .call2action .chooseImg');
    const captureButton = document.querySelector('.floater-pages .page.storyCreate .controls .call2action .capture')
    const canvas = document.createElement('canvas');

    captureButton.ontouchstart = ()=>{
        clickSound.play();
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        // Apply any CSS filter here (same syntax as CSS)
        ctx.filter = getComputedStyle(video).filter;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        //create a photo name
        let time = new Date();

        // Convert to PNG and download
        const link = document.createElement('a');
        const imgURL = canvas.toDataURL('image/png')
        link.download = `sokoni-${time.getTime()}.png`;
        link.href = imgURL;
        link.click();

        //set view to most recent
        imageSlt.style.backgroundImage = `url(${imgURL})`;
    };
};
function initInputFocus(trigger, input){
    const inputEl = document.querySelector(input);
    const triggerEl = document.querySelector(trigger);
    triggerEl.addEventListener('click', ()=>{
        inputEl.focus();
    });
};
function initContactVerification(){
    const cardPopup = document.querySelector('.content-popup.contact-verification');
    setTimeout(()=>{
        if(onboardData.wallet.otp != null) return;
        initOTPinput('.onboardOTP', get('.otpCallBtn'), initCardCreate);
        cardPopup.classList.add('active');
        cardPopup.parentElement.classList.add('active');
    }, 1000);
    return;
};
function initStartupScroll(){
    const allStartupScroll = document.querySelectorAll('.startup-scroll');
    allStartupScroll.forEach((startupScroll, index)=>{
        // let scrollRect = startupScroll.getBoundingClientRect();

        const startupImg = startupScroll.querySelectorAll('img');
        const startupNav = startupScroll.parentElement.querySelectorAll('.scroll-nav .nav');

        let stFn = ()=>{
            startupImg.forEach((img, i) => {
                const rect = img.getBoundingClientRect();
                const fullyVisible = rect.left >= 0 && rect.right <= window.innerWidth;
                if (fullyVisible) {
                    img.classList.add('active');
                    startupNav[i].classList.add('active');
                } else {
                    img.classList.remove('active');
                    startupNav[i].classList.remove('active');
                }
            });
        }

        startupScroll.ontouchstart = ()=>{
            startupScroll.setAttribute('active', '');
        };
        startupScroll.onscroll = ()=>{stFn()};
        stFn();
        // window.addEventListener('load', stFn);
        // if ( startupScroll.hasAttribute('active') ) startupScroll.setAttribute('scrolled', '');
    });
};
async function initCamera() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const hasCamera = devices.some(device => device.kind === 'videoinput');
  if (!hasCamera) return;

  const video = document.querySelector('video');
  if (!video) return;
  let stream = null

  async function startCamera() {
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true })
      video.srcObject = stream
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      video.srcObject = null
      stream = null
    }
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startCamera()
      else stopCamera()
    })
  }, { threshold: 0.1 })

  observer.observe(video)
};
function initVoiceSearch() {
  const output = document.getElementById('voiceSearchAble');
  const startBtn = document.getElementById('initVoice');

  if (!SpeechRecognition) {
    alert("Sorry, your browser doesn't support Speech Recognition.");
  } else {
    const recognition = new SpeechRecognition();

    recognition.continuous = false; // Stop automatically after speaking
    recognition.interimResults = true; // Show partial results
    recognition.lang = 'en-US'; // Set language

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
        }
        console.log(transcript);
        output.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    startBtn.addEventListener('click', () => {
        recognition.start();
        output.focus();
        output.click();
    });
    output.addEventListener("keypress", (e)=>{
        if(e.key != "Enter") return;
        recognition.stop();
    })
  }
};
function initStatusMessage(msg, audio=new Audio("assets/audio/ding.mp3")){
    audio.play();
    let statusEl = get(".statusMessage");
    let spanText = statusEl.querySelector("span");
    spanText.textContent = msg;
    statusEl.classList.add("active");
    setTimeout(()=>{statusEl.classList.remove("active")}, 2000);
};




function initAllSettings(settingsDict) {
  const container = document.querySelector(".floater-pages");
  if (!container) return;

  // Helper to create a single option div
  function createOption(option, isProfileInfo) {
    const [title, iconClass, funcId] = option;

    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");
    optionDiv.setAttribute("data-func-id", funcId);

    // Left icon
    const leftIcon = document.createElement("i");
    leftIcon.className = iconClass;
    optionDiv.appendChild(leftIcon);

    // Data block
    const dataDiv = document.createElement("div");
    dataDiv.classList.add("data");
    const h4 = document.createElement("h4");
    h4.textContent = title;
    const p = document.createElement("p");
    p.textContent = "user data here"; // placeholder for dynamic user data
    dataDiv.appendChild(h4);
    dataDiv.appendChild(p);
    optionDiv.appendChild(dataDiv);

    // Right icon
    const rightIcon = document.createElement("i");
    rightIcon.className = isProfileInfo ? "fi fi-rr-edit" : "fi fi-rr-angle-small-right";
    optionDiv.appendChild(rightIcon);

    return optionDiv;
  }

  // Iterate over each page type
  for (const [pageKey, sections] of Object.entries(settingsDict)) {
    const pageDiv = document.createElement("div");
    pageDiv.classList.add("page", pageKey);
    if (pageKey === "profileSettings") pageDiv.classList.add("active"); // default active

    // Page header
    const h1 = document.createElement("h1");
    h1.textContent = pageKey.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
    pageDiv.appendChild(h1);

    // Iterate over each section
    for (const [sectionName, options] of Object.entries(sections)) {
      const h3 = document.createElement("h3");
      h3.textContent = sectionName.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
      pageDiv.appendChild(h3);

      const sectionDiv = document.createElement("div");
      sectionDiv.classList.add(sectionName);

      options.forEach(option => {
        const isProfileInfo = sectionName === "profileInfo";
        sectionDiv.appendChild(createOption(option, isProfileInfo));
      });

      pageDiv.appendChild(sectionDiv);
    }

    pageDiv.classList.add("profileBase");
    container.appendChild(pageDiv);
  }
}



// initAllSettings(sokoniAfricaSettings)
// initInputFocus('.page.messaging .header i', '.page.messaging input');
// initAllStories(sampleStories);
// initRecommendations();
initKYC();
initToggleBtn();
initStartupScroll();
initRating();
initSliderButtons();
initDefaultButtons();
initLargeSelections();
initSmallSelections();
initCheckoutSelection();
initMainNavigation();
initSokoniSearch(mockTitles);
initPriceDraggable();
initCommaInput();
initSliderSelect('.sliderSelect .resultOpt', '.searchResults .resultsList');
initPhotoCapture();
initInputs();
initVoiceSearch();
initScrollAll();
initSearchSettings(".profileBase.accountSettings");