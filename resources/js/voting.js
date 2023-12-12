async function addLike(node, upvotes, postid) {
  let likes = node.parentElement.children[1]
  let url = "";
  if(node.checked) {
    likes.innerHTML = parseInt(likes.innerHTML) + 1
    url = "http://127.0.0.1:1738/addUpvote";
  }else {
    likes.innerHTML = parseInt(likes.innerHTML) - 1
    url = "http://127.0.0.1:1738/removeUpvote"
  }
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"id" : postid })
  })
}
