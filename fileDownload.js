 
function download(){
    const token=localStorage.getItem('token');
    axios.get('http://localhost:3000/expense/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 200){
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.txt';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        throw new Error(err);
    });
}
