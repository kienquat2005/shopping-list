import React, { useState, useEffect } from "react";
import "./index.css";
import firebase, { storage } from "./Config/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faCircle,
  faCheckCircle,
  faPlus,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [totalItemCount, setTotalItemCount] = useState();
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      db.collection("list").onSnapshot(function (data) {
        setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        var total = 0;
        data.docs.map((doc) => {
          return total += doc.data().quantity;
        })
        setTotalItemCount(total);
      });
    };
    fetchData();
  }, []);
  function handleChange(e) {
    setFile(e.target.files[0]);
  }
  const handleAddButtonClick = (e) => {
    e.preventDefault();
    if(inputValue === "") {
      alert("Please enter value");
    } else {
      const uploadTask = storage.ref(`/images/${file.name}`).put(file);
      uploadTask.on("state_changed", console.log, console.error, () => {
        storage
          .ref("images")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            setFile(null);
            const newItem = {
              itemName: inputValue,
              quantity: 1,
              isSelected: false,
              thumb: url,
            };
  
            const newItems = [...items, newItem];
            const db = firebase.firestore();
  
            db.collection("list").add(newItem);
            setItems(newItems);
            setInputValue("");
            calculateTotal();
          });
      });
    }
  };

  const handleQuantityIncrease = (index) => {
    const newItems = [...items];

    newItems[index].quantity++;

    const db = firebase.firestore();
    db.collection("list")
      .get()
      .then((docs) => {
        let items = [];
        docs.forEach(async (doc) => {
          const item = {
            id: doc.id,
            ...doc.data(),
          };
          await items.push(item);
           if (items[index].id === item.id) {
            db.collection("list").doc(items[index].id).update(newItems[index]);
          }
        });
      });
    setItems(newItems);
    calculateTotal();
  };

  const handleQuantityDecrease = (index) => {
    const newItems = [...items];

    newItems[index].quantity--;
    const db = firebase.firestore();
    db.collection("list")
      .get()
      .then((docs) => {
        let items = [];
        docs.forEach(async (doc) => {
          const item = {
            id: doc.id,
            ...doc.data(),
          };
          await items.push(item);
           if (items[index].id === item.id) {
            db.collection("list").doc(items[index].id).update(newItems[index]);
          }
        });
      });
    setItems(newItems);
    calculateTotal();
  };

  const removeTodo = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    const db = firebase.firestore();
    db.collection("list")
    .get()
    .then((docs) => {
      let items = [];
      docs.forEach(async (doc) => {
        const item = {
          id: doc.id,
          ...doc.data(),
        };
        await items.push(item);
         if (items[index].id === item.id) {
          db.collection("list").doc(items[index].id).delete();
        }
      });
    });
    setItems(newItems);
    calculateTotal();
  };
  const toggleComplete = (index) => {
    const newItems = [...items];
    newItems[index].isSelected = !newItems[index].isSelected;
    const db = firebase.firestore();
    db.collection("list")
      .get()
      .then((docs) => {
        let items = [];
        docs.forEach(async (doc) => {
          const item = {
            id: doc.id,
            ...doc.data(),
          };
          await items.push(item);
           if (items[index].id === item.id) {
            db.collection("list").doc(items[index].id).update(newItems[index]);
          }
        });
      });

    setItems(newItems);
  };

  const calculateTotal = () => {
    const totalItemCount = items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    setTotalItemCount(totalItemCount);
  };
  const show = () =>{
      window.location.href = '/shopping-list/share';
  }

  return (
    <div className="app-background">
      <div className="main-container">
        <div className="add-item-box">
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="add-item-input"
            placeholder="Add an item..."
          />
          <input type="file" onChange={handleChange} />
          <FontAwesomeIcon
            icon={faPlus}
            onClick={(e) => handleAddButtonClick(e)}
          />
        </div>

        <div className="item-list">
          {items.map((item, index) => (
            <div key={index} className="item-container">
              <div className="item-name" onClick={() => toggleComplete(index)}>
                {item.isSelected ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} />

                    <span className="completed">{item.itemName}</span>
                   
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCircle} />
                    <span>{item.itemName}</span>
                    
                  </>
                )}
              </div>
              <div className="item-thumb">
              <img src={item.thumb} alt={item.title} />
              </div>
              <div className="quantity">
                <button>
                  <FontAwesomeIcon

                    icon={faChevronLeft}
                    onClick={() => handleQuantityDecrease(index)}
                  />
                </button>
                <span> {item.quantity} </span>
                <button>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    onClick={() => handleQuantityIncrease(index)}
                  />
                </button>
              </div>
              <div>
                  <button className="btn-remove">
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={() => removeTodo(index)}
                  />
                  </button>
              </div>
            </div>
          ))}
        </div>
        <div className="footer">
        <button onClick={() => show()} className="btn-share"> Share </button>
        <div className="total">Total: {totalItemCount}</div> 
        </div>
        
      </div>
    </div>
  );
};

export default ShoppingList;
