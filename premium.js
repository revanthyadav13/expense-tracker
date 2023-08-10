
var showLeaderBoardBtn=document.getElementById("hiddenbutton");

showLeaderBoardBtn.addEventListener('click',fetchFromDatabase);


function fetchFromDatabase() {
  const token=localStorage.getItem('token');
  axios.get("http://localhost:3000/premium/showLeaderBoard",{headers:{"Authorization":token}})
    .then((response) => {
        for(var i=0;i<response.data.userLeaderBoardDetails.length;i++){
           showPremiumDetails(response.data.userLeaderBoardDetails[i].name, response.data.userLeaderBoardDetails[i].totalExpense||0)
     }
      })
      .catch((err)=>{
        console.log(err);
      })

}
 function showPremiumDetails(name,expenseAmount){

    var parentEle= document.getElementById("LeaderBoardlist-items");
    var childEle=document.createElement("li");
    childEle.setAttribute("id","LeaderBoardlist-item");
    childEle.textContent=`Name:${name}   Total Amount:${expenseAmount}`;
    parentEle.appendChild(childEle);
 }
 