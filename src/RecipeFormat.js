import React from "react";
import './App.css';

const Recipe = ({ title, link, img }) => {
    return(
        <div className="recipe">
            <img src={img} alt="Recipe Image" className="recipe-img"/>
            <h1 className="recipe-title"><a href={link}>{title}</a></h1>  
        </div>
    );
};

export default Recipe;