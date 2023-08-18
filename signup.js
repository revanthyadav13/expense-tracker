
document.getElementById("name").focus();

var submitBtn=document.getElementById("signup");

submitBtn.addEventListener('click',formValidation);

function formValidation(event){
    event.preventDefault();

     const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    if (!name || !email || !password) {
                document.getElementById("error-message").innerText = "Please fill in all (*) fields.";
            } 
            else{
              document.getElementById("error-message").innerText="";
              saveToDatabase();
              location.href = 'login.html';
            }
}

function saveToDatabase(){

    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    
    const userdetails={name:name, 
        email:email, 
        password:password
        }

        axios.post('http://54.165.72.81:3000/user/signup',userdetails)
        .then((response)=>{
              
         if (response.data.status === 403) {
          document.getElementById('error-message').innerText = "Error:Request failed with status code 403 (or) Email already registered. Please use a different email.";
        }
             document.getElementById("name").value="";
             document.getElementById("email").value="";
             document.getElementById("password").value="";

             })

        .catch((err)=>{
          document.getElementById('error-message').innerText = "Error:Request failed with status code 403 (or) Email already registered. Please use a different email.";
          console.log('An error occurred:', err);
        })
   }


