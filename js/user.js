function User(userName, password, profile) {
	self =this;
	this.userName = userName;
	this.password = password;
	this.profile = profile;
	return self;
}

function UserService(){
}

var user;

UserService.prototype.login = function(){
	if(!user){
		//fire login process
		user = new User("test","123",5);
	}
	return user;
};

UserService.prototype.getProfile = function(){
	
	if(user)return user.profile;
	else{
		return 5;
	}
};