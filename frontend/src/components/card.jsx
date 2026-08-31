import React from "react";
import styled from "styled-components";
import Button from "./button.jsx";

const Card = ({ title, description, image, buttonText, onButtonClick }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <img src={image} alt={title} />
        <h3>{title}</h3>
        <p>{description}</p>
         <Button
        text={buttonText}
        onClick={onButtonClick}
      />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 350px;      /* Increased width */
    height: 500px;
    border-radius: 30px;
    background: #e0e0e0;
    box-shadow: 20px 20px 60px #bebebe,
      -20px -20px 60px #ffffff;
    overflow: hidden;
    text-align: center;
    padding-bottom:20px;
    
  }

  img {
    width: 100%;
    height: 320px;
    object-fit: cover;
  }

  h3 {
    margin-top: 15px;
    font-size: 1.4rem;
  }

  p {
    padding: 0 20px;
    color: #555;
  }
`;

export default Card;