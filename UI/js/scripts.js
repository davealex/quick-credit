const keywords = ['secure', 'simple', 'quick'];

const keywordSpan = document.getElementById('quick-text');

var counter = 0;
var cycleThroughWords = setInterval(function() {
    keywordSpan.innerHTML = keywords[counter];
    counter++;

    if (counter === keywords.length) {
        clearInterval(cycleThroughWords);
    }
}, 2000);

// Show button When the user scrolls down 20px from the top
window.onscroll = function() {
    scrollFunction()
};

const goUpButton = document.getElementById("goUp");

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        goUpButton.style.display = "block";
    } else goUpButton.style.display = "none";
}

function topFunction() {
    if(window.scrollY !== 0) {
        setTimeout(function() {
            window.scrollTo(0, window.scrollY-30);
            topFunction()
        }, 5);
    }
}