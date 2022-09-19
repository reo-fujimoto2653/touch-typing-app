// 列ごとの練習
let line1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "@", "["];
//let line1 = ["a", "s", "d"];
let line2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", ":", "]"];
let line3 = ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "_"];
let line4 = line2.concat(line2, line3);
let lineArray = {
    line1Mode: line1,
    line2Mode: line2,
    line3Mode: line3,
    line4Mode: line4
}

// 指ごとの練習
let little_left = ["q", "a", "z"];
let ring_left = ["w", "s", "x"];
let middle_left = ["e", "d", "c"];
let index_left = ["r", "f", "v", "t", "g", "b"];
let index_right = ["y", "h", "n", "u", "j", "m"];
let middle_right = ["i", "k", ","];
let ring_right = ["o", "l", "."];
let little_right = ["p", ";", "/", "@", ":", "_"];

let leftMode = {
    little_left: little_left,
    ring_left: ring_left,
    middle_left: middle_left,
    index_left: index_left
};

let rightMode = {
    index_right: index_right,
    middle_right: middle_right,
    ring_right: ring_right,
    little_right: little_right
};

let fingerMode = {
    leftMode: leftMode,
    rightMode: rightMode
}

// 50音での出題
let failed = [];
let count = 0;
let text = $('.question').text();
let remaining;
let line;
let uniqeFailed;
let repeat;

// タイプする対象のキー、指の色を変える
function target(text) {

    let target = `[value="${text}"]`;
    $(target).attr('id', 'orange');

    let finger = {
        little_left: little_left,
        ring_left: ring_left,
        middle_left: middle_left,
        index_left: index_left,
        index_right: index_right,
        middle_right: middle_right,
        ring_right: ring_right,
        little_right: little_right
    };

    $.each(finger, function (key, value) {
        let judge = $.inArray(text, value);
        if (judge !== -1) {
            $('.finger').css('background-color', 'gray');
            let targetFinger = `[id="${key}"]`;
            $(targetFinger).css('background-color', 'orange');
        }
    });
}

$(function () {

    $('.js-start-button').on('click', function(){
        $('.introduction-modal').fadeOut();
        $('.start-modal').fadeIn();
    });

    $('.js-chosenLine').on('click', function () {
        failed = [];
        remaining = undefined;
        line = undefined;

        $('.start-modal').fadeOut();
        $('.playingFlg').attr('id', 'playing');

        line = lineArray[$(this).attr('value')];
        remaining = line.slice(0, line.length);

        text = line[Math.floor(Math.random() * line.length)];
        $('.question').text(text);
        target($('.question').text());
    });

    $(window).on('keydown', function (e) {
        if (!($('#playing').length)) {
            return false;
        } else {
            if ($('.question').text() === e.key) {

                let idx = remaining.indexOf($('.question').text());
                if (idx >= 0) {
                    remaining.splice(idx, 1);
                }

                text = remaining[Math.floor(Math.random() * remaining.length)];
                $('.question').text(text);

                $('#orange').removeAttr('id');
                $('#red').removeAttr('id');
                target($('.question').text());

            } else if ($('.question').text() !== e.key) {
                $('#red').removeAttr('id');
                let typed = `[value="${e.key}"]`;
                $(typed).attr('id', 'red');
                remaining.push($('.question').text());
                failed.push($('.question').text());
            }

            if (remaining.length === 0) {
                count += 1;
                remaining = line.slice(0, line.length);
            }

            if (!($('#repeat').length)) {
                repeat = 2;
            } else {
                repeat = 4;
            }

            if (count === repeat) {
                count = 0;
                $('.js-result-modal').fadeIn();
                $('.playingFlg').removeAttr('id');
                $('.key').removeAttr('id');
                uniqeFailed = failed.filter(function (x, i, self) {
                    return self.indexOf(x) === i;
                });
                let failedStr = uniqeFailed.join(',');

                $('.js-result-modal-retry').hide();
                if (failedStr !== "") {
                    $('#resultCommnent').text("間違えたのは...");
                    $('#result').show();
                    $.each(uniqeFailed, function (elem) {
                        console.log(uniqeFailed[elem]);
                        $(`#result > [value="${uniqeFailed[elem]}"]`).attr('id', 'red')
                        $('#result').find($(`[value="${uniqeFailed[elem]}"]`)).attr('id', 'red');
                    });
                    $('.js-result-modal-retry').show();
                } else {
                    $('#result').hide();
                    $('#resultCommnent').text("全問正解！");
                }
            }
        }


    });


});

$(function () {

    $('.chosenMode').on('click', function () {
        $('.mode-select-modal').fadeOut();
        $('.hand-modal').fadeIn();
        $('#orange').removeAttr('id');
        $('.playingFlg').removeAttr('id');

        failed = [];
        line = fingerMode[$(this).attr('value')];
        line = uniqeFailed;
        remaining = line.slice(0, line.length);

        text = line[Math.floor(Math.random() * line.length)];
        $('.question').text(text);
        target($('.question').text());

        return false;
    });

    $('.js-result-modal-restart').on('click', function () {
        $('.result-modal').fadeOut();
        $('.start-modal').fadeIn();
        $('#orange').removeAttr('id');
        $('.playingFlg').removeAttr('id');
        return false;
    });

    $('.js-result-modal-retry').on('click', function () {
        $('.result-modal').fadeOut();
        $('.playingFlg').attr('id', 'playing');
        $('#orange').removeAttr('id');
        $('.repeatFlg').attr('id', 'repeat');

        failed = [];
        line = uniqeFailed;
        remaining = line.slice(0, line.length);

        text = line[Math.floor(Math.random() * line.length)];
        $('.question').text(text);
        target($('.question').text());

        return false;
    });
});
