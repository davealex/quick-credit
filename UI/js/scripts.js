// word changer - cycle through words in array
const keywords = ['secure', 'simple', 'quick'];

const keywordSpan = document.getElementById('quick-text');

let counter = 0;
const cycleThroughWords = setInterval(() => {
  keywordSpan.innerHTML = keywords[counter];
  counter += 1;

  if (counter === keywords.length) {
    clearInterval(cycleThroughWords);
  }
}, 2000);

// animate go-back-to-top on button click
const goUpButton = document.getElementById('goUp');

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    goUpButton.style.display = 'block';
  } else goUpButton.style.display = 'none';
}

// Show button When the user scrolls down 20px from the top
window.onscroll = () => {
  scrollFunction();
};

function topFunction() {
  if (window.scrollY !== 0) {
    setTimeout(() => {
      window.scrollTo(0, window.scrollY - 30);
      topFunction();
    }, 5);
  }
}
