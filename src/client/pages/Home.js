import React from "react";
import styled from "styled-components";

const Home = () => {
  return (
    <StyledHome>
      <img src="images/pict.jpg" alt="" />
      <h2>Welcome To My Page</h2>
      <button onClick={() => console.log("yilma")}>click me</button>
    </StyledHome>
  );
};

export default { component: Home };

const StyledHome = styled.div`
  display: flex;
  color: white;
  height: 100vh;
  background-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

//ADD TEXT SHADOW HERE
