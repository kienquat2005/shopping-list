import React, { useState, useEffect } from "react";
import firebase from "./Config/firebase";
import * as emailjs from "emailjs-com";
function Share() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      db.collection("list").onSnapshot(function (data) {
        setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    };
    fetchData();
  }, []);

  // console.log(items);

        {items.map((item, index) => (
          <ul key={index}>
              <li>{index}</li>
              <li>{item.itemName}</li>
              <li>{item.thumb}</li>
              <li>{item.isSelected}</li>
              <li>{item.quantity}</li>
            </ul>
        ))}

   console.log();
  function sendEmails(e) {
   
    const service_id = "service_x9fgz7l";
    const templates_id = "template_uflxvtm";
    const user_id = "user_vbOZbXg9DJRhTlQC2HPI5";
    var data = {
      from_name: "Nguyễn Thị Hằng",
      to_email: inputValue,
      message: JSON.stringify(items),
    };
    emailjs.send(service_id, templates_id, data, user_id).then(
      function (response) {
        console.log(response.status, response.text);
      },
      function (err) {
        console.log(err);
      }
    );
  }

  return (
    <div className="share">
      <div className="app-background">
        <div className="main-container">
          <div className="add-item-box">
            <input
              type="email"
              onChange={(event) => setInputValue(event.target.value)}
              className="add-item-input"
              placeholder="Enter email."
              name="user_email"
            />
            <button type="submit" onClick={sendEmails}>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Share;
