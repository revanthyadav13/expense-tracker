
document.getElementById("name").focus();

var submitBtn=document.getElementById("submit");

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
              saveToDatabase(event);
            }
}

function saveToDatabase(event){
    event.preventDefault();

    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    
    const userdetails={name:name, 
        email:email, 
        password:password
        }

        axios.post('http://localhost:3000/user/signup',userdetails)
        .then((response)=>{
            console.log(response.data.newUserDetail)
             document.getElementById("name").value="";
             document.getElementById("email").value="";
             document.getElementById("password").value="";

             })

        .catch((err)=>{
            if (err.response && err.response.status === 403) {
          document.getElementById('error-message').innerText = "Error:Request failed with status code 403 (or) Email already registered. Please use a different email.";
        } else {
          console.error('An error occurred:', err.message);
        }
        })
   }


