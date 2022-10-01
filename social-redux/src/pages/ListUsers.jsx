import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { count } from "./../constant/const";
import { Link, useNavigate } from 'react-router-dom';
import {
  getUsersFetch,
  deleteFollowFetch,
  postFollowFetch,
} from "./../future/action/getUsersFetch";

export const ListUsers = () => {
  const navigate = useNavigate();
  const [array, setArray] = useState(count);
  const { users, totalCount } = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const pagesCount = Math.ceil(totalCount / 18);
  const pages = [];

  for (let i = 1; i <= pagesCount; i++) pages.push(i);

  const changePage = (num) => {
    setPage(num);
    dispatch(getUsersFetch(num));
    if (num - 2 > 0 && num + 2 < pages.length)
      setArray(pages.slice(num - 3, num + 2));
    if (num === pagesCount) setArray(pages.slice(num - 5));
    if (num === 1) setArray(pages.slice(num - 1, num + 4));
  };
  const followHandle = (user) => {
    if (user.followed) {
      dispatch(deleteFollowFetch(user.id));
      dispatch(getUsersFetch(page));
    } else {
      dispatch(postFollowFetch(user.id));
      dispatch(getUsersFetch(page));
    }
    changePage(page);
  };
  useEffect(() => {
    dispatch(getUsersFetch());
  }, [dispatch]);
  return (
    <>
      <div className="flex flex-row justify-center">
        <span
          onClick={(e) => changePage(1)}
          className="flex cursor-pointer items-center bg-white bg-opacity-30  h-1 ml-5 my-5 p-5 rounded-lg"
        >
          1...
        </span>
        {array.map((num, idx) => (
          <span
            key={idx}
            onClick={(e) => changePage(num)}
            className="flex cursor-pointer items-center bg-white bg-opacity-30  h-1 ml-5 my-5 p-5 rounded-lg"
          >
            {num}
          </span>
        ))}
        <span
          onClick={(e) => changePage(pagesCount)}
          className="flex cursor-pointer items-center bg-white bg-opacity-30  h-1 ml-5 my-5 p-5 rounded-lg"
        >
          ...{pagesCount}
        </span>
      </div>
      <div className="flex flex-wrap justify-between bg-white bg-opacity-30 h-auto  p-5 mx-5  rounded-lg">
        {users.map((user, idx) => (
          <div
            className="flex flex-col  justify-between items-center w-44  p-5 mr-5 my-5  bg-white bg-opacity-30 rounded-lg"
            key={user.id}
          >
            
              <img
              onClick={()=>navigate(`/profile/${user.id}`)}
                className="  h-14  rounded-full"
                src={
                  user.photos.small
                    ? user.photos.small
                    : "https://openclipart.org/image/800px/177394"
                }
                alt="#"
              />

              <div className="pt-3">{user.name}</div>
              <div className="pt-3">{user.status}</div>
            
            <button
              onClick={(e) => followHandle(user)}
              className="text-lg w-28 my-3 border-black border-solid border  bg-gray-300 hover:bg-gray-600 bg-opacity-70 rounded-lg"
            >
              {user.followed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};