// Get references to the form and its elements
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const repeatBtn = document.getElementById('repeat-btn');

let repeat = false;
let currentPlayingIndex = -1;
let musicFiles = [];
let quranChapters = [];
let loadingCancelled = false;
let selectedReciter = 1; // Default reciter

const verseTextDiv = document.querySelector('.verse-text');

// Add this line at the beginning of the file
const surahListTitle = document.querySelector('.p-3 h2');

const waveform = document.querySelector('.waveform');
const audioPlayer = document.getElementById('audio-player');

function updateSelectedReciter(reciter) {
    selectedReciter = reciter;
    const dropdownButton = document.getElementById('reciterDropdown');
    dropdownButton.textContent = `Reciter ${reciter}`;
    // You might want to clear the current playlist when changing reciters
    musicFiles = [];
    displaySurahList();
}

async function getQuranAudio(surahNum, verseNum) {
    const response = await fetch(`https://quranaudio.pages.dev/${selectedReciter}/${surahNum}_${verseNum}.mp3`);
    const audio = await response.blob();
    return audio;
}

async function fetchQuranChapters() {
    const response = await fetch('./quranlist.json');
    const data = await response.json();
    quranChapters = data.chapters;
    // console.log(quranChapters);
}

let quranVerses = [];

// Add this function to fetch the Quran verses
async function fetchQuranVerses() {
    const response = await fetch('./quran-arabic.json');
    quranVerses = await response.json();
}

const displaySurahList = () => {
    const musicList = document.getElementById('music-list');
    musicList.innerHTML = '';
    quranChapters.forEach((chapter, index) => {
        const li = document.createElement('li');
        li.className = 'music-item';
        li.textContent = `${chapter.number}. ${chapter.name}`;
        li.dataset.index = index;
        li.addEventListener('click', ()=>{loadSurahVerses(chapter.number, chapter.verse_count)});
        musicList.appendChild(li);
    });
    
    // Hide the back button when showing the surah list
    document.getElementById('back-button').style.display = 'none';
    
    // Hide the verse-text div when showing the surah list
    verseTextDiv.style.display = 'none';
    verseTextDiv.style.visibility = 'hidden';

    // Set the title back to "Surah List"
    surahListTitle.textContent = 'Surah List';
};

let currentChapterIndex = -1;

// Modify the loadSurahVerses function to update currentChapterIndex
async function loadSurahVerses(surahNum, verseCount) {
    console.log("loadSurahVerses", surahNum, verseCount);
    musicFiles = [];
    loadingCancelled = false;
    document.getElementById('back-button').style.display = 'block';
    currentChapterIndex = surahNum - 1; // Update the current chapter index
    
    // Show the verse-text div when loading a surah
    verseTextDiv.style.display = 'flex';
    verseTextDiv.style.visibility = 'visible';

    // Update the title to the current surah name
    const currentSurah = quranChapters[currentChapterIndex];
    surahListTitle.textContent = `Playing Surah`;

    // Load and display the first verse immediately
    const firstVerseAudio = await getQuranAudio(surahNum, 1);
    musicFiles.push({
        name: `Verse 1`,
        url: URL.createObjectURL(firstVerseAudio)
    });
    displayVerseList();
    playMusic(0);  // Play the first verse immediately
    setActiveVerse(0);  // Set the first verse as active
    
    // Continue loading the rest of the verses
    for (let i = 2; i <= verseCount && !loadingCancelled; i++) {
        const audio = await getQuranAudio(surahNum, i);
        if (loadingCancelled) break;
        musicFiles.push({
            name: `Verse ${i}`,
            url: URL.createObjectURL(audio)
        });
        displayVerseList();
    }
    
    if (!loadingCancelled) {
        displayVerseList();
        setActiveVerse(currentPlayingIndex);  // Ensure the correct verse is still active after full load
    }

}

const displayVerseList = () => {
    const musicList = document.getElementById('music-list');
    musicList.innerHTML = '';
    musicFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'music-item';
        li.textContent = file.name;
        li.dataset.index = index;
        li.addEventListener('click', () => {
            playMusic(index);
            updateActiveMusic(index);
        });
        musicList.appendChild(li);
    });
};

const displayUserMusic = async () => {
    try {
        await fetchQuranChapters();
        await fetchQuranVerses();
        displaySurahList();
    } catch (error) {
        console.error('Error displaying Quran chapters:', error);
    }
};

const updateActiveMusic = (index) => {
    const musicItems = document.querySelectorAll('.music-item');
    musicItems.forEach(item => {
        item.classList.remove('active');
        item.style.transform = 'scale(1)';
        item.style.backgroundColor = '#036C68';
        item.style.color = 'white';
        // item.style.backgroundColor = '#ccc';

    });
    const activeItem = document.querySelector(`.music-item[data-index="${index}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.style.transform = 'scale(1.05)';
        activeItem.style.transition = 'all 0.6s ease';
        activeItem.style.backgroundColor = 'white';
        activeItem.style.color = 'black';
    }
};

const playMusic = (index) => {
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = musicFiles[index].url;
    audioPlayer.play();
    setActiveVerse(index);
    waveform.classList.add('active');
    waveform.classList.remove('paused');
};

// Modify the playNextMusic function
const playNextMusic = () => {
    if (currentPlayingIndex < musicFiles.length - 1) {
        playMusic(currentPlayingIndex + 1);
    } else {
        playNextChapter();
    }
};

// Add a new function to handle chapter transitions
const playNextChapter = async () => {
    currentChapterIndex++;
    if (currentChapterIndex >= quranChapters.length) {
        currentChapterIndex = 0;
    }
    
    const nextChapter = quranChapters[currentChapterIndex];
    musicFiles = [];
    loadingCancelled = false;
    document.getElementById('back-button').style.display = 'block';
    
    // Load and play the first verse immediately
    const firstVerseAudio = await getQuranAudio(nextChapter.number, 1);
    musicFiles.push({
        name: `Verse 1`,
        url: URL.createObjectURL(firstVerseAudio)
    });
    displayVerseList();
    playMusic(0);
    setActiveVerse(0);  // Set the first verse as active
    
    // Continue loading the rest of the verses
    for (let i = 2; i <= nextChapter.verse_count && !loadingCancelled; i++) {
        const audio = await getQuranAudio(nextChapter.number, i);
        if (loadingCancelled) break;
        musicFiles.push({
            name: `Verse ${i}`,
            url: URL.createObjectURL(audio)
        });
        displayVerseList();
    }
    
    if (!loadingCancelled) {
        displayVerseList();
        setActiveVerse(currentPlayingIndex);  // Ensure the correct verse is still active after full load
    }
};

// Modify the audio player's 'ended' event listener
// const audioPlayer = document.getElementById('audio-player');

audioPlayer.addEventListener('pause', () => {
    waveform.classList.add('paused');
});

audioPlayer.addEventListener('play', () => {
    waveform.classList.add('active');
    waveform.classList.remove('paused');
});

audioPlayer.addEventListener('ended', () => {
    if (repeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        waveform.classList.remove('active');
        waveform.classList.add('paused');
        playNextMusic();
    }
});

function updateRepeatButtonStyle() {
    if (repeat) {
        repeatBtn.classList.remove('btn-light');
        repeatBtn.classList.add('btn-dark');
        repeatBtn.innerHTML = '<i class="bi bi-arrow-repeat" style="color: white;"></i>';
    } else {
        repeatBtn.classList.remove('btn-dark');
        repeatBtn.classList.add('btn-light');
        repeatBtn.innerHTML = '<i class="bi bi-repeat" style="color: black;"></i>';
    }
}

repeatBtn.addEventListener('click', () => {
    repeat = !repeat;
    updateRepeatButtonStyle();
});

// Modify the backToSurahList function
function backToSurahList() {
    loadingCancelled = true;
    musicFiles = [];
    
    // Stop audio playback
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    waveform.classList.remove('active');
    waveform.classList.add('paused');
    
    // Hide the verse-text div when going back to the surah list
    verseTextDiv.style.display = 'none';
    
    displaySurahList();
}

// Add event listeners for reciter selection
window.addEventListener('load', () => {
    displayUserMusic();
    
    document.getElementById('back-button').addEventListener('click', backToSurahList);

    // Add event listeners for reciter selection
    const reciterItems = document.querySelectorAll('.dropdown-item');
    reciterItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const reciter = parseInt(e.target.getAttribute('data-reciter'));
            updateSelectedReciter(reciter);
        });
    });

    // Add this function to create the waveform bars
    function createWaveformBars() {
        const waveform = document.querySelector('.waveform');
        waveform.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.className = 'waveform-bar';
            waveform.appendChild(bar);
        }
    }

    createWaveformBars();
});

// Modify the setActiveVerse function
const setActiveVerse = (index) => {
    updateActiveMusic(index);
    currentPlayingIndex = index;
    
    // Update the verse text and translation
    const currentChapter = quranChapters[currentChapterIndex];
    const currentVerse = quranVerses.find(verse => 
        verse.surah_number === currentChapter.number && 
        verse.verse_number === index + 1
    );

    if (currentVerse) {
        document.getElementById('verse-text-arabic').textContent = currentVerse.text;
        document.getElementById('verse-text-translation').textContent = currentVerse.translation;
    }
    
    // Scroll to the active verse if it's out of view
    const activeItem = document.querySelector(`.music-item[data-index="${index}"]`);
    if (activeItem) {
        const scrollableList = document.querySelector('.scrollable-list');
        const itemRect = activeItem.getBoundingClientRect();
        const listRect = scrollableList.getBoundingClientRect();
        
        if (itemRect.bottom > listRect.bottom || itemRect.top < listRect.top) {
            activeItem.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        }
    }
};