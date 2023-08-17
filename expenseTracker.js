document.addEventListener("DOMContentLoaded", fetchExpenseList);
document.addEventListener("DOMContentLoaded", fetchFileList);
document.addEventListener("DOMContentLoaded", fetchPremiumStatus);


const preferredExpensesPerPage = parseInt(localStorage.getItem("preferredExpensesPerPage")) || 5;
let expenseItemsPerPage = preferredExpensesPerPage;

function updateExpensesPerPage() {
  const expensesPerPageSelector = document.getElementById("expensesPerPage");
  const selectedValue = expensesPerPageSelector.value;

  localStorage.setItem("preferredExpensesPerPage", selectedValue);

  expenseItemsPerPage = parseInt(selectedValue);
  fetchExpenseList(expenseCurrentPage);
}

let expenseCurrentPage = 1;
const token=localStorage.getItem('token');

function fetchExpenseList(expensePageNumber){
axios
    .get(`http://localhost:3000/expense/get-expenses?page=${expensePageNumber}&perPage=${expenseItemsPerPage}`,{headers:{"Authorization":token}})
    .then((response) => {

      const totalExpenses = response.data.totalExpenses; // Total number of expenses
      const totalPages = response.data.totalPages; // Total number of pages

      // Update the pagination buttons' visibility based on current page
      expensePrevPageButton.disabled = expenseCurrentPage === 1;
      expenseNextPageButton.disabled = expenseCurrentPage === totalPages;

      // Update the pagination info
      const paginationInfo = document.getElementById("expenseListPagination-info");
      paginationInfo.innerHTML = `Page ${expenseCurrentPage} of ${totalPages}`;

      clearExpenseList();

     for(var i=0;i<response.data.allExpenses.length;i++){
           showExpenseDetails(response.data.allExpenses[i])
     }
      })
      .catch((err)=>{
        console.log(err);
      })
}
      function clearExpenseList() {
  const parentEle = document.getElementById("list-items");
  while (parentEle.firstChild) {
    parentEle.removeChild(parentEle.firstChild);
  }
}

// Call fetchFileList initially with the first page
fetchExpenseList(expenseCurrentPage);

// Add event listeners for pagination buttons
const expensePrevPageButton = document.getElementById("expensePrev-page");
expensePrevPageButton.addEventListener("click", () => {
  if (expenseCurrentPage > 1) {
    expenseCurrentPage--;
    fetchExpenseList(expenseCurrentPage);
  }
});

const expenseNextPageButton = document.getElementById("expenseNext-page");
expenseNextPageButton.addEventListener("click", () => {
  expenseCurrentPage++;
  fetchExpenseList(expenseCurrentPage);
});



function fetchPremiumStatus() {
  var purchaseBtn=document.getElementById("rzp-button1");
var hiddenBtn=document.getElementById("hiddenbutton");
  axios
    .get("http://localhost:3000/expense/get-premiumStatus",{headers:{"Authorization":token}})
    .then((response) => {
      document.getElementById('name-message').innerText = `Hi ${response.data.userDetail.name} `;
      if(response.data.userDetail.ispremiumuser==true){
        purchaseBtn.style.display = 'none';
         document.getElementById('success-message').innerText = "You are a premium user";
         hiddenBtn.style.display = "block";
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
        axios.post('http://localhost:3000/expense/add-expense', details, {headers:{"Authorization":token}})
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

function deleteStock(event){
    event.preventDefault();
 const expenseId = event.target.getAttribute("expense-id");
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

let downloadFilesCurrentPage = 1;
const downloadFilesItemsPerPage = 10; // Number of items per page

function fetchFileList(downloadFilesPageNumber) {
  axios
    .get(`http://localhost:3000/expense/getFiles?page=${downloadFilesPageNumber}&perPage=${downloadFilesItemsPerPage}`, {headers: {"Authorization": token}})
    .then((response) => {
      const allContent = response.data.allContent;
      const totalCount = response.data.totalCount;
       const totalPages = Math.ceil(response.data.totalCount / downloadFilesItemsPerPage); // Calculate total pages

      // Update the pagination buttons' visibility based on current page
      downloadFilesPrevPageButton.disabled = downloadFilesCurrentPage === 1;
      downloadFilesNextPageButton.disabled = downloadFilesCurrentPage === totalPages;

      // Update the pagination info
      const downloadedFilesPaginationInfo = document.getElementById("downloadedFilesPagination-info");
      downloadedFilesPaginationInfo.innerHTML = `Page ${downloadFilesCurrentPage} of ${totalPages}`;

      // Clear the existing list before populating with new data
      clearFileList();

      for (let i = 0; i < allContent.length; i++) {
        showListOfFiles(allContent[i].url || null, allContent[i].createdAt || null, allContent[i].updatedAt || null);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function clearFileList() {
  const parentEle = document.getElementById("downloadedFiles-items");
  while (parentEle.firstChild) {
    parentEle.removeChild(parentEle.firstChild);
  }
}

function clearExpenseList() {
  const parentEle = document.getElementById("list-items");
  while (parentEle.firstChild) {
    parentEle.removeChild(parentEle.firstChild);
  }
}

// Call fetchFileList initially with the first page
fetchFileList(downloadFilesCurrentPage);

// Add event listeners for pagination buttons
const downloadFilesPrevPageButton = document.getElementById("downloadFilesPrev-page");
downloadFilesPrevPageButton.addEventListener("click", () => {
  if (downloadFilesCurrentPage > 1) {
    downloadFilesCurrentPage--;
    fetchFileList(downloadFilesCurrentPage);
  }
});

const downloadFilesNextPageButton = document.getElementById("downloadFilesNext-page");
downloadFilesNextPageButton.addEventListener("click", () => {
  downloadFilesCurrentPage++;
  fetchFileList(downloadFilesCurrentPage);
});


function showListOfFiles(url, createdAt, updatedAt){
  var parentEle= document.getElementById("downloadedFiles-items");
    var childEle=document.createElement("li");
    childEle.setAttribute("id","downloadedFiles-item");
    var anchorElem = document.createElement("a");
     anchorElem.href = url;
     anchorElem.textContent = url; 
  childEle.appendChild(anchorElem);
childEle.appendChild(document.createTextNode("----- Created At: " + createdAt +"----- Created At: " + createdAt + " ----- Updated At: " + updatedAt));
  
    parentEle.appendChild(childEle);

}


