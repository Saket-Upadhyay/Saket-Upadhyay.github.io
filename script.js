// Variables
const content = document.getElementById('content');
const navbar = document.getElementById('navbardiv')


function LightMode() {

    localStorage.setItem("vision", "light")
    document.body.style.backgroundColor = "white";
    document.body.style.transition = ".3s linear";
    content.style.color = "black";
    content.style.transition = ".3s linear";
    navbar.style.color = "black"

}

function DarkMode() {
    localStorage.setItem("vision", "dark")
    document.body.style.backgroundColor = "black";
    document.body.style.transition = ".3s linear";
    content.style.color = "white";
    content.style.transition = ".3s linear";
    navbar.style.color = "white"
}

function checkVision() {
    if (localStorage.getItem("vision") == 'dark') {
        DarkMode();
    } else if (localStorage.getItem("vision") == 'light') {
        LightMode();
    } else if (localStorage.getItem("vision") == '') {
        DarkMode();
    }
}

document.addEventListener("load", checkVision());


// RESEARCH TAB THIGNS
const track = document.getElementById("platter");

const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.predPer = track.dataset.percentage;
}

const handleOnMove = e => {
    if (track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.predPer) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.percentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, {duration: 1200, fill: "forwards"});

    for (const image of track.getElementsByClassName("image")) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, {duration: 1200, fill: "forwards"});
    }
}

const disableselect = (e) => {
    return false
}

/* -- Had to add extra lines for touch events -- */

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);

// Disable Selection
document.onselectstart = disableselect;