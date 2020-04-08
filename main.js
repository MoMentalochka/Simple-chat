$('#chatPage').hide()
    $(function () {
      var socket = io()
      socket.on('new user', function (data) {
        $('#messages').append($('<li class = "connected">').text(data + ' is connected'))
      })
      socket.on('update users', function (data) {
        if (data != [] && data) {
          $('#sidebar').empty()
          for (i = 0; i < data.length; i++) {
            $('#sidebar').append($('<li class = "user">').text(data[i]))
          }
        };

      });
      $('#form').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        if ($('#textarea2').val().trim()) socket.emit('chat message', $('#textarea2').val());
        $('#textarea2').val('');
        return false;
      });

      $('#loginForm').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        if ($('#login').val()) {
          socket.emit('new user', $('#login').val());
          $('#loginPage').hide()
          $('#chatPage').show()
        }
        $('#login').val('')
        return false;
      });

      socket.on('chat message', function (data) {
        $('#messages').append($('<li>').text(data.from + ' : ' + data.message))
      })

      socket.on('bye', function (data) {
        $('#messages').append($('<li class = "disconnected">').text(data + ' disconnected'))
      });
    });