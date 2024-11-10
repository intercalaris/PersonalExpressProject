const trashIcons = document.querySelectorAll(".fa-trash");

trashIcons.forEach((icon) => {
  icon.addEventListener("click", function () {
    const contactElement = this.closest(".contact");
    const name = contactElement.querySelector(".contact-name").innerText;
    const number = contactElement.querySelector(".contact-number").innerText;
    const email = contactElement.querySelector(".contact-email").innerText;
    
        fetch('/contacts', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'number': number,
            'email': email
            
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
