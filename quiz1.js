//#######【quiz.html　STARTにページ遷移を入れる】

var quiz_start_btn = document.getElementById("quiz_start_btn");
console.log(quiz_start_btn);
quiz_start_btn.addEventListener("click",()=>{
    window.location.href = "quiz_main.html";
   
},{once:true});
