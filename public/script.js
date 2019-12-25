const mediaPlayer = document.querySelector(".media-player");
const audioPlayer = mediaPlayer.querySelector(".media-player-audio");
const playButton = mediaPlayer.querySelector(".fa-play");
const pauseButton = mediaPlayer.querySelector(".fa-pause");
const stopButton = mediaPlayer.querySelector(".fa-stop");
const speedSlower = mediaPlayer.querySelector(".fa-angle-down");
const speedFaster = mediaPlayer.querySelector(".fa-angle-up");
const playerMute = mediaPlayer.querySelector(".fa-volume-up");
const audioTime = mediaPlayer.querySelector(".audio-time");
const audioVolume = mediaPlayer.querySelector(".audio-volume");

const canvas = document.getElementById("myCanvas");
const canvasCtx = canvas.getContext("2d"); 

let audioCtx;
let analyser;
let src;
let bufferLength;
let dataArray;
let soundPlayRate = 1;
let changeTime = false;
let initStart = false;
let soundMute = false;

// Объявление Path
paper.setup(canvas);
let path = new paper.Path();
path.strokeColor = 'black';
path.strokeWidth = 2;

// Отрисовка изображения
function draw() {
    requestAnimationFrame(draw)
    analyser.getByteTimeDomainData(dataArray);

    let sliceWidth = 360 / bufferLength;
    let x = 0;
    
    for(let i = 0; i < bufferLength; i++) {
    
        let v = dataArray[i]/128.0;
        let y = v * 150;

        let centerPoint = new paper.Point(canvas.width/2, canvas.height/2);
        let toPoint = new paper.Point(y, 0);
        toPoint.angle = toPoint.angle + x;

        path.lineTo(centerPoint.add(toPoint));

        x += sliceWidth;
    }
    path.closePath();
    clearCanvas();
}

// ИНИЦИАЛИЗАЦИЯ Audio Context
function init() {
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    src = audioCtx.createMediaElementSource(audioPlayer);
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
}

// Очитска paper project
function clearCanvas(){
    setTimeout(function () {
        paper.project.activeLayer.removeChildren();
        path.removeSegments();
        paper.project.activeLayer.addChildren([path]);
}, 1);
}

// КНОПКИ УПРАВЛЕНИЯ МЕДИА-ПЛЕЕРОМ
playButton.addEventListener("click", ()=>{
    if (!initStart) {
        init();
        draw();
        initStart = true;
    }
    audioPlayer.play();
    playButton.classList.toggle('hidden');
    pauseButton.classList.toggle('hidden');
    audioCtx.resume();
});

pauseButton.addEventListener("click", ()=>{
    audioPlayer.pause();
    playButton.classList.toggle('hidden');
    pauseButton.classList.toggle('hidden');
    audioCtx.suspend();
});

stopButton.addEventListener("click", ()=>{
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
});

speedSlower.addEventListener("click", ()=>{
    soundPlayRate -= 0.25;
    audioPlayer.playbackRate = soundPlayRate; 
});

speedFaster.addEventListener("click", ()=>{
    soundPlayRate += 0.25;
    audioPlayer.playbackRate = soundPlayRate; 
});

playerMute.addEventListener("click", ()=>{
    if (soundMute) {
        soundMute = false;
        audioPlayer.volume = 1;
        audioVolume.value = 100;
        playerMute.classList.toggle("mute");
    } else {
        soundMute = true;
        audioPlayer.volume = 0;
        audioVolume.value = 0;
        playerMute.classList.toggle("mute");
    }
});

audioPlayer.addEventListener('timeupdate', ()=>{
    if (changeTime === false) {
        audioTime.value = 100 * audioPlayer.currentTime / audioPlayer.duration;
    } else return;
});

audioTime.addEventListener("input", ()=>{
    changeTime = true;
    audioPlayer.currentTime =  audioPlayer.duration / 100 * audioTime.value;
    changeTime = false;
});

audioVolume.addEventListener('input', ()=>{
    audioPlayer.volume = audioVolume.value/100;
});