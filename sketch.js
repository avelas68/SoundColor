let song;
let playButton;
let changeButton;
const songs = [];
let amplitude;
let fft;
let peakDetect;
let ellipses = [];

function preload() {
  songs.push(loadSound("Brass Monkey.mp3"));
  songs.push(loadSound("Havana.mp3"));
  songs.push(loadSound("Izzo In The End.mp3"));
  songs.push(loadSound("Scooby Doo.mp3"));
  songs.push(loadSound("Akon.mp3"));
  songs.push(loadSound("California Love.mp3"))
  songs.push(loadSound("Rob Base & DJ E Z Rock - Joy & Pain.mp3"))
  songs.push(loadSound("Blackstreet.mp3"));
  songs.push(loadSound("Bring Me The Horizon - DArkSide (Lyric Video).mp3"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // beginning amplitude
  amplitude = new p5.Amplitude();

  // load first song
  song = songs[0];

  // p5.PeakDetect requires a p5.FFT
  fft = new p5.FFT();

  peakDetect = new p5.PeakDetect(4000, 12000, 0.2);

  // buttons
  playButton = createButton("Play");
  playButton.mousePressed(togglePlaying);

  changeButton = createButton("Change Song");
  changeButton.mousePressed(changeSong);
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.3);
    playButton.html("Pause");
  } else {
    song.pause();
    playButton.html("Play");
  }
}

function changeSong() {
  // stop the current song
  song.stop();

  // change the song
  let currentSongIndex = songs.indexOf(song);
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  song = songs[currentSongIndex];

  // play the new song
  song.play();
}

function draw() {
  // background(200, 200, 200);

  // get the current volume (amplitude) of the song
  let vol = amplitude.getLevel();

  // map the volume to a range suitable for visual elements
  let diameter = map(vol, 0, 1, 10, 200);
  console.log(vol);
 

  // draw a circle that changes size based on the music volume
  // fill(255, 0, 0); // Red color
  // ellipse(width / 2, height / 2, diameter, diameter * 10); // adjusted for better visibility

  // peakDetect accepts an fft post-analysis
  fft.analyze();
  peakDetect.update(fft);

  if (peakDetect.isDetected) {
    // randomly generate a number of ellipses
    let pastelColors = [("#DBCDF0"), ("#F2C6DE"), ("#C9E4DE"), ("#F7D9C4")];
    let BrightColors = [("#00CDAC"),("#00A5E3"), ("#FFD872"), ("#F2D4CC")];
    let BrightDarkColors = [("#FFA73C"), ("#E15D3A"), ("#2E3D7C"),("#BA292E")];
    let DarkColors = [("#2B1715"), ("#796855"), ("#00234B"), ("#0E3523")];
    let NightColors = [("#373E02"), ("#112222"), ("#262b2f"), ("#00022e")];
    let numEllipses = floor(random(3, 7));
    for (let i = 0; i < numEllipses; i++) {
      let x = random(width);
      let y = random(height);
      let ellipseColor;
      stroke(255);
      if(vol <0.12){
        ellipseColor = random(pastelColors);
        ellipses.push({ x, y, diameter: 100, color: ellipseColor });
      }
      if(vol >0.12 && vol <0.15){
        ellipseColor = random(BrightColors); 
        ellipses.push({ x, y, diameter: 150, color: ellipseColor });
        }
      if(vol >0.15 && vol <0.17){
        ellipseColor = random(BrightDarkColors); 
        ellipses.push({ x, y, diameter: 200, color: ellipseColor });
        }
      if(vol > 0.17 && vol < 0.19){
        ellipseColor = random(DarkColors); 
        ellipses.push({ x, y, diameter: 250, color: ellipseColor });
      }
      if( vol > 0.19){
        ellipseColor = random(NightColors); 
        ellipses.push({ x, y, diameter: 300, color: ellipseColor });
      }
    }
  }

  // draw the ellipses
  for (let i = 0; i < ellipses.length; i++) {
    fill(ellipses[i].color); // use the color stored in the ellipse object
    ellipse(ellipses[i].x, ellipses[i].y, ellipses[i].diameter, ellipses[i].diameter);
  }

  // update the ellipses
  for (let i = ellipses.length - 1; i >= 0; i--) {
    ellipses[i].diameter *= 0.95; // adjusted for a slower fade (decreased fading speed to 3%)
    if (ellipses[i].diameter < 1) {
      ellipses.splice(i, 1);
    }
  }
}
