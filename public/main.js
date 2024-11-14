const editButtons = document.querySelectorAll(".edit");
const trashIcons = document.querySelectorAll(".fa-trash");

editButtons.forEach(button => button.addEventListener("click", editClick));
trashIcons.forEach(icon => icon.addEventListener("click", deleteClick));

async function editClick(click) {
  const editButton = click.target;
  console.log('edit clicked');
  const contact = editButton.closest(".contact");
  const contactID = contact.getAttribute("data-id");
  const updateButton = contact.querySelector('.update')

  // make text fields into input fields
  const nameField = contact.querySelector(".contact-name");
  const numberField = contact.querySelector(".contact-number");
  const emailField = contact.querySelector(".contact-email");
  const name = nameField.innerText;
  const number = numberField.innerText;
  const email = emailField.innerText;

  nameField.innerHTML = `<input class="edit-input" type="text" required placeholder="Name"  name="name" value="${name}">`;
  numberField.innerHTML = `<input class="edit-input" type="tel" pattern= "^[0-9]+$" title="Please enter numbers only." required placeholder="Phone number" name="number" value="${number}">`;
  emailField.innerHTML = `<input class="edit-input" type="email" required placeholder="Email" name="email" value="${email}">`;
  // switch to update mode, unhide update button and hide edit one
  updateButton.classList.toggle('hidden'); 
  editButton.classList.toggle('hidden');

  // updateButton.addEventListener("click", () => updateClick(contactID, contact)); 
}

// async function updateClick(contactID, contact) {
//   console.log('update clicked')
//   const updatedName = contact.querySelector(".contact-name input").value; //.value for inputs, .innerText for non-input elementos
//   const updatedNumber = contact.querySelector(".contact-number input").value;
//   const updatedEmail = contact.querySelector(".contact-email input").value;

//   try {
//     const response = await fetch(`/contacts/${contactID}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name: updatedName, number: updatedNumber, email: updatedEmail })
//     });

//     if (response.ok) {
//       window.location.reload();
//     }
//   } catch (error) {
//     console.error("Error updating contact:", error);
//   }
// }

async function deleteClick(click) {
  const trashIcon = click.target;
  const contact = trashIcon.closest(".contact");
  const contactID = contact.getAttribute("data-id");

  try {
    const response = await fetch(`/contacts/${contactID}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      window.location.reload();
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}
