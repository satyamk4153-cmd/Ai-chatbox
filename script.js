const API_KEY = "YOUR_API_KEY";
const messgaes=document.getElementById("messages");
const input=document.getElementById("input");
const sendBtn=document.getElementById("send");
const history=[];

function addMsg(text,who){
    const div= document.createElement("div");
    div.classList.add("msg",who);
    div.textContent=text;

    messgaes.appendChild(div);
    return div;
}

async function sendMsg(){
    const query=input.value.trim();

    if(!query)
        return;
    addMsg(query,"user");
    input.value="";
    history.push({role:"user",parts:[{"text":query}]});

    const botMsg=addMsg("THINKING.......","bot");

    try{
        const url=`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`;

        const response=await fetch(url,{
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({contents:history})
        });
        const data=await response.json();

        if(data.error){
            throw new Error(data.error.message)
        }

        const reply=data.candidates[0].content.parts[0].text;

        botMsg.textContent=reply;

        history.push({role:"model", parts:[{text:reply}]});

    }catch(error){
        botMsg.textContent="ERROR:",+data.error.message;
    }

}

sendBtn.addEventListener("click",sendMsg);
input.addEventListener("keydown",(e)=>{
    if(e.key==="Enter")
        sendMsg();
});


addMsg("Hi, I can help you with any query","bot");

