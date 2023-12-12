function editThePost(node, postid) {
  const post = document.getElementById("post"+postid);
  const initialContent = post.innerHTML;
  let newMessage = post.innerHTML;
  console.log(initialContent)
  const button = node;
  console.log(button)
  post.toggleAttribute("contentEditable")
  if (button.innerHTML === "Save changes?") {
    newMessage = post.innerHTML;
    button.innerHTML = "Edit Post"
  } else {
    button.innerHTML = "Save changes?"
  }
  fetch("http://127.0.0.1:1738/editPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"id" : postid, "message" : newMessage})
  })
}
