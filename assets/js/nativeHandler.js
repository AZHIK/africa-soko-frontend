const { Haptics } = Capacitor.Plugins;

function startupVibrate(){
    let allButtons = document.querySelectorAll('.choices .default-btn');
    allButtons.forEach(btn=>{
        btn.addEventListener('touchend', ()=>{
            Haptics.vibrate({ duration: 300 });
            navigator.vibrate(1);
        })
    })
    console.log(allButtons);
}

startupVibrate();