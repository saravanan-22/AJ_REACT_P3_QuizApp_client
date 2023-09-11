import React, { useEffect, useContext, useReducer, useState } from "react";
// import Header from "../Header/Header";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./GK.css";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CartContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import image from "../images/quiz.jpg";

const gkReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };
    case "SET_SELECTED_ANSWER":
      return { ...state, selectedAnswer: action.payload };
    case "SET_CURRENT_QUESTION_INDEX":
      return { ...state, currentQuestionIndex: action.payload };
    case "DECREASE_TIMER":
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    case "SET_POINTS":
      return { ...state, points: action.payload };
    case "SET_ANSWERED_CORRECTLY":
      return { ...state, answeredCorrectly: action.payload };
    case "SET_TOTAL_POINTS":
      return { ...state, totalPoints: action.payload };
    case "SET_POINTS_ARRAY":
      return { ...state, pointsArray: action.payload };
    case "SET_TOTAL_CURR":
      return { ...state, totalCurrPoints: action.payload };
    default:
      return state;
  }
};

const initialState = {
  questions: [],
  selectedAnswer: [],
  currentQuestionIndex: 0,
  timeRemaining: 60,
  points: 0,
  pointsArray: [0],
  answeredCorrectly: [],
  totalPoints: 0,
  totalCurrPoints: 0,
};

const userId = localStorage.getItem("uid");
const userSpecificStorageKey = `currPointsArray_${userId}`;
let currPointsArray = JSON.parse(localStorage.getItem(userSpecificStorageKey));

if (!currPointsArray) {
  currPointsArray = [0];
  localStorage.setItem(userSpecificStorageKey, JSON.stringify(currPointsArray));
}

const Gk = () => {
  const [userId, setUserId] = useState();
  const [state, dispatch] = useReducer(gkReducer, initialState);
  const { Gk } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: "SET_QUESTIONS", payload: Gk });
  }, [Gk]);

  useEffect(() => {
    let timer;
    const updateTimer = () => {
      if (state.timeRemaining > 0) {
        timer = setTimeout(() => {
          dispatch({ type: "DECREASE_TIMER" });
        }, 1000);
      } else {
        navigate("/Home")
        setTimeout(() => {
          window.location.reload();
        }, 4000); 
      
        
        // Push the current points into the array
        currPointsArray.push(state.totalCurrPoints);
        // console.log(currPointsArray);
        localStorage.setItem(
          userSpecificStorageKey,
          JSON.stringify(currPointsArray)
        ); // Use the user-specific key
        const totalLength = currPointsArray.length;
        // console.log(totalLength);
        const exactLength = totalLength > 2 ? `${totalLength - Number(2)}` : 0;
        const preValues = currPointsArray[exactLength];
        // console.log(preValues);

        // update previous value in db-------------------
        axios
          .put(
            `https://muddy-bat-moccasins.cyclic.cloud/api/v1/users/updateGkQuestions/previousPoints/${userId}`,
            {
              prevPoint: preValues,
            }
          )
          .then((res) => console.log("previous point updated successfully"))
          .catch((err) => console.log(err));

        // update totalPoints in db--------------------------
        const totalValue = currPointsArray.reduce(
          (accumulator, currentValue) => {
            return accumulator + currentValue;
          },
          0
        );
    //  console.log(totalValue);

        axios
          .put(
            `https://muddy-bat-moccasins.cyclic.cloud/api/v1/users/updateGKQuestions/totalPoints/${userId}`,
            {
              gkTotalPoints: totalValue,
            }
          )
          .then((res) => console.log("totalPoints updated successfully"))
          .catch((err) => console.log(err));
      }
    }

    updateTimer();  

    return () => {
      clearTimeout(timer);
    };
  }, [state.timeRemaining, state.totalCurrPoints]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleSelectAnswer = (answer) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];

    if (currentQuestion) {
      if (answer === currentQuestion.correct_answer) {
        if (!state.answeredCorrectly[state.currentQuestionIndex]) {
          const updatedPoints = state.points + 1;

          // Update the points for the current question in pointsArray
          const updatedPointsArray = [...state.pointsArray];
          updatedPointsArray[state.currentQuestionIndex] = updatedPoints;

          dispatch({ type: "SET_POINTS", payload: updatedPoints });
          dispatch({ type: "SET_POINTS_ARRAY", payload: updatedPointsArray });
          const totalCurrPoints = updatedPointsArray.length;
          // console.log(totalCurrPoints);
          dispatch({ type: "SET_TOTAL_CURR", payload: totalCurrPoints });
          const updatedAnsweredCorrectly = [...state.answeredCorrectly];
          updatedAnsweredCorrectly[state.currentQuestionIndex] = true;

          dispatch({
            type: "SET_ANSWERED_CORRECTLY",
            payload: updatedAnsweredCorrectly,
          });

          // Update total points
          const addPoints = state.points + 1;
          dispatch({ type: "SET_TOTAL_POINTS", payload: addPoints });
          const userId = localStorage.getItem("uid");
          setUserId(userId);
          axios
            .put(
              `https://muddy-bat-moccasins.cyclic.cloud/api/v1/users/updateCurrentPoints/${userId}`,
              {
                currentPoints: updatedPoints,
              }
            )
            .then((response) => {
              console.log("Points updated successfully");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }

    const updatedSelectedAnswer = [...state.selectedAnswer];
    updatedSelectedAnswer[state.currentQuestionIndex] = answer;

    dispatch({
      type: "SET_SELECTED_ANSWER",
      payload: updatedSelectedAnswer,
    });
  };

  const handleNextQuestion = () => {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      dispatch({
        type: "SET_CURRENT_QUESTION_INDEX",
        payload: state.currentQuestionIndex + 1,
      });
    } else {
      navigate("/");
    }
  };

  const handlePreviousQuestion = () => {
    if (state.currentQuestionIndex > 0) {
      dispatch({
        type: "SET_CURRENT_QUESTION_INDEX",
        payload: state.currentQuestionIndex - 1,
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* <Header /> */}
      <section style={{ marginTop: "6em" ,}}>
        <h5 style={{ textAlign: "end", margin: "0", marginRight: "52px" , color :"red"}}>
          Timer: {formatTime(state.timeRemaining)}
        </h5>
        {state.questions.map((gkQuestion, index) => (
          <div
            key={index}
            style={{
              display: index === state.currentQuestionIndex ? "block" : "none",
            }}
          >
            <Card className="text-center mx-5 mb-2 transparent-card" style={{backgroundColor : "white"}}>
              <Card.Header style={{backgroundColor : "rgb(55, 134, 158)"}}>{gkQuestion.category}</Card.Header>
              <Card.Body>
                <Card.Title className="mb-3" >
                  QUESTION : {gkQuestion.question}
                </Card.Title>
                <Row className="mb-2">
                  <Col md={6}>
                    <Button
                      onClick={() =>
                        handleSelectAnswer(gkQuestion.correct_answer)
                      }
                      variant={
                        state.selectedAnswer[state.currentQuestionIndex] ===
                        gkQuestion.correct_answer
                          ? "outline-success"
                          : "outline-dark"
                      }
                      disabled={
                        state.selectedAnswer[state.currentQuestionIndex] !==
                        undefined
                      }
                    >
                      A . {gkQuestion.correct_answer}
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      onClick={() =>
                        handleSelectAnswer(gkQuestion.incorrect_answers[0])
                      }
                      variant={
                        state.selectedAnswer[state.currentQuestionIndex] ===
                        gkQuestion.incorrect_answers[0]
                          ? "outline-danger"
                          : "outline-dark"
                      }
                      disabled={
                        state.selectedAnswer[state.currentQuestionIndex] !==
                        undefined
                      }
                    >
                      B . {gkQuestion.incorrect_answers[0]}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Button
                      onClick={() =>
                        handleSelectAnswer(gkQuestion.incorrect_answers[1])
                      }
                      variant={
                        state.selectedAnswer[state.currentQuestionIndex] ===
                        gkQuestion.incorrect_answers[1]
                          ? "outline-danger"
                          : "outline-dark"
                      }
                      disabled={
                        state.selectedAnswer[state.currentQuestionIndex] !==
                        undefined
                      }
                    >
                      C . {gkQuestion.incorrect_answers[1]}
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      onClick={() =>
                        handleSelectAnswer(gkQuestion.incorrect_answers[2])
                      }
                      variant={
                        state.selectedAnswer[state.currentQuestionIndex] ===
                        gkQuestion.incorrect_answers[2]
                          ? "outline-danger"
                          : "outline-dark"
                      }
                      disabled={
                        state.selectedAnswer[state.currentQuestionIndex] !==
                        undefined
                      }
                    >
                      D . {gkQuestion.incorrect_answers[2]}
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="text-muted" style={{backgroundColor : "rgb(55, 134, 158)"}}>
                {gkQuestion.questionType}
              </Card.Footer>
            </Card>
          </div>
        ))}
        <div className="text-center">
          {state.currentQuestionIndex > 0 && (
            <Button
              onClick={handlePreviousQuestion}
              variant="primary"
              className="me-2"
            >
              Previous Question
            </Button>
          )}
          {state.currentQuestionIndex < state.questions.length - 1 && (
            <Button onClick={handleNextQuestion}  variant="success">
              Next Question
            </Button>
          )}
        </div>
        <h6 className="text-start ms-5" style ={{color : "rgb(246, 222, 100)"}}>POINTS: {state.points}</h6>
        <h6 className="text-start ms-5" style ={{color : "rgb(55, 134, 158)"}}>
          Selected Answer:{" "}
          {state.selectedAnswer[state.currentQuestionIndex] || "Not Selected"}
        </h6>
        <h6 className="text-start ms-5" style ={{color : "rgb(246, 222, 100)"}}>
          Questions No: {state.currentQuestionIndex}
        </h6>
      </section>
    </div>
  );
};

export default Gk;
