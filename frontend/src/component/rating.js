import React from 'react';
import _ from 'lodash';
import { FaStarHalfAlt, FaStar, FaRegStar } from 'react-icons/fa';
export default function Rating({ rating }) {
  const star = Math.floor(rating);
  const stars = _.range(0, star);
  const remain = _.range(0, Math.floor(5 - rating));
  return (
    <div className="rating">
      {rating}{' '}
      {stars.map((star) => (
        <span key={star}>
          <FaStar />
        </span>
      ))}
      {rating > star ? <FaStarHalfAlt /> : null}
      {remain.map((r) => (
        <span key={r}>
          <FaRegStar />
        </span>
      ))}
    </div>
  );
}
