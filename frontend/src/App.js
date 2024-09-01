import React, { useState } from "react";
import "./App.css";

const App = () => {
  // Variables for input and response data
  const [userInput, setUserInput] = useState("");
  const [responseData, setResponseData] = useState("");

  const submitData = async (e) => {
    e.preventDefault();
    console.log("Submitting data:", userInput); // Debugging line
    try {
      const response = await fetch("http://localhost:5505/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }), // Send user input as JSON
      });
      
        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json(); // Expecting a JSON response
        if (data.url) {
                window.location.href = data.url; // Redirect to the URL provided by the backend
        } else {
            setResponseData("No matching theme found.");
        }
    } catch (error) {
      console.log("Error Happened: ", error);
      setResponseData("An error occurred. Please try again.",error);
    }
  };

  return (
    <div>
      <form onSubmit={submitData}>
        <span className="material-symbols-outlined">search</span>
        <input
          id="search-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter Your Theme!"
        />
        <button type="submit">Submit</button>
      </form>
      <p>{responseData}</p>
    </div>
  );
};

export default App;
