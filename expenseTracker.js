document.addEventListener("DOMContentLoaded", fetchFromDatabase);


function fetchFromDatabase() {
  axios
    .get("http://localhost:3000/expense/get-expenses")
    .then((response) => {
     for(var i=0;i<response.data.allExpenses.length;i++){
           showExpenseDetails(response.data.allExpenses[i])
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

        axios.post('http://localhost:3000/expense/add-expense',details)
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

function deleteStock(event,userId){
    event.preventDefault();
 expenseId = event.target.getAttribute("expense-id");
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`)
    .then((response)=>{
        console.log(response);
    })
    .catch((err) => console.log(err));
  parentEle.removeChild(childEle);
}
childEle.appendChild(del);


}