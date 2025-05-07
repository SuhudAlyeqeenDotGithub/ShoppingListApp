import React from "react";
import { IoMdClose } from "react-icons/io";
import { FaSearch, FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

export const NewShoppingListDialog = () => {
  const inputStyle = "outline-none border border-gray-300 rounded-lg p-3 py-2 w-full focus:border-gray-400";
  return (
    <div className="bg-black/50 w-full h-full fixed inset-0 z-50 flex justify-center items-center">
      {/* dialog */}
      <div className=" flex flex-col gap-7 border border-gray-300 bg-gray-100 shadow p-6 rounded-lg max-h-[400px] w-[500px]">
        {/* heading div */}
        <div className="flex w-full justify-between items-center gap-5 text-[20px] font-bold">
          <h1>New Shopping List</h1>
          <IoMdClose className="hover:text-red-600" />
        </div>
        {/* body div */}
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="List Name" className={inputStyle} required />
          <textarea placeholder="List Description" className={inputStyle} />
          <div className="flex flex-col gap-2">
            <label className="ml-1 font-semibold text-gray-600">Shopping Date</label>
            <input type="date" placeholder="List Date" className={inputStyle} />
          </div>
        </div>
        {/* action button div */}
        <div className="w-full flex justify-center items-center">
          <button type="submit" className="w-1/5">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditShoppingListDialog = () => {
  const listItems = Array(10).fill({ itemName: "Item Name", itemQuantity: 5, itemPrice: "£10" });

  return (
    <div className="bg-black/50 w-full h-full fixed inset-0 z-50 flex justify-center items-center">
      {/* dialog */}
      <div className=" flex flex-col gap-12 border border-gray-300 bg-gray-100 shadow p-8 rounded-lg h-[800px] w-[800px]">
        {/* heading and save action div */}
        <div className="flex flex-col gap-4">
          {/* heading 1 */}
          <div className="flex w-full justify-between items-center gap-5">
            {/* list heading div */}
            <div className="flex w-1/2 justify-between items-center gap-5">
              <h1 className="text-[25px] font-bold">New Shopping List</h1>
              <span className="text-gray-600 font-semibold">11/03/2025</span>
            </div>

            {/* save div */}

            <button>Save</button>
          </div>
          <textarea
            className="border border-gray-200 rounded-lg p-2 w-full focus:border-gray-300 outline-none overflow-auto h-[60px] text-gray-600"
            value="The shopping lists list object will display data information about the items it contains The shopping lists list object will display data information about the items it containsThe shopping lists list object will display data information about the items it contains"
          />
        </div>

        {/* action button and search div */}
        <div className="flex justify-center items-center gap-10 px-5">
          <div className="flex justify-center items-center gap-5">
            <button>Delete</button>
            <button>New Item</button>
          </div>

          <div className=" flex justify-between gap-5 items-center px-3 py-1 border border-gray-300 rounded-2xl shadow w-full">
            <input className="w-full outline-none" placeholder="Search Shopping List - By Name" />
            <span className="rounded-full hover:bg-gray-200 hover:cursor-pointer p-2">
              <FaSearch className="size-5 text-gray-500" />
            </span>
          </div>
        </div>

        {/* body div */}
        <div className="flex flex-col gap-4">
          {/* body headings */}
          <div className="grid grid-cols-5 gap-5 justify-between items-center ml-5 font-semibold">
            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-5 h-5 accent-gray-700" />
              <h1 className="text-gray-500 mt-1">20</h1>
            </div>
            <h1>Name</h1>
            <h1>Quantity</h1>
            <h1>Price</h1>
            <h1>Actions</h1>
          </div>
          {/* body items */}
          <div className="flex flex-col gap-2 items-center overflow-auto h-[460px] p-2">
            {listItems.length > 0
              ? listItems.map(({ itemName, itemPrice, itemQuantity }) => (
                  <div className="grid grid-cols-5 p-4 gap-5 justify-between items-center border border-gray-300 shadow-sm rounded-lg w-full bg-gray-50 hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 accent-gray-700" />
                    <h1>{itemName}</h1>
                    <h1>{itemQuantity}</h1>
                    <h1>{itemPrice}</h1>
                    <div className="flex gap-3 justify-center items-center text-[20px] text-gray-900">
                      <FaEdit className="hover:text-gray-500 hover:cursor-pointer" />
                      <RiDeleteBin6Line className="hover:text-gray-500 hover:cursor-pointer" />
                    </div>
                  </div>
                ))
              : "You have not items in this list. Let's start adding"}
          </div>
        </div>
      </div>
    </div>
  );
};
