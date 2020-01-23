//Particiles ----------------------------------------------------------

var canvas = document.querySelector('canvas')
var body = document.querySelector('body')
canvas.width = body.offsetWidth
canvas.height = body.offsetHeight
var ctx = canvas.getContext('2d')
var particleCount = 100
partCnt = 100;
var particles = [];
function random_range(min, max){
    return Math.round(min + Math.random() * (max-min))
}
for(var i = 0; i < partCnt; i++){
    particles[i] = {
        x: random_range(0, canvas.width),
        y: random_range(0, canvas.height),
        xSpeed: random_range(-2, 2),
        ySpeed: random_range(-2, 2),
        size: random_range(1, 10),
        range: random_range(10, 75)
    }
}

//Rotating Text ----------------------------------------------------------

requestAnimationFrame(draw)
function draw(){
    requestAnimationFrame(draw)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //Loop each particle
    for(var i = 0; i < partCnt; i++){

        //Draw the particle
        particles[i].x += particles[i].xSpeed;
        particles[i].y += particles[i].ySpeed;
        ctx.fillStyle = "blue"
        ctx.fillRect(particles[i].x,particles[i].y,particles[i].size,particles[i].size)

        //How we will draw the lines
        check_points(particles[i].x, particles[i].y, particles[i].size, particles[i].range)

        //This will flip the particles across if they go out of bounds!
        if(particles[i].x > canvas.width)
            particles[i].x = 0
        if(particles[i].x < 0)
            particles[i].x = canvas.width
        if(particles[i].y > canvas.height)
            particles[i].y = 0
        if(particles[i].y < 0)
            particles[i].y = canvas.height
    }
}


function check_points(x, y, size, range){
    for(var i = 0; i < partCnt; i++){
        if(distance(x, y, particles[i].x, particles[i].y) < range){
            ctx.beginPath()
            ctx.moveTo(x+size/2,y+size/2)
            ctx.lineTo(particles[i].x+particles[i].size/2,particles[i].y+particles[i].size/2)
            ctx.strokeStyle = "#fff"
            ctx.stroke()
        }
    }
}

function distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2) )
}



var words = document.querySelectorAll(".word");
words.forEach(function (word) {
    var letters = word.textContent.split("");
    word.textContent = "";
    letters.forEach(function (letter) {
        var span = document.createElement("span");
        if (letter == " ") {
            span.textContent = " ";
            span.className = "letter";
            word.append(span);
        } else {
            span.textContent = letter;
            span.className = "letter";
            word.append(span);
        }
    });
});
var currentWordIndex = 0;
var maxWordIndex = words.length - 1;
words[currentWordIndex].style.opacity = "1";
var rotateText = function () {
    var currentWord = words[currentWordIndex];
    var nextWord = currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
    // rotate out letters of current word
    Array.from(currentWord.children).forEach(function (letter, i) {
        setTimeout(function () {
            letter.className = "letter out";
        }, i * 40);
    });
    // reveal and rotate in letters of next word
    nextWord.style.opacity = "1";
    Array.from(nextWord.children).forEach(function (letter, i) {
        letter.className = "letter behind";
        setTimeout(function () {
            letter.className = "letter in";
        }, 500 + i * 20);
    });
    currentWordIndex =
        currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};
setTimeout(rotateText, 1000);
setInterval(rotateText, 3000);


// Jump to Bio
$("#prev-about").click(function () {
    $('html,body').animate({
            scrollTop: $("#bio_container").offset().top
        },
        duration = 1000);
});

// Jump to Experiences
$("#prev-exp").click(function () {
    $('html,body').animate({
            scrollTop: $("#experience_container").offset().top
        },
        duration = 1000);
});

// Jump to Experiences
$("#prev-projects").click(function () {
    $('html,body').animate({
            scrollTop: $("#projects_container").offset().top
        },
        duration = 1500);
});


// Video Handling JS
$(".video-container").on('click', function (event) {
    var v = document.getElementById("makerportfolio");
    togglePause(v)
});

$("#togglePlayButton").on('click', function (event) {
    var v = document.getElementById("makerportfolio");
    togglePause(v)
});

var cursorOnDiv = false;

$(document).on({
        mouseenter: function () {
            cursorOnDiv = true;
        },
        mouseleave: function () {
            cursorOnDiv = false;
        },
    },
    '#vid_player_card'
);

function fancyTime(time) {
    // Hours, minutes and seconds
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    var ret = "";

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function togglePause(v) {
    if (v.paused) {
        v.style.filter = "grayscale(0%) brightness(100%)";
        v.play()
        $(".playpause").fadeOut();
        $("#togglePlayButton").text("❚❚ Pause")
    } else {
        if (v.currentTime != 0) {
            v.style.filter = "grayscale(60%) brightness(80%)";
            v.pause()
            $('#progress').text(fancyTime(v.currentTime) + ' / ' + fancyTime(v.duration))
            $(".playpause").fadeIn();
            $("#togglePlayButton").text("► Play")
        }
    }
}

$(document).keydown(function (e) {
    var v = document.querySelector("#makerportfolio");
    switch (e.which) {
        case 32: // space
            if (cursorOnDiv) {
                togglePause(v)
            }
            break;

        case 37: // left
            if (cursorOnDiv) {
                v.currentTime = v.currentTime - 5
                $('#progress').text(fancyTime(v.currentTime) + ' / ' + fancyTime(v.duration))
            }
            break;

        case 39: // right
            if (cursorOnDiv) {
                v.currentTime = v.currentTime + 5
                $('#progress').text(fancyTime(v.currentTime) + ' / ' + fancyTime(v.duration))
            }
            break;

        case 38: // up
            if (cursorOnDiv) {
                v.volume = v.volume + 0.1
                $('#volume').text(Math.round(v.volume * 100) + '%')
                $('#volume').show()
                $("#volume").delay(1000).fadeOut();
            }
            break;

        case 40: // down
            if (cursorOnDiv) {
                v.volume = v.volume - 0.1
                $('#volume').text(Math.round(v.volume * 100) + '%')
                $('#volume').show()
                $("#volume").delay(1000).fadeOut();
            }
            break;

        default:
            return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

// Project Accordion
$(function () {
    $(".accordion > .accordion-item.is-active .proj_left").children(".accordion-panel").slideDown();

    $(".accordion > .accordion-item > .proj_left").click(function () {
        $(this).toggleClass("is-active").children(".accordion-panel").slideToggle("ease-out");
    });
});
