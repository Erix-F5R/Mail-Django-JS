document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //Send Email
  document.querySelector('#compose-form').onsubmit = post_email; 
  


  // By default, load the inbox
  load_mailbox('inbox');
});

function post_email(event){

    //event.preventDefault();
    
    let recps = document.querySelector('#compose-recipients').value;
    let sub = document.querySelector('#compose-subject').value;
    let body = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recps,
          subject: sub,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
    
    load_mailbox('inbox');

    return false;
    

  
}


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  console.log(mailbox);

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
  // Print emails
  console.log(emails);

  for( let i = 0; i < emails.length; i++){
    let email = emails[i];
    
    let sender = email.sender;
    let subject = email.subject;
    let body = email.body;
    let timestamp = email.timestamp;
    
    let style = ``
    if (email.read){
      style = ` "background-color: lightgrey;" `
    }

    
    

    document.querySelector('#emails-view').innerHTML += `<div id='email-box' style = ${style} >From:${sender} <br> Subject:${subject} <br> ${timestamp} <br> ${body}</div>`;


    
  }
  document.querySelectorAll('#email-box').forEach(function(currentDiv) {currentDiv.style.border += 'solid black 2px'; })

  // ... do something else with emails ...
  });

}