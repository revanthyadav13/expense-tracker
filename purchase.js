var purchaseBtn=document.getElementById("rzp-button1");

purchaseBtn.addEventListener('click',premiumMembership);

async function premiumMembership(event){
    event.preventDefault();
const token=localStorage.getItem('token');
const response = await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{"Authorization":token}})
console.log(response);
            var options = {
                "key": response.data.key_id,
                "order_id":response.data.order.id,
                "handler": async function(response) {

                     try {
                    await axios.post('http://localhost:3000/purchase/updateTransactionStatus', {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }, {
                        headers: { "Authorization": token }
                    });
                    alert('Payment successful! You are a premium user');
                } catch (error) {
                    console.error('Error updating transaction status:', error);
                    alert('Payment successful, but status update failed. Please contact support.');
                }
                },
                theme: {
                    color: '#F37254',
                },
            };

            var rzp = new Razorpay(options);
            
              rzp.on('payment.failed', function (response) {
        
        axios.post('http://localhost:3000/purchase/updateTransactionStatus', {
            order_id: options.order_id,
            payment_id: null
        }, {
            headers: { "Authorization": token }
        }).catch(error => {
            console.error('Error updating transaction status:', error);
        });
        alert('Payment failed! Please try again or contact support.');
    });

rzp.open();
}