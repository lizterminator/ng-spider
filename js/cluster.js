var Cluster = function(options){

	if(!options.name || !options.title || !options.machines) 
		throw new Error("Cluster 缺少参数");
	this.name = options.name;
	this.title = options.title;
	this.machines = options.machines;
};

