function random(low, high) {
    return Math.random() * (high - low) + low;
}

class Visual {
    constructor() {
        this.canvas = document.querySelector('#canvas');
        this.context = this.canvas.getContext('2d');
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.particleLength = 400;
        this.particles = [];
        this.particleMaxRadius = 30;

        this.handleMouseMoveBind = this.handleMouseMove.bind(this);
        this.handleResizeBind = this.handleResize.bind(this);

        this.initialize();
        this.render();
    }

    // Initialize particles
    initialize() {
        this.resizeCanvas();
        for (let i = 0; i < this.particleLength; i++) {
            this.particles.push(this.createParticle(i));
        }
        this.bind();
    }

    // bind event listeners
    bind() {
        document.body.addEventListener('mousemove', this.handleMouseMoveBind, false);
        window.addEventListener('resize', this.handleResizeBind, false);
    }

    unbind() {
        document.body.removeEventListener('mousemove', this.handleMouseMoveBind, false);
        window.removeEventListener('resize', this.handleResizeBind, false);
    }

    handleMouseMove(e) {
        this.enlargeParticle(e.clientX, e.clientY);
    }

    handleResize() {
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvasWidth = document.body.offsetWidth;
        this.canvasHeight = document.body.offsetHeight;
        this.canvas.width = this.canvasWidth * window.devicePixelRatio;
        this.canvas.height = this.canvasHeight * window.devicePixelRatio;
        this.context = this.canvas.getContext('2d');
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // particle creation
    createParticle(id, isRecreate) {
        // randomize position and radius
        const radius = random(5, this.particleMaxRadius);
        const x = isRecreate ? -radius - random(0, this.canvasWidth) : random(0, this.canvasWidth);
        let y = random(this.canvasHeight / 2 - 150, this.canvasHeight / 2 + 150);
        y += random(-100, 100);

        const alpha = random(0.05, 0.6);

        // pick random colour
        var col
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                col = [0, 128, 255];
                break;
            case 1:
                col = [216, 235, 255];
                break;
            case 2:
                col = [0, 30, 59];
                break;
        }

        return {
            id: id,
            x: x,
            y: y,
            startY: y,
            radius: radius,
            defaultRadius: radius,
            startAngle: 0,
            endAngle: Math.PI * 2,
            alpha: alpha,
            ref_alpha: alpha,
            color: {r: col[0], g: col[1], b: col[2]},
            speed: alpha,
            amplitude: random(50, 200)
        };
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.moveParticle(particle);
            this.context.beginPath();
            this.context.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha})`;
            this.context.arc(particle.x, particle.y, particle.radius, particle.startAngle, particle.endAngle);
            this.context.fill();
        });
    }

    moveParticle(particle) {
        particle.x += particle.speed;
        particle.y = particle.startY + particle.amplitude * Math.sin(((particle.x / 6) * Math.PI) / 180);
    }

    enlargeParticle(clientX, clientY) {
        this.particles.forEach(particle => {

            const distance = Math.hypot(particle.x - clientX, particle.y - clientY);

            if (distance <= 100) {
                const scaling = (100 - distance) / 12;
                TweenMax.to(particle, 0.5, {
                    radius: particle.defaultRadius + scaling,
                    alpha: 1,
                    ease: Power2.easeOut,
                    speed: 1
                });
            } else {
                TweenMax.to(particle, 0.5, {
                    radius: particle.defaultRadius,
                    ease: Power2.easeOut,
                    alpha: particle.ref_alpha,
                    speed: particle.ref_alpha
                });
            }
        });
    }

    render() {
        this.context.clearRect(0, 0, this.canvasWidth + this.particleMaxRadius * 2, this.canvasHeight);
        this.context.fillStyle = "#080808";
        this.context.fillRect(0, 0, canvas.width, canvas.height);
        this.drawParticles();

        // kill offscreen particles and re-render
        this.particles.forEach(particle => {
            if (particle.x - particle.radius >= this.canvasWidth) {
                this.particles[particle.id] = this.createParticle(particle.id, true);
            }
        });

        requestAnimationFrame(this.render.bind(this));
    }
}

new Visual();

// Rotating Text credit to alphardex
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
