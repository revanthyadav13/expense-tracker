
document.getElementById("email").focus();

var loginBtn=document.getElementById("login");

loginBtn.addEventListener('click',formValidation);

function formValidation(event){
    event.preventDefault();

    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    if (!email || !password) {
                document.getElementById("error-message").innerText = "Please fill in all (*) fields.";
            } 
            else{
              document.getElementById("error-message").innerText="";
              saveToDatabase(event);
            }
}

function saveToDatabase(event){
    event.preventDefault();

    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    
    const userdetails={ email:email, 
        password:password
        }

        axios.post('http://localhost:3000/user/login',userdetails)
        .then((response)=>{

            if(response.data.status==404){
                document.getElementById('error-message').innerText = response.data.error;
            }
            else if(response.data.status==401){
                document.getElementById('error-message').innerText = response.data.error;
            }
            else{
                document.getElementById('success-message').innerText = response.data.message;
            }
            
             document.getElementById("email").value="";
             document.getElementById("password").value="";

             })

        .catch((err)=>{
            document.getElementById('success-message').innerText = "";
        if(err.response.status==404){
                document.getElementById('error-message').innerText = "Error:Request failed with status code 404 (or) account not found.";
            }
            else if(err.response.status==401){
                document.getElementById('error-message').innerText = "Incorrect password";
            }    
            console.error('An error occurred:', err.message);
        })
   }


