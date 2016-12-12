var crypto = require('crypto');

var UserSchema = {};
  UserSchema.createSchema=function(mongoose){

    var UserSchema = mongoose.Schema({
      email: {type:String, 'defalue':''}
       ,hashed_password: {type:String, 'default' : ''}
       ,salt:{type:String}
      ,created_at: {type: Date, index: {unique: false},'default':Date.now}
      ,updated_at: {type: Date, index: {unique: false},'default':Date.now}
      ,name : {type:String, index : 'hashed', 'default' : ''}
      ,provider: {type:String, 'default':''}
      ,authToken: {type: String, 'default':''}
      ,facebook:{}
      ,twitter:{}
      ,google:{}



    })
    UserSchema.virtual('password')
              .set(function(password){
                this._password = password;
                this.salt=this.makeSalt();
                this.hashed_password=this.encryptPassword(password);
                console.log('virtual password called : ' +this.hashed_password);
              })
              .get(function(){
                return this._password;
              });
    UserSchema.method('encryptPassword', function(plainText, salt){
      if(salt){
        return crypto.createHmac('sha1',salt).update(plainText).digest('hex');
      }else{
        return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
      }
    });
    UserSchema.method('authenticate',function(plainText,inSalt,hashed_password){
      if(inSalt){

        return this.encryptPassword(plainText,inSalt) == hashed_password;
      }else {
        console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
        return this.encryptPassword(plainText) === this.hashed_password;
      }
    });
    UserSchema.method('makeSalt',function(){
      return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    UserSchema.static('findUser',function(email,callback){
      return this.findOne({email:email},callback);
       });
       UserSchema.static('load', function(options, callback) {
     		console.log("option!!!!!");
     	//	options.select = options.select || 'name';
     		console.dir(options);
     		this.findOne(options.criteria,options.projection)
     	    //  .select(options.select)
     	      .exec(callback);
     	});

    return UserSchema;

  };

//authSchema
var authUserSchema = {};
  authUserSchema.createSchema=function(mongoose){

    var UserSchema = mongoose.Schema({
      email: {type:String, 'defalue':''}
      ,created_at: {type: Date, index: {unique: false},'default':Date.now}
      ,updated_at: {type: Date, index: {unique: false},'default':Date.now}
      ,name : {type:String, index : 'hashed', 'default' : ''}

      ,provider: {type:String, 'default':''}
      ,authToken: {type: String, 'default':''}
      ,facebook:{}
      ,twitter:{}
      ,google:{}
    })

    UserSchema.static('findUser',function(email,callback){
      return this.findOne({email:email},callback);
       });

    return UserSchema;

  };
module.exports=function(){

  return{
      'UserSchema' : UserSchema
//    'localUserSchema': localUserSchema
//    ,'authUserSchema' :authUserSchema
  };

}
