document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //Send Email
  document.querySelector('#compose-form').onsubmit = post_email;

  //View single Email

  // By default, load the inbox
  load_mailbox('inbox');
});

function load_email(email_id){
  
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  //Clear emails
  document.querySelector('#email-view').innerHTML = '' 

  //GET Email
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#email-view').innerHTML += `From:${email.sender} <br> Subject:${email.subject} <br> ${email.timestamp} <br> ${email.body}<br>`
    console.log(email.archived)
    archive(email_id, email.archived);
    reply(email_id);


  });


    

  //PUT read = TRUE
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

};

function reply(email_id){
  let button = document.createElement('button')
  button.innerHTML = 'Reply'
  button.onclick = function() {
    
      // Show compose view and hide other views
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#email-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';

      fetch(`/emails/${email_id}`)
      .then(response => response.json())
      .then(email => {
        // Clear out composition fields
        document.querySelector('#compose-recipients').value = email.sender;
        document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
        document.querySelector('#compose-body').value = `\n\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
    });
  }


  document.querySelector('#email-view').append(button);


};

function archive(email_id, archived){
    //Archive
    let button = document.createElement('button');

    if(!archived){
    

    button.innerHTML = 'Archive';
    button.onclick = function() { 
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({archived: true})
      })
      load_mailbox('inbox') 
    }
  }
    else{
    button.innerHTML = 'Unarchive';
    button.onclick = function() { 
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({archived: false})
      })
      load_mailbox('inbox') 
    }
    
    };
    document.querySelector('#email-view').append(button);
      
};

function post_email(event) {

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
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {

      for (let i = 0; i < emails.length; i++) {
        let email = emails[i];
        let newElement = document.createElement('div')
 
        newElement.innerHTML = `From:${email.sender} <br> Subject:${email.subject} <br> ${email.timestamp} <br> ${email.body}`

        if (email.read) {
          newElement.style.backgroundColor = 'lightgrey'
        }
        newElement.id = 'email-box'
        newElement.addEventListener('click', () => load_email(email.id))
        document.querySelector('#emails-view').append(newElement)
      }
      document.querySelectorAll('#email-box').forEach(function (currentDiv) { currentDiv.style.border += 'solid black 2px'; })

    });

}