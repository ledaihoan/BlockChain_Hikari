$(function () {
    Proxy = class {
        constructor() { }
        static Do(act,  sqlParams, onSuccess, onError) {
            $.ajax({
                type: "POST",
                url: "/"+ act,
                data: { Name: act,  SqlParams: sqlParams },
                dataType: 'json',
                success: onSuccess,
                error: onError
            });
        }
        static login(acc,pass, onSuccess, onError) {
            var shaPass=Helper.sha256(pass);
            Proxy.Do("login", {acc,shaPass},  onSuccess, onError);
        }
        static checkLogin(onSuccess, onError) {
            Proxy.Do("login", {},  onSuccess, onError);
        }
        ///wallet/balance
        static getWallet( onSuccess, onError) {
            Proxy.Do("wallet/balance", {},  onSuccess, onError);
        }
        ///wallet/history
        static getTransactionList(onSuccess, onError){
            Proxy.Do("wallet/history", {},  onSuccess, onError);
        }
    };
    var proxy = new Proxy();
});