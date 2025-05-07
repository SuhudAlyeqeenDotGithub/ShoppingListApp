"use client";
import { FaSearch } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { NewShoppingListDialog, EditShoppingListDialog } from "./components/dialogs";
import { useState } from "react";

export default function Home() {
  const shoppingLists = Array(2).fill({
    name: "Shopping List",
    date: "2023-10-01",
    totalCost: "£20",
    totalQuantity: 20,
    totalItems: 20
  });

  const listValueDivStyle =
    " rounded-lg flex flex-col gap-2 items-center justify-center bg-white border border-gray-300 px-3 py-5 w-full h-20";

  const listValueFigureStyle = "";
  const listValueHeadStyle = "whitespace-nowrap font-semibold";

  const [openNewShoppingListDialog, setOpenNewShoppingListDialog] = useState(false);
  const [openEditShoppingListDialog, setOpenEditShoppingListDialog] = useState(false);

  const handleNewShoppingList = () => {
    document.body.style.overflow = "hidden";
    setOpenNewShoppingListDialog(true);
  };

  const handleSaveShoppingList = () => {
    document.body.style.overflow = "";
    setOpenNewShoppingListDialog(false);
  };

  const handleEditShoppingList = () => {
    document.body.style.overflow = "hidden";
    setOpenEditShoppingListDialog(true);
  };
  return (
    <div className="bg-white p-10 flex flex-col gap-8">
      {/* new list dialog div */}
      {openNewShoppingListDialog && <NewShoppingListDialog />}

      {/* edit list dialog div */}
      {openEditShoppingListDialog && <EditShoppingListDialog />}

      {/* nav div with logout and profile image */}
      <div className="flex flex-row justify-between">
        {/* hero heading div */}
        <h1 className="text-[30px] text-gray-700 font-bold">Hi Suhud, Let's plan shopping</h1>
        <div className="flex flex-row justify-between items-center gap-8 font-semibold">
          <button>Log Out</button>
          <div className="rounded-full h-11 w-11 bg-[url(/water.jpg)] bg-cover bg-center p-1 flex items-center justify-center">
            <div className="bg-black/50 rounded-full text-white w-full h-full p-2 text-center">SY</div>
          </div>
        </div>
      </div>

      {/* mini aggregate div */}
      <div className="flex flex-col justify-center items-center gap-5">
        {/* amount div */}
        <div className="border border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center gap-4 w-80 h-30">
          <h1 className="font-semibold">Total Cost</h1>
          <span className="text-[40px] font-bold">£20</span>
        </div>
      </div>

      {/* main app nav */}
      <div className="flex gap-20 justify-center items-center w-full">

        {/* search div */}
        <div className=" flex justify-between gap-5 items-center px-3 py-1 border border-gray-300 rounded-2xl shadow w-1/3">
          <input className="w-full outline-none" placeholder="Search Shopping List - By Name" />
          <span className="rounded-full hover:bg-gray-200 hover:cursor-pointer p-2">
            <FaSearch className="size-5 text-gray-500" />
          </span>
        </div>

        {/* action button div */}
        <div className="flex justify-center items-center gap-10 ">
          <button>Delete All Shopping List</button>
          <button onClick={handleNewShoppingList}>New Shopping List</button>
        </div>
      </div>

      {/* main body. shopping lists */}
      <div className="flex flex-wrap gap-5 overflow-auto h-[1000px] px-10 w-full justify-center mt-5">
        {shoppingLists.length > 0 ? (
          shoppingLists.map(({ name, date, totalCost, totalItems, totalQuantity }) => (
            // shopping list card
            <div className="flex flex-col gap-12 border border-gray-300 bg-black/4 shadow p-6 rounded-lg w-[320px] h-[400px]">
              {/* heading div*/}
              <div className="flex w-full justify-between items-center gap-5">
                <h1 className="text-[20px] font-bold">{name}</h1>
                <span className="font-semibold text-gray-500">{date}</span>
              </div>
              {/* body div */}
              <div className="flex flex-col gap-3 items-center justify-center">
                {/* 2 col div */}
                <div className="flex flex-row gap-3">
                  <div className={listValueDivStyle}>
                    <h1 className={listValueHeadStyle}>Total Quantity</h1>
                    <span className={listValueFigureStyle}>{totalQuantity}</span>
                  </div>
                  <div className={listValueDivStyle}>
                    <h1 className={listValueHeadStyle}>Total Items</h1>
                    <span className={listValueFigureStyle}>{totalItems}</span>
                  </div>
                </div>
                {/* 1 col div  */}
                <div className={listValueDivStyle}>
                  <h1 className={listValueHeadStyle}>Total Cost</h1>
                  <span className={listValueFigureStyle}>{totalCost}</span>
                </div>
              </div>

              {/* bottom action div */}
              <div className="flex justify-between items-center gap-5">
                <button onClick={handleEditShoppingList}>Edit List</button>
                <span className="rounded-full hover:bg-gray-200 hover:cursor-pointer p-2">
                  <RiDeleteBin6Line className="size-6" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div>No Shopping List. Let's start adding</div>
        )}
      </div>
    </div>
  );
}
