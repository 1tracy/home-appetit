import React, {useRef, useEffect, useState} from 'react';
import './App.css';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import classData from './data/classData.js'
import Recipe from './RecipeFormat';

const App = (props) => {
  // state stuff
  const [ingredients, setIngredients] = useState([]); // current list of ingredients
  const [current, setCurrent] = useState([]); // what is currently on the screen
  const [final, setFinal] = useState([]); // final list of ingredients (saved after btn)
  const [recipes, setRecipes] = useState([]); // list of available recipes
  const [page, setPage] = useState(1); // page number of recipe list
  const [isSaved, setSave] = useState(false); // false if save btn is not clicked
  const [baseResponse, setBase] = useState([]) // run one time to get base response

  // effects
  useEffect(() => {
    const updateIngredients = () => {
      //console.log("updateIngredients");
      if (current !== ["person"] && ingredients.includes(current[0]) === false) {
        function arrayUnique(array) {
          var a = array.concat();
          for(var i=0; i<a.length; ++i) {
              for(var j=i+1; j<a.length; ++j) {
                  if(a[i] === a[j])
                      a.splice(j--, 1);
              }
          }
          return a;
        };
        let temp_ingredients = ingredients;
        setIngredients(arrayUnique(temp_ingredients.concat(current)));
        //console.log(ingredients);
      };
    };
    updateIngredients();
  }, [current]);

  //
  // get recipes api
  //

  useEffect(() => {
    const getRecipes = async () => {
      console.log("recipes renders .. make sure dont spam this!!");

      // access the api here!
      console.log(final.join(',')); // output: apple, page=1

      const response = await fetch(`https://young-plains-99773.herokuapp.com/http://www.recipepuppy.com/api/?i=${final.join(',')}&p=${page}`);
      const data = await response.json();
      const results = data.results;
      console.log(data.results);

      console.log(results[0].title);
      console.log(results.length);
      if (results.length > 0 && results[0].title === "Ginger Champagne") {
        setRecipes([]);
        console.log('set blank recipes');
      } else {
        setRecipes(data.results); // relevant: title, href, thumbnail
        console.log('did not set blank recipes');
      }
    };
    getRecipes();
  }, [final]);

  useEffect(() => {
    if (isSaved) {
      return;
    };

    if (!isSaved) {

      let errorExists = false;

      const rules = {// Define the rules for the mediaDevices in loadCam below
        audio: false,
        video: {facingMode: 'environment'}
      };

      // Control if user has cam / browser
      if (navigator.mediaDevices.getUserMedia) { // check if the browser is getting a prompt for cam permission
        const loadCam = navigator.mediaDevices.getUserMedia(rules) // returns promise, ask for cam permission with constraints in rules above
        .then(stream => {
          vidRef.current.srcObject = stream;
          return new Promise(resolve => 
            vidRef.current.onloadedmetadata = resolve
            );
        })
        .catch(err => {
          //console.log('error lmfaoo ;-;');
          errorExists = true;
          return;
        });


        if (!errorExists && vidRef.current!== null && canvasRef.current !== null) {
          //console.log(vidRef.current);
          //console.log(canvasRef.current);

         // Wait for the cocoSsd model to load, then for the cam to load
      Promise.all([loadModel, loadCam]) // wait for loading the coco-ssd model & the cam feed, then call detectutility with the vidref and results
      .then(
        res => {
          if (vidRef.current !== null) {
            detectUtility(vidRef.current, res[0]) // build guesses on each image from the feed
          };
        }
        )
      .catch(
        err => console.error(`Error loading the models / cam ${err}`));
    }
    else {
      alert('You should probably download Chrome buddy');
    }
      };
    };
  });

  // save button
  const saveIngredients = () => {
    //console.log("saveIngredients");
    setFinal(ingredients); // save ingredients
    setIngredients([]); // clear temp ingredients for next time
    //console.log("final");
    //console.log(final);
    //console.log(ingredients); // check is empty
    setSave(true);
  }


  // promised loading model 
  const loadModel = cocoSsd.load('mobilenet_v2');
  
  // Refs
  const windowWidth = window.innerWidth / 2;
  const windowHeight = window.innerHeight / 2;
  const canvasRef = useRef(null);
  const vidRef = useRef(null);
  

  // Utils
  
  const detectUtility = (video, model) => { // uses detect method on the model then calls the box building util below on each object recognized

    //console.log(model.detect(video));
    if (isSaved) {
      //console.log("issaved");
      return;
    }

    if (canvasRef.current !== null) {
      model.detect(video)
        .then(discriminations => {
          // console.log(discriminations);
          // props.handleCountFrames()
          buildRectangle(discriminations);
          // props.handleGuess(discriminations);
        })
        requestAnimationFrame(() => detectUtility(video, model));
      };
    };

    const buildRectangle = discriminations => { // Draws a rectangle with html around each discriminations in the object passed in
      // !!!!
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
      // !!!!

      if (isSaved) {
        //console.log("issaved");
        return;
      }
      
      if (canvasRef.current !== null) {
        //console.log(canvasRef);
        const ctx = canvasRef.current.getContext('2d'); // define the rectangle
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Build the rectangle styling
        ctx.lineWidth = 2;
        ctx.textBaseline = 'bottom';
        ctx.font = '14px sans-serif';
        
        discriminations.forEach(guess => { // Draw the rectangle around each object prediction
        const guessText = `${guess.class}`;
        setCurrent([...current, guessText]);
        ctx.strokeStyle = classData[guessText]; // give each guess.class's box a unique color
        
        const textWidth = ctx.measureText(guessText).width;
        const textHeight = parseInt(ctx.font, 10);
        ctx.strokeRect(guess.bbox[0], guess.bbox[1], guess.bbox[2], guess.bbox[3]);
        ctx.fillStyle = 'white';
        ctx.fillRect( 
          guess.bbox[0]-ctx.lineWidth/2, // place the label on the top left of the box
          guess.bbox[1], 
          textWidth + ctx.lineWidth, 
          -textHeight);
        ctx.fillStyle = '#fc0303' // color the label text red, always
        ctx.fillText(guessText, guess.bbox[0], guess.bbox[1]);

        //console.log(guessText);
      });
    };
  };


    

  // Render the feed & app
  //const [isSaved, setSave] = useState(false); // false if save btn is not clicked
  return (
    <>
    <button className="save-button" onClick={saveIngredients}>Save</button>
    <p>Items detected: {final.join(", ")}.</p>
    
    {!isSaved && (
      <>
      <video
        ref={vidRef}
        className='app-position'
        autoPlay
        playsInline
        muted
        width={windowWidth}
        height={windowHeight}
      />
      <canvas
        ref={canvasRef}
        className='app-position'
        width={windowWidth}
        height={windowHeight-100}
      />
      </>
    )}

    {recipes.map(recipe => (
      <Recipe 
      key={recipe.title}
      title={recipe.title}
      img={recipe.thumbnail}
      link={recipe.href}/>
    ))}
    </>
    );
}
export default App;