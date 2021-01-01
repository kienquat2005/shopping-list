import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Share from "./Share";
import ShoppingList from "./shoppingList";
function App() {
  return(
    <div className="App">
      <Router>
        <Switch>
          <Route path="/shopping-list/" exact component={ShoppingList} />
          <Route path="/shopping-list/share" component={Share} />
        </Switch>
      </Router>
    </div>
  )
};

export default App;
