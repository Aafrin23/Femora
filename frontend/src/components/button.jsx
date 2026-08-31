import React from 'react';
import styled from 'styled-components';

const Button = ({ text, onClick }) => {
  return (
    <StyledWrapper>
      <button className="comic-button" onClick={onClick}>
        {text}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .comic-button {
    display: inline-block;
    padding: 2px 10px;
    font-size: 16px;
    /* font-weight: bold; */
    text-align: center;
    text-decoration: none;
    color: black;
    background-color: #ffafc;
    border: 2px solid #000;
    border-radius: 10px;
    box-shadow: 5px 5px 0px #000;
    transition: all 0.3s ease;
    cursor: pointer;
    margin: 5px;
  }

  .comic-button:hover {
    background-color: #fff;
    color: #ff5252;
    border: 2px solid #ff5252;
    box-shadow: 5px 5px 0px #ff5252;
  }

  .comic-button:active {
    background-color: #fdf2f8;
    box-shadow: none;
    transform: translateY(4px);
  }`;

export default Button;
