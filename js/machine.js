function Machine(options) {

	this.name = options.name;
	this.ip = options.ip;
	this.port = options.port;
	this.isLive = options.live;
	this.type = options.type;
};

Machine.prototype.template = function() {

};

Machine.prototype.setTitle = function(ele) {
	// $('.page-heading>h3').text(this.name + "  " + this.ip);
	$(ele).text(this.name + "  " + this.ip);
};
 
Machine.prototype.refresh = function(detail) {
	
	$('#physics').empty();
	$("#serviceDetail").empty();
	$('#jvm').empty();
	if (!detail.live) {
		$('#startMachine').removeClass('btn-success');
		$('#startMachine').text("已关闭");
		return;
	}
	$('#startMachine').addClass('btn-success');
	$('#startMachine').text("已开启");



};

Machine.prototype.requestDetail = function(url) {
	var that = this;
	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'json',
		data: {
			ip: that.ip,
			port: that.port
		},
		success: function(data) {
			that.refresh(data);
		},
		error: function(data) {
			$('#physics').empty();
			$("#serviceDetail").empty();
			$('#jvm').empty();
			$('#startMachine').removeClass('btn-success');
			$('#startMachine').text("已关闭");
		}
	});
};

/******************type === TOMCAT*******************/

function Tomcat(options) {
	Machine.call(this, options);
};


Tomcat.prototype = new Machine();
Tomcat.prototype.constructor = Tomcat;



/********************ICE*********************/
function Ice(options) {
	Machine.call(this, options);
};


Ice.prototype = new Machine();
Ice.prototype.constructor = Ice;



/*********************NGINX********************/
function Nginx(options) {
	Machine.call(this, options);
};


Nginx.prototype = new Machine();
Nginx.prototype.constructor = Nginx;



/**********************REDIS**********************/
function Redis(options) {
	Machine.call(this, options);
};


Redis.prototype = new Machine();
Redis.prototype.constructor = Redis;