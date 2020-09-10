/**
 * VARIABLES
 */
const UNIT = 20; // Unit size
const WIDTH = UNIT * 40;
const HEIGHT = UNIT * 20;

var db = firebase.database();

var p2_checked = false;
px = py = 1; //Pos X Y


$(window).on('load', function () {
    // Fit the canvas size to the window
    $("#canvas").attr('width', WIDTH);
    $("#canvas").attr('height', HEIGHT);

    // Player
    $("#p2").change(function () {
        p2_checked = this.checked;
    });

    // Canvas and context
    canvas = $("canvas").get(0);
    ctx = canvas.getContext("2d");

    // Detects the pressed direction arrow
    $(this).keydown(keyPush);

    // Start the game
    init();
});

/**
 * DB on changes
 */
db.ref('match1').on('value', function () {
    init();
});

/**
 * INIT
 */
function init() {

    let player = '';

    if (!p2_checked) {
        player = 'player1';
    } else {
        player = 'player2';
    }

    db.ref('match1/' + player).on('value', function (data) {
        px = data.val().px;
        py = data.val().py;
    });


    px;
    py;

    if (px < 1) {
        px = 1;
    }
    if (px > WIDTH / UNIT - 2) {
        px = WIDTH / UNIT - 2;
    }
    if (py < 1) {
        py = 1;
    }
    if (py > HEIGHT / UNIT - 2) {
        py = HEIGHT / UNIT - 2;
    }

    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Border
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, WIDTH, UNIT); // top
    ctx.fillRect(0, HEIGHT - UNIT, WIDTH, UNIT); // bottom
    ctx.fillRect(0, 0, UNIT, HEIGHT); // left
    ctx.fillRect(WIDTH - UNIT, 0, UNIT, HEIGHT); // rigth

    // Players
    db.ref('match1/player1').on('value', function (data) {
        let p1x = data.val().px;
        let p1y = data.val().py;
        ctx.fillStyle = "lime";
        ctx.fillRect(p1x * UNIT, p1y * UNIT, UNIT, UNIT);
    });

    db.ref('match1/player2').on('value', function (data) {
        let p2x = data.val().px;
        let p2y = data.val().py;
        ctx.fillStyle = "red";
        ctx.fillRect(p2x * UNIT, p2y * UNIT, UNIT, UNIT);
    });


}

/**
 * KEY PUSH
 */
function keyPush(evt) {

    let validKey = true;

    switch (evt.keyCode) {
        case 37:
            px += -1;
            break;
        case 38:
            py += -1;
            break;
        case 39:
            px += 1;
            break;
        case 40:
            py += 1;
            break;
        default:
            validKey = false;
    }


    if (validKey) {

        let player = '';

        if (!p2_checked) {
            player = 'player1';
        } else {
            player = 'player2';
        }

        db.ref('match1/' + player).set({ px, py });

        init();
    }

}