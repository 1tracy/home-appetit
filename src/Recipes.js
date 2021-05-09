import React, { useState, useEffect } from 'react';
import './App.css';

const Recipes = ({ ingredients }) => {
    console.log("recipes renders .. make sure dont spam this!!");
    // states
    const [recipes, setRecipes] = useState([]);
    const [num, setNum] = useState(1);

    // access the api here!
    const template = `http://www.recipepuppy.com/api/?i=${ingredients.join(',')}&p=${num}`;
    console.log(ingredients);

    // effects
    useEffect( () => {
       // getRecipes();
    }, [ingredients]);

    // functions
    const getRecipes = async () => {
        const response = await fetch(`http://www.recipepuppy.com/api/?i=${ingredients.join(',')}&p=${num}`);
        const data = await response.json();
        console.log(data);
    }

    return (
        <div className="App">
            <p>{ingredients.join(', ')}</p>
            
        </div>
    );
}

export default Recipes;