var main = function(req,res){
  res.render('index.ejs',{title:'Borad Main'});
}
var signupPage = function(req,res){
}
module.exports.main=main;
module.exports.signupPage=signupPage;
