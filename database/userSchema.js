var crypto = require('crypto');

var Schema = {};

Schema.createSchema=function(mongoose){

  var UserSchema = mongoose.Schema({
    email: {type:String, 'defalue':''}
     ,hashed_password: {type:String, 'default' : ''}
     ,salt:{type:String}
    ,created_at: {type: Date, index: {unique: false},'default':Date.now}
    ,updated_at: {type: Date, index: {unique: false},'default':Date.now}
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
      console.log('authenticate called: %s -> %s : %s', plainText, this.encryptPassword(plainText,inSalt),hashed_password);

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

  return UserSchema;

};

module.exports=Schema;
