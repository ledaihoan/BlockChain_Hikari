$("#create").click(() => {
    let pass = $("#password").val();
    let confirm = $("#confirm").val();

    if(pass && pass == confirm && pass.length > 0) {
        $.get("/walletGen", function(res, status) {

        });
    }
});