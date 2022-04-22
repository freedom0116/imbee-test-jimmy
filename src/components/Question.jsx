import React from 'react';

export default function Question({ question }) {
  const { title, score, answer_count, view_count, is_answered, owner, link } =
    question;
  const { profile_image, display_name } = owner;

  return (
    <a
      className="w-full flex flex-row border-b-2 border-gray-300 p-1"
      href={link}
      alt={title}
    >
      <div className="w-full">
        <h3>{title}</h3>
        <div className="flex flex-row justify-evenly">
          <div>
            <div className="text-red-800">Score</div>
            <div
              className={`${
                score < 0 ? 'text-red-600' : 'text-black'
              } text-center`}
            >
              {score}
            </div>
          </div>
          <div>
            <div className="text-red-800">Answers</div>
            <div
              className={`${
                is_answered
                  ? 'bg-green-700 text-white'
                  : answer_count
                  ? 'border border-green-700 text-green-700'
                  : 'text-black'
              } text-center`}
            >
              {answer_count}
            </div>
          </div>
          <div>
            <div className="text-red-800">Viewed</div>
            <div className="text-center">{view_count}</div>
          </div>
        </div>
      </div>
      <div className="w-20 flex flex-col justify-center items-center">
        <img
          className="h-14 w-14 rounded-full"
          src={profile_image}
          alt=""
        ></img>
        <div className="text-center">{display_name}</div>
      </div>
    </a>
  );
}
