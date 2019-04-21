'use strict';

var app = {

    userChat: function(currentUserEmailId, chatUserEmailId, currentUsername){

        var socket = io('/user/chat', { transports: ['websocket'] });

        // When socket connects, join the current chatroom
        socket.on('connect', function () {

            let userChatId;

            socket.emit('joinUser', currentUserEmailId, chatUserEmailId);

            socket.on('userChatId', function(chatId) {
                userChatId = chatId;
            });

            // Whenever the user hits the save button, emit newMessage event.
            $(".chat-message button").on('click', function(e) {

                var textareaEle = $("textarea[name='message']");
                var messageContent = textareaEle.val().trim();
                if(messageContent !== '') {
                    var message = {
                        content: messageContent,
                        username: currentUsername,
                        date: Date.now()
                    };

                    socket.emit('newMessageUser', userChatId, message);
                    textareaEle.val('');
                    app.helpers.addMessage(message);
                }
            });

            // Append a new message
            socket.on('addMessageUser', function(message) {
                app.helpers.addMessage(message);
            });
        });
    },

    roomChat: function(roomTitle, currentUsername, userEmailId){

        var socket = io('/rooms/chat', { transports: ['websocket'] });

        // When socket connects, join the current chatroom
        socket.on('connect', function () {

            socket.emit('joinRoom', roomTitle);

            // Update users list upon emitting updateUsersList event
            socket.on('updateUsersList', function(users) {

                $('.container p.message').remove();
                app.helpers.updateUsersList(users);
            });

            // Whenever the user hits the save button, emit newMessage event.
            $(".chat-message button").on('click', function(e) {

                var textareaEle = $("textarea[name='message']");
                var messageContent = textareaEle.val().trim();
                if(messageContent !== '') {
                    var message = {
                        content: messageContent,
                        username: currentUsername,
                        date: Date.now()
                    };

                    socket.emit('newMessageRoom', roomTitle, message);
                    textareaEle.val('');
                    app.helpers.addMessage(message);
                }
            });

            // Append a new message
            socket.on('addMessageRoom', function(message) {
                app.helpers.addMessage(message);
            });

            socket.on('getRoomTitle', function() {
                socket.emit('removeUser', roomTitle, userEmailId);
            });

            socket.on('removeUser', function(userEmailId) {
                $('li#user-' + userEmailId).remove();
                app.helpers.updateNumOfUsers();
            });
        });
    },

    helpers: {

        encodeHTML: function (str){
            return $('<div />').text(str).html();
        },

        // Update users list
        updateUsersList: function(users){
            if(users.constructor !== Array){
                users = [users];
            }

            var html = '';
            for(var user of users) {
                user.username = this.encodeHTML(user.username);
                html += `<li class="clearfix" id="user-${user.emailId}">
                     <img src="/img/default-profile-picture" alt="${user.username}" />
                     <a href="/user/checkProfile/${user.emailId}" <div class="about">
                        <div class="name">${user.username}</div>
                        <div class="status"><i class="fa fa-circle online"></i> online</div>
                     </div></a></li>`;
            }

            if(html === ''){ return; }
            $('.users-list ul').prepend(html);

            this.updateNumOfUsers();
        },

        // Adding a new message to chat history
        addMessage: function(message){
            message.date      = (new Date(message.date)).toLocaleString();
            message.username  = this.encodeHTML(message.username);
            message.content   = this.encodeHTML(message.content);

            var html = `<li>
                    <div class="message-data">
                      <span class="message-data-name">${message.username}</span>
                      <span class="message-data-time">${message.date}</span>
                    </div>
                    <div class="message my-message" dir="auto">${message.content}</div>
                  </li>`;
            $(html).hide().appendTo('.chat-history ul').slideDown(200);

            // Keep scroll bar down
            $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
        },

        // Update number of online users in the current room
        // This method MUST be called after adding, or removing list element(s)
        updateNumOfUsers: function(){
            var num = $('.users-list ul li').length;
            $('.chat-num-users').text(num +  " User(s)");
        }
    }
};


