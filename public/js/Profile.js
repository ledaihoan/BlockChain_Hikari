//Cam Van
$(function () {
    class Profile {
        constructor(addr, balance) {
            this.addr=addr;
            this.balance=balance;
            this.txtAAddr=$("#txtIAAddr");
            this.txtBalance=$("#txtIBalance");
            this.tblPTransactionList=$("#tblPTransactionList").DataTable({
                destroy:true,
                "rowCallback":function(row, data, index){
                    if(index%2==0){
                        $(row).removeClass('myodd myeven');
                        $(row).addClass('myodd');
                    }else{
                        $(row).removeClass('myodd myeven');
                        $(row).addClass('myeven');
                    }
                },
                "pageLength":25,
                "paging":true,
                "searching":true,
                "info":true,
                ordering:true,
                select:{
                    style:'os',
                    selector:'td:first-child'
                },
                responsive: true
            });
            this.txtTotal=$("#txtPTotal");
            this.txtFrom=$("#txtPFrom");
            this.txtTo=$("#txtPTo");
            this.divMessage=$("#divPMessage");
            ////////////////////////////////////////
            var me=this;
            ////////////////////////////////////////
            me.txtAAddr.text(addr);
            me.txtBalance.text(balance);
            me.loadPage();


        }
        loadPage(){
            var me=this;
            Proxy.getTransactionList(function (rsl) {
                if(rsl!=null){
                    var data=rsl.data;
                    me.txtTotal.text(data.total);
                    me.txtFrom.text(data.from);
                    me.txtTo.text(data.to);
                    var table= me.tblPTransactionList;
                    table.clear().draw();
                    var defaultData = [
                        {
                            "tx_id": "ddfadsfdfdf0a046a839f0fb418cf0b2e8ce1927b082351f0a8c027995aef4c",
                            "time": 1526625529,
                            "confirmations": 1,
                            "value": 6184973,
                            "fee": 23052,
                            "type": 1
                        },
                        { "tx_id": "adfadsfadsfdsafasdfdsffg44333r0b2e8ce1927b082351f0a8c027995aef4c",
                            "time": 1526625529,
                            "confirmations": 1,
                            "value": 543333,
                            "fee": 23052,
                            "type": 1
                        },
                        { "tx_id": "sfgsfdgsdf5436566a839f0fb418cf0b2e8ce1927b082351f0a8c027995aef4c",
                            "time": 1526625529,
                            "confirmations": 1,
                            "value": 983632,
                            "fee": 23052,
                            "type": 2
                        }
                    ];
                    var tableData = data.transactions.length>0? data.transactions:defaultData;

                    for(var i in tableData){
                        var d=tableData[i];
                        var rowNode=table.row.add([
                            d.tx_id,
                            d.time,
                            d.value,
                        ]).draw().node();
                    }
                    table.columns.adjust().responsive.recalc();
                }
            },function () {
                Helper.OnError(me.divMessage,"Error get transaction list");
            });
        }
    }
    Proxy.getWallet(function (rsl) {
        console.log(rsl);
        if(rsl!=null && !rsl.error && !rsl.invalidate){
            var profile = new Profile(rsl.data.addr, rsl.data.balance);
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