'use strict';

var app = {

    userChat: function(currentUserEmailId, chatUserEmailId, currentUsername, chatId, pageNumber){

        var socket = io('/user/chat', { transports: ['websocket'] });

        // When socket connects, join the current chatroom
        socket.on('connect', function () {

            socket.emit('joinUser', currentUserEmailId, chatUserEmailId, chatId);

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

                    socket.emit('newMessageUser', chatId, message);
                    textareaEle.val('');
                    app.helpers.addMessage(message, currentUsername);
                }
            });

            $(".delete-message").on('click', function(e) {

                var message = {
                    content: $(this).parent().find(".my-message").text(),
                    username: $(this).parent().find(".message-data-name").text(),
                    date: new Date($(this).parent().find(".message-data-time").text()),
                    _id: $(this).parent().find(".message-data-id").text()
                };

                socket.emit('deleteMessageUser', chatId, message);
                $(this).parent().remove();
            });

            $(".edit-message").on('click', function(e) {
                alert("Inside editMessage");

                var editableText = $("<textarea />");
                $(editableText).attrName = "editMessage";
                alert(this.class);
                $(this).removeClass().addClass('edit-done');
                alert(this.class);
                $(this).parent().find(".my-message").replaceWith(editableText);
                $(this).val('Done');
                this.class = "edit-done";

                // $(this).parent().remove();
            });

            $(".edit-done").on('click', function(e) {
                alert("Inside editDone");

                var editableText = $("textarea[name='editMessage']");
                var messageContent = editableText.val().trim();

                if(messageContent !== '') {
                    var message = {
                        content: messageContent,
                        username: $(this).parent().find(".message-data-name").text(),
                        date: new Date($(this).parent().find(".message-data-time").text()),
                        _id: $(this).parent().find(".message-data-id").text()
                    };

                    socket.emit('editMessageUser', chatId, message);
                }
            });

            socket.on('updateChatUser', function(messages) {
                app.helpers.updateChat(messages, currentUsername, true);
            });

            // Append a new message
            socket.on('addMessageUser', function(message) {
                app.helpers.addMessage(message, currentUsername);
            });

            $(".load-more").on('click', function(e) {
                socket.emit("loadMoreMessagesUser", chatId, pageNumber);
            });

            socket.on('additionalMessagesUser', function(messages, updatedPageNumber) {
                app.helpers.updateChat(messages, currentUsername, false);
                pageNumber = updatedPageNumber;
            });
        });
    },

    roomChat: function(roomTitle, currentUsername, currentUserEmailId, pageNumber){

        var socket = io('/rooms/chat', { transports: ['websocket'] });

        // When socket connects, join the current chatroom
        socket.on('connect', function () {

            socket.emit('joinRoom', roomTitle, currentUserEmailId);

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
                    app.helpers.addMessage(message, currentUsername);
                }
            });

            $(".delete-message").on('click', function(e) {

                var message = {
                    content: $(this).parent().find(".my-message").text(),
                    username: $(this).parent().find(".message-data-name").text(),
                    date: new Date($(this).parent().find(".message-data-time").text()),
                    _id: $(this).parent().find(".message-data-id").text()
                };

                socket.emit('deleteMessageRoom', roomTitle, message);
                $(this).parent().remove();
            });

            $(".edit-message").on('click', function(e) {


                $(this).parent().find(".my-message").contentEditable = true;

                var message = {
                    content: $(this).parent().find(".my-message").text(),
                    username: $(this).parent().find(".message-data-name").text(),
                    date: new Date($(this).parent().find(".message-data-time").text()),
                    _id: $(this).parent().find(".message-data-id").text()
                };

                // socket.emit('deleteMessageRoom', roomTitle, message);
                // $(this).parent().remove();
            });

            socket.on('updateChatRoom', function(messages) {
                app.helpers.updateChat(messages, currentUsername, true);
            });

            // Append a new message
            socket.on('addMessageRoom', function(message) {
                app.helpers.addMessage(message, currentUsername);
            });

            socket.on('removeUser', function(userEmailId) {
                $('li#user-' + userEmailId).remove();
                app.helpers.updateNumOfUsers();
            });

            $(".load-more").on('click', function(e) {
                socket.emit("loadMoreMessagesRoom", roomTitle, pageNumber);
            });

            socket.on('additionalMessagesRoom', function(messages, updatedPageNumber) {
                app.helpers.updateChat(messages, currentUsername, false);
                pageNumber = updatedPageNumber;
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
                html += `<li class="clearfix" id="user-${user.userId}">
                     <img src="/img/default-profile-picture" alt="${user.username}" />
                     <a href="/user/checkProfile/${user.userId}" <div class="about">
                        <div class="name">${user.username}</div>
                        <div class="status"><i class="fa fa-circle online"></i> online</div>
                     </div></a></li>`;
            }

            if(html === ''){ return; }
            $('.users-list ul').html('').html(html);

            this.updateNumOfUsers();
        },

        // Adding a new message to chat history
        addMessage: function(message, currentUsername){
            message.date      = (new Date(message.date)).toLocaleString();
            message.username  = message.username;
            message.content   = message.content;

            var html = `<li>
                    <div class="message-data">
                      <span class="message-data-name">${message.username}</span>
                      <span class="message-data-time">${message.date}</span>
                    </div>
                    <div class="message my-message" dir="auto">${message.content}</div>`;

            if(message.username === currentUsername) {
                html = html + `<button class="edit-message rooms-btn">Edit</button>
                                <button class="delete-message logout-btn">Delete</button>
                                </li>`;
            } else {
                html = html + `</li>`;
            }
            $(html).hide().appendTo('.chat-history ul').slideDown(200);

            // Keep scroll bar down
            $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
        },

        updateChat: function(messages, currentUsername, isReplace){
            var html = '';
            messages.forEach(function(message) {
                html = html + `<li>
                    <div class="message-data">
                      <span class="message-data-name">${message.username}</span>
                      <span class="message-data-time">${message.date}</span>
                    </div>
                    <div class="message my-message" dir="auto">${message.content}</div>`;

                if(message.username === currentUsername) {
                    html = html + `<button class="edit-message rooms-btn">Edit</button>
                                <button class="delete-message logout-btn">Delete</button>
                                </li>`;
                } else {
                    html = html + `</li>`;
                }
            });

            if(isReplace) {
                $('.chat-history ul').html('').html(html).slideDown(200);
                // Keep scroll bar down
                $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
            } else {
                $('.chat-history ul').prepend(html).slideDown(200);
            }

        },

        // Update number of online users in the current room
        //         // This method MUST be called after adding, or removing list element(s)
        updateNumOfUsers: function(){
            var num = $('.users-list ul li').length;
            $('.chat-num-users').text(num +  " User(s)");
        }
    }
};


