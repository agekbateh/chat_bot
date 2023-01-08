var botMsg = ['Hi!', 'How you doing?'];
var msg = 0;

(function ($) {

    function ChatBot(el, options) {
        var session_id = Math.random() * 100000000000;
        var checkBotMsg;

        function getHtml() {
            return '<div class="chatbot-wrapper">\n' +
                '    <a href="javascript:;" class="chatbot-open-btn js-chatbot-open-btn">' +
				'Chat' +
				'</a>\n' +
                '\n' +
                '    <div class="chatbot-container js-chatbot-container">\n' +
                '        <div class="chatbot-header">\n' +
                '            <div class="chatbot-header__logo">\n' +
                '            </div>\n' +
                '            <div class="chatbot-header__company">\n' +
                '                Widget\n' +
                '            </div>\n' +
                '            <a href="javascript:;" class="chatbot-header__closer js-chatbot-header__closer"></a>\n' +
                '        </div>\n' +
                '        <div class="chatbot__chat-wrapper js-chatbot__chat-wrapper">\n' +
                '            <div class="chatbot__chat cf">\n' +
                '            </div>\n' +
                '        </div>\n' +
                '        <div class="chatbot__controls">\n' +
                '            <div class="chatbot__overlay">\n' +
                '                <p>\n' +
                '                   Agree agree agree.\n' +
                '                </p>\n' +
                '                <a href="javascript:;" class="legal-btn">Yes, I agree</a>\n' +
                '            </div>\n' +
                '            <form id="chatbot__form" class="chatbot__form" enctype="multipart/form-data">\n' +
                '                <form-field class="form-field">\n' +
                '                    <label for="input-file" class="label-file"></label>\n' +
                '                    <input type="file" id="input-file" name="input-file" accept="image/*,image/jpeg">\n' +
                '                </form-field>\n' +
                '                <form-field class="form-field form-field--text">\n' +
                '                    <label for="input-text"></label>\n' +
                '                    <input type="text" id="input-text" class="input-text" placeholder="Enter message..." autocomplete="off">\n' +
                '                </form-field>\n' +
                '               <button type="submit" class="submit"></button>\n' +
                '            </form>\n' +
                '\n' +
                '        </div>\n' +
                '\n' +
                '    </div>\n' +
                '</div>';
        }

        function addMessage(options) {
            var message = $("<div class='chatbot__chat__message'><div class='inner-container'></div></div>");
            options.from === "bot" ? message.addClass('chatbot__chat__message--bot') : message.addClass('chatbot__chat__message--user');
            if (options.text) {
                var p = $('<p>' + options.text + '</p>');
                message.find('.inner-container').append(p);
            }
            if (options.imgSrc) {
                var img = $('<img src=' + options.imgSrc + '>');
                message.find('.inner-container').append(img);
            }
            $('.chatbot__chat').append(message);

            if(options.scrollToBottom) {
                setTimeout(function () {
                    $(".js-chatbot__chat-wrapper").mCustomScrollbar("scrollTo", "bottom", {
                        scrollInertia: 100,
                    });
                }, 50)
            }
        }

        function getBotMessage(cb){
            // $.get({
            //     url:"http://178.62.214.195:8000/splat/messages/",
            //     crossDomain: true,
            //     data: {"userId": "1", "sessionId": session_id},
            //     success: function(data) {
            //         $.each(data, function(index, item) {
            //             addMessage({from:'bot', text: item.text, scrollToBottom: true});
						if (botMsg[msg]) {
							addMessage({from:'bot', text: botMsg[msg], scrollToBottom: true});
							msg = msg + 1;
						}
            //         });
            //     }
            // });
        }



        ChatBot.prototype.init = function() {

            $(el).append(getHtml());

            // $.post({
            //     url:"http://178.62.214.195:8000/splat/message/",
            //     crossDomain: true,
            //     data: JSON.stringify( {"userId": "1", "sessionId": session_id, "messageType": 1, "message": "hello"}),
            //     success: function(data) {
            //         addMessage({from: 'bot', text:data.messages[0], imgSrc: data.messages[1]});
            //     }
            // });

            $(".js-chatbot__chat-wrapper").mCustomScrollbar({
                theme: "light",
                documentTouchScroll: true,
                contentTouchScroll: 0
            });

            $('.js-chatbot-open-btn').on('click', function () {
                $('.chatbot-container').addClass('is-shown');
                $('.js-chatbot-open-btn').addClass('is-hidden');
                checkBotMsg = setInterval(getBotMessage, 1000)
            });

            $('.legal-btn').on('click', function () {
                $('.chatbot__overlay').addClass('is-confirm');
            });


            $('.js-chatbot-header__closer').on('click', function(e){
                e.stopImmediatePropagation();
                $('.js-chatbot-open-btn').removeClass('is-hidden');
                $('.chatbot-container').removeClass('is-shown');
                clearInterval(checkBotMsg);
                checkBotMsg = false;
            });

            $('.chatbot-container').on('click', function () {
                $('.chatbot-container').addClass('is-shown');
                $('.js-chatbot-open-btn').addClass('is-hidden');
                if (!checkBotMsg) {
                    checkBotMsg = setInterval(getBotMessage, 3000)
                }
            });

            $("input[type=file]").change(function(event) {

                $.each(event.target.files, function(index, file) {
                    var reader = new FileReader();

                    reader.onload = function(event) {
                        var object = {};
                        object.filename = file.name;
                        object.data = event.target.result;

                        addMessage({from: 'user', imgSrc:object.data,scrollToBottom: true});
                        $.post({
                            url:"http://178.62.214.195:8000/splat/message/",
                            crossDomain: true,
                            data: JSON.stringify({"userId": "1", "sessionId": session_id, "messageType": 0, "message": object.data}),
                            success: function(data){}
                        }).then(setTimeout(function(){
                            getBotMessage()
                        }, 1000));
                    };
                    reader.readAsDataURL(file);
                });
                $(this).val('');
            });

            $("form").submit(function(form) {
                var msg = $("#input-text").val();

                if(!msg.length) {
                    return false;
                }
                // $.post({
                //     url: "http://178.62.214.195:8000/splat/message/",
                //     crossDomain: true,
                //     data: JSON.stringify({"userId": "1", "sessionId": session_id, "messageType": 1, "message": $("#input-text").val()}),
                //     success: function(data) {
                //         addMessage({from:'user', text: msg, scrollToBottom: true});
                        addMessage({from:'user', text: msg, scrollToBottom: true});
                //     }
                // }).then(setTimeout(function(){
                //     getBotMessage()
                // }, 500));

                $("#input-text").val("");
                form.preventDefault();
            });

        };
    }

    var bot = new ChatBot('body', {});
    bot.init();
})(jQuery);
