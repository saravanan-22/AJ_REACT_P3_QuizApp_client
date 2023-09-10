import React, { useContext, useEffect, useState } from "react";
import "./Points.css";
import { CartContext } from "../Context/Context";

const Points = () => {
  const { currentPoints , totalPoints, prevPoints} = useContext(CartContext);
  return (
    <div>
      <table className="points-table">  
        <thead>
          <tr className="text-white">
            <th>NO.</th>
            <th>Category</th>
            <th>Previous Points</th>
            <th>Current Points</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-white">
            <td>1</td>
            <td>GK</td>
            <td>{prevPoints}</td>
            <td>{currentPoints}</td>
            <td>{totalPoints}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Points;
