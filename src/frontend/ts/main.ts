
function SayHello(){
    let current_value = document.getElementById("textarea_1") as HTMLInputElement;
    let new_value = "Hello world!!!" + "\n" + current_value.value;
    document.getElementById("textarea_1").innerHTML = new_value;
}


var fun:any = SayHello;

window.addEventListener("load", ()=>{
    
    fun();
    console.log("aca2")
    SayHello();
});
