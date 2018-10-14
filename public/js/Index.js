//Cam Van
$(function () {
    class Index {
        constructor(addr, balance) {
            this.addr=addr;
            this.balance=balance;
            this.divMessage=$("#divIMessage");
            this.txtAAddr=$("#txtIAAddr");
            this.txtBalance=$("#txtIBalance");
            //////////////////////////////////////////
            var me=this;
            me.txtAAddr.text(addr);
            me.txtBalance.text(balance);
        }
    }
    Proxy.getWallet(function (rsl) {
        console.log(rsl);
        if(rsl!=null && !rsl.error && !rsl.invalidate){
            var index = new Index(rsl.data.addr, rsl.data.balance);
            Conf.addr=rsl.data.addr;
            Conf.balance=rsl.data.balance;
        }
        else {
            Conf.addr=null;
            Conf.addr=null;
            Conf.account=null;
            document.location.pathname = '/pages/login.html';
        }
    },false);

});