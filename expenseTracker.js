document.addEventListener("DOMContentLoaded", fetchFromDatabase);


function fetchFromDatabase() {
  const token=localStorage.getItem('token');
  axios
    .get("http://localhost:3000/expense/get-expenses",{headers:{"Authorization":token}})
    .then((response) => {
     for(var i=0;i<response.data.allExpenses.length;i++){
           showExpenseDetails(response.data.allExpenses[i])
     }
      })
      .catch((err)=>{
        console.log(err);
      })
var purchaseBtn=document.getElementById("rzp-button1");
  axios
    .get("http://localhost:3000/expense/get-premiumStatus",{headers:{"Authorization":token}})
    .then((response) => {
      if(response.data.userDetail.ispremiumuser==true){
        purchaseBtn.style.display = 'none';
         document.getElementById('success-message').innerText = "You are a premium user";
      }else{
        document.getElementById('buy-message').innerText = "You are not a premium user buy premium"
      }
         
      })
      .catch((err)=>{
        console.log(err);
      })
}


document.getElementById("expenseAmount").focus();

var addExpenseBtn=document.getElementById("addExpenseButton");

addExpenseBtn.addEventListener('click',saveToDatabase);

function saveToDatabase(event){
    event.preventDefault();

    const expenseAmount=document.getElementById("expenseAmount").value;
    const description=document.getElementById("description").value;
    const category=document.getElementById("category").value;

    const details={expenseAmount:expenseAmount, 
        description:description, 
        category:category
        }
      const token=localStorage.getItem('token');
        axios.post('http://localhost:3000/expense/add-expense',details,{headers:{"Authorization":token}})
        .then((response)=>{showExpenseDetails(response.data.newExpenseDetail)})

        .catch((err)=>console.log(err))
   }


   function showExpenseDetails(details){

    document.getElementById("expenseAmount").value="";
    document.getElementById("description").value="";
    document.getElementById("category").value="";


    var parentEle= document.getElementById("list-items");
    var childEle=document.createElement("li");
    childEle.setAttribute("id","list-item");
    childEle.textContent="Expense Amount:"+details.expenseAmount+"---"+"Description:"+details.description+"---"+"category:"+details.category;
    parentEle.appendChild(childEle);


var del =document.createElement("button");
del.textContent="\u2717";
del.setAttribute("expense-id",details.id);
del.style.backgroundColor="red";
del.addEventListener("click",deleteStock);

function deleteStock(event,expenseId){
    event.preventDefault();
 expenseId = event.target.getAttribute("expense-id");
 const token=localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`,{headers:{"Authorization":token}})
    .then((response)=>{
        console.log(response);
    })
    .catch((err) => console.log(err));
  parentEle.removeChild(childEle);
}
childEle.appendChild(del);


}