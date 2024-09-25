import React from "react";
import "./App.css";
import SearchBox from "./components/SearchBox";
import SearchTable from "./components/SearchTable";

function App() {
  const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <div className="App">
      <SearchBox setSearchQuery={setSearchQuery} />
      <SearchTable searchQuery={searchQuery} />
    </div>
  );
}

export default App;
