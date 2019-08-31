
var config = {
	apiKey: "AIzaSyD56i8SVsP-9Qdlm0HggogIlTm7v7CSwuM",
	authDomain: "playground-b2343.firebaseapp.com",
	databaseURL: "https://playground-b2343.firebaseio.com",
	projectId: "playground-b2343",
	storageBucket: "playground-b2343.appspot.com",
	messagingSenderId: "11358421019"
};
firebase.initializeApp(config);
var db = firebase.database();
var token;
if(localStorage.getItem('token')){
	token = localStorage.getItem('token');
}else{
	token = Math.random().toString(36).substring(7);
	localStorage.setItem('token', token);
}
if(localStorage.getItem('user')){
	$('#name').val(localStorage.getItem('user'));
	$('#home').hide();
	$('#chat').show();
}

$('#start').on('click', function() {
	if ($('#name').val().trim().length) {
		$('#home').hide();
		$('#chat').show();
	}
});

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function sendMessage(user, content){
	db.ref('/messages').push({
		user,
		content,
		token: token,
		time: new Date().toISOString(),
	});
	localStorage.setItem('user', user);
	$('.input .content').val('');
	var $target = $('html,body');
	$target.animate({scrollTop: $target.height()}, 300);
}

// db.ref('/messages').orderByKey().limitToLast(10).once('value', function(snapshot){
// 	snapshot.forEach(function(msg){
// 		insertMsg(msg.val());
// 	});
// });

db.ref('/messages').orderByKey().limitToLast(25).on('child_added', function(snapshot){
	insertMsg(snapshot.val());
});

var lastUserName = Math.random().toString(36);
function insertMsg(data){
	var time = new Date(data.time).getHours() + ':' + new Date(data.time).getMinutes();
	var str;
	if(data.token === token){
		str = '<div class="msg sent" title="'+time+'">';
		str += '<div class="content">' + escapeHtml(data.content) + '</div></div>';
	}else{
		str = '<div class="msg received title='+time+'">';
		if (data.user !== lastUserName) {
			str += '<div class="user">' + escapeHtml(data.user) + '</div>';
		}
		lastUserName = data.user;
		str += '<div class="content">' + escapeHtml(data.content) + '</div></div>';
	}
	$('.messages').append(str);
	var $target = $('html,body');
	$target.animate({scrollTop: $target.height()}, 300);
}

$('.send-wrapper').on('click', function() {
	var u = $('#name').val().trim();
	var c = $('.input .content').val().trim();
});

$('.input .content').on('keypress', function(e){
	var code = (e.keyCode ? e.keyCode : e.which);
	var u = $('#name').val().trim();
	var c = $('.input .content').val().trim();
	if(code === 13 && u && c){
		sendMessage(u, c);
	}else if(code === 13 & c){
		alert('暱稱不能為空！');
	}
})
