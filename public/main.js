const trashIcons = document.querySelectorAll(".fa-trash");

trashIcons.forEach((icon) => {
  icon.addEventListener("click", async function () {
    const contactId = this.closest(".contact").getAttribute("data-id");
    
    try {
      const response = await fetch(`/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }); 
      if (response.ok) {
        window.location.reload(); 
      }
  } catch(error) {
    console.error("Error deleting contact:", error);
  }
  });
});
