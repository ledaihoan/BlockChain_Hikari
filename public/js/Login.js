//// Cam Van
$(function () {
    Login =class {
        constructor() {
            this.divMessage = $("#divLMessage");
            this.lblCaptcha = $("#lblLCaptcha");
            this.btnRefreshCaptcha = $("#btnLRefreshCaptcha");
            this.btnLogin = $("#btnLLogin");
            this.txtAccount = $("#txtLAccount");
            this.txtPassword = $("#txtLPassword");
            this.txtCaptcha = $("#txtLCaptcha");
            this.captcha = Helper.Captcha();
            this.lblCaptcha.text(this.captcha);
            
            ///////////////////////////////////////
            var me = this;
            ///////////////////////////////////////

            me.btnRefreshCaptcha.click(function () {
                me.captcha = Helper.Captcha();
                me.lblCaptcha.text(me.captcha);
            });
            me.btnLogin.click(function () {
                var account = me.txtAccount.val();
                var pass = me.txtPassword.val();
                var captcha = me.txtCaptcha.val();
                if (captcha == me.captcha) {
                    if(account!=null && account!=undefined && pass!=null && pass!=undefined ){
                        Proxy.login(account,pass,function(rsl){
                            if(rsl!=null ){
                                Conf.account=account;

                                setTimeout(() => document.location.pathname = 'index.html', 200);
                            } else {
                                Conf.account=null;

                            }
                        },function(){
                            Helper.OnError(me.divMessage,"Login again");
                        });
                    }
                    else Helper.OnError(me.divMessage,"Đăng nhập lại")
                }
            });
        }
        
    }
    Proxy.checkLogin(function (rsl) {
        if(rsl!=null && rsl.acc!=null)
            document.location.pathname = 'index.html';
        else var login = new Login();
    },false);

});