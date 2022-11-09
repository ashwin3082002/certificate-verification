let params = new URLSearchParams(location.search);
let val = params.get("cert");

document.addEventListener("DOMContentLoaded", (event) => {
  const app = firebase.app();
  document.getElementById("cert_id").value = val;
  window.history.replaceState(null, null, window.location.pathname);
});

function verify_certificate() {
  const db = firebase.firestore();
  cert_id = document.getElementById("cert_id").value.trim();
  document.getElementById("cert_id").value = "";
  cert_id = cert_id.replace(/\//g, "");
  const certs = db.collection("certs").doc(cert_id);

  var storage = firebase.storage();
  var storageRef = storage.ref();

  certs
    .get()
    .then((doc) => {
      const data = doc.data();
      if (data == undefined) {
        document.getElementById("id01").style.display = "block";
        document.getElementById("popupfoot").style.display = "none";
        document
          .getElementById("popupheader")
          .setAttribute("class", "w3-container w3-red");
        document.getElementById("popuphead").innerHTML =
          "Certificate Not Valid";
        document.getElementById("popupbody").innerHTML =
          "<p style='font-size:18px'><br>The Certificate number entered is not in our records...</p>";
        
      } else {
        storageRef
          .child("certs/" + cert_id + ".png")
          .getDownloadURL()
          .then(function (url) {
            let img = url;

            document
              .getElementById("popupheader")
              .setAttribute("class", "w3-container w3-teal");
            document.getElementById("id01").style.display = "block";
            document.getElementById("popupfoot").style.display = "block";
            document.getElementById("popuphead").innerHTML =
              "Certificate Valid";
            document.getElementById("popupbody").innerHTML =
              "<p style='font-size:18px'><br>Name: " +
              data.name +
              "<br>Issued On: " +
              data.date +
              "<br>Roll Number: " +
              data.roll +
              "</p>";
            document.getElementById("popupbutton").innerHTML =
              "<a style='text-decoration:none; color:black;' href='" +
              img +
              "'>View Certificate</a>";
            })
          .catch((error) => {
            console.log(error)
            alert("Server Error!!\nERROR CODE: 101");
          });
      }
    })
    .catch((error) => {
      console.log(error)
      alert("Server Error!\nERROR CODE:102!");
    });
}
