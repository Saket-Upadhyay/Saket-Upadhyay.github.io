// Variables
const content = document.getElementById('content');
const navbar = document.getElementById('navbardiv')



function LightMode() {

    localStorage.setItem("vision","light")
    document.body.style.backgroundColor = "white";
    document.body.style.transition = ".3s linear";
    content.style.color = "black";
    content.style.transition = ".3s linear";
    navbar.style.color = "black"

}

function DarkMode()
{
    localStorage.setItem("vision","dark")
    document.body.style.backgroundColor = "black";
    document.body.style.transition = ".3s linear";
    content.style.color = "white";
    content.style.transition = ".3s linear";
    navbar.style.color = "white"
}

function checkVision(){
    if (localStorage.getItem("vision") == 'dark')
    {
        DarkMode();
    } else if (localStorage.getItem("vision") == 'light')
    {
        LightMode();
    }
}

document.addEventListener("load",checkVision());

