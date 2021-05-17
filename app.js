class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll(".pad");
    this.kickAudio = document.querySelector(".kick-sound");
    this.hithatAudio = document.querySelector(".hithat-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.selects = document.querySelectorAll("select");
    this.playBtn = document.querySelector(".play");
    this.muteBtn = document.querySelectorAll(".mute");
    this.tempoSlider = document.querySelector(".tempo-slider");
    this.index = 0;
    this.bpm = 180;
    this.isPlaying = null;
    this.init();
  }

  repeat = () => {
    let step = this.index % 8;
    const activeBars = document.querySelectorAll(`#b${step}`);
    this.index++;
    //loop over the pads
    activeBars.forEach((bar) => {
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;

      //check on active bar to play
      if (!bar.classList.contains("active")) {
        return;
      }
      if (bar.classList.contains("kick-pad")) {
        this.kickAudio.currentTime = 0;
        this.kickAudio.play();
      }
      if (bar.classList.contains("snare-pad")) {
        this.snareAudio.currentTime = 0;
        this.snareAudio.play();
      }
      if (bar.classList.contains("hithat-pad")) {
        this.hithatAudio.currentTime = 0;
        this.hithatAudio.play();
      }
    });
  };

  swithPlayButtonStatus(status) {
    if (status) {
      this.playBtn.innerText = "Stop";
    } else {
      this.playBtn.innerHTML = "Play";
    }
  }

  start() {
    const interval = (60 / this.bpm) * 1000;

    if (!this.isPlaying) {
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    }
  }

  activePad(event) {
    event.target.classList.toggle("active");
  }

  changeSound(event) {
    const selectionName = event.target.name;
    const audioWay = event.target.value;
    switch (selectionName) {
      case "snare": {
        this.snareAudio.src = audioWay;
        break;
      }
      case "kick": {
        this.kickAudio.src = audioWay;
      }
      case "hihat": {
        this.hithatAudio.src = audioWay;
      }
    }
  }

  mute = (event) => {
    event.target.classList.toggle("active");
    if (event.target.classList.contains("active")) {
      event.target.innerHTML = '<i class="fas fa-volume-mute"></i>';
      switch (event.target.dataset.track) {
        case "0": {
          this.kickAudio.volume = 0;
          break;
        }
        case "1": {
          this.snareAudio.volume = 0;
          break;
        }
        case "2": {
          this.hithatAudio.volume = 0;
          break;
        }
      }
    } else {
      event.target.innerHTML = '<i class="fas fa-volume-up"></i>';
      switch (event.target.dataset.track) {
        case "0": {
          this.kickAudio.volume = 1;
          break;
        }
        case "1": {
          this.snareAudio.volume = 1;
          break;
        }
        case "2": {
          this.hithatAudio.volume = 1;
          break;
        }
      }
    }
  };

  changeTempo = (event) => {
    const tempoText = document.querySelector(".tempo-nr");
    this.bpm = event.target.value;
    tempoText.innerText = this.bpm;
  };

  updateTempo = (event) => {
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    const playBtn = document.querySelector(".play");
    if (playBtn.classList.contains("active")) {
      this.start();
    }
  };

  init = () => {
    //click on pud functionality
    this.pads.forEach((pad) => {
      pad.addEventListener("click", (event) => {
        this.activePad(event);
      });
      pad.addEventListener("animationend", () => {
        pad.style.animation = "";
      });
    });
    //start playng music listerer
    this.playBtn.addEventListener("click", () => {
      this.playBtn.classList.toggle("active");
      this.start();
      this.swithPlayButtonStatus(this.isPlaying);
    });
    //change selector of sounds listener
    this.selects.forEach((select) => {
      select.addEventListener("change", () => {
        this.changeSound(event);
      });
    });
    // mute buttons add listeneres
    this.muteBtn.forEach((btn) => {
      btn.addEventListener("click", this.mute);
    });
    // update tempo of music
    this.tempoSlider.addEventListener("input", this.changeTempo);
    this.tempoSlider.addEventListener("change", this.updateTempo);
  };
}

class PianoKit {
  constructor() {
    this.piano = document.querySelector(".piano");
    this.pianoKeys = this.piano.querySelectorAll(".p-button.white");
    this.pianoBtnListeners();
  }

  pianoBtnListeners = () => {
    window.addEventListener("keydown", (e) => {
      const audio = document.querySelector(
        `audio[data-keyCode="${e.keyCode}"]`
      );
      const pBtn = this.piano.querySelector(`div[data-keyCode="${e.keyCode}"]`);

      if (!audio) return;
      audio.currentTime = 0;
      audio.play();
      pBtn.classList.add("active");
    });

    this.pianoKeys.forEach((key) =>
      key.addEventListener("transitionend", this.removeStyle)
    );
  };

  removeStyle(e) {
    if (e.propertyName != "box-shadow") return;
    this.classList.remove("active");
  }
}
const drumKit = new DrumKit();
const piano = new PianoKit();
