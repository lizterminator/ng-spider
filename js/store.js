var Store = {
	storage: localStorage,
	getString: function(key){
		return this.storage.getItem(key);
	},
	getJson: function(key){
		return JSON.parse(this.getString(key));
	},
	setString: function(key,value){
		if(typeof value === 'string')
			this.storage.setItem(key,value);
		else throw new TypeError('类型错误,请使用String类型');
	},
	setJson: function(key,obj){
		this.setString(key,JSON.stringify(obj));
	}
};